from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from PIL import Image, ImageFilter
import io
import base64
from functools import lru_cache

app = Flask(__name__)
CORS(app)

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
    
    blurred = img.filter(ImageFilter.GaussianBlur(radius=blur_amount))
    buffered = io.BytesIO()
    blurred.save(buffered, format="JPEG", quality=85)  # Reduzindo qualidade para melhor performance
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Nenhuma imagem fornecida'}), 400
    
    image = request.files['image']
    blur_amount = float(request.form.get('blur', 0))
    
    try:
        image_bytes = image.read()
        img_str = apply_blur(image_bytes, blur_amount)
        return jsonify({'image': f'data:image/jpeg;base64,{img_str}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['POST'])
def download_image():
    try:
        image_data = request.json.get('image')
        if not image_data:
            return jsonify({'error': 'Nenhuma imagem fornecida'}), 400
        
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        output = io.BytesIO(image_bytes)
        
        response = Response(
            output.getvalue(),
            mimetype='image/jpeg',
            headers={
                'Content-Disposition': 'attachment;filename=imagem_desfocada.jpg'
            }
        )
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
