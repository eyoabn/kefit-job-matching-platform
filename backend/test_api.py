import requests
API_URL = "http://localhost:8000/api/v1"
reg_data = {"email": "test403_2@example.com", "password": "password123", "name": "Test User", "role": "Freelancer"}
resp = requests.post(f"{API_URL}/auth/register", json=reg_data)
if resp.status_code == 200:
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp_me = requests.get(f"{API_URL}/auth/me", headers=headers)
    print("Me:", resp_me.status_code, resp_me.text[:100])
else:
    print(resp.text)
