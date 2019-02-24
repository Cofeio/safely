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
        'proximity': f'{latitude},{longitude}'
    }

    response = requests.get('https://gfe.api.here.com/2/search/proximity.json',
                            params=params)

    print(response.content)

@app.route('/')
def hello():
    return 'Parent Dashboard'


@app.route('/child_location', methods=['POST'])
def set_location():
    data = json.loads(request.data)

    if 'latitude' in data and 'longitude' in data:
    	child_location['latitude'] = data['latitude']
    	child_location['longitude'] = data['longitude']

    check_here_api(child_location['latitude'], child_location['longitude'])

    return jsonify(message='Child Location updated!',
    	           data=child_location), 200


@app.route('/child_location', methods=['GET'])
def get_location():
    return jsonify(message='Child Location:',
    	           data=child_location), 200


if __name__ == '__main__':
    app.run(debug=True)