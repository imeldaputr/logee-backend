import nodemailer from 'nodemailer';

const nodemailer = require('nodemailer');

// Konfigurasi transporter untuk Yahoo
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465, // Port untuk koneksi SSL
  secure: true, // Gunakan SSL
  auth: {
    user: process.env.YAHOO_USER, // Email Yahoo kamu
    pass: process.env.YAHOO_PASS, // Password Yahoo kamu
  },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      try {
        // Kirim email konfirmasi ke user
        await transporter.sendMail({
          from: process.env.YAHOO_USER, // Alamat email pengirim
          to: email, // Alamat email penerima
          subject: 'Subscription Confirmation',
          text: 'Thank you for subscribing to our newsletter!',
        });
  
        return res.status(200).json({ message: 'Subscription successful' });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        return res.status(500).json({ message: 'Error sending confirmation email' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  }
