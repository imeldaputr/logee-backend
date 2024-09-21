const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Dummy in-memory array to store emails (in real case, use database)
let subscribers = [];

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// POST endpoint for email subscription
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    // Basic email validation
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    // Check if email already subscribed
    if (subscribers.includes(email)) {
        return res.status(400).json({ message: 'Email already subscribed' });
    }

    // Add email to subscribers
    subscribers.push(email);

    // Send confirmation email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Berlangganan Buletin LOGEE Berhasil!',
        text: `Halo, Terima kasih telah berlangganan buletin LOGEE! Anda akan menerima berita terbaru dari kami.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending confirmation email' });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Subscription successful and email sent' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
