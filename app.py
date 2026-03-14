# Web-based Real-Time Sign Language Interpreter
# For hosting on localhost - Simple version

from flask import Flask, render_template_string, Response
import cv2
import numpy as np
import threading

app = Flask(__name__)

current_sign = "--"
text_buffer = []
prediction_history = []
camera = None
running = True

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
            <p class="subtitle">AI-powered translation of sign language to text and speech</p>
            <span class="project-id">RAISE-26 Hackathon #1559029</span>
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
                </div>
                
                <div class="panel">
                    <h2>Sentence</h2>
                    <div class="sentence" id="sentenceText">Start making signs to see translation...</div>
                </div>
                
                <div class="panel">
                    <h2>Controls</h2>
                    <button class="control-btn" onclick="clearText()">Clear Text</button>
                </div>
            </div>
        </div>
        
        <div class="info-panel">
            <div class="info-grid">
                <div class="info-item"><h3>Technology</h3><p>OpenCV</p></div>
                <div class="info-item"><h3>Supported</h3><p>Finger Counting</p></div>
                <div class="info-item"><h3>Language</h3><p>Python + Flask</p></div>
                <div class="info-item"><h3>Purpose</h3><p>Bridging Communication Gaps</p></div>
            </div>
        </div>
    </div>
    
    <script>
        let sentence = '';
        let lastSign = '';
        
        function clearText() {
            sentence = '';
            document.getElementById('sentenceText').textContent = 'Start making signs to see translation...';
            fetch('/clear');
        }
        
        function updateSign(sign) {
            const signElement = document.getElementById('detectedSign');
            const sentenceElement = document.getElementById('sentenceText');
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            
            if (sign && sign !== '--') {
                signElement.textContent = sign;
                statusDot.classList.add('active');
                statusText.textContent = 'Detecting signs...';
                
                if (sign !== lastSign) {
                    lastSign = sign;
                    sentence = sentence ? sentence + ' ' + sign : sign;
                    sentenceElement.textContent = sentence;
                }
            } else {
                statusDot.classList.remove('active');
                statusText.textContent = 'Waiting for signs...';
            }
        }
        
        setInterval(() => {
            fetch('/get_sign').then(res => res.json()).then(data => updateSign(data.sign));
        }, 500);
    </script>
</body>
</html>
"""


def detect_hand_gesture(frame):
    global current_sign, text_buffer, prediction_history

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)
    mask = cv2.inRange(hsv, lower_skin, upper_skin)

    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=4)
    mask = cv2.GaussianBlur(mask, (5, 5), 100)

    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    sign_detected = None

    if contours and max(len(c) for c in contours) > 100:
        max_contour = max(contours, key=cv2.contourArea)

        if cv2.contourArea(max_contour) > 5000:
            hull = cv2.convexHull(max_contour, returnPoints=False)
            defects = cv2.convexityDefects(max_contour, hull)

            if defects is not None:
                finger_count = 0
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

                if finger_count == 1:
                    sign_detected = "Fist"
                elif finger_count == 2:
                    sign_detected = "One"
                elif finger_count == 3:
                    sign_detected = "Two"
                elif finger_count == 4:
                    sign_detected = "Three"
                elif finger_count == 5:
                    sign_detected = "Five"
                else:
                    sign_detected = f"Fingers: {finger_count}"

    if sign_detected:
        prediction_history.append(sign_detected)
        if len(prediction_history) >= 5:
            prediction_history.pop(0)

        if len(set(prediction_history)) == 1 and len(prediction_history) >= 3:
            current_sign = sign_detected

    return sign_detected


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

        sign = detect_hand_gesture(frame)

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
    global current_sign
    return {"sign": current_sign}


@app.route("/clear")
def clear():
    global text_buffer, prediction_history, current_sign
    text_buffer = []
    prediction_history = []
    current_sign = "--"
    return {"status": "cleared"}


if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
    finally:
        running = False
