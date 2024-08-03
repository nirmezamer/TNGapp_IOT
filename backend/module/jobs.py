import azure.functions as func
import logging
import os
import json
from azure.data.tables import TableClient

jobs = func.Blueprint()

@jobs.route(route="InsertJob", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def InsertJob(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            req_body = req.get_json()
            req_body["PartitionKey"] = req_body["Owner"]
            req_body["RowKey"] = f"{req_body['Owner']}_{req_body['Date']}_{req_body['Time']}"
            table.upsert_entity(entity=req_body, mode="merge")
            return func.HttpResponse(f"Job inserted successfully:\n {req_body}", status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)
    
@jobs.route(route="RemoveJob", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def RemoveJob(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="jobs") as table:
            req_body = req.get_json()
            req_body["PartitionKey"] = req_body["Owner"]
            req_body["RowKey"] = f"{req_body['Owner']}_{req_body['Date']}_{req_body['Time']}"
            table.delete_entity(partition_key=req_body["PartitionKey"], row_key=req_body["RowKey"])
            return func.HttpResponse(f"Job deleted successfully:\n {req_body}", status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)

@jobs.route(route="GetAllJobs", auth_level=func.AuthLevel.ANONYMOUS, methods=["GET"])
def GetAllJobs(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
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
