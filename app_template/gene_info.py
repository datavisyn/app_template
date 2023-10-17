import requests

# extract the gene name using ensembl API

def get_gene_name(ensg_id):
    base_url = "https://rest.ensembl.org"
    endpoint = f"/lookup/id/{ensg_id}"

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(base_url + endpoint, headers=headers)

        if response.status_code == 200:
            data = response.json()
            # description = full name
            gene_full_name = data.get("description")
            return gene_full_name
        else:
            return "Gene not found"

    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"
    
# extract additional information on genes from ensembl

def get_gene_info(ensg_id):
    base_url = f"https://rest.ensembl.org/lookup/id/{ensg_id}"
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(base_url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            gene_info = {}

            # additional information -> transcript product and the chromosome location
            if "canonical_transcript" in data:
                gene_info["Transcript Product"] = data.get("canonical_transcript")

            if "seq_region_name" in data:
                gene_info["Chromosome Location"] = data.get("seq_region_name")

            return gene_info
        else:
            return "Gene not found"

    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"

ensg_id = "ENSG00000000005"
gene_info = get_gene_info(ensg_id)
print(gene_info)

ensg_id = "ENSG00000185418"
gene_info = get_gene_info(ensg_id)
print(gene_info)

# Example usage:
# ensg_id = "ENSG00000000003"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000005"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000419"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000457"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000460"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000938"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001036"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000971"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001084"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001167"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001461"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001497"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000003"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000005"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000419"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000457"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000460"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000938"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001036"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000000971"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001084"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001167"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001461"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)

# ensg_id = "ENSG00000001497"
# gene_name = get_gene_name(ensg_id)
# print(gene_name)