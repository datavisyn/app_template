# app_template
[![build](https://github.com/datavisyn/app_template/actions/workflows/build.yml/badge.svg)](https://github.com/datavisyn/app_template/actions/workflows/build.yml)

App template for full-stack datavisyn apps. The repository is split into frontend (`src`, `package.json`, ...) and backend (`app_template`, `Makefile`, `requirements.txt`, ...). Make sure you have Node 16 and the latest yarn version installed (and run `corepack enable`). We are using `make` for our backend scripts, which you should have installed already (or [install](https://gnuwin32.sourceforge.net/packages/make.htm) on Windows).

To get started, clone this repository:

```bash
git clone -b develop https://github.com/datavisyn/app_template.git  # or any other branch you want to develop in
cd app_template
```

Finally, replace all occurances of `app_template` with your new application name (i.e. also the folder `app_template`). Then delete the `.git` folder and initialize with a new repository.

## Frontend

The frontend is a React application built and managed via [visyn_scripts](https://github.com/datavisyn/visyn_scripts). All relevant scripts can be found in the package.json.

### Installation

yarn 3 is used as package manager, such that you can simply install the frontend via `yarn install`.

### Development

The application has many package.json scripts available, with one of them being `yarn start`. This will start the webpack dev-server.

### Linting

All sourcefiles are linted via ESLint and Prettier, which can be checked and auto-fixed via `yarn run lint[:fix]`.

### Testing

Jest is used for unit-tests via `yarn run test`, and Cypress is used for e2e and component tests via `yarn run cy:run`. Alternatively, the Cypress UI can be started via `yarn run cy:open`.

### Building

For generating a production build of the application (i.e. for deployment to Github Pages), simply run `yarn run webpack:prod` and the bundle will be in the `bundles/` folder.

**Note:** The CI will automatically run the lint, build and test jobs, such that it makes sense to run them before committing. `yarn run all` runs all the relevant tasks.

## Backend

The backend is a FastAPI server managed via [visyn_core](https://github.com/datavisyn/visyn_core). All relevant scripts can be found in the Makefile.

## OTAR interactome (Neo4j)

You can install and use the OTAR interactome described in https://www.nature.com/articles/s41588-023-01327-9 by first downloading it from the official FTP server and then starting a Neo4j instance with it. 

The following are commands for Linux, but in the end you should have the folder `./neo4j/data/databases/graph.db`. Use ChatGPT to get the Windows equivalent commands.

```
// Download the database
wget -r -nd -np -P ./neo4j_download ftp://ftp.ebi.ac.uk/pub/databases/intact/various/ot_graphdb/current/\*
// Create folder volume for neo4j
mkdir -p ./neo4j/data/databases
// Unzip it in the neo4j directory
unzip neo4j_download/ot_graphdb.zip -d ./neo4j/data/databases
```

You can now start the Neo4j using docker compose: 

```
docker compose up
```

A remote interface will be available at http://localhost:7474/, in which you can test and visualize queries.

Example queries include: 

```
// get all node types
MATCH (n) RETURN distinct labels(n) 

// get all relationship types
MATCH (n)-[r]-(m) RETURN distinct type(r)

// Checkout BRCA2 and it's graph structure
MATCH (a:GraphProtein {uniprotName: 'P51587'})-[r]-(b) RETURN a, r, b

// Checkout EGFR and it's graph structure
Match (e:GraphProtein) WHERE e.uniprotName = 'P00533' RETURN e 

// Example query from the paper (apoc_procedures_ot_data.txt) for BRCA2
MATCH (complexInteractorN:GraphInteractor)-[complexInteractorR:interactor]-(complexParticipantN:GraphModelledParticipant)-[complexParticipantR:IC_PARTICIPANT]-(complex:GraphComplex) WHERE EXISTS(complexInteractorN.uniprotName)
WITH  COLLECT(distinct complexInteractorN) as complexInteractors
UNWIND complexInteractors as complexInteractor
MATCH  (complexInteractor)-[complexInteractorR:interactor]-(complexParticipantN:GraphModelledParticipant)-[complexParticipantR:IC_PARTICIPANT]-(complex:GraphComplex),(complex)-[complexAcXrefR:complexAcXref]-(complexAcXrefN:GraphXref)
WHERE complexInteractor.uniprotName = 'P51587'
RETURN complexInteractor.uniprotName as interactor_uniprot_name, COLLECT (distinct complexAcXrefN.identifier) as complex_acs
ORDER BY complexInteractor.uniprotName

// Adapted example query from the paper (apoc_procedures_ot_data.txt)
MATCH (complexInteractorN:GraphInteractor)-[complexInteractorR:interactor]-(complexParticipantN:GraphModelledParticipant)-[complexParticipantR:IC_PARTICIPANT]-(complex:GraphComplex) WHERE EXISTS(complexInteractorN.uniprotName)
RETURN complexInteractorN, complexInteractorR, complexParticipantN, complexParticipantR, complex
```

## Network expansion
The paper https://www.nature.com/articles/s41588-023-01327-9 describes the expansion of protein interaction networks using GWAS-linked
genes as seeds. The expansion is run per trait/disease and uses googles pagerank algorithm followed by iterative clustering using the walktrap algorithm.

For the source code of network expansion see the function `astro` in the R script `./r_scripts/Script_1_SEED.R`.

**TODO**
- [ ] Finish porting the function `astro` from R to python (initial in file `nwe.py`)
- [ ] Apply the python version of network expansion to real data (see notebook `nwe.ipynb`)
- [ ] Find out how the input data for the `astro` function was retrieved
  - we could possibly query the OTAR interactome DB to get that data
  - https://platform-docs.opentargets.org/target/molecular-interactions

Data needed for the python implementation of network expansion could be found at https://drive.google.com/file/d/1LGBhrtz6_W57HNoh_xGkUf9fd6PCaAdE/view?usp=sharing. After downloading extract the content inside the backend folder.

### Installation

It is recommended to create a virtual environment to avoid cluttering the global installation directory.

```bash
python -m venv .venv  # create a new virtual environment
source .venv/bin/activate  # active it  (for Linux)
.\.venv\Scripts\Activate.ps1  # active it  (for Windows)
make develop  # install all dependencies
```

### Development

To start the development server, simply run `make start` which will execute a uvicorn runner.

### Linting

All sourcefiles are formatted and linted, which can be checked and auto-fixed via `make format` and `make lint`.

### Testing

pytest is used for unit-tests via `make test`. See `app_template/tests` for details.

**Note:** The CI will automatically run the lint, build and test jobs, such that it makes sense to run them before committing. `make all` runs all the relevant tasks.
