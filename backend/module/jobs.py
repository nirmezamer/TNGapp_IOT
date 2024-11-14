import azure.functions as func
import logging
import os
import json
from azure.data.tables import TableClient
from .google import validate_token

jobs = func.Blueprint()

@jobs.route(route="InsertJob", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
@jobs.generic_output_binding(arg_name="signalRHub", type="signalR", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def InsertJob(req: func.HttpRequest, signalRHub: func.Out[str]) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    # Validate the token
    token = req.params.get('authToken')
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    user_name = decoded_token['name']
    logging.info(f"InsertJob for user: {user_name}")
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            req_body = req.get_json()
            req_body["PartitionKey"] = user_name
            req_body["Owner"] = user_name
            req_body["RowKey"] = f"{user_name.replace(' ', '_')};{req_body['Date']};{req_body['Time']}"
            req_body["Status"] = "Available"
            req_body["Walker"] = "None"

            # Add default location for Tel Aviv if not provided
            if "Latitude" not in req_body or "Longitude" not in req_body:
                req_body["Latitude"] = 32.0853
                req_body["Longitude"] = 34.7818

            table.upsert_entity(entity=req_body, mode="merge")

            # Notify clients via SignalR about the new job
            signalRHub.set(json.dumps({
                'target': 'newJob',
                'arguments': [req_body]
            }))
            
            return func.HttpResponse(f"Job inserted successfully:\n {req_body}", status_code=200)
    except Exception as e:
        logging.info(f"Error: {e}")
        return func.HttpResponse("Error", status_code=500)
    
@jobs.route(route="RemoveJob", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def RemoveJob(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            req_body = req.get_json()
            req_body["PartitionKey"] = req_body["Owner"]
            req_body["RowKey"] = f"{req_body['Owner'].replace(' ', '_')};{req_body['Date']};{req_body['Time']}"
            table.delete_entity(partition_key=req_body["PartitionKey"], row_key=req_body["RowKey"])
            return func.HttpResponse(f"Job deleted successfully:\n {req_body}", status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)

@jobs.route(route="GetAllJobs", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])
def GetAllJobs(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    # Validate the token
    token = req.params.get('authToken')
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    name = decoded_token['name']
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            entities = table.list_entities()
            response = []
            for entity in entities:
                response.append(entity)
            return func.HttpResponse(json.dumps(response), status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)

@jobs.route(route="GetAllJobs/{owner}", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])    
def GetAllJobsOfOwner(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('GetAllJobsOfOwner function processed a request.')
    logging.info(f"Owner: {req.route_params['owner']}")
    
    # Validate the token
    token = req.params.get('authToken')
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    name = decoded_token['name']
    if name != req.route_params['owner']:
        return func.HttpResponse("Unauthorized", status_code=401)
    
    _owner = req.route_params['owner'].replace('_', ' ')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            logging.info(f"start query for Owner: {_owner}")
            entities = table.query_entities(query_filter=f"PartitionKey eq '{_owner}'")
            logging.info(f"end query for Owner: {_owner}")
            response = []
            for entity in entities:
                response.append(entity)
            return func.HttpResponse(json.dumps(response), status_code=200)
    except Exception as e:
        logging.info(f"Error: {e}")
        return func.HttpResponse("Error", status_code=500)

@jobs.route(route="GetJob/{id}", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])    
def GetJobById(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('GetJobById function processed a request.')
    
    # Validate the token
    token = req.params.get('authToken')
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    name = decoded_token['name']
    
    _id = req.route_params['id']
    _owner = _id.split(";")[0]
    _owner = _owner.replace('_', ' ')
    
    logging.info(f"Owner: {_owner}, ID: {_id}")
    
    connection_string = os.getenv("AzureWebJobsStorage")
    
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            logging.info(f"start query for PartitionKey: {_owner}, RowKey: {_id}")
            entity = table.get_entity(partition_key=_owner, row_key=_id)
            logging.info(f"end query for PartitionKey: {_owner}, RowKey: {_id}")
            entity = {key: str(value) for key, value in entity.items()}
            logging.info(f"Entity: {entity}")
            response = func.HttpResponse(json.dumps(entity), status_code=200)
            response.headers['Set-Cookie'] = "SameSite=None"
            return response

    except Exception as e:
        logging.info(f"Error: {e}")
        return func.HttpResponse("Error", status_code=500)
    
@jobs.route(route="UpdateAllJobs", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])    
def UpdateAllJobs(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('UpdateAllJobs function processed a request.')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            entities = table.list_entities()
            logging.info(f"Start updating all jobs")
            for entity in entities:
                entity["Status"] = "Available"
                entity["Walker"] = "None"
                table.upsert_entity(entity=entity, mode="replace")
            logging.info(f"End updating all jobs")
            return func.HttpResponse("All jobs updated successfully", status_code=200)
    except Exception as e:
        logging.info(f"Error: {e}")
        return func.HttpResponse("Error", status_code=500)
    
@jobs.route(route="UpdateJob/{id}", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
@jobs.generic_output_binding(arg_name="signalRHub", type="signalR", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def UpdateJob(req: func.HttpRequest, signalRHub: func.Out[str]) -> func.HttpResponse:
    logging.info('UpdateJob function processed a request.')
    
    # Validate the token
    token = req.params.get('authToken')
    decoded_token = validate_token(token)
    if not decoded_token:
        return func.HttpResponse("Invalid token", status_code=401)
    user_name = decoded_token['name']

    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            req_body = req.get_json()
            partition_key = req_body.pop("PartitionKey")
            row_key = req.route_params['id']
            
            if "TakeJob" in req_body and req_body["TakeJob"]:
                req_body["Walker"] = user_name
                req_body.pop("TakeJob")

            # Fetch the entity from the table
            entity = table.get_entity(partition_key=partition_key, row_key=row_key)
            for key, value in req_body.items():
                entity[key] = value
            
            # Update the entity
            table.update_entity(entity=entity, mode="merge")
            # Trigger SignalR notification to clients
            signalRHub.set(json.dumps({
                'target': 'jobUpdated' + '_' + row_key,
                'arguments': [json.dumps(entity)]
            }))

            return func.HttpResponse(json.dumps(entity), status_code=200)
    except Exception as e:
        logging.error(f"Error: {e}")
        return func.HttpResponse("Error", status_code=500)
