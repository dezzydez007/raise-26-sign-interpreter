# Real-Time Sign Language Interpreter

**RAISE-26 Hackathon Project #1559029**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://sign-interpreter-five.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/dezzydez007/raise-26-sign-interpreter)

---

## Main Screen

![Sign Interpreter](assets/screenshots/main_screen.png)

The app opens directly to a full-screen camera view - the primary translation interface. Position your hand in the frame to detect ASL gestures in real-time.

### Features on Main Screen:
- **Full-screen camera** - Real-time webcam feed with hand landmark detection
- **Quick navigation** - Right-side buttons for Learn, Numbers, Words, Face, History, Calibrate
- **ML status indicator** - Shows when AI detection is active
- **Motion tracking** - Detects hand movement patterns
- **Face detection** - Shows face detection status
- **Confidence meter** - Displays gesture recognition confidence
- **Live translation** - Shows detected letters/numbers in real-time
- **Speak button** - Text-to-speech output
- **Copy button** - Copy translation to clipboard

### Navigation:
- **Menu button** (top-left) - Opens side menu with all screens
- **Home button** (top-right) - Go to dashboard
- **Settings button** (top-right) - Voice settings

---

## All Screens

| Screen | Access | Description |
|--------|--------|-------------|
| **Translate** | Main | Real-time ASL detection with camera |
| **Learn ASL** | Side menu / Quick buttons | A-Z alphabet with difficulty filters |
| **Numbers** | Side menu / Quick buttons | ASL numbers 0-10 |
| **Words** | Side menu / Quick buttons | Common phrases (Greetings, Questions, Everyday) |
| **Face & Pose** | Side menu / Quick buttons | 468-point face mesh + 33-point body pose |
| **History** | Side menu / Quick buttons | Translation log with export |
| **Calibrate** | Side menu / Quick buttons | Improve accuracy with training |
| **Settings** | Side menu | Dark mode, ML sensitivity, detection toggles |
| **Voice Settings** | From translate | Voice profile, speed, pitch, volume |
| **About** | Side menu | App info, features, technology |

---

## Problem

430 million people worldwide have disabling hearing loss. Key barriers include:
- Lack of real-time translation
- Limited accessibility in public services
- Dependency on human interpreters
- Most apps only recognize fingerspelling

---

## Solution

AI-powered real-time ASL interpreter using:
- **MediaPipe Holistic** - Hand, face, and pose detection
- **Motion tracking** - Velocity calculation between frames
- **Text-to-speech** - Voice output via Web Speech API
- **Browser-based** - No installation required

---

## Features

| Feature | Description |
|---------|-------------|
| Real-time Detection | Live ASL gesture recognition |
| Motion Tracking | Detects hand movement |
| Face Mesh | 468 facial landmarks |
| Pose Detection | 33 body keypoints |
| Text-to-Speech | Voice output |
| ASL Alphabet | A-Z guide with tutorials |
| Numbers 0-10 | ASL number gestures |
| Common Words | Essential phrases |
| Translation History | Save and export |
| Calibration | Accuracy training |
| Dark Mode | Dark theme support |
| Voice Settings | Customize speech |

---

## How to Use

1. Visit: https://sign-interpreter-five.vercel.app
2. Allow camera access
3. Position hand in frame
4. Make ASL signs - app detects in real-time
5. Tap "Speak" to hear translation
6. Use quick buttons to access Learn, Numbers, Words

---

## Technology

- MediaPipe Holistic
- TensorFlow.js
- Tailwind CSS
- Vercel Deployment

---

## License

MIT License - RAISE-26 Hackathon Project

---

*RAISE-26 Hackathon | Project #1559029*
