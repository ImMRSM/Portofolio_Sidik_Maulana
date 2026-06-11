from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # mengizinkan akses dari frontend

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = [
        {"name": "PHP (Laravel)", "icon": "bi-filetype-php", "level": 89},
        {"name": "Python AI/ML", "icon": "bi-filetype-py", "level": 85},
        {"name": "JavaScript/TypeScript", "icon": "bi-filetype-js", "level": 92},
        {"name": "Bootstrap 5 + Custom CSS", "icon": "bi-bootstrap", "level": 96},
        {"name": "Git & GitHub Actions", "icon": "bi-github", "level": 88},
        {"name": "Vercel Deployment", "icon": "bi-cloud-upload", "level": 94},
        {"name": "Responsive Web Design", "icon": "bi-display", "level": 98},
        {"name": "Vibe Coding & UI/UX", "icon": "bi-stars", "level": 91}
    ]
    return jsonify(skills)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "neon_online", "version": "futuristic_v2"})

# Untuk development lokal
if __name__ == '__main__':
    app.run(debug=True, port=5000)