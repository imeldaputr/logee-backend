import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Berlangganan Buletin LOGEE Berhasil!',
            text: `Halo, Terima kasih telah berlangganan buletin LOGEE! Anda akan menerima berita terbaru dari kami.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'Subscription successful and email sent' });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending confirmation email' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
