import requests
API_URL = "http://localhost:8000/api/v1"
headers = {"Authorization": "Bearer undefined"}
resp = requests.get(f"{API_URL}/auth/me", headers=headers)
print(resp.status_code, resp.text)
