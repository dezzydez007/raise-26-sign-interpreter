        // ASL Alphabet Data with enhanced info
        const ASL_ALPHABET = [
            { letter: "A", desc: "Fist with thumb to the side", fingers: "Thumb beside fist, fingers closed", tips: "Make a tight fist with thumb resting beside your fingers", difficulty: "easy" },
            { letter: "B", desc: "Flat hand, fingers together", fingers: "All fingers extended, thumb folded across palm", tips: "Keep fingers straight and close together", difficulty: "easy" },
            { letter: "C", desc: "Curved hand like holding something", fingers: "Curved fingers and thumb forming C shape", tips: "Imagine holding a large object like a bowl", difficulty: "easy" },
            { letter: "D", desc: "Index up, others form circle", fingers: "Index finger up, thumb touches fingertips", tips: "Make a circle with thumb and fingers while pointing index up", difficulty: "medium" },
            { letter: "E", desc: "Bent fingers, thumb tucked", fingers: "All fingers bent, thumb tucked between fingers", tips: "Bend all fingers down with thumb tucked in front", difficulty: "easy" },
            { letter: "F", desc: "OK sign", fingers: "Thumb and index touch forming circle, other fingers up", tips: "Touch thumb tip to index finger tip, keep other fingers extended", difficulty: "medium" },
            { letter: "G", desc: "Index pointing sideways", fingers: "Index finger points out, thumb extended", tips: "Point index finger to the side like a finger gun", difficulty: "easy" },
            { letter: "H", desc: "Index and middle sideways", fingers: "Index and middle fingers point sideways", tips: "Extend index and middle fingers to the side together", difficulty: "medium" },
            { letter: "I", desc: "Pinky up", fingers: "Only pinky finger extended", tips: "Close all fingers except pinky", difficulty: "easy" },
            { letter: "J", desc: "I with motion", fingers: "Pinky moving in J shape", tips: "Make I sign and draw a J in the air", difficulty: "hard" },
            { letter: "K", desc: "Index + middle up, thumb between", fingers: "Two fingers up (V shape), thumb between", tips: "Point index and middle up in V, place thumb between them", difficulty: "hard" },
            { letter: "L", desc: "L shape", fingers: "Thumb and index extended at 90 degrees", tips: "Extend thumb and index to form an L", difficulty: "easy" },
            { letter: "M", desc: "Three fingers over thumb", fingers: "Three fingers fold down over thumb", tips: "Tuck thumb under three middle fingers", difficulty: "medium" },
            { letter: "N", desc: "Two fingers over thumb", fingers: "Two fingers fold over thumb", tips: "Tuck thumb under index and middle fingers", difficulty: "medium" },
            { letter: "O", desc: "Fingers curved into O", fingers: "All fingers curved touching thumb", tips: "Touch fingertips to thumb tip forming circle", difficulty: "easy" },
            { letter: "P", desc: "K pointing down", fingers: "Like K but pointing downward", tips: "Make K sign but point downward", difficulty: "hard" },
            { letter: "Q", desc: "G pointing down", fingers: "Like G but pointing downward", tips: "Make G sign but point downward", difficulty: "hard" },
            { letter: "R", desc: "Crossed index and middle", fingers: "Index and middle fingers crossed", tips: "Cross your index and middle fingers", difficulty: "medium" },
            { letter: "S", desc: "Thumb over fingers", fingers: "Fist with thumb across fingers", tips: "Make fist and wrap thumb across front of fingers", difficulty: "easy" },
            { letter: "T", desc: "Thumb between index and middle", fingers: "Thumb positioned between fingers", tips: "Make fist with thumb sticking up between index and middle", difficulty: "medium" },
            { letter: "U", desc: "Index + middle up together", fingers: "Two fingers straight up together", tips: "Keep index and middle together pointing straight up", difficulty: "easy" },
            { letter: "V", desc: "Peace sign", fingers: "Index and middle spread (V shape)", tips: "Make a V with fingers spread apart", difficulty: "easy" },
            { letter: "W", desc: "Three fingers up", fingers: "Index, middle, and pinky extended", tips: "Extend three fingers like W", difficulty: "easy" },
            { letter: "X", desc: "Index bent like hook", fingers: "Index finger bent at joint", tips: "Bend index finger like a hook", difficulty: "medium" },
            { letter: "Y", desc: "Thumb and pinky extended", fingers: "Thumb and pinky out (hang loose)", tips: "Extend thumb and pinky outward", difficulty: "easy" },
            { letter: "Z", desc: "Z with finger drawing", fingers: "Index draws Z in air", tips: "Use index finger to trace Z in the air", difficulty: "hard" }
        ];

        // ASL Numbers
        const ASL_NUMBERS = [
            { number: "0", desc: "Finger to thumb circle", fingers: "Thumb and index touching" },
            { number: "1", desc: "Index finger up", fingers: "Only index extended" },
            { number: "2", desc: "Index and middle up", fingers: "Two fingers up" },
            { number: "3", desc: "Thumb, index, middle up", fingers: "Three fingers with thumb" },
            { number: "4", desc: "Four fingers up", fingers: "All except thumb" },
            { number: "5", desc: "Five fingers up", fingers: "All fingers extended" },
            { number: "6", desc: "Thumb and pinky", fingers: "Thumb and pinky extended" },
            { number: "7", desc: "Thumb across fingers", fingers: "Thumb across four fingers" },
            { number: "8", desc: "Index to thumb", fingers: "Index touches thumb base" },
            { number: "9", desc: "Index bent over thumb", fingers: "Index bent over thumb" },
            { number: "10", desc: "Crossed index fingers", fingers: "Both index fingers crossed" }
        ];

        // Common Words
        const ASL_WORDS = {
            greetings: [
                { word: "Hello", desc: "Open hand from chin forward" },
                { word: "Goodbye", desc: "Open hand wave outward" },
                { word: "Please", desc: "Rub flat hand in circle on chest" },
                { word: "Thank you", desc: "Touch chin, move forward" },
                { word: "Sorry", desc: "Rub circle on chest" },
                { word: "Yes", desc: "Fist nods forward" }
            ],
            questions: [
                { word: "Who", desc: "Point to person, wiggle" },
                { word: "What", desc: "Two fists, twist sides" },
                { word: "Where", desc: "Point out, question look" },
                { word: "When", desc: "Move finger in arc" },
                { word: "Why", desc: "Why not - drag on forehead" },
                { word: "How", desc: "Two flat hands twist" }
            ],
            everyday: [
                { word: "Help", desc: "Fist up, pull up" },
                { word: "Eat", desc: "Fingers to mouth" },
                { word: "Drink", desc: "Fingers to mouth, mime drinking" },
                { word: "Want", desc: "Pull fingers toward you" },
                { word: "Need", desc: "X hands across chest" },
                { word: "Good", desc: "Touch chest, move out" }
            ]
        };

        // State variables
        let currentSign = "--";
        let currentFullText = "";
        let predictionHistory = [];
        let previousLandmarks = null;
        let previousMotionTime = 0;
        let motionVelocity = 0;
        let cameraActive = false;
        let holistic = null;
        let translationCount = 0;
        let sessionStartTime = Date.now();
        let translationHistory = [];
        let confidenceScores = [];
        
        // Settings
        let settings = {
            darkMode: false,
            showLandmarks: true,
            motionTracking: true,
            handDetection: true,
            faceDetection: true,
            poseDetection: true,
            soundFeedback: false,
            vibrationFeedback: false,
            mlSensitivity: 0.5,
            voiceGender: 'female',
            speechSpeed: 1,
            voicePitch: 1,
            volume: 1
        };

        // Check if MediaPipe is ready
        function checkMediaPipe() {
            return typeof Holistic !== 'undefined' && typeof Camera !== 'undefined';
        }

        // Calibration state
        let calibrationStep = 0;
        const calibrationLetters = ['A', 'B', 'C', 'D', 'E'];

        // Load settings from localStorage
        function loadSettings() {
            const saved = localStorage.getItem('signInterpreterSettings');
            if (saved) {
                settings = { ...settings, ...JSON.parse(saved) };
            }
            applySettings();
        }

        function saveSettings() {
            localStorage.setItem('signInterpreterSettings', JSON.stringify(settings));
        }

        function applySettings() {
            if (settings.darkMode) {
                document.documentElement.classList.add('dark');
            }
        }

        // Context Help content
        const contextHelp = {
            translate: {
                title: "How to Translate",
                content: "Position your hand in the center frame. The app will detect ASL letters in real-time. Hold each sign steady for best results. Use Speak to hear the translation aloud."
            },
            learn: {
                title: "Learn ASL Alphabet",
                content: "Browse through all 26 letters of the ASL alphabet. Tap any letter to see detailed instructions. Practice each sign in front of your camera."
            },
            numbers: {
                title: "ASL Numbers",
                content: "Learn numbers 0-10 in ASL. Each number has a unique handshape. Practice making each number sign clearly."
            },
            words: {
                title: "Common Words",
                content: "Essential ASL phrases for everyday conversation. Learn greetings, questions, and common expressions."
            },
            calibration: {
                title: "Calibration",
                content: "Improve accuracy by calibrating for your hand. Perform each letter shown on screen while the camera detects your hand position."
            },
            settings: {
                title: "Settings Help",
                content: "Adjust ML sensitivity for better detection. Enable sound or vibration feedback. Toggle dark mode for comfortable viewing."
            },
            voice: {
                title: "Voice Settings",
                content: "Customize how translations are spoken. Adjust speed, pitch, and volume to your preference."
            },
            face: {
                title: "Face & Pose Detection",
                content: "View real-time face mesh (468 points) and body pose detection (33 points). Useful for understanding body language and facial expressions in ASL."
            }
        };

        function showContextHelp(type) {
            const help = contextHelp[type] || contextHelp.translate;
            const modal = document.getElementById('context-modal');
            const content = document.getElementById('context-modal-content');
            content.innerHTML = `
                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">help</span>${help.title}
                </h3>
                <p class="text-slate-600 dark:text-slate-300">${help.content}</p>
            `;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeContextModal() {
            const modal = document.getElementById('context-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Menu functions
        function toggleMenu() {
            const menu = document.getElementById('side-menu');
            menu.classList.toggle('menu-slide');
            menu.classList.toggle('menu-open');
        }

        function showScreen(screenName) {
            document.querySelectorAll('[id$="-screen"]').forEach(s => {
                s.classList.add('hidden');
                s.classList.remove('flex');
            });
            
            const screen = document.getElementById(screenName + '-screen');
            if (screen) {
                screen.classList.remove('hidden');
                screen.classList.add('flex');
            }

            // Initialize screen-specific content - keep camera running for translate/calibrate
            if (screenName === 'translate') {
                startMLCamera();
            }
            else if (screenName === 'calibrate') {
                if (!cameraActive) {
                    startCalibrationCamera();
                } else {
                    // Use existing camera - just show landmarks on calibration canvas
                    shareCameraToCalibration();
                }
            }
            else if (screenName === 'home') {
                stopCamera();
                updateStats();
            }
            else if (screenName === 'learn') renderAlphabet();
            else if (screenName === 'numbers') renderNumbers();
            else if (screenName === 'words') renderWords();
            else if (screenName === 'history') renderHistory();
            
            // Close menu if open
            document.getElementById('side-menu').classList.add('menu-slide');
            document.getElementById('side-menu').classList.remove('menu-open');
        }

        function shareCameraToCalibration() {
            // Share the active camera feed to calibration screen
            const calibVideo = document.getElementById('calibVideo');
            const mainVideo = document.getElementById('inputVideo');
            if (calibVideo && mainVideo && mainVideo.srcObject) {
                calibVideo.srcObject = mainVideo.srcObject;
            }
        }

        function updateStats() {
            document.getElementById('stat-translations').textContent = translationCount;
            const timeElapsed = Math.floor((Date.now() - sessionStartTime) / 60000);
            document.getElementById('stat-time').textContent = timeElapsed + 'm';
            
            if (confidenceScores.length > 0) {
                const avgConf = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
                document.getElementById('stat-accuracy').textContent = Math.round(avgConf * 100) + '%';
            }
        }

        // Render functions
        function renderAlphabet(filter = 'all') {
            const grid = document.getElementById('alphabet-grid');
            const filtered = filter === 'all' ? ASL_ALPHABET : ASL_ALPHABET.filter(l => l.difficulty === filter);
            grid.innerHTML = filtered.map(sign => `
                <button onclick="showLetterDetail('${sign.letter}')" class="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 transition-colors">
                    <span class="text-2xl font-bold text-primary">${sign.letter}</span>
                    <span class="text-xs text-slate-500 mt-1 text-center">${sign.desc}</span>
                </button>
            `).join('');
        }

        function filterAlphabet(filter) {
            document.querySelectorAll('.learn-filter').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            event.target.classList.add('bg-primary', 'text-white');
            event.target.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            renderAlphabet(filter);
        }

        function showLetterDetail(letter) {
            const sign = ASL_ALPHABET.find(s => s.letter === letter);
            if (sign) {
                document.getElementById('modal-letter').textContent = letter;
                document.getElementById('modal-desc').textContent = sign.desc;
                document.getElementById('modal-fingers').textContent = sign.fingers;
                document.getElementById('modal-tips').textContent = sign.tips;
                document.getElementById('letter-modal').classList.remove('hidden');
                document.getElementById('letter-modal').classList.add('flex');
            }
        }

        function closeLetterModal() {
            document.getElementById('letter-modal').classList.add('hidden');
            document.getElementById('letter-modal').classList.remove('flex');
        }

        function practiceLetter() {
            closeLetterModal();
            showScreen('translate');
        }

        function renderNumbers() {
            const grid = document.getElementById('numbers-grid');
            grid.innerHTML = ASL_NUMBERS.map(num => `
                <button onclick="showNumberDetail('${num.number}')" class="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 transition-colors">
                    <span class="text-3xl font-bold text-primary">${num.number}</span>
                    <span class="text-xs text-slate-500 mt-1">${num.desc}</span>
                </button>
            `).join('');
        }

        function showNumberDetail(number) {
            const num = ASL_NUMBERS.find(n => n.number === number);
            if (num) {
                alert(`${number}: ${num.desc}\n\nFingers: ${num.fingers}`);
            }
        }

        function renderWords(category = 'greetings') {
            const grid = document.getElementById('words-grid');
            const words = ASL_WORDS[category] || [];
            grid.innerHTML = words.map(w => `
                <button onclick="showWordDetail('${w.word}', '${w.desc}')" class="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 transition-colors">
                    <span class="text-xl font-bold text-primary">${w.word}</span>
                    <span class="text-xs text-slate-500 mt-1 text-center">${w.desc}</span>
                </button>
            `).join('');
        }

        function filterWords(category) {
            document.querySelectorAll('.word-filter').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            event.target.classList.add('bg-primary', 'text-white');
            event.target.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            renderWords(category);
        }

        function showWordDetail(word, desc) {
            alert(`${word}: ${desc}`);
        }

        function renderHistory() {
            const list = document.getElementById('history-list');
            document.getElementById('history-count').textContent = translationHistory.length;
            
            if (translationHistory.length === 0) {
                list.innerHTML = '<p class="text-slate-500 text-center py-8">No translation history yet</p>';
            } else {
                list.innerHTML = translationHistory.map((t, i) => `
                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl slide-up" style="animation-delay: ${i * 50}ms">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl font-bold text-primary bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">${t.letter}</span>
                            <div>
                                <span class="font-semibold text-slate-900 dark:text-white">${t.desc}</span>
                                <p class="text-xs text-slate-500">${t.time}</p>
                            </div>
                        </div>
                        <button onclick="speakLetter('${t.letter}')" class="text-primary p-2 hover:bg-primary/10 rounded-full">
                            <span class="material-symbols-outlined">volume_up</span>
                        </button>
                    </div>
                `).join('');
            }
        }

        function clearHistory() {
            translationHistory = [];
            localStorage.removeItem('translationHistory');
            renderHistory();
            showToast('History cleared');
        }

        function exportHistory() {
            const data = translationHistory.map(t => `${t.letter} - ${t.desc} (${t.time})`).join('\n');
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translation-history.txt';
            a.click();
        }

        // Settings functions
        function toggleDarkMode() {
            settings.darkMode = !settings.darkMode;
            document.documentElement.classList.toggle('dark');
            saveSettings();
        }

        function toggleLandmarks() {
            settings.showLandmarks = !settings.showLandmarks;
            saveSettings();
        }

        function toggleMotion() {
            settings.motionTracking = !settings.motionTracking;
            saveSettings();
        }

        function toggleHand() {
            settings.handDetection = !settings.handDetection;
            saveSettings();
        }

        function toggleFace() {
            settings.faceDetection = !settings.faceDetection;
            saveSettings();
        }

        function togglePose() {
            settings.poseDetection = !settings.poseDetection;
            saveSettings();
        }

        function toggleSound() {
            settings.soundFeedback = !settings.soundFeedback;
            saveSettings();
        }

        function toggleVibration() {
            settings.vibrationFeedback = !settings.vibrationFeedback;
            saveSettings();
        }

        function updateSensitivity() {
            settings.mlSensitivity = parseFloat(document.getElementById('sensitivity-select').value);
            saveSettings();
        }

        function resetSettings() {
            localStorage.removeItem('signInterpreterSettings');
            location.reload();
        }

        // Voice settings functions
        function setVoiceGender(gender) {
            settings.voiceGender = gender;
            saveSettings();
        }

        function updateSpeed(value) {
            settings.speechSpeed = parseFloat(value);
            document.getElementById('speed-value').textContent = value + 'x';
            saveSettings();
        }

        function updatePitch(value) {
            settings.voicePitch = parseFloat(value);
            const labels = ['Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'];
            const idx = Math.min(Math.floor((value - 0.5) / 0.4), 4);
            document.getElementById('pitch-value').textContent = labels[idx];
            saveSettings();
        }

        function updateVolume(value) {
            settings.volume = parseFloat(value);
            document.getElementById('volume-value').textContent = Math.round(value * 100) + '%';
            saveSettings();
        }

        // ML Functions
        let frameCount = 0;
        let lastFpsTime = Date.now();
        
        function startMLCamera() {
            if (cameraActive) return;
            
            // Simple poll for MediaPipe
            let attempts = 0;
            function tryInit() {
                if (checkMediaPipe()) {
                    initMLCamera();
                } else if (attempts < 30) {
                    attempts++;
                    setTimeout(tryInit, 100);
                } else {
                    initMLCamera(); // Fallback
                }
            }
            tryInit();
        }

        function initMLCamera() {
            
            const video = document.getElementById('inputVideo');
            const canvas = document.getElementById('outputCanvas');
            if (!video || !canvas) return;

            const ctx = canvas.getContext('2d');
            cameraActive = true;

            holistic = new Holistic({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
            });

            holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: settings.mlSensitivity,
                minTrackingConfidence: settings.mlSensitivity
            });

            holistic.onResults((results) => {
                // FPS calculation
                frameCount++;
                const now = Date.now();
                if (now - lastFpsTime >= 1000) {
                    document.getElementById('fps-counter').textContent = frameCount + ' FPS';
                    frameCount = 0;
                    lastFpsTime = now;
                }

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

                const rightHand = results.rightHandLandmarks;
                const leftHand = results.leftHandLandmarks;
                const faceLandmarks = results.faceLandmarks;
                const poseLandmarks = results.poseLandmarks;

                // Draw face landmarks if enabled
                if (settings.faceDetection && faceLandmarks && settings.showLandmarks) {
                    drawFaceLandmarks(ctx, faceLandmarks);
                }

                // Draw pose landmarks if enabled
                if (settings.poseDetection && poseLandmarks && settings.showLandmarks) {
                    drawPoseLandmarks(ctx, poseLandmarks);
                }

                // Face detection status
                if (faceLandmarks) {
                    document.getElementById('face-status').classList.remove('bg-slate-400');
                    document.getElementById('face-status').classList.add('bg-green-500');
                    document.getElementById('face-indicator').textContent = 'Face: Detected';
                } else {
                    document.getElementById('face-status').classList.remove('bg-green-500');
                    document.getElementById('face-status').classList.add('bg-slate-400');
                    document.getElementById('face-indicator').textContent = 'Face: Not seen';
                }

                // Motion detection
                const currentLandmarks = rightHand || leftHand;
                let motionDetected = false;
                
                if (settings.motionTracking && currentLandmarks && previousLandmarks) {
                    const motion = calculateMotion(previousLandmarks, currentLandmarks);
                    motionDetected = motion > 0.02;
                    motionVelocity = motion;
                    
                    const motionDot = document.getElementById('motion-dot');
                    const motionIndicator = document.getElementById('motion-indicator');
                    
                    if (motionDetected) {
                        motionDot.classList.remove('bg-yellow-500');
                        motionDot.classList.add('bg-green-500');
                        motionIndicator.textContent = `Motion: ${motion > 0.1 ? 'Fast' : 'Moving'}`;
                    } else {
                        motionDot.classList.remove('bg-green-500');
                        motionDot.classList.add('bg-yellow-500');
                        motionIndicator.textContent = 'Motion: Steady';
                    }
                }

                if ((rightHand || leftHand) && settings.handDetection) {
                    const landmarks = currentLandmarks;
                    
                    if (settings.showLandmarks) {
                        if (rightHand) {
                            drawConnectors(ctx, rightHand, HAND_CONNECTIONS, {color: '#135bec', lineWidth: 2});
                            drawLandmarks(ctx, rightHand, {color: '#ff4757', lineWidth: 1});
                        }
                        if (leftHand) {
                            drawConnectors(ctx, leftHand, HAND_CONNECTIONS, {color: '#135bec', lineWidth: 2});
                            drawLandmarks(ctx, leftHand, {color: '#ff4757', lineWidth: 1});
                        }
                    }

                    const fingers = getFingerStates(landmarks);
                    const detected = detectASL(fingers);
                    
                    if (detected) {
                        predictionHistory.push({ letter: detected.letter, time: Date.now() });
                        if (predictionHistory.length > 10) predictionHistory.filter(p => Date.now() - p.time < 2000);
                        
                        // Require consistent detection
                        const recent = predictionHistory.filter(p => Date.now() - p.time < 1500);
                        const letters = recent.map(p => p.letter);
                        
                        if (letters.length >= 3 && letters.slice(-3).every(l => l === letters[0])) {
                            currentSign = detected.letter;
                            currentFullText += detected.letter;
                            updateTranslation(detected, letters.length > 0 ? letters.length / 5 : 0.5);
                        }
                        
                        document.getElementById('gesture-type').textContent = detected.type || 'Letter';
                    }
                } else {
                    currentSign = "--";
                    document.getElementById('detected-sign').textContent = "--";
                    document.getElementById('gesture-desc').textContent = "Show hand to camera";
                    document.getElementById('gesture-type').textContent = "--";
                    document.getElementById('confidence-bar').style.width = '0%';
                    document.getElementById('confidence-value').textContent = '--%';
                    predictionHistory = [];
                }
                
                previousLandmarks = currentLandmarks;
                ctx.restore();
            });

            const camera = new Camera(video, {
                onFrame: async () => { await holistic.send({image: video}); },
                width: 1280, height: 720
            });
            camera.start();
            
            // Update ML status
            document.getElementById('ml-status').classList.remove('bg-red-500');
            document.getElementById('ml-status').classList.add('bg-green-500');
        }

        function calculateMotion(prev, curr) {
            let totalMotion = 0;
            for (let i = 0; i < Math.min(prev.length, curr.length); i++) {
                totalMotion += Math.abs(curr[i].x - prev[i].x) + Math.abs(curr[i].y - prev[i].y);
            }
            return totalMotion / curr.length;
        }

        function drawFaceLandmarks(ctx, landmarks) {
            if (!landmarks || landmarks.length < 468) return;
            
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            
            // Draw face mesh connections
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 0.5;
            
            // Draw key face points
            ctx.fillStyle = '#00ff88';
            const keyPoints = [1, 4, 10, 152, 397, 288, 323, 454, 356, 61, 40, 140, 171, 175, 396, 369, 395, 364, 365, 397, 288, 361, 323, 454];
            
            for (const idx of keyPoints) {
                if (landmarks[idx]) {
                    const x = landmarks[idx].x * w;
                    const y = landmarks[idx].y * h;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
            
            // Draw face oval
            ctx.beginPath();
            ctx.ellipse(
                landmarks[1].x * w, 
                landmarks[1].y * h, 
                Math.abs(landmarks[234].x - landmarks[454].x) * w / 2,
                Math.abs(landmarks[10].y - landmarks[152].y) * h / 2,
                0, 0, 2 * Math.PI
            );
            ctx.stroke();
        }

        function drawPoseLandmarks(ctx, landmarks) {
            if (!landmarks || landmarks.length < 33) return;
            
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
            
            ctx.fillStyle = '#ff6b35';
            ctx.strokeStyle = '#ff6b35';
            ctx.lineWidth = 2;
            
            // Key pose points to draw
            const poseConnections = [
                [11, 12], // shoulders
                [11, 13], [13, 15], // left arm
                [12, 14], [14, 16], // right arm
                [11, 23], [12, 24], // torso
                [23, 24], // hips
                [23, 25], [25, 27], // left leg
                [24, 26], [26, 28], // right leg
            ];
            
            // Draw connections
            for (const [i, j] of poseConnections) {
                if (landmarks[i] && landmarks[j]) {
                    ctx.beginPath();
                    ctx.moveTo(landmarks[i].x * w, landmarks[i].y * h);
                    ctx.lineTo(landmarks[j].x * w, landmarks[j].y * h);
                    ctx.stroke();
                }
            }
            
            // Draw key joints
            const keyJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
            for (const idx of keyJoints) {
                if (landmarks[idx]) {
                    ctx.beginPath();
                    ctx.arc(landmarks[idx].x * w, landmarks[idx].y * h, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }

        function stopCamera() {
            cameraActive = false;
            document.querySelectorAll('video').forEach(v => {
                if (v.srcObject) v.srcObject.getTracks().forEach(t => t.stop());
            });
        }

        function getFingerStates(landmarks) {
            if (!landmarks || landmarks.length < 21) return null;
            
            const getFingerState = (tip, pip, isThumb = false) => {
                if (isThumb) {
                    return landmarks[tip].x < landmarks[pip].x - 0.02 || landmarks[tip].x > landmarks[pip].x + 0.02;
                }
                return landmarks[tip].y < landmarks[pip].y - 0.02;
            };

            return {
                thumb: getFingerState(4, 3, true),
                index: getFingerState(8, 6),
                middle: getFingerState(12, 10),
                ring: getFingerState(16, 14),
                pinky: getFingerState(20, 18),
            };
        }

        function detectASL(fingers) {
            if (!fingers) return null;
            const { thumb, index, middle, ring, pinky } = fingers;
            const count = thumb + index + middle + ring + pinky;
            
            // More detailed ASL detection
            if (count === 0) return { letter: "E", desc: "E - Bent fingers", type: "Letter" };
            if (count === 1 && index) return { letter: "I", desc: "I - Pinky up", type: "Letter" };
            if (count === 1 && pinky) return { letter: "1", desc: "1 - Index up", type: "Number" };
            if (count === 2 && index && middle) return { letter: "U", desc: "U - Two fingers up", type: "Letter" };
            if (count === 2 && !thumb && index && middle) return { letter: "2", desc: "2 - Two fingers", type: "Number" };
            if (count === 3 && index && middle && ring) return { letter: "W", desc: "W - Three fingers", type: "Letter" };
            if (count === 4 && !thumb) return { letter: "4", desc: "4 - Four fingers", type: "Number" };
            if (count === 5) return { letter: "5", desc: "5 - Five fingers", type: "Number" };
            if (thumb && index && !middle && !ring && !pinky) return { letter: "L", desc: "L - L shape", type: "Letter" };
            if (thumb && !index && !middle && !ring && pinky) return { letter: "Y", desc: "Y - Hang loose", type: "Letter" };
            if (index && middle && !ring && !pinky) return { letter: "V", desc: "V - Peace sign", type: "Letter" };
            if (thumb && index && middle && !ring && !pinky) return { letter: "3", desc: "3 - Three (thumb)", type: "Number" };
            if (thumb && !index && !middle && !ring && !pinky) return { letter: "A", desc: "A - Fist", type: "Letter" };
            if (!thumb && index && middle && ring && !pinky) return { letter: "B", desc: "B - Flat hand", type: "Letter" };
            if (thumb && index && !middle && !ring && pinky) return { letter: "F", desc: "F - OK sign", type: "Letter" };
            if (!thumb && !index && !middle && !ring && !pinky) return { letter: "S", desc: "S - Thumb over", type: "Letter" };
            
            return { letter: `?`, desc: `${count} fingers detected`, type: "Unknown" };
        }

        function updateTranslation(detected, confidence = 0.5) {
            document.getElementById('detected-sign').textContent = detected.letter;
            document.getElementById('gesture-desc').textContent = detected.desc;
            
            // Update confidence display
            const confPercent = Math.round(confidence * 100);
            document.getElementById('confidence-bar').style.width = confPercent + '%';
            document.getElementById('confidence-value').textContent = confPercent + '%';
            
            confidenceScores.push(confidence);
            if (confidenceScores.length > 50) confidenceScores.shift();
            
            translationCount++;
            document.getElementById('stat-translations').textContent = translationCount;
            
            const timeElapsed = Math.floor((Date.now() - sessionStartTime) / 60000);
            document.getElementById('stat-time').textContent = timeElapsed + 'm';
            
            // Add to history
            translationHistory.unshift({
                letter: detected.letter,
                desc: detected.desc,
                time: new Date().toLocaleTimeString()
            });
            if (translationHistory.length > 50) translationHistory.pop();
            
            // Save to localStorage
            localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
            
            // Sound feedback
            if (settings.soundFeedback) {
                playBeep();
            }
            
            // Vibration feedback
            if (settings.vibrationFeedback && navigator.vibrate) {
                navigator.vibrate(50);
            }
        }

        function playBeep() {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(0.1);
        }

        function speakText() {
            if (currentSign !== "--") {
                const utterance = new SpeechSynthesisUtterance(currentSign);
                utterance.rate = settings.speechSpeed;
                utterance.pitch = settings.voicePitch;
                utterance.volume = settings.volume;
                speechSynthesis.speak(utterance);
            }
        }

        function speakLetter(letter) {
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.rate = settings.speechSpeed;
            utterance.pitch = settings.voicePitch;
            utterance.volume = settings.volume;
            speechSynthesis.speak(utterance);
        }

        function copyText() {
            if (currentSign !== "--") {
                navigator.clipboard.writeText(currentSign);
                showToast('Copied to clipboard');
            }
        }

        function clearCurrentText() {
            currentSign = "--";
            currentFullText = "";
            document.getElementById('detected-sign').textContent = "--";
            document.getElementById('gesture-desc').textContent = "Show hand to camera";
            document.getElementById('gesture-type').textContent = "--";
            document.getElementById('confidence-bar').style.width = '0%';
            document.getElementById('confidence-value').textContent = '--%';
        }

        function saveToHistory() {
            if (currentSign !== "--") {
                translationHistory.unshift({
                    letter: currentSign,
                    desc: document.getElementById('gesture-desc').textContent,
                    time: new Date().toLocaleTimeString()
                });
                localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
                showToast('Saved to history');
            }
        }

        function testVoice() {
            const utterance = new SpeechSynthesisUtterance("Hello! This is a test of the voice settings.");
            utterance.rate = settings.speechSpeed;
            utterance.pitch = settings.voicePitch;
            utterance.volume = settings.volume;
            speechSynthesis.speak(utterance);
        }

        // Toast notification
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm z-50 fade-in';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }

        // Calibration
        function startCalibrationCamera() {
            calibrationStep = 0;
            updateCalibrationUI();
            
            // Simple poll for MediaPipe
            let attempts = 0;
            function tryInit() {
                if (checkMediaPipe()) {
                    initCalibrationCamera();
                } else if (attempts < 30) {
                    attempts++;
                    setTimeout(tryInit, 100);
                } else {
                    initCalibrationCamera();
                }
            }
            tryInit();
        }

        function initCalibrationCamera() {
            const video = document.getElementById('calibVideo');
            const canvas = document.getElementById('calibCanvas');
            if (!video || !canvas) return;

            const ctx = canvas.getContext('2d');
            
            holistic = new Holistic({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
            });

            holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            holistic.onResults((results) => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

                if (results.rightHandLandmarks || results.leftHandLandmarks) {
                    const landmarks = results.rightHandLandmarks || results.leftHandLandmarks;
                    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#135bec', lineWidth: 2});
                    drawLandmarks(ctx, landmarks, {color: '#ff4757', lineWidth: 1});
                    
                    document.getElementById('calib-overlay').classList.add('hidden');
                }
            });

            const camera = new Camera(video, {
                onFrame: async () => { await holistic.send({image: video}); },
                width: 640, height: 480
            });
            camera.start();
        }

        function updateCalibrationUI() {
            document.getElementById('calib-progress').textContent = `${calibrationStep + 1} / 5`;
            
            const letter = calibrationLetters[calibrationStep];
            const sign = ASL_ALPHABET.find(s => s.letter === letter);
            
            document.getElementById('calib-letter').textContent = `Perform the '${letter}' sign`;
            document.getElementById('calib-desc').textContent = sign ? sign.desc : '';
            
            for (let i = 1; i <= 5; i++) {
                const el = document.getElementById('prog-' + i);
                if (i <= calibrationStep + 1) {
                    el.classList.remove('bg-slate-200');
                    el.classList.add('bg-primary');
                } else {
                    el.classList.remove('bg-primary');
                    el.classList.add('bg-slate-200');
                }
            }
        }

        function startCalibration() {
            document.getElementById('calib-status').classList.remove('hidden');
            showToast('Calibration saved!');
            
            setTimeout(() => {
                if (calibrationStep < 4) {
                    calibrationStep++;
                    updateCalibrationUI();
                    document.getElementById('calib-status').classList.add('hidden');
                } else {
                    document.getElementById('calib-letter').textContent = 'Calibration Complete!';
                    document.getElementById('calib-desc').textContent = 'Your hand has been calibrated for better accuracy.';
                }
            }, 2000);
        }

        function skipCalibration() {
            if (calibrationStep < 4) {
                calibrationStep++;
                updateCalibrationUI();
            } else {
                showScreen('home');
            }
        }

        function switchCamera() {
            showToast('Switching camera...');
        }

        // Face Detection Screen Functions
        let faceCameraActive = false;
        let currentFaceInfo = "";
        
        function startFaceCamera() {
            if (faceCameraActive) return;
            
            let attempts = 0;
            function tryInit() {
                if (checkMediaPipe()) {
                    initFaceCamera();
                } else if (attempts < 30) {
                    attempts++;
                    setTimeout(tryInit, 100);
                } else {
                    initFaceCamera();
                }
            }
            tryInit();
        }

        function initFaceCamera() {
            const video = document.getElementById('faceVideo');
            const canvas = document.getElementById('faceCanvas');
            if (!video || !canvas) return;

            const ctx = canvas.getContext('2d');
            faceCameraActive = true;

            holistic = new Holistic({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
            });

            holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableFaceMesh: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            holistic.onResults((results) => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

                // Draw face landmarks
                if (results.faceLandmarks) {
                    drawFaceLandmarks(ctx, results.faceLandmarks);
                    document.getElementById('face-points').textContent = results.faceLandmarks.length;
                    currentFaceInfo = `Face detected with ${results.faceLandmarks.length} landmarks`;
                } else {
                    document.getElementById('face-points').textContent = '0';
                }

                // Draw pose landmarks
                if (results.poseLandmarks) {
                    drawPoseLandmarks(ctx, results.poseLandmarks);
                    document.getElementById('pose-points').textContent = results.poseLandmarks.length;
                    if (currentFaceInfo) {
                        currentFaceInfo += `, Pose: ${results.poseLandmarks.length} points`;
                    } else {
                        currentFaceInfo = `Pose detected with ${results.poseLandmarks.length} points`;
                    }
                } else {
                    document.getElementById('pose-points').textContent = '0';
                }

                // Update info display
                document.getElementById('face-pose-info').textContent = currentFaceInfo || 'No detection';

                ctx.restore();
            });

            const camera = new Camera(video, {
                onFrame: async () => { await holistic.send({image: video}); },
                width: 1280, height: 720
            });
            camera.start();
        }

        function stopFaceCamera() {
            faceCameraActive = false;
            const video = document.getElementById('faceVideo');
            if (video && video.srcObject) {
                video.srcObject.getTracks().forEach(t => t.stop());
            }
        }

        function speakFaceInfo() {
            if (currentFaceInfo) {
                speechSynthesis.speak(new SpeechSynthesisUtterance(currentFaceInfo));
            } else {
                speechSynthesis.speak(new SpeechSynthesisUtterance("No face or pose detected. Please position yourself in front of the camera."));
            }
        }

        // Update showScreen to handle face screen
        const originalShowScreen = showScreen;
        showScreen = function(screenName) {
            if (screenName === 'face') {
                startFaceCamera();
            } else if (screenName === 'home') {
                stopFaceCamera();
            }
            originalShowScreen(screenName);
        };

        // Initialize - start with camera screen as main menu
        window.addEventListener('load', () => {
            loadSettings();
            
            // Load history
            const saved = localStorage.getItem('translationHistory');
            if (saved) {
                translationHistory = JSON.parse(saved);
            }
            
            // Hide loading screen and start camera immediately
            document.getElementById('loading-screen').classList.add('hidden');
            showScreen('translate'); // Start with camera as main screen
        });
