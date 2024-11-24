let currentScreen = 1;
let qrDataUrl = '';

// Handle form submission
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        clubName: document.getElementById('clubName').value,
        eventName: document.getElementById('eventName').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    // Generate QR code
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: JSON.stringify(formData),
        width: 200,
        height: 200
    });

    // Store QR code data URL for later use
    setTimeout(() => {
        qrDataUrl = qrContainer.querySelector('img').src;
        goToScreen(2);
    }, 100);
});

// Handle file upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f0f0f0';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createFinalImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function createFinalImage(uploadedImageSrc) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const qrImg = new Image();

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        qrImg.onload = function() {
            // Draw QR code in bottom-right corner
            const qrSize = Math.min(canvas.width, canvas.height) * 0.2;
            ctx.drawImage(qrImg, 
                canvas.width - qrSize - 20, 
                canvas.height - qrSize - 20, 
                qrSize, qrSize);
            
            document.getElementById('finalPreview').src = canvas.toDataURL();
            goToScreen(4);
        };
        qrImg.src = qrDataUrl;
    };
    img.src = uploadedImageSrc;
}

function goToScreen(screenNumber) {
    document.querySelector(`.screen:nth-child(${currentScreen})`).classList.remove('active');
    document.querySelector(`.screen:nth-child(${screenNumber})`).classList.add('active');
    currentScreen = screenNumber;
}

function resetForm() {
    document.getElementById('eventForm').reset();
    goToScreen(1);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'event-poster-with-qr.png';
    link.href = document.getElementById('finalPreview').src;
    link.click();
}
