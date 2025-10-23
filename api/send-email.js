

const SibApiV3Sdk = require('@sendinblue/client');

export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error("Brevo API Key nahi mili.");
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  
  const { name, email, message } = req.body;

  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all fields' });
  }

  
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = BREVO_API_KEY;

  
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = `New Contact Form Message from ${name}`;
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Message from Your Startup Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p style="margin: 0;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </body>
    </html>
  `;

  
  sendSmtpEmail.sender = { name: "Your Startup Bot", email: "your-verified-sender@gmail.com" }; 

  
  sendSmtpEmail.to = [
    { email: "your-personal-email@gmail.com", name: "Sonu Rao" } 
  ];

  
  sendSmtpEmail.replyTo = { email: email, name: name };
  

  
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Brevo Error:', error.message);
    
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
}