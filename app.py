# Web-based Real-Time Sign Language Interpreter
# For hosting on localhost - With Supabase Integration

from flask import Flask, render_template_string, Response
import cv2
import numpy as np
import json
import os
from supabase import create_client, Client

app = Flask(__name__)

# Supabase Configuration
SUPABASE_URL = "https://pagufhklqtkxtrmspvpg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZ3VmaGtscXRreHRybXNwdnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDc1MjMsImV4cCI6MjA4ODcyMzUyM30.81FXOJmOEWSEMnxKMhmBFCwdWjEHPxFjC8fkh6Kuh4Y"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    db_connected = True
except Exception as e:
    print(f"Supabase connection failed: {e}")
    db_connected = False

# Load ASL Gesture Database
ASL_DATABASE_PATH = os.path.join(os.path.dirname(__file__), "asl_gesture_database.json")


def load_asl_database():
    """Load ASL gesture database from JSON file"""
    try:
        with open(ASL_DATABASE_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load ASL database: {e}")
        return {"alphabet": {}, "phrases": {}}


asl_db = load_asl_database()

# Current state
current_sign = "--"
text_buffer = []
prediction_history = []
camera = None
running = True

# ASL Alphabet matching based on finger states
ASL_ALPHABET = {
    (0, 0, 0, 0, 1): "A",
    (1, 1, 1, 1, 0): "B",
    (1, 1, 1, 1, 1): "C",
    (1, 1, 0, 0, 0): "D",
    (0, 0, 0, 0, 0): "E",
    (1, 1, 1, 1, 1): "F",  # OK sign
    (1, 1, 0, 0, 0): "G",
    (1, 1, 1, 0, 0): "H",
    (0, 0, 0, 0, 1): "I",
    (0, 0, 0, 0, 1): "J",  # Same as I with motion
    (1, 1, 1, 0, 0): "K",
    (1, 1, 0, 0, 0): "L",
    (0, 1, 1, 1, 0): "M",
    (0, 0, 1, 1, 0): "N",
    (1, 1, 1, 1, 1): "O",
    (1, 1, 1, 0, 0): "P",  # K pointing down
    (1, 1, 0, 0, 0): "Q",  # G pointing down
    (1, 1, 1, 0, 0): "R",  # Crossed
    (0, 0, 0, 0, 0): "S",  # Thumb over fingers
    (0, 1, 0, 0, 0): "T",
    (1, 1, 1, 0, 0): "U",
    (1, 1, 1, 0, 0): "V",  # Peace sign
    (1, 1, 1, 1, 0): "W",
    (1, 0, 0, 0, 0): "X",
    (1, 0, 0, 0, 1): "Y",
    (1, 1, 0, 0, 0): "Z",  # Index hook
}

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Language Interpreter - RAISE-26</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            color: #fff;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px solid #0f3460;
        }
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .subtitle { color: #888; font-size: 1rem; }
        .project-id {
            display: inline-block;
            background: #0f3460;
            padding: 5px 15px;
            border-radius: 20px;
            margin-top: 10px;
            font-size: 0.9rem;
        }
        .db-status {
            display: inline-block;
            background: #0f3460;
            padding: 5px 15px;
            border-radius: 20px;
            margin-top: 10px;
            margin-left: 10px;
            font-size: 0.9rem;
        }
        .db-status.connected { background: #00ff88; color: #1a1a2e; }
        .db-status.disconnected { background: #ff4757; }
        .main-content {
            display: flex;
            gap: 20px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        .video-container {
            flex: 1;
            min-width: 600px;
            background: #0f3460;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .video-wrapper {
            position: relative;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;
            background: #000;
        }
        #videoElement { width: 100%; display: block; }
        .sidebar {
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .panel {
            background: #0f3460;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .panel h2 {
            font-size: 1.2rem;
            margin-bottom: 15px;
            color: #00d9ff;
        }
        .detected-text {
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            background: #1a1a2e;
            border-radius: 10px;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00ff88;
        }
        .sentence {
            margin-top: 15px;
            font-size: 1rem;
            color: #aaa;
            word-wrap: break-word;
            max-height: 200px;
            overflow-y: auto;
            padding: 10px;
            background: #1a1a2e;
            border-radius: 10px;
        }
        .gesture-info {
            margin-top: 15px;
            font-size: 0.9rem;
            color: #888;
            padding: 10px;
            background: #1a1a2e;
            border-radius: 10px;
        }
        .control-btn {
            width: 100%;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            background: #ffa502;
            color: #1a1a2e;
            font-weight: 600;
            transition: all 0.3s;
            margin-top: 10px;
        }
        .control-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(255,165,2,0.3);
        }
        .status {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #1a1a2e;
            border-radius: 8px;
        }
        .status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff4757;
        }
        .status-dot.active {
            background: #00ff88;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .info-panel {
            background: #0f3460;
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .info-item {
            background: #1a1a2e;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        .info-item h3 { color: #00d9ff; font-size: 0.9rem; margin-bottom: 5px; }
        .info-item p { font-size: 1.2rem; font-weight: bold; }
        @media (max-width: 900px) {
            .video-container { min-width: 100%; }
            .sidebar { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Real-Time Sign Language Interpreter</h1>
            <p class="subtitle">AI-powered translation of ASL to text - Powered by Supabase</p>
            <span class="project-id">RAISE-26 Hackathon #1559029</span>
            <span class="db-status" id="dbStatus">Database: Connecting...</span>
        </header>
        
        <div class="main-content">
            <div class="video-container">
                <div class="video-wrapper">
                    <img id="videoElement" src="{{ url_for('video_feed') }}">
                </div>
            </div>
            
            <div class="sidebar">
                <div class="panel">
                    <h2>Detection Status</h2>
                    <div class="status">
                        <div class="status-dot" id="statusDot"></div>
                        <span id="statusText">Initializing camera...</span>
                    </div>
                </div>
                
                <div class="panel">
                    <h2>Current Sign</h2>
                    <div class="detected-text" id="detectedSign">--</div>
                    <div class="gesture-info" id="gestureInfo">Show hand to camera</div>
                </div>
                
                <div class="panel">
                    <h2>Sentence</h2>
                    <div class="sentence" id="sentenceText">Start making signs to see translation...</div>
                </div>
                
                <div class="panel">
                    <h2>Controls</h2>
                    <button class="control-btn" onclick="clearText()">Clear Text</button>
                    <button class="control-btn" onclick="speakText()">Speak</button>
                </div>
            </div>
        </div>
        
        <div class="info-panel">
            <div class="info-grid">
                <div class="info-item"><h3>Database</h3><p id="dbInfo">Loading...</p></div>
                <div class="info-item"><h3>ASL Alphabet</h3><p>26 Letters</p></div>
                <div class="info-item"><h3>Common Phrases</h3><p>15+ Phrases</p></div>
                <div class="info-item"><h3>Tech Stack</h3><p>Flask + Supabase</p></div>
            </div>
        </div>
    </div>
    
    <script>
        let sentence = '';
        let lastSign = '';
        
        // Set database status
        fetch('/get_db_status').then(r => r.json()).then(data => {
            const status = document.getElementById('dbStatus');
            const info = document.getElementById('dbInfo');
            if (data.connected) {
                status.classList.add('connected');
                status.textContent = 'Database: Connected';
                info.textContent = 'Supabase';
            } else {
                status.classList.add('disconnected');
                status.textContent = 'Database: Offline';
                info.textContent = 'Local JSON';
            }
        });
        
        function clearText() {
            sentence = '';
            document.getElementById('sentenceText').textContent = 'Start making signs to see translation...';
            fetch('/clear');
        }
        
        function speakText() {
            fetch('/speak');
        }
        
        function updateSign(sign, gestureDesc) {
            const signElement = document.getElementById('detectedSign');
            const sentenceElement = document.getElementById('sentenceText');
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            const gestureInfo = document.getElementById('gestureInfo');
            
            if (sign && sign !== '--') {
                signElement.textContent = sign;
                statusDot.classList.add('active');
                statusText.textContent = 'Detecting signs...';
                gestureInfo.textContent = gestureDesc || 'ASL Gesture';
                
                if (sign !== lastSign) {
                    lastSign = sign;
                    sentence = sentence ? sentence + ' ' + sign : sign;
                    sentenceElement.textContent = sentence;
                    
                    // Save to database
                    fetch('/save_gesture', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({gesture: sign, description: gestureDesc})
                    });
                }
            } else {
                statusDot.classList.remove('active');
                statusText.textContent = 'Waiting for signs...';
                gestureInfo.textContent = 'Show hand to camera';
            }
        }
        
        setInterval(() => {
            fetch('/get_sign').then(res => res.json()).then(data => {
                updateSign(data.sign, data.description);
            });
        }, 500);
    </script>
</body>
</html>
"""


def get_finger_states(landmarks):
    """Get finger states from landmarks (extended=1, folded=0)"""
    if len(landmarks) < 21:
        return None

    landmarks = np.array(landmarks).reshape(-1, 3)

    # Thumb: compare x positions
    thumb_extended = (
        landmarks[4][0] < landmarks[3][0] or landmarks[4][0] > landmarks[3][0]
    )

    # Other fingers: compare y positions (tip vs knuckle)
    index_extended = landmarks[8][1] < landmarks[6][1]
    middle_extended = landmarks[12][1] < landmarks[10][1]
    ring_extended = landmarks[16][1] < landmarks[14][1]
    pinky_extended = landmarks[20][1] < landmarks[18][1]

    return (
        int(thumb_extended),
        int(index_extended),
        int(middle_extended),
        int(ring_extended),
        int(pinky_extended),
    )


def detect_asl_gesture(landmarks):
    """Detect ASL letter from hand landmarks"""
    global current_sign, text_buffer, prediction_history

    finger_states = get_finger_states(landmarks)

    if finger_states is None:
        return None, "No hand detected"

    # Match finger states to ASL letter
    if finger_states in ASL_ALPHABET:
        letter = ASL_ALPHABET[finger_states]

        # Get description from database
        description = "ASL Letter"
        if asl_db and "alphabet" in asl_db and letter in asl_db["alphabet"]:
            description = asl_db["alphabet"][letter].get("description", "ASL Letter")

        return letter, description

    # Check finger count
    finger_count = sum(finger_states)

    if finger_count == 0:
        return "Fist", "All fingers folded"
    elif finger_count == 5:
        return "Five", "All fingers extended"
    elif finger_count == 1:
        return "One", "Index finger up"
    elif finger_count == 2:
        return "Two", "Index and middle up"
    elif finger_count == 3:
        return "Three", "Three fingers up"
    elif finger_count == 4:
        return "Four", "Four fingers up"

    return f"Fingers: {finger_count}", f"{finger_count} fingers extended"


def detect_hand_gesture(frame):
    """Main detection function using skin color segmentation"""
    global current_sign, text_buffer, prediction_history

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Skin color range
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)
    mask = cv2.inRange(hsv, lower_skin, upper_skin)

    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=4)
    mask = cv2.GaussianBlur(mask, (5, 5), 100)

    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    gesture_detected = None
    description = ""

    if contours and max(len(c) for c in contours) > 100:
        max_contour = max(contours, key=cv2.contourArea)

        if cv2.contourArea(max_contour) > 5000:
            hull = cv2.convexHull(max_contour, returnPoints=False)
            defects = cv2.convexityDefects(max_contour, hull)

            finger_count = 0

            if defects is not None:
                for i in range(defects.shape[0]):
                    s, e, f, d = defects[i, 0]
                    start = tuple(max_contour[s][0])
                    end = tuple(max_contour[e][0])
                    far = tuple(max_contour[f][0])

                    a = np.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2)
                    b = np.sqrt((far[0] - start[0]) ** 2 + (far[1] - start[1]) ** 2)
                    c = np.sqrt((end[0] - far[0]) ** 2 + (end[1] - far[1]) ** 2)
                    angle = np.arccos((b**2 + c**2 - a**2) / (2 * b * c))

                    if angle <= np.pi / 2:
                        finger_count += 1

            finger_count += 1

            # Estimate finger states
            finger_states = [0, 0, 0, 0, 0]
            if finger_count >= 1:
                finger_states[0] = 1  # Thumb
            if finger_count >= 2:
                finger_states[1] = 1  # Index
            if finger_count >= 3:
                finger_states[2] = 1  # Middle
            if finger_count >= 4:
                finger_states[3] = 1  # Ring
            if finger_count >= 5:
                finger_states[4] = 1  # Pinky

            finger_tuple = tuple(finger_states)
            gesture_detected, description = detect_asl_gesture(finger_states + [0] * 58)

    if gesture_detected:
        prediction_history.append(gesture_detected)
        if len(prediction_history) >= 5:
            prediction_history.pop(0)

        if len(set(prediction_history)) == 1 and len(prediction_history) >= 3:
            current_sign = gesture_detected

    return gesture_detected, description


def generate_frames():
    global camera, running

    camera = cv2.VideoCapture(0)
    camera.set(3, 640)
    camera.set(4, 480)

    while running:
        success, frame = camera.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)

        sign, desc = detect_hand_gesture(frame)

        if sign:
            cv2.putText(
                frame,
                f"Detected: {sign}",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )
            cv2.putText(
                frame, desc, (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1
            )

        # Show database status
        status_text = "DB: Connected" if db_connected else "DB: Offline"
        cv2.putText(
            frame,
            status_text,
            (10, frame.shape[0] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 0) if db_connected else (0, 0, 255),
            1,
        )

        ret, buffer = cv2.imencode(".jpg", frame)
        frame = buffer.tobytes()

        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

    if camera:
        camera.release()


@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@app.route("/get_sign")
def get_sign():
    global current_sign, asl_db

    description = "ASL Gesture"
    if asl_db and current_sign in asl_db.get("alphabet", {}):
        description = asl_db["alphabet"][current_sign].get("description", "ASL Gesture")
    elif asl_db and current_sign in asl_db.get("phrases", {}):
        description = asl_db["phrases"][current_sign].get("description", "ASL Phrase")

    return {"sign": current_sign, "description": description}


@app.route("/get_db_status")
def get_db_status():
    return {"connected": db_connected}


@app.route("/clear")
def clear():
    global text_buffer, prediction_history, current_sign
    text_buffer = []
    prediction_history = []
    current_sign = "--"
    return {"status": "cleared"}


@app.route("/save_gesture", methods=["POST"])
def save_gesture():
    if not db_connected:
        return {"status": "offline"}

    from flask import request

    data = request.get_json()

    try:
        # Save to Supabase
        supabase.table("gestures").insert(
            {
                "gesture": data.get("gesture"),
                "description": data.get("description"),
                "timestamp": "now()",
            }
        ).execute()
        return {"status": "saved"}
    except Exception as e:
        print(f"Failed to save gesture: {e}")
        return {"status": "error"}


@app.route("/speak")
def speak():
    global current_sign, text_buffer

    # Text-to-speech would require additional setup
    return {"status": "spoken", "text": " ".join(text_buffer)}


if __name__ == "__main__":
    print(f"Supabase connected: {db_connected}")
    print(
        f"ASL Database loaded: {len(asl_db.get('alphabet', {}))} letters, {len(asl_db.get('phrases', {}))} phrases"
    )

    try:
        app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
    finally:
        running = False
