"""
Real-Time Sign Language Interpreter
RAISE-26 Hackathon Project #1559029

A device that uses AI to interpret sign language in real time and translates it into
spoken word and text. This tool aims to bridge communication gaps for the deaf and
hard of hearing community.
"""

import cv2
import numpy as np
import mediapipe as mp
import pyttsx3
import pickle
import os
from collections import deque
from datetime import datetime


class SignLanguageInterpreter:
    def __init__(self, model_path=None):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles

        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
        )

        self.model = None
        self.labels = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "Hello",
            "Thank You",
            "Yes",
            "No",
            "Help",
            "Please",
            "Sorry",
            "Good",
        ]

        if model_path and os.path.exists(model_path):
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)

        self.engine = pyttsx3.init()
        self.engine.setProperty("rate", 150)

        self.text_buffer = deque(maxlen=50)
        self.prediction_history = deque(maxlen=5)
        self.last_speak_time = datetime.now()
        self.speak_delay = 1.5

        self.running = True
        self.paused = False
        self.show_landmarks = True

    def extract_hand_landmarks(self, hand_landmarks):
        """Extract hand landmarks as a flat array"""
        landmarks = []
        for landmark in hand_landmarks.landmark:
            landmarks.extend([landmark.x, landmark.y, landmark.z])
        return landmarks

    def predict_sign(self, landmarks):
        """Predict sign language gesture"""
        if self.model is None:
            return self._rule_based_prediction(landmarks)

        landmarks = np.array(landmarks).reshape(1, -1)
        prediction = self.model.predict(landmarks)
        return self.labels[prediction[0]]

    def _rule_based_prediction(self, landmarks):
        """Simple rule-based prediction for demonstration"""
        if len(landmarks) < 63:
            return None

        landmarks = np.array(landmarks).reshape(-1, 3)

        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]

        fingers_extended = [
            thumb_tip[0] < landmarks[3][0],
            index_tip[1] < landmarks[6][1],
            middle_tip[1] < landmarks[10][1],
            ring_tip[1] < landmarks[14][1],
            pinky_tip[1] < landmarks[18][1],
        ]

        finger_count = sum(fingers_extended)

        if finger_count == 0:
            return "Fist"
        elif finger_count == 5:
            return "Five"
        elif fingers_extended[1] and not any(fingers_extended[2:]):
            return "One"
        elif (
            fingers_extended[1]
            and fingers_extended[2]
            and not any(fingers_extended[3:])
        ):
            return "Two"
        elif (
            fingers_extended[1]
            and fingers_extended[2]
            and fingers_extended[3]
            and not fingers_extended[4]
        ):
            return "Three"
        elif thumb_tip[0] > landmarks[2][0]:
            return "OK"

        return f"Fingers: {finger_count}"

    def speak_text(self, text):
        """Convert text to speech"""
        now = datetime.now()
        if (now - self.last_speak_time).total_seconds() > self.speak_delay:
            self.engine.say(text)
            self.last_speak_time = now

    def draw_hand_overlay(self, image, hand_landmarks):
        """Draw hand landmarks on image"""
        self.mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
            self.mp_hands.HAND_CONNECTIONS,
            self.mp_drawing_styles.get_default_hand_landmarks_style(),
            self.mp_drawing_styles.get_default_hand_connections_style(),
        )

    def process_frame(self, frame):
        """Process a single frame"""
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = self.hands.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        sign_detected = None

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                if self.show_landmarks:
                    self.draw_hand_overlay(image, hand_landmarks)

                landmarks = self.extract_hand_landmarks(hand_landmarks)
                prediction = self.predict_sign(landmarks)

                if prediction:
                    self.prediction_history.append(prediction)
                    if len(set(self.prediction_history)) == 1:
                        sign_detected = prediction
                        self.text_buffer.append(prediction)

        return image, sign_detected

    def get_full_text(self):
        """Get full accumulated text"""
        return " ".join(self.text_buffer)

    def run(self):
        """Main run loop"""
        cap = cv2.VideoCapture(0)
        cap.set(3, 1280)
        cap.set(4, 720)

        print("=" * 50)
        print("Real-Time Sign Language Interpreter")
        print("RAISE-26 Hackathon Project #1559029")
        print("=" * 50)
        print("Controls:")
        print("  SPACE - Pause/Resume")
        print("  L - Toggle landmarks")
        print("  C - Clear text")
        print("  Q - Quit")
        print("=" * 50)

        while self.running:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)

            if not self.paused:
                frame, sign = self.process_frame(frame)

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
                frame,
                f"Text: {self.get_full_text()}",
                (10, frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            status = "PAUSED" if self.paused else "RUNNING"
            cv2.putText(
                frame,
                f"Status: {status}",
                (frame.shape[1] - 200, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 255) if self.paused else (0, 255, 0),
                2,
            )

            cv2.imshow("Sign Language Interpreter", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                self.running = False
            elif key == ord(" "):
                self.paused = not self.paused
            elif key == ord("l"):
                self.show_landmarks = not self.show_landmarks
            elif key == ord("c"):
                self.text_buffer.clear()
                self.prediction_history.clear()
            elif key == ord("s"):
                text = self.get_full_text()
                if text:
                    self.speak_text(text)

        cap.release()
        cv2.destroyAllWindows()


def train_model():
    """Train a simple model for sign language recognition"""
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    import json

    print("Training Sign Language Model...")

    X = []
    y = []

    landmarks_dir = "hand_landmarks_data"
    if os.path.exists(landmarks_dir):
        for label in os.listdir(landmarks_dir):
            label_dir = os.path.join(landmarks_dir, label)
            if os.path.isdir(label_dir):
                for file in os.listdir(label_dir):
                    if file.endswith(".json"):
                        with open(os.path.join(label_dir, file), "r") as f:
                            data = json.load(f)
                            X.append(data["landmarks"])
                            y.append(label)

    if len(X) > 0:
        X = np.array(X)
        y = np.array(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        accuracy = model.score(X_test, y_test)
        print(f"Model accuracy: {accuracy:.2%}")

        with open("sign_language_model.pkl", "wb") as f:
            pickle.dump(model, f)

        print("Model saved to sign_language_model.pkl")
    else:
        print("No training data found. Using rule-based detection.")


def collect_training_data():
    """Collect hand landmark data for training"""
    import json

    cap = cv2.VideoCapture(0)
    current_label = None

    print("Data Collection Mode")
    print("Enter a label (letter or word) to collect data, or 'q' to quit")

    while True:
        label = input("Label (or 'q' to quit): ").strip()
        if label.lower() == "q":
            break

        current_label = label
        label_dir = f"hand_landmarks_data/{label}"
        os.makedirs(label_dir, exist_ok=True)

        sample_count = 0
        max_samples = 100

        print(f"Collecting data for '{label}'... Press 'q' to stop early")

        while sample_count < max_samples:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            results = mp.solutions.hands.Hands(
                static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7
            ).process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmarks = []
                    for lm in hand_landmarks.landmark:
                        landmarks.extend([lm.x, lm.y, lm.z])

                    sample_count += 1

                    with open(f"{label_dir}/sample_{sample_count}.json", "w") as f:
                        json.dump({"landmarks": landmarks, "label": label}, f)

                    mp.solutions.drawing_utils.draw_landmarks(
                        image, hand_landmarks, mp.solutions.hands.HAND_CONNECTIONS
                    )

            cv2.putText(
                image,
                f"Samples: {sample_count}/{max_samples}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )
            cv2.imshow("Data Collection", image)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        print(f"Collected {sample_count} samples for '{label}'")

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == "train":
            train_model()
        elif sys.argv[1] == "collect":
            collect_training_data()
        else:
            print("Usage: python sign_interpreter.py [train|collect]")
    else:
        mp = __import__("mediapipe")
        interpreter = SignLanguageInterpreter()
        interpreter.run()
