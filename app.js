require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const nodemailer = require('nodemailer');
const mailgunTransport = require("nodemailer-mailgun-transport");


const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded( {extended: true} )); // Parse application/x-www-form-urlencoded.
app.use(bodyParser.json()); // Parse application/json.

//Routers
app.get('/', (req, res) => {res.render('pages/home');});
app.get('/about', (req, res) => {res.render('pages/about');});
app.get('/cv', (req, res) => {res.render('pages/cv');});
app.get('/cover-letter', (req, res) => {res.render('pages/cover-letter');});
app.get('/portfolios', (req, res) => {res.render('pages/portfolios');});
app.get('/contact', (req, res) => {res.render('pages/contact');});

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
        res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email", details: error.toString() });
    }
});

app.listen(port, () => {
  console.log(`Website live at http://localhost:${port}`);
});
