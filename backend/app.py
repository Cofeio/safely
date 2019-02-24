import json

import requests

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

secrets_file = 'secrets.json'
geofence_file = 'test.wkt.zip'

with open(secrets_file) as json_file:
    secrets_data = json.load(json_file)

(APP_ID, APP_CODE) = secrets_data.values()

child_location = {'latitude': 0.0, 'longitude': 0.0}

def check_here_api(latitude, longitude):
    params = {
        'app_id': f'{APP_ID}',
        'app_code': f'{APP_CODE}',
        'layer_ids': 1,
        'key_attribute': 'NAME',
        'proximity': f'{latitude},{longitude},23676'
    }

    response = requests.get('https://gfe.api.here.com/2/search/proximity.json',
                            params=params)

    response_json = response.json()

    return_data = dict()

    return_data['safe'] = True
    return_data['waypoint'] = dict()
    try:
        return_data['safe'] = int(response_json['geometries'][0]['distance']) >= 0
        return_data['waypoint']['latitude'] = response_json['geometries'][0]['nearestLat']
        return_data['waypoint']['longitude'] = response_json['geometries'][0]['nearestLon']
    except (KeyError, IndexError):
        return_data['waypoint']['latitude'] = None
        return_data['waypoint']['longitude'] = None
        pass

    return return_data


@app.route('/')
def hello():
    return 'Parent Dashboard'


@app.route('/child_location', methods=['POST'])
def set_location():
    data = json.loads(request.data)

    if 'latitude' in data and 'longitude' in data:
    	child_location['latitude'] = data['latitude']
    	child_location['longitude'] = data['longitude']

    here_data = check_here_api(child_location['latitude'], child_location['longitude'])
    print(here_data)

    if 'latitude' in here_data['waypoint'] and here_data['waypoint']['latitude'] and \
       'longitude' in here_data['waypoint'] and here_data['waypoint']['longitude']:
        waypoint = here_data['waypoint']
    else:
        waypoint = None

    return jsonify(message='Child Location updated!',
    	           data=child_location,
                   safe=here_data['safe'],
                   waypoint=waypoint), 200
    

@app.route('/child_location', methods=['GET'])
def get_location():
    here_data = check_here_api(child_location['latitude'], child_location['longitude'])
    print(here_data)

    return jsonify(message='Child Location:',
                   data=child_location,
                   safe=here_data['safe'],
                   waypoint=waypoint), 200


if __name__ == '__main__':
    app.run(debug=True)