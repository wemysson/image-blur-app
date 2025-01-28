from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from PIL import Image, ImageFilter
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Nenhuma imagem fornecida'}), 400
    
    image = request.files['image']
    blur_amount = float(request.form.get('blur', 0))
    
    try:
        img = Image.open(image)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
        
        blurred = img.filter(ImageFilter.GaussianBlur(radius=blur_amount))
        
        buffered = io.BytesIO()
        blurred.save(buffered, format="JPEG", quality=95)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
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
        
        img = Image.open(io.BytesIO(image_bytes))
        
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=95)
        output.seek(0)
        
        response = Response(
            output.getvalue(),
            mimetype='image/jpeg',
            headers={
                'Content-Disposition': 'attachment; filename=imagem_desfocada.jpg',
                'Content-Type': 'image/jpeg'
            }
        )
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
