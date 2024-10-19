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

# Allow insecure transport for Production 
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '0'

# Load environment variables
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')

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

import jwt  # Import PyJWT
import time  # To handle token expiration

SECRET_KEY = GOOGLE_CLIENT_SECRET

def generate_token(user_info):
    expiration_time = time.time() + 3600  # Token valid for 1 hour
    payload = {
        "sub": user_info["email"],  # Unique identifier (e.g., user's email)
        "name": user_info["name"],  # User's name
        "aud": "https://tngapp1.azurewebsites.net",
        "exp": expiration_time  # Expiration time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def validate_token(token):
    try:
        # Decode the token without verifying audience
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], options={"verify_aud": False})    
        return decoded_token  # Valid token
    except:
        return None  # Invalid token

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

        # Check if email is verified and generate a token
        if userinfo_response.json().get("email_verified"):
            user_info = userinfo_response.json()  # Get user info

            # Generate JWT token
            token = generate_token(user_info)
            user_name = user_info["name"]

            # Redirect with the token as a query parameter
            redirect_url = f"http://localhost:8081/GoodEntrance?token={token}&user_name={user_name}"
            return func.HttpResponse(status_code=302, headers={"Location": redirect_url})
        else:
            logging.error("User email not verified")
            return func.HttpResponse("User email not verified", status_code=400)
    
    except Exception as e:
        logging.error(f"Error in callback: {e}")
        return func.HttpResponse(f"Error in callback: {e}", status_code=500)


# Not suposed to be in use
@google.route(route="test", auth_level=func.AuthLevel.ANONYMOUS)
def test(req: func.HttpRequest) -> func.HttpResponse:
    token = req.params.get('authToken')
    logging.info(f"Token: {token}")
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    logging.info(f"Decoded token: {decoded_token}")
    logging.info(f"name: {decoded_token['name']}")
    return func.HttpResponse(f"{decoded_token}", status_code=200)