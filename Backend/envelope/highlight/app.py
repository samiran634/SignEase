from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import fitz
import os
import uuid
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration for web deployment
app.config['MAX_CONTENT_LENGTH'] = 300 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = '/tmp'  # Use system temp directory

@app.route('/highlight-pdf', methods=['POST'])
def highlight_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400
    
    pdf_file = request.files['pdf']
    
    # Validate file
    if pdf_file.filename == '' or not pdf_file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid PDF file"}), 400

    # Secure filename
    filename = secure_filename(pdf_file.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4()}_{filename}')
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4()}_highlighted.pdf')

    try:
        # Save and open PDF
        pdf_file.save(input_path)
        pdf_document = fitz.open(input_path)
        
        # Get sentences
        sentences = request.form.get('sentences', '').split(',')
        
        # Highlight sentences
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            for page in pdf_document:
                text_instances = page.search_for(sentence)
                for inst in text_instances:
                    page.add_highlight_annot(inst)
        
        # Save highlighted PDF
        pdf_document.save(output_path, garbage=4, deflate=True, clean=True)
        pdf_document.close()
        
        # Send file for download
        return send_file(output_path, 
                         mimetype='application/pdf', 
                         as_attachment=True, 
                         download_name='highlighted.pdf')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Cleanup files
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
        except:
            pass
# Add health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    # Use Gunicorn or other WSGI server in production
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 1234)))