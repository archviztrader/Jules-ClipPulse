from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "ClipPulse Backend is running!"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    print("--- Received Generation Request ---")
    print(json.dumps(data, indent=2))
    print("---------------------------------")

    # In a real application, this would be a URL to a generated video.
    # For this mock, we'll use a placeholder video from a public source.
    # This is a sample video from Pexels.
    mock_video_url = "https://videos.pexels.com/video-files/2099392/2099392-hd_1280_720_25fps.mp4"

    response = {
        "message": "Clip generation initiated!",
        "video_url": mock_video_url,
        "clip_name": data.get("character") or "New Clip" # Use character name or a default
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
