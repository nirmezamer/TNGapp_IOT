import azure.functions as func
import logging
import os
import json
import requests
from azure.data.tables import TableClient
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import WebApplicationClient
from dotenv import load_dotenv

google = func.Blueprint()

# Allow insecure transport for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Load environment variables
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
REDIRECT_URI = "http://localhost:7071/api/auth/google/callback"  # Use the local redirect URI


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@google.route(route="auth/google", methods=["GET"])
def auth_google(req: func.HttpRequest) -> func.HttpResponse:
    try:
        google_provider_cfg = get_google_provider_cfg()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        client = WebApplicationClient(GOOGLE_CLIENT_ID)

        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=REDIRECT_URI,
            scope=["openid", "email", "profile"],
        )
        logging.info(f"Redirecting to: {request_uri}")
        return func.HttpResponse(status_code=302, headers={"Location": request_uri})
    except Exception as e:
        logging.error(f"Error in auth_google: {e}")
        return func.HttpResponse(f"Error in auth_google: {e}", status_code=500)

@google.route(route="auth/google/callback")
def callback(req: func.HttpRequest) -> func.HttpResponse:
    try:
        code = req.params.get('code')
        if not code:
            logging.error("Missing authorization code")
            return func.HttpResponse("Missing authorization code", status_code=400)

        client = WebApplicationClient(GOOGLE_CLIENT_ID)
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]

        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=req.url,
            redirect_url=REDIRECT_URI,
            code=code
        )
        logging.info(f"Token request URL: {token_url}")
        logging.info(f"Token request headers: {headers}")
        logging.info(f"Token request body: {body}")

        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )
        logging.info(f"Token response: {token_response.json()}")

        client.parse_request_body_response(json.dumps(token_response.json()))

        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        logging.info(f"Userinfo response: {userinfo_response.json()}")

        if userinfo_response.json().get("email_verified"):
            # Redirect to the front-end page with a success message
            return func.HttpResponse(status_code=302, headers={"Location": "http://localhost:8081/GoodEntrance"})  # Update to match your frontend URL
        else:
            logging.error("User email not verified")
            return func.HttpResponse("User email not verified", status_code=400)
    except Exception as e:
        logging.error(f"Error in callback: {e}")
        return func.HttpResponse(f"Error in callback: {e}", status_code=500)


