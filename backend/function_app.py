import random
import azure.functions as func
import logging
import os
import json
import requests
from azure.data.tables import TableClient

from module.jobs import jobs

# create a function app
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# register the services
app.register_functions(jobs)

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
    # Because Azure functions are stateless, we cannot locally define and manipulate local variables
    # lets just randomly draw our counter and return it.
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
    # Because Azure functions are stateless, we cannot locally define and manipulate local variables
    # lets just randomly draw our counter and return it.
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
    # Because Azure functions are stateless, we cannot locally define and manipulate local variables
    # lets just randomly draw our counter and return it.
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