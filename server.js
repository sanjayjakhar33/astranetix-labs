const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'your-app-password',
    },
  });

  const mailOptions = {
    from: email,
    to: 'your@gmail.com',
    subject: 'New Contact - TriNexa Website',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Message sent!');
  } catch (err) {
    res.status(500).send('Failed to send message');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));