// Teachable Machine 모델 URL
const URL = "https://teachablemachine.withgoogle.com/models/PlVGzK_8F/";

let model, webcam, labelContainer, maxPredictions;

// 모델 로드 및 웹캠 설정
async function init() {
    const startBtn = document.getElementById("startBtn");
    startBtn.disabled = true;
    startBtn.textContent = "AI 모델 로딩 중...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // 모델 로드
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // 웹캠 설정
        const flip = true; 
        webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        // DOM에 웹캠 화면 추가
        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = ""; // 초기화
        webcamContainer.appendChild(webcam.canvas);

        // 결과 레이블 컨테이너 설정
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ""; // 초기화
        for (let i = 0; i < maxPredictions; i++) {
            const bar = document.createElement("div");
            bar.className = "result-bar";
            bar.innerHTML = `<div style="width: 0%"></div><span></span>`;
            labelContainer.appendChild(bar);
        }
        
        startBtn.textContent = "AI 분석 중...";
    } catch (e) {
        console.error(e);
        alert("카메라를 시작할 수 없습니다. 권한을 확인해주세요.");
        startBtn.disabled = false;
        startBtn.textContent = "Start";
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

// 웹캠 이미지를 모델에 통과시켜 예측
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        const barDiv = labelContainer.childNodes[i].querySelector("div");
        const spanText = labelContainer.childNodes[i].querySelector("span");
        
        barDiv.style.width = (prediction[i].probability * 100) + "%";
        spanText.textContent = classPrediction;
    }
}

// 기존 구매 기능
function buyWater() {
    if(confirm("생수 2L를 구매하시겠습니까?")) {
        document.getElementById("storeList").style.display = "block";
    }
}

// 다크모드 설정
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
