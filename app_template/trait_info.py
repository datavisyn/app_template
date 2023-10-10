import requests
from fastapi import FastAPI
from io import BytesIO
import subprocess
import json
import re

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

        # Extract name and description
        term = data["_embedded"]["terms"][0]
        disease_name = term["label"]
        description = term.get("description", "Description not available")

        return {
            "name": disease_name,
            "description": description
        }
    else:
        return {"error": "not found"}

def get_CHEBI_name(chebi_id):
    url = f"https://www.ebi.ac.uk/webservices/chebi/2.0/test/getCompleteEntity?chebiId={chebi_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.text

        # Extract the name
        start_name = data.find("<chebiAsciiName>") + len("<chebiAsciiName>")
        end_name = data.find("</chebiAsciiName>")
        drug_name = data[start_name:end_name]

        # Extract the description
        data_match = re.search(r'<data>(.*?)</data>', data, re.DOTALL)
        description = data_match.group(1).strip() if data_match else "Description not available"

        return {
            "name": drug_name,
            "description": description
        }
    else:
        return {"error": "not found"}


def get_MONDO_name(mondo_id):
    url = f"https://api.monarchinitiative.org/api/bioentity/disease/{mondo_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data.get("label", "Name not available")

        # Check if a description is available
        description = data.get("description", "Description not available")

        return {
            "name": disease_name,
            "description": description
        }
    else:
        return {"error": "not found"}

def get_HP_name(hpo_id):
    url = f"https://hpo.jax.org/api/hpo/term/{hpo_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data.get("details", {}).get("name", "Name not available")

        # Check if a description is available
        description = data.get("details", {}).get("definition", "Definition not available")

        return {
            "name": disease_name,
            "description": description
        }
    else:
        return {"error": "not found"}

def get_GO_name(go_id):
    url = f"https://api.geneontology.org/api/ontology/term/{go_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data.get("label", "Name not available")

        # Check if a description is available
        description = data.get("definition", "Definition not available")

        return {
            "name": disease_name,
            "description": description
        }
    else:
        return {"error": "not found"}

def get_NCIT_name(ncit_id):
    url = f"https://www.ebi.ac.uk/ols/api/terms?id={ncit_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        disease_name = data["_embedded"]["terms"][0]["label"]

        # Check if a description is available
        description = data["_embedded"]["terms"][0].get("description", "Description not available")

        return {
            "name": disease_name,
            "description": description
        }
    else:
        return {"error": "not found"}

def get_ORPHANET_name(orphanet_id):
    api_key = "val"
    orphanet_id = orphanet_id.replace("Orphanet:", "")

    # Define the CURL commands for name and description
    name_curl_command = [
        "curl",
        "-X", "GET",
        f"https://api.orphacode.org/EN/ClinicalEntity/orphacode/{orphanet_id}/Name",
        "-H", "accept: application/json",
        "-H", f"apiKey: {api_key}"
    ]

    description_curl_command = [
        "curl",
        "-X", "GET",
        f"https://api.orphacode.org/EN/ClinicalEntity/orphacode/{orphanet_id}/Definition",
        "-H", "accept: application/json",
        "-H", f"apiKey: {api_key}"
    ]

    try:
        # Make a request to get the name
        result_name = subprocess.run(name_curl_command, capture_output=True, text=True, check=True)
        name_data = result_name.stdout.strip()
        
        # Make a request to get the description
        result_description = subprocess.run(description_curl_command, capture_output=True, text=True, check=True)
        description_data = result_description.stdout.strip()

        if name_data:
            name_json = json.loads(name_data)
            name = name_json.get("Preferred term", "Name not found")
        else:
            name = "Name not found"
        
        if description_data:
            description_json = json.loads(description_data)
            description = description_json.get("Definition", "Description not found")
        else:
            description = "Description not found"

        return {
            "name": name,
            "description": description
        }
    except subprocess.CalledProcessError as e:
        return {"error": f"Error: {e.stderr}"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

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