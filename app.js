const express = require('express');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect('home'));
app.get('/home', (req, res) => res.render('pages/home'));
app.get('/about', (req, res) => res.render('pages/about'));
app.get('/cv', (req, res) => res.render('pages/cv'));
app.get('/cover-letter', (req, res) => res.render('pages/cover-letter'));
app.get('/portfolio', (req, res) => res.render('pages/portfolio'));
app.get('/contact', (req, res) => res.render('pages/contact'));

// Configure Nodemailer with Mailgun

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {

    const transporter = nodemailer.createTransport(mailgunTransport({
        auth: {
            api_key: process.env.MAILGUN_API_KEY, // Your Mailgun API key
            domain: process.env.MAILGUN_DOMAIN,   // Your Mailgun domain (sandbox or custom)
        },
    }));

    const mailOptions = {
        from: process.env.MAILGUN_EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Submission",
        text: `You have a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Message sent successfully! Someone will contact you shortly." });

        res.render('contact');
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email", details: error.toString() });
    }
});

app.listen(port, () => {
  console.log(`Website live at http://localhost:${port}`);
});
