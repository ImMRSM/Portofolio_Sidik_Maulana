import os
import smtplib
import ssl
from email.message import EmailMessage
from flask import Flask, request, jsonify

# Karena ini akan menjadi endpoint di Vercel, kita gunakan Flask app terpisah
# Tapi Vercel akan menjalankan file ini sebagai serverless function
app = Flask(__name__)

@app.route('/api/contact', methods=['POST'])
def send_email():
    try:
        data = request.form
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': 'Semua field harus diisi.'}), 400

        # Konfigurasi SMTP Gmail (gunakan App Password)
        # Untuk keamanan, simpan credentials di Environment Variables Vercel
        smtp_server = "smtp.gmail.com"
        port = 587
        sender_email = os.environ.get('GMAIL_USER')  # Set di Vercel Dashboard: GMAIL_USER=your-email@gmail.com
        sender_password = os.environ.get('GMAIL_PASS')  # App password, bukan password biasa

        if not sender_email or not sender_password:
            return jsonify({'status': 'error', 'message': 'Konfigurasi email belum diatur. Hubungi admin.'}), 500

        # Buat email
        msg = EmailMessage()
        msg.set_content(f"Nama: {name}\nEmail: {email}\nPesan:\n{message}")
        msg['Subject'] = f"Portofolio Contact: Pesan dari {name}"
        msg['From'] = sender_email
        msg['To'] = "sidikmaulan8272@gmail.com"
        msg['Reply-To'] = email

        # Kirim email
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls(context=ssl.create_default_context())
            server.login(sender_email, sender_password)
            server.send_message(msg)

        return jsonify({'status': 'success', 'message': f"Pesan Anda sudah terkirim ke sidikmaulan8272@gmail.com. Saya akan segera membalas, {name}."})

    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error', 'message': 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'}), 500

# Handler untuk Vercel
def handler(request):
    return app(request)