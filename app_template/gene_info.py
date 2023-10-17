import requests

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
            gene_full_name = data.get("description")
            return gene_full_name
        else:
            return "Gene not found"

    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"

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