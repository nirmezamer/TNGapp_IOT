import azure.functions as func
import logging
import json
from azure.functions import Blueprint

geoLocation = Blueprint()

@geoLocation.route(route="location", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
@geoLocation.generic_output_binding(arg_name="signalRHub", type="signalR", hubName="mySignalRHub", connectionStringSetting="AzureSignalRConnectionString")
def update_location(req: func.HttpRequest, signalRHub: func.Out[str]) -> func.HttpResponse:
    try:
        # Parse the JSON data from the request body
        data = req.get_json()
        latitude = data['latitude']
        longitude = data['longitude']
        walker_id = data['walker_id']

        # Create a message to send to SignalR
        message = {
            "target": "newLocation",
            "arguments": [{
                "latitude": latitude,
                "longitude": longitude,
                "walker_id": walker_id
            }]
        }

        # Send the message to SignalR
        signalRHub.set(json.dumps(message))
        return func.HttpResponse("Location updated", status_code=200)
    except Exception as e:
        logging.error(f"Error updating location: {e}")
        return func.HttpResponse(f"Error updating location: {e}", status_code=500)
