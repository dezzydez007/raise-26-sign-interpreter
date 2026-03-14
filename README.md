# Real-Time Sign Language Interpreter

**RAISE-26 Hackathon Project #1559029**

---

## 1. Problem Statement

Communication barriers persist between the deaf/hard-of-hearing community and hearing individuals. Approximately 430 million people worldwide have disabling hearing loss, and this number is projected to increase to over 700 million by 2050. 

Key problems include:
- **Lack of real-time translation**: Existing solutions have significant delays
- **Accessibility gaps**: Many public services, healthcare facilities, and educational institutions lack adequate sign language interpretation
- **Dependency on human interpreters**: Cost-prohibitive and not always available
- **Limited vocabulary support**: Most apps only recognize fingerspelling (A-Z) rather than full words and phrases

---

## 2. Solution

Our **Real-Time Sign Language Interpreter** is an AI-powered device that:
- Captures video input via webcam
- Uses computer vision (MediaPipe) to detect and track hand landmarks
- Employs machine learning to classify gestures into letters (A-Z) and common phrases
- Outputs translations as both **text** (on-screen) and **spoken audio** (text-to-speech)
- Works in real-time with minimal latency

This solution bridges communication gaps by providing instant, automatic translation without requiring a human interpreter.

---

## 3. Technical Implementation

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Webcam Input   │───>│ MediaPipe Hands  │───>│ ML Classifier   │
│   (OpenCV)      │    │ (21 landmarks)   │    │ (Random Forest) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                      │
                                                      v
                        ┌──────────────────┐    ┌─────────────────┐
                        │   Text Display   │<───│ Text-to-Speech  │
                        │   (OpenCV)       │    │   (pyttsx3)     │
                        └──────────────────┘    └─────────────────┘
```

### Key Components

1. **Hand Detection (MediaPipe)**
   - Detects 21 hand landmarks per frame
   - Supports multi-hand tracking
   - 3D coordinates (x, y, z) for depth awareness
   - 70% detection confidence threshold

2. **Gesture Classification**
   - Random Forest classifier trained on landmark data
   - Supports: A-Z alphabet, common phrases (Hello, Thank You, Yes, No, etc.)
   - Rule-based fallback for immediate use without training

3. **Output System**
   - Real-time text overlay on video
   - Text-to-speech audio output
   - Configurable speech rate

4. **User Interface**
   - Toggle landmarks visualization
   - Pause/resume functionality
   - Clear text buffer
   - Manual speech trigger

### Technologies Used
- **Python** (as required by RAISE-26)
- **OpenCV** - Video capture and rendering
- **MediaPipe** - Hand landmark detection
- **scikit-learn** - ML classification
- **pyttsx3** - Text-to-speech

---

## 4. Impact

### Social Impact
- **Accessibility**: Enables deaf/hard-of-hearing individuals to communicate with hearing people in real-time
- **Independence**: Reduces reliance on human interpreters for everyday conversations
- **Education**: Can be used in classrooms to include deaf students
- **Healthcare**: Improves patient-doctor communication in medical settings

### Economic Impact
- Reduces cost of professional sign language interpreters
- Enables businesses to better serve deaf customers
- Creates job opportunities in accessibility technology

### Future Enhancements
- Deep learning models for better accuracy
- Support for multiple sign languages (ASL, BSL, etc.)
- Mobile app deployment
- Integration with video conferencing platforms
- Continuous learning from user input

---

## 5. How to Run

### Installation
```bash
pip install -r requirements.txt
```

### Run the Interpreter
```bash
python sign_interpreter.py
```

### Collect Training Data
```bash
python sign_interpreter.py collect
```

### Train Custom Model
```bash
python sign_interpreter.py train
```

### Controls
- **SPACE**: Pause/Resume
- **L**: Toggle landmarks visualization
- **C**: Clear text
- **S**: Speak current text
- **Q**: Quit

---

## 6. Presentation

This project can be presented with:
1. Live demo of real-time sign language translation
2. Comparison with existing solutions
3. Technical deep-dive on the ML pipeline
4. Discussion of ablation experiments (removing components to prove value)
5. Future roadmap for SOTA improvements

---

*Submitted for RAISE-26 Hackathon | Project #1559029*
