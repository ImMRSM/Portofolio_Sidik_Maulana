import os
import smtplib
import ssl
from email.message import EmailMessage
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/contact', methods=['POST'])
def send_email():
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': 'Semua field harus diisi.'}), 400

        sender_email = os.environ.get('GMAIL_USER')
        sender_password = os.environ.get('GMAIL_PASS')

        if not sender_email or not sender_password:
            return jsonify({'status': 'error', 'message': 'Konfigurasi email belum diatur.'}), 500

        msg = EmailMessage()
        msg.set_content(f"Nama: {name}\nEmail: {email}\nPesan:\n{message}")
        msg['Subject'] = f"Portofolio Contact: Pesan dari {name}"
        msg['From'] = sender_email
        msg['To'] = "sidikmaulan8272@gmail.com"
        msg['Reply-To'] = email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls(context=ssl.create_default_context())
            server.login(sender_email, sender_password)
            server.send_message(msg)

        return jsonify({'status': 'success', 'message': f"Pesan terkirim, {name}. Saya akan membalas ke {email}."})

    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error', 'message': 'Terjadi kesalahan. Coba lagi nanti.'}), 500

def handler(request):
    return app(request)