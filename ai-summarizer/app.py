from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import torch

app = Flask(__name__)
CORS(app)  # Enable frontend requests

# ---------------- Summarizer ----------------
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=0 if torch.cuda.is_available() else -1
)

@app.route('/summarize', methods=['POST'])
def summarize_chat():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({'error': 'Invalid JSON format'}), 400

    if not data or 'chat' not in data or not isinstance(data['chat'], list):
        return jsonify({'error': 'Invalid input. Expecting JSON with a "chat" field (list).'}), 400

    try:
        chat = data['chat']
        combined_text = " ".join(str(msg.get("message", "")).strip() for msg in chat if isinstance(msg, dict))

        if not combined_text.strip():
            return jsonify({'error': 'No meaningful messages found to summarize.'}), 400

        max_input_chars = 3000
        safe_input = combined_text[:max_input_chars]

        summary = summarizer(safe_input, max_length=100, min_length=20, do_sample=False)[0]['summary_text']

        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': f'Server Error: {str(e)}'}), 500

# ---------------- Chat Persistence ----------------
chat_history = []

@app.route('/chat', methods=['GET'])
def get_chat():
    return jsonify(chat_history)

@app.route('/chat', methods=['POST'])
def add_chat():
    data = request.get_json()
    author = data.get("author", "Unknown")
    message = data.get("message", "")
    chat_history.append({"author": author, "message": message})
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
