import json

from flask import Flask, request, jsonify

app = Flask(__name__)

child_location = {'latitude': 0.0, 'longitude': 0.0}

@app.route('/')
def hello():
    return 'Parent Dashboard'


@app.route('/child_location', methods=['POST'])
def set_location():
    data = json.loads(request.data)

    if 'latitude' in data and 'longitude' in data:
    	child_location['latitude'] = data['latitude']
    	child_location['longitude'] = data['longitude']

    return jsonify(message='Child Location updated!',
    	           data=child_location), 200


@app.route('/child_location', methods=['GET'])
def get_location():
    return jsonify(message='Child Location:',
    	           data=child_location), 200


if __name__ == '__main__':
    app.run(debug=True)