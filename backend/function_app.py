import azure.functions as func
import logging
import os
import json
import requests
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import WebApplicationClient
from dotenv import load_dotenv

# Allow insecure transport for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Load environment variables
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
REDIRECT_URI = "http://localhost:7071/api/auth/google/callback"  # Use the local redirect URI

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@app.route(route="auth/google", methods=["GET"])
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

@app.route(route="auth/google/callback")
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
    
# Our other functions (HttpExample, DecreaseCounter, IncreaseCounter, ReadCounter, negotiate) remain the same
@app.route(route="HttpExample")
def HttpExample(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="DecreaseCounter", auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_output_binding(arg_name="signalRHub", type="signalR", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def DecreaseCounter(req: func.HttpRequest, signalRHub : func.Out[str] ) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    UpdateCounterTable(-1)
    count = GetCounterTable()
    signalRHub.set(json.dumps({
            'target' : 'newCountUpdate',
            'arguments': [f'{count}']
        }))
    return func.HttpResponse(f"{count}", status_code=200)

@app.route(route="IncreaseCounter", auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_output_binding(arg_name="signalRHub", type="signalR", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def IncreaseCounter(req: func.HttpRequest, signalRHub : func.Out[str]) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    UpdateCounterTable(1)
    count = GetCounterTable()
    signalRHub.set(json.dumps({
            'target' : 'newCountUpdate',
            'arguments': [f'{count}']
        }))
    return func.HttpResponse(f"{count}", status_code=200)

@app.route(route="ReadCounter", auth_level=func.AuthLevel.ANONYMOUS)
def ReadCounter(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    count = GetCounterTable()
    return func.HttpResponse(f"{count}", status_code=200)

def GetCounterTable() -> int:
    connection_string = os.getenv("AzureWebJobsStorage")

    try:
        with TableClient.from_connection_string(connection_string, table_name="countertable") as table:
            entity = table.get_entity("counters", "counter_0")
            counter_value = entity["value"]
    except:
        return -1
    
    return counter_value

def UpdateCounterTable(i : int) -> int:
    connection_string = os.getenv("AzureWebJobsStorage")

    try:
        with TableClient.from_connection_string(connection_string, table_name="countertable") as table:
            entity = table.get_entity("counters", "counter_0")
            counter_value = entity["value"]
            entity["value"] = counter_value + i
            table.update_entity(entity)
            return 0
    except:
        return -1
    

@app.route(route="negotiate", auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_input_binding(arg_name="connectionInfo", type="signalRConnectionInfo", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def negotiate(req: func.HttpRequest, connectionInfo) -> func.HttpResponse:
    return func.HttpResponse(connectionInfo)
