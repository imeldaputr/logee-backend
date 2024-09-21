const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Konfigurasi Nodemailer untuk Yahoo
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465, // Port untuk SSL
  secure: true, // Menggunakan SSL
  auth: {
    user: process.env.YAHOO_USER, 
    pass: process.env.YAHOO_PASS, 
  },
});

// Endpoint untuk subscription
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Mengirim email konfirmasi ke user
    await transporter.sendMail({
      from: process.env.YAHOO_USER, // Alamat email pengirim
      to: email, // Alamat email penerima
      subject: 'Berlangganan Buletin LOGEE Berhasil!',
      text: 'Halo, Terima kasih telah berlangganan buletin LOGEE! Anda akan menerima berita terbaru dari kami.',
    });

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ message: 'Error sending confirmation email' });
  }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
