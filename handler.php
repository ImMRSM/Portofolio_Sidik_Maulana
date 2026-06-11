<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
    $email = htmlspecialchars(strip_tags(trim($_POST['email'] ?? '')));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid.']);
        exit;
    }

    // Tujuan email ke portofolio pemilik
    $to = "sidikmaulan8272@gmail.com";
    $subject = "Portofolio Contact: Pesan dari $name";
    $body = "Anda menerima pesan baru dari portofolio neon.\n\n" .
            "Nama: $name\n" .
            "Email: $email\n\n" .
            "Pesan:\n$message\n\n" .
            "---\nDikirim dari NEO_VIBE PORTFOLIO";
    $headers = "From: $email\r\n" .
               "Reply-To: $email\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Kirim email
    $mailSent = mail($to, $subject, $body, $headers);

    // Simpan log juga (opsional)
    $logEntry = "[".date('Y-m-d H:i:s')."] $name ($email) mengirim: " . substr($message, 0, 50) . (strlen($message)>50 ? "..." : "") . PHP_EOL;
    file_put_contents('contact_log.txt', $logEntry, FILE_APPEND);

    if ($mailSent) {
        echo json_encode([
            'status' => 'success',
            'message' => "Halo $name, pesan Anda sudah terkirim ke email saya (sidikmaulan8272@gmail.com). Saya akan segera membalas ke $email."
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => "Gagal mengirim email. Pastikan server PHP mendukung fungsi mail(). Hubungi saya langsung via WhatsApp atau media sosial lain."
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Method tidak diizinkan. Gunakan POST.']);
}
?>