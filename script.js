document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const startBtn = document.getElementById('start-btn');
    const candleSection = document.getElementById('candle-section');
    const candleLit = document.getElementById('candle-lit');
    const instructionText = document.getElementById('instruction-text');
    const iconGroup = document.getElementById('icon-group');
    
    let audioContext;
    let analyser;
    let microphone;
    let isCandleLit = true;

    // --- Confetti Function ---
    function shootConfetti() {
        const colors = ['#ff5252', '#ffeb3b', '#00e676', '#29b6f6', '#ab47bc'];
        for (let i = 0; i < 100; i++) {
            let conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
            conf.style.animationDelay = (Math.random() * 0.5) + 's';
            document.body.appendChild(conf);
            setTimeout(() => { conf.remove(); }, 5000);
        }
    }

    // --- Microphone Blow Detection Logic ---
    async function startMicListening() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            
            microphone.connect(analyser);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function checkVolume() {
                if (!isCandleLit) return;

                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                let averageVolume = sum / bufferLength;

                if (averageVolume > 100) {
                    blowOutCandle();
                  } else {
                    requestAnimationFrame(checkVolume);
                }

            }

            checkVolume();

        } catch (err) {
            console.error("Microphone access denied or error:", err);
            instructionText.textContent = "Microphone access blocked. Tap the candle to blow it out manually!";
            candleSection.addEventListener('click', blowOutCandle);
        }
    }

    // --- The Big Reveal Action ---
    function blowOutCandle() {
        isCandleLit = false;
        
        candleLit.style.opacity = '0';
        instructionText.style.display = 'none';

        setTimeout(() => {
            candleSection.style.display = 'none';
            shootConfetti();
            iconGroup.classList.remove('hidden-element');
            
            if (microphone) microphone.disconnect();
            if (audioContext) audioContext.close();
        }, 800);
    }

    // --- Start Celebration Button Click ---
    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        candleSection.style.display = 'flex';
        startMicListening();
    });

    // --- Page Navigation Logic ---
    const landingPage = document.getElementById('landing-page');
    const messagePage = document.getElementById('message-page');
    const cameraPage = document.getElementById('camera-page');
    const videoPage = document.getElementById('video-page');

    const btnLetter = document.getElementById('btn-letter');
    const animatedEnvelope = document.getElementById('animated-envelope');
    const btnCamera = document.getElementById('btn-camera');
    const btnVideo = document.getElementById('btn-video');
    
    const backFromMessage = document.getElementById('back-from-message');
    const backFromCamera = document.getElementById('back-from-camera');
    const backFromVideo = document.getElementById('back-from-video');
    const sampleVideo = document.querySelector('.custom-video');

    // Envelope Click Logic
    btnLetter.addEventListener('click', () => {
        animatedEnvelope.classList.add('is-open');
        setTimeout(() => {
            landingPage.classList.remove('active');
            landingPage.classList.add('hidden');
            messagePage.classList.remove('hidden');
            messagePage.classList.add('active');
        }, 800);
    });

    backFromMessage.addEventListener('click', () => {
        messagePage.classList.remove('active');
        messagePage.classList.add('hidden');
        landingPage.classList.remove('hidden');
        landingPage.classList.add('active');
        setTimeout(() => { animatedEnvelope.classList.remove('is-open'); }, 400); 
    });

    // Camera Click Logic
    btnCamera.addEventListener('click', () => {
        btnCamera.classList.add('camera-clicking');
        setTimeout(() => {
            landingPage.classList.remove('active');
            landingPage.classList.add('hidden');
            cameraPage.classList.remove('hidden');
            cameraPage.classList.add('active');
            btnCamera.classList.remove('camera-clicking');
        }, 400);
    });

    backFromCamera.addEventListener('click', () => {
        cameraPage.classList.remove('active');
        cameraPage.classList.add('hidden');
        landingPage.classList.remove('hidden');
        landingPage.classList.add('active');
    });

    // Video Click Logic
    btnVideo.addEventListener('click', () => {
        landingPage.classList.remove('active');
        landingPage.classList.add('hidden');
        videoPage.classList.remove('hidden');
        videoPage.classList.add('active');
    });

    backFromVideo.addEventListener('click', () => {
        videoPage.classList.remove('active');
        videoPage.classList.add('hidden');
        landingPage.classList.remove('hidden');
        landingPage.classList.add('active');
        if (sampleVideo) sampleVideo.pause(); // Pause video playback when leaving page
    });

});
