import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Usa variables de entorno
        pass: process.env.EMAIL_PASS
    }
});

export async function enviarCorreoRecuperacion(destinatario: string, link: string) {
    try {
        console.log("Intentando enviar correo a:", destinatario, "con link:", link);
        const info = await transporter.sendMail({
            from: '"VetWeb" <no-reply@vetweb.com>',
            to: destinatario,
            subject: "Recupera tu contraseña",
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                   <a href="${link}">${link}</a>`
        });
        console.log("Correo enviado:", info.response);
    } catch (error) {
        console.error("Error enviando el correo:", error);
        throw error;
    }
}