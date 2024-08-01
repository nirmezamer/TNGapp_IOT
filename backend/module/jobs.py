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
        with TableClient.from_connection_string(connection_string, table_name="countertable") as table:
            req_body = req.get_json()
            table.upsert_entity(entity=req_body, mode="merge")
            return func.HttpResponse(f"Job inserted successfully:\n {req_body}", status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)
    
@jobs.route(route="RemoveJob", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def RemoveJob(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    connection_string = os.getenv("AzureWebJobsStorage")
    try:
        with TableClient.from_connection_string(connection_string, table_name="countertable") as table:
            req_body = req.get_json()
            table.delete_entity(partition_key=req_body["PartitionKey"], row_key=req_body["RowKey"])
            return func.HttpResponse(f"Job deleted successfully:\n {req_body}", status_code=200)
    except:
        return func.HttpResponse("Error", status_code=500)
