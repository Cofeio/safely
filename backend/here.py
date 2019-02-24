import json
import requests

secrets_file = 'secrets.json'
geofence_file = 'test.wkt.zip'

with open(secrets_file) as json_file:  
    secrets_data = json.load(json_file)

(APP_ID, APP_CODE) = secrets_data.values()

def upload_shapefile():
	headers = {
	    'Content-Type': 'multipart/form-data',
	}

	params = (
	    ('layer_id', '4711'),
	    ('app_id', f'{APP_ID}'),
	    ('app_code', f'{APP_CODE}'),
	)

	files = {
	    'zipfile': ('/Users/kishan/git/safely/backend/test.wkt.zip', open('/Users/kishan/git/safely/backend/test.wkt.zip', 'rb')),
	}

	response = requests.post('https://gfe.api.here.com/2/layers/upload.json',
		                     headers=headers,
		                     params=params,
		                     files=files)

	print(response.content)


if __name__ == '__main__':
    upload_shapefile()

