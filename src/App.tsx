import { Button, Card, Group, SimpleGrid, Stack, TextInput } from '@mantine/core';
import * as React from 'react';
import { VisynApp, VisynHeader } from 'visyn_core/app';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { appApi, useCreateCampaign, useDeleteCampaign, useGetCampaigns } from './store/store';
import { useAppDispatch } from './store/hooks';

export function App() {
  const { data: campaigns } = useGetCampaigns();
  const [deleteCampaign, { isLoading }] = useDeleteCampaign();
  const [createCampaign, { isLoading: isCreateLoading }] = useCreateCampaign();
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
    },
  });

  React.useEffect(() => {
    const evtSource = new EventSource('/api/v1/app/subscribe');

    evtSource.onmessage = (event) => {
      console.log(`message: ${event.data}`);
      // refetch my stuff
      dispatch(appApi.util.invalidateTags(['Campaign']));
    };

    return () => {
      evtSource.close();
    };
  }, [dispatch]);

  return (
    <VisynApp header={<VisynHeader />} loginMenu={null}>
      <SimpleGrid cols={2}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            await createCampaign({
              campaignCreate: {
                name: values.name,
                description: values.description,
              },
            }).unwrap();

            form.reset();
          })}
        >
          <Stack m="sm">
            <TextInput placeholder="Campaign name" {...form.getInputProps('name')} />

            <TextInput placeholder="Campaign description" {...form.getInputProps('description')} />

            <Button loading={isCreateLoading} type="submit">
              Create campaign
            </Button>
          </Stack>
        </form>
        <Stack style={{ overflowY: 'auto' }} m="md">
          {campaigns?.map((c) => (
            <Card key={c.id} withBorder shadow="sm">
              <Group position="apart">
                {c.name}

                <Button
                  onClick={async () => {
                    try {
                      await deleteCampaign({ campaignId: c.id }).unwrap();
                    } catch (e) {
                      showNotification({
                        title: 'Error deleting campaign',
                        color: 'red',
                        message: `${e.data.detail}`,
                      });
                    }
                  }}
                  color="red"
                  loading={isLoading}
                >
                  Delete
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      </SimpleGrid>
    </VisynApp>
  );
}
