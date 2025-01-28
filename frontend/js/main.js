let currentImage = null;

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('dropZone').addEventListener('dragover', handleDragOver);
document.getElementById('dropZone').addEventListener('drop', handleDrop);
document.getElementById('blurRange').addEventListener('input', handleBlurChange);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.borderColor = '#007bff';
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.borderColor = '#444';
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

async function processImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('blur', document.getElementById('blurRange').value);

    try {
        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.image) {
            currentImage = data.image;
            document.getElementById('previewImage').src = currentImage;
            document.getElementById('imageContainer').style.display = 'block';
            document.getElementById('dropZone').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro ao processar a imagem. Por favor, tente novamente.');
    }
}

async function handleBlurChange(event) {
    const blurAmount = event.target.value;
    document.getElementById('blurValue').textContent = blurAmount;
    
    if (document.getElementById('fileInput').files[0]) {
        await processImage(document.getElementById('fileInput').files[0]);
    }
}

async function downloadImage() {
    if (!currentImage) return;

    try {
        const response = await fetch(`${API_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao baixar imagem:', error);
        alert('Erro ao baixar a imagem. Por favor, tente novamente.');
    }
}

function toggleFullscreen() {
    const container = document.getElementById('imageContainer');
    container.classList.toggle('fullscreen');
    
    if (container.classList.contains('fullscreen')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}
