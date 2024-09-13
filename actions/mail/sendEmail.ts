"use server"


import nodemailer from "nodemailer"

export const sendEmail = async(email: string, ens: string, amount: string, provider: string, type: string) => {

    try {
        if (type == "withdrawal") {
            const transporter = nodemailer.createTransport({
                host: "smtppro.zoho.com",
                port: 465,
                secure: true, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.W_USER,
                    pass: process.env.W_PASS,
                },
            });
        
            const withdrawalEmail = {
                from: `Withdrawals @ susu.club <${process.env.W_USER}>`,
                to: email, // Dynamic recipient email address
                subject: 'susu club withdrawal',
                html: `
                    <p>Dear ${ens},</p>
    
                    <p>Your Susu Box withdrawal of <strong>$${amount}</strong> has been successfully processed via ${provider}. You don’t need to take any further action, simply check your updated balance at your convenience.</p>
    
                    <p>Thank you for trusting us with your savings, and as always, stay safe!</p>
    
                    <p>Warm regards,<br/>susu.club</p>
                `,
            };
            await transporter.sendMail(withdrawalEmail);
        } else if(type == "deposit") {
            const transporter = nodemailer.createTransport({
                host: "smtppro.zoho.com",
                port: 465,
                secure: true, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.D_USER,
                    pass: process.env.D_PASS,
                },
            });
        
            const depositEmail = {
                from: `Deposits @ susu.club <${process.env.D_USER}>`,
                to: email, // Dynamic recipient email address
                subject: 'susu club deposit',
                html: `
                    <p>Dear ${ens},</p>
    
                    <p>We’re excited to inform you that your recent deposit of <strong>$${amount}</strong> has been successfully credited to your Susu Box. You're doing an amazing job with your savings!</p>
    
                    <p>There's nothing more you need to do at this time. When it's convenient, feel free to check your updated balance in your account.</p>
    
                    <p>Thank you for your continued trust, and as always, stay safe and keep up the great savings!</p>
    
                    <p>Warm regards,<br/>susu.club</p>
                `,
            };
            await transporter.sendMail(depositEmail);
        }
    } catch (error) {
        console.log(error)
    }

}



