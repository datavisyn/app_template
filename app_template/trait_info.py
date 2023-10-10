import requests
from fastapi import FastAPI
from io import BytesIO
import subprocess
import json

app = FastAPI()

@app.get('/api/app/get_diseaseOrDrug_name')
def get_name(id: str):
    name = get_diseaseOrDrug_name(id)
    return {'name': name}

# use function 'get_diseaseOrDrug_name(id)'

def get_EFO_name(efo_id):
    url = f"https://www.ebi.ac.uk/ols/api/terms?id={efo_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["_embedded"]["terms"][0]["label"]
        return (disease_name)
    else:
        return ("not found")

def get_CHEBI_name(chebi_id):
    url = f"https://www.ebi.ac.uk/webservices/chebi/2.0/test/getCompleteEntity?chebiId={chebi_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.text

        start_index = data.find("<chebiAsciiName>") + len("<chebiAsciiName>")
        end_index = data.find("</chebiAsciiName>")
        drug_name = data[start_index:end_index]
        return (drug_name)
    else:
        return ("not found")

def get_MONDO_name(mondo_id):
    url = f"https://api.monarchinitiative.org/api/bioentity/disease/{mondo_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["label"]
        return (disease_name)
    else:
        return ("not found")

def get_HP_name(hpo_id):
    url = f"https://hpo.jax.org/api/hpo/term/{hpo_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["details"]["name"]
        return (disease_name)
    else:
        return ("not found")

def get_GO_name(go_id):
    url = f"https://api.geneontology.org/api/ontology/term/{go_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["label"]
        return (disease_name)
    else:
        return ("not found")

def get_NCIT_name(ncit_id):
    url = f"https://www.ebi.ac.uk/ols/api/terms?id={ncit_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["_embedded"]["terms"][0]["label"]
        return (disease_name)
    else:
        return ("not found")

def get_ORPHANET_name(orphanet_id):
    api_key = "val"
    orphanet_id = orphanet_id.replace("Orphanet:", "")

    # Define the CURL command
    curl_command = [
        "curl",
        "-X", "GET",
        f"https://api.orphacode.org/EN/ClinicalEntity/orphacode/{orphanet_id}/Name",
        "-H", "accept: application/json",
        "-H", f"apiKey: {api_key}"
    ]

    try:
        result = subprocess.run(curl_command, capture_output=True, text=True, check=True)

        data = result.stdout.strip()
        if data:
            response_json = json.loads(data)
            name = response_json.get("Preferred term")
            if name:
                return name
            else:
                return "not found"
        else:
            return "not found"
    except subprocess.CalledProcessError as e:
        return f"Error: {e.stderr}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

def fix_name(id):
    return id.replace('_', ':')

def get_diseaseOrDrug_name(id):
    id = fix_name(id)
    
    if (id.startswith("EFO")):
        return get_EFO_name(id)
    elif (id.startswith("CHEBI")):
        return get_CHEBI_name(id)
    elif (id.startswith("MONDO")):
        return get_MONDO_name(id)
    elif (id.startswith("HP")):
        return get_HP_name(id)
    elif (id.startswith("GO")):
        return get_GO_name(id)
    elif (id.startswith("NCIT")):
        return get_NCIT_name(id)
    elif (id.startswith("Orphanet")):
        return get_ORPHANET_name(id)
    else:
        pass
    
# tests
#print(get_diseaseOrDrug_name("EFO_0000094"))
#print(get_diseaseOrDrug_name("CHEBI_44185"))
#print(get_diseaseOrDrug_name("MONDO_0000334"))
#print(get_diseaseOrDrug_name("HP_0000023"))
#print(get_diseaseOrDrug_name("GO_1901557"))
#print(get_diseaseOrDrug_name("NCIT_C74532"))
#print(get_diseaseOrDrug_name("Orphanet_130"))