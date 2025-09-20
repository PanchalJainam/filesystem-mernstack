const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  console.log("here", to, otp);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML template for OTP
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333;">🔐 Email Verification</h2>
        <p style="font-size: 16px; color: #555;">
          Please use the following One-Time Password (OTP) to complete your login:
        </p>
        <div style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ddd; text-align: center;">
          <h1 style="letter-spacing: 5px; color: #4CAF50;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #777;">
          This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #aaa;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"File System App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`, // fallback for text-only clients
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
