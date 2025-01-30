from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from PIL import Image, ImageFilter
import io
import base64
from functools import lru_cache
import os

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://image-blur-app.netlify.app",
            "https://image-blur-app.onrender.com",
            "http://localhost:5000",
            "http://localhost:3000"
        ]
    }
})

@lru_cache(maxsize=32)
def apply_blur(image_bytes, blur_amount):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGB')
    
    # Redimensiona a imagem se for muito grande para melhor performance
    max_size = 1200
    if img.size[0] > max_size or img.size[1] > max_size:
        ratio = min(max_size/img.size[0], max_size/img.size[1])
        new_size = (int(img.size[0]*ratio), int(img.size[1]*ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Aplica o desfoque apenas se o valor for maior que 0
    if blur_amount > 0:
        img = img.filter(ImageFilter.GaussianBlur(radius=blur_amount))
    
    # Converte para JPEG
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/process', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Nenhuma imagem fornecida'}), 400
        
        image = request.files['image']
        blur_amount = float(request.form.get('blur', 0))
        
        if not image.content_type.startswith('image/'):
            return jsonify({'error': 'Arquivo enviado não é uma imagem'}), 400
        
        image_bytes = image.read()
        img_str = apply_blur(image_bytes, blur_amount)
        return jsonify({'image': f'data:image/jpeg;base64,{img_str}'})
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/download', methods=['POST'])
def download_image():
    try:
        image_data = request.json.get('image')
        if not image_data:
            return jsonify({'error': 'Nenhuma imagem fornecida'}), 400
        
        # Remove o cabeçalho data:image/jpeg;base64,
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        return Response(
            image_bytes,
            mimetype='image/jpeg',
            headers={'Content-Disposition': 'attachment;filename=imagem_desfocada.jpg'}
        )
    
    except Exception as e:
        return jsonify({'error': 'Erro ao fazer download da imagem'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
