from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Parent Dashboard'

@app.route('/child_location', methods=['POST'])
def location():
    data = request.data
    return data

if __name__ == '__main__':
    app.run(debug=True)