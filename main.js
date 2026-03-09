// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/PlVGzK_8F/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const startBtn = document.getElementById("startBtn");
    startBtn.disabled = true;
    startBtn.textContent = "모델 로딩 중...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        const bar = document.createElement("div");
        bar.className = "result-bar";
        bar.innerHTML = `<div style="width: 0%"></div><span></span>`;
        labelContainer.appendChild(bar);
    }

    startBtn.textContent = "AI 작동 중";
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
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

// Existing functions
function buyWater() {
    let confirmBuy = confirm("생수 2L를 구매하시겠습니까?");
    if (confirmBuy) {
        document.getElementById("storeList").style.display = "block";
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
}

function updateToggleButton(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleButton(savedTheme);
});
