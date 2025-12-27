const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    // ১. ট্রান্সপোর্টার কনফিগারেশন
    // ১. ট্রান্সপোর্টার কনফিগারেশন (সবচেয়ে সহজ পদ্ধতি)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // হোস্ট ও পোর্ট অটোমেটিক নিয়ে নেবে
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
    // 🔥 ফিক্স ১: বাটন দেখাবো কি না? (যদি URL থাকে তবেই সত্য)
    const hasLink = options.url ? true : false;

    // ৪. ইমেইল বডি
    const message = {
        from: `HyperBoost Security Team <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: `
            <div style="max-width: 600px; margin: auto; border: 1px solid #333; background-color: #000; font-family: Arial, sans-serif; color: #fff;">
                <div style="text-align: center; padding: 20px; border-bottom: 1px solid #333;">
                    <h1 style="color: #06b6d4; margin: 0; letter-spacing: 2px;">HYPERBOOST</h1>
                </div>
                
                <div style="padding: 30px; text-align: center;">
                    <h3 style="color: #fff;">Hello,</h3>
                    
                    <div style="font-size: 16px; color: #ccc; line-height: 1.6;">
                        ${options.message}
                    </div>
                    
                    ${hasLink ? `
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${options.url}" style="background-color: #06b6d4; color: #000; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                            VERIFY ACCOUNT
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">Or copy this link:</p>
                    <p style="background: #111; padding: 10px; font-size: 12px; color: #06b6d4; word-break: break-all; border: 1px solid #333;">${options.url}</p>
                    ` : ''}
                    
                </div>
            </div>
        `
    };

    // ৫. ইমেইল পাঠানো
    try {
        const info = await transporter.sendMail(message);
        console.log("✅ Email sent successfully! Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ EMAIL FAILED:", error);
        throw error;
    }
};

module.exports = sendEmail;