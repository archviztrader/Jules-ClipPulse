# ClipPulse

ClipPulse is a web-based, AI-first filmmaking studio that turns text, images, or rough storyboards into cinematic video clips. This project is a frontend prototype that mocks the core functionality of such a tool, complete with a mock backend to simulate the generation process.

## Features

*   **Modern Editor UI:** A dark-themed, intuitive interface for creating and arranging video clips.
*   **Ingredients Panel:** Define the components of your scene, including character, setting, lighting, and mood.
*   **Engine Switcher:** Select between different (mocked) AI generation engines like "StepFun" and "Qwen".
*   **Mock Generation:** A "Generate" button that communicates with a mock backend to simulate video creation.
*   **SceneBuilder:** A drag-and-drop timeline to arrange and sequence your generated clips.
*   **Gallery Pages:** Mocked-up pages for "Asset Management" and "Flow TV".

## How to Run

This project consists of a pure HTML/CSS/JS frontend and a Python-based Flask backend.

### 1. Backend Setup

First, set up and run the backend server.

**Prerequisites:**
*   Python 3.x
*   pip

**Installation:**
Install the necessary Python packages using the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

**Running the Server:**
Start the Flask backend server. It will run on `http://127.0.0.1:5001`.
```bash
python app.py
```
You should see output indicating that the server is running. Leave this terminal window open.

### 2. Frontend Setup

The frontend is composed of static files and requires no build step.

**Running the Application:**
Simply open the `index.html` file in your web browser. The application will connect to the backend server running on port 5001.