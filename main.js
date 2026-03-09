// Teachable Machine 모델 URL
const URL = "https://teachablemachine.withgoogle.com/models/PlVGzK_8F/";

let model, labelContainer, maxPredictions;

// 모델 로드
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// 이미지 업로드 처리
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 모델이 아직 로드되지 않았다면 로드
    if (!model) {
        await loadModel();
    }

    const preview = document.getElementById('imagePreview');
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        preview.onload = function() {
            predict(preview);
        }
    }
    reader.readAsDataURL(file);
}

// 이미지 예측
async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // 초기화

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        
        const bar = document.createElement("div");
        bar.className = "result-bar";
        bar.innerHTML = `
            <div style="width: ${prediction[i].probability * 100}%"></div>
            <span>${classPrediction}</span>
        `;
        labelContainer.appendChild(bar);
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
