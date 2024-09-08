"use server"


import nodemailer from "nodemailer"

export const sendEmail = async(email: string, ens: string, amount: string, provider: string) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
    
        const withdrawalEmail = {
            from: `Withdrawals @ susu.club <${process.env.USER}>`,
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
    } catch (error) {
        console.log(error)
    }

}



