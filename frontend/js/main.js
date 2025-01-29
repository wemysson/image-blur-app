let currentImage = null;
let originalImage = null;
const updateDelay = 150;

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para processar a imagem
async function processImage(file, isInitialUpload = false) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('blur', document.getElementById('blurRange').value);

    try {
        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        currentImage = data.image;
        if (isInitialUpload) {
            originalImage = data.image;
            document.getElementById('dropZone').style.display = 'none';
            document.getElementById('imageContainer').style.display = 'block';
        }
        document.getElementById('previewImage').src = currentImage;
    } catch (error) {
        alert('Erro ao processar imagem: ' + error.message);
    }
}

// Função para atualizar o desfoque com debounce
const updateBlur = debounce(async (value) => {
    if (!originalImage) return;
    
    if (parseFloat(value) === 0) {
        // Se o valor do blur for 0, restaura a imagem original
        currentImage = originalImage;
        document.getElementById('previewImage').src = originalImage;
        return;
    }
    
    // Cria um arquivo a partir da imagem original
    const file = await fetch(originalImage)
        .then(res => res.blob())
        .then(blob => new File([blob], 'image.jpg', { type: 'image/jpeg' }));
    
    await processImage(file, false);
}, updateDelay);

// Event Listeners
document.getElementById('blurRange').addEventListener('input', (e) => {
    document.getElementById('blurValue').textContent = e.target.value;
    updateBlur(e.target.value);
});

// Função para download
async function downloadImage() {
    if (!currentImage) return;
    
    try {
        const response = await fetch(`${API_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: currentImage })
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imagem_desfocada.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        alert('Erro ao baixar imagem: ' + error.message);
    }
}

// Função para redefinir
function resetImage() {
    if (!originalImage) return;
    
    currentImage = originalImage;
    document.getElementById('blurRange').value = 0;
    document.getElementById('blurValue').textContent = '0';
    document.getElementById('previewImage').src = originalImage;
}

// Função para trocar imagem
function changeImage() {
    document.getElementById('fileInput').click();
}

// Setup do drag and drop
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file, true);
    }
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file, true);
    }
});

// Função para toggle fullscreen
function toggleFullscreen() {
    const container = document.getElementById('imageContainer');
    const icon = document.querySelector('.fullscreen-icon i');
    
    container.classList.toggle('fullscreen');
    
    if (container.classList.contains('fullscreen')) {
        document.body.style.overflow = 'hidden';
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
    } else {
        document.body.style.overflow = 'auto';
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
    }
}

// Event listener para a tecla Esc
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const container = document.getElementById('imageContainer');
        const icon = document.querySelector('.fullscreen-icon i');
        if (container.classList.contains('fullscreen')) {
            container.classList.remove('fullscreen');
            document.body.style.overflow = 'auto';
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    }
});
