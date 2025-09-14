from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/institute"
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

# Add a new trainer
@app.route('/trainer', methods=['POST'])
def add_trainer():
    data = request.json
    if not data or 'name' not in data or 'empId' not in data or 'subject' not in data:
        return jsonify({"error": "Invalid data"}), 400
    mongo.db.trainers.insert_one(data)
    return jsonify({"message": "Trainer added successfully"}), 201

# Get the list of all trainers
@app.route('/trainer', methods=['GET'])
def get_trainers():
    trainers = list(mongo.db.trainers.find())
    for trainer in trainers:
        trainer['_id'] = str(trainer['_id'])
    return jsonify(trainers), 200

# Remove a specific trainer
@app.route('/trainer', methods=['DELETE'])
def delete_trainer():
    emp_id = request.args.get('empId')
    if not emp_id:
        return jsonify({"error": "empId is required"}), 400
    result = mongo.db.trainers.delete_one({'empId': emp_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Trainer not found"}), 404
    return jsonify({"message": "Trainer deleted successfully"}), 200

# Get information of a trainer by empId
@app.route('/trainer/<id>', methods=['GET'])
def get_trainer_by_id(id):
    trainer = mongo.db.trainers.find_one({'empId': id})
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    trainer['_id'] = str(trainer['_id'])
    return jsonify(trainer), 200

# Get trainers by subject
@app.route('/trainer/<subject>/topic', methods=['GET'])
def get_trainers_by_subject(subject):
    trainers = list(mongo.db.trainers.find({'subject': subject}))
    for trainer in trainers:
        trainer['_id'] = str(trainer['_id'])
    return jsonify(trainers), 200

# Add a new subject
@app.route('/subject', methods=['POST'])
def add_subject():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Invalid data"}), 400
    mongo.db.subjects.insert_one(data)
    return jsonify({"message": "Subject added successfully"}), 201

# Get the list of all subjects
@app.route('/subject', methods=['GET'])
def get_subjects():
    subjects = list(mongo.db.subjects.find())
    for subject in subjects:
        subject['_id'] = str(subject['_id'])
    return jsonify(subjects), 200

# Get subjects with trainers teaching the topic
@app.route('/subject/<id>', methods=['GET'])
def get_subject_with_trainers(id):
    subject = mongo.db.subjects.find_one({'_id': ObjectId(id)})
    if not subject:
        return jsonify({"error": "Subject not found"}), 404
    trainers = list(mongo.db.trainers.find({'subject': subject['name']}))
    for trainer in trainers:
        trainer['_id'] = str(trainer['_id'])
    subject['_id'] = str(subject['_id'])
    subject['trainers'] = trainers
    return jsonify(subject), 200

if __name__ == '__main__':
    app.run(debug=True)