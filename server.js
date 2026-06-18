require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

const app = express();
const port = process.env.PORT || 3010;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.render("pages/home"));
app.get("/about", (req, res) => res.render("pages/about"));
app.get("/cv", (req, res) => res.render("pages/cv"));
app.get("/cover-letter", (req, res) => res.render("pages/cover-letter"));
app.get("/portfolios", (req, res) => res.render("pages/portfolios"));
app.get("/contact", (req, res) => res.render("pages/contact"));

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_EMAIL_USER || !process.env.EMAIL_USER) {
    return res.status(500).json({ error: "Error encounter: Please email me at aaliyahhaenni@gmail.com" });
  }

  try {
    const transporter = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      })
    );

    const mailOptions = {
      from: process.env.MAILGUN_EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error encounter: Please email me at aaliyahhaenni@gmail.com", error);
    res.status(500).json({ error: "Error encounter: Please email me at aaliyahhaenni@gmail.com", details: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Website live on port ${port}`);
});
