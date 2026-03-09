// Teachable Machine URL
const AI_MODEL_URL = "https://teachablemachine.withgoogle.com/models/PlVGzK_8F/";

let model, webcam, labelContainer, maxPredictions;

// Initialize AI Test
async function initAI() {
    const startBtn = document.getElementById("startBtn");
    startBtn.disabled = true;
    startBtn.textContent = "모델 로딩 중...";

    const modelURL = AI_MODEL_URL + "model.json";
    const metadataURL = AI_MODEL_URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(320, 320, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            const bar = document.createElement("div");
            bar.className = "result-bar";
            bar.innerHTML = `<div style="width: 0%"></div><span></span>`;
            labelContainer.appendChild(bar);
        }
        startBtn.textContent = "테스트 진행 중";
    } catch (e) {
        console.error(e);
        alert("카메라 또는 모델 로딩에 실패했습니다.");
        startBtn.disabled = false;
        startBtn.textContent = "테스트 시작하기";
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        const bar = labelContainer.childNodes[i].querySelector("div");
        const span = labelContainer.childNodes[i].querySelector("span");
        
        bar.style.width = (prediction[i].probability * 100) + "%";
        span.textContent = classPrediction;
    }
}

// Purchase Functions
function buyWater() {
    if(confirm("생수 2L를 구매하시겠습니까?")) {
        document.getElementById("storeList").style.display = "block";
    }
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
}

function updateToggleButton(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleButton(savedTheme);
});
