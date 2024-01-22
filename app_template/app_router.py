import asyncio
import contextlib
import json
import logging
import uuid
from datetime import datetime
from weakref import WeakSet

from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.orm import sessionmaker
from sqlmodel import Field, SQLModel, create_engine
from sse_starlette.sse import EventSourceResponse

_log = logging.getLogger(__name__)
app_router = APIRouter(tags=["app_template"])


class CampaignBase(SQLModel):
    name: str
    description: str | None = None


class Campaign(CampaignBase, table=True):
    __tablename__ = "campaign"  # type: ignore

    id: uuid.UUID | None = Field(default_factory=uuid.uuid4, primary_key=True)
    creation_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    modification_date: datetime | None = Field(nullable=True)


class CampaignRead(CampaignBase):
    id: uuid.UUID
    creation_date: datetime
    modification_date: datetime | None


class CampaignCreate(CampaignBase):
    pass


# Create all tables and stuff (use in development only)
engine = create_engine("sqlite:///:memory:", echo=True, connect_args={"check_same_thread": False})
SQLModel.metadata.drop_all(engine)
SQLModel.metadata.create_all(engine)


create_session = sessionmaker(engine)


class StreamQueue:
    def __init__(self) -> None:
        self.queues = WeakSet[asyncio.Queue]()

    async def subscribe(self, req: Request):
        queue = await self.create_queue()

        async def poll_queue():
            with contextlib.suppress(asyncio.CancelledError):
                yield json.dumps({"message": "start"})
                while True:
                    if await req.is_disconnected():
                        break

                    message = await queue.get()
                    yield json.dumps(message)
                    queue.task_done()

        # The Cache-Control header is required to make it work with webpack-dev-server: https://stackoverflow.com/q/71783075
        return EventSourceResponse(poll_queue(), headers={"Cache-Control": "no-transform"})  # type: ignore --> we are returning the response, but want it typed as SSEMessage

    async def create_queue(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.queues.add(queue)
        return queue

    async def publish(self, message: dict) -> None:
        for queue in self.queues:
            await queue.put(message)


stream_queue = StreamQueue()


with create_session() as session:
    campaign = Campaign(name="My first campaign", description="This is the first campaign", modification_date=None)
    session.add(campaign)
    session.commit()


@app_router.get("/campaigns")
async def get_campaigns() -> list[CampaignRead]:
    with create_session() as session:
        campaigns: list[Campaign] = session.query(Campaign).all()
        return campaigns  # type: ignore


@app_router.post("/campaign")
async def create_campaign(data: CampaignCreate) -> CampaignRead:
    with create_session() as session:
        campaign = Campaign.from_orm(data)
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        await stream_queue.publish({"type": "campaign_created", "message": str(campaign.id)})
        return campaign  # type: ignore


@app_router.delete("/campaign/{campaign_id}")
async def delete_campaign(campaign_id: uuid.UUID) -> CampaignRead:
    with create_session() as session:
        campaign: Campaign | None = session.get(Campaign, campaign_id)
        if not campaign:
            raise HTTPException(404, "Campaign not found")
        session.delete(campaign)
        session.commit()
        await stream_queue.publish({"message": "campaign deleted"})
        return campaign  # type: ignore


@app_router.get("/subscribe")
async def subscribe(req: Request):
    return await stream_queue.subscribe(req)
