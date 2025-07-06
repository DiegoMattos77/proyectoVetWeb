import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import path from "path";

const router = Router();
const SECRET = process.env.JWT_SECRET || "secreto";

// Configura tu correo y contraseña de aplicación aquí
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'germanr7675@gmail.com',
        pass: 'oqqm aqgd whnf reda'
    }
});

function formatNumber(n: number) {
    return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

router.post('/enviar-remito', async (req: Request, res: Response) => {
    const { nombre, retiro, carrito, total } = req.body;

    // 1. Verifica que el usuario esté autenticado
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    let email = "";
    try {
        // 2. Extrae el email del token JWT
        const decoded = jwt.verify(token, SECRET) as { mail: string };
        email = decoded.mail;
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    // 3. Genera el PDF en memoria
    const doc = new PDFDocument({ margin: 40 });
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        try {
            await transporter.sendMail({
                from: '"Veterinaria" <tucorreo@gmail.com>',
                to: email,
                subject: 'Remito de tu compra',
                text: 'Adjuntamos el remito de tu compra.',
                attachments: [
                    { filename: 'remito.pdf', content: pdfData }
                ]
            });
            res.json({ ok: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al enviar el remito' });
        }
    });

    // --- Remito profesional ---

    // LOGO ARRIBA DE TODO
    try {
        const logoPath = path.join(__dirname, '../img/LogoVet.png'); // Ajusta la ruta si es necesario
        doc.image(logoPath, doc.page.width / 2 - 40, 20, { width: 80 });
        doc.moveDown(4.5); // Espacio debajo del logo
    } catch (e) {
        doc.moveDown(2);
    }

    // Datos de la empresa
    doc.fontSize(18).text("Vet Shop S.A.", { align: "center" });
    doc.fontSize(10).text("Av. Siempre Libre 123, Posadas - Misiones", { align: "center" });
    doc.text("Tel: (376) 4379744 | CUIT: 30-12345678-9", { align: "center" });
    doc.moveDown();

    // Fecha y número de remito

    doc.font("Helvetica-Bold").fontSize(14).text(`REMITO`, { align: "center" });

    const fecha = new Date().toLocaleDateString();
    const nroRemito = Math.floor(Math.random() * 90000 + 10000); // Ejemplo simple
    doc.fontSize(12).text(`Remito N°: ${nroRemito}`, { align: "right" });
    doc.text(`Fecha: ${fecha}`, { align: "right" });
    doc.moveDown();

    // Datos del cliente
    doc.fontSize(12).text(`Cliente: ${nombre}`);
    doc.text(`Email: ${email}`);
    doc.text(`Retiro: ${retiro === "sucursal" ? "Sucursal Posadas" : "Sucursal Posadas"}`);
    doc.moveDown();

    // Tabla de productos
    doc.fontSize(12).text("Productos:", { underline: true });
    doc.moveDown(0.5);

    // Encabezado de tabla alineado
    const startY = doc.y;
    doc.font("Helvetica-Bold");
    doc.text("Producto", 40, startY);
    doc.text("Cantidad", 250, startY);
    doc.text("Precio Unit.", 330, startY);
    doc.text("Subtotal", 430, startY);
    doc.font("Helvetica");
    doc.moveDown(0.5);

    // Filas de productos alineadas
    let y = doc.y;
    carrito.forEach((prod: any) => {
        doc.text(prod.descripcion, 40, y);
        doc.text(prod.cantidad.toString(), 250, y);
        doc.text(`$${formatNumber(prod.precio_venta)}`, 330, y);
        doc.text(`$${formatNumber(prod.precio_venta * prod.cantidad)}`, 430, y);
        y += 18;
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text(`TOTAL: $${formatNumber(total)}`, { align: "right" });
    doc.font("Helvetica").moveDown();

    // Pie de página
    doc.moveDown(2);
    doc.fontSize(10).text("¡Gracias por confiar en Vet Shop S.A.!", { align: "center" });
    doc.text("Ante cualquier consulta, comuníquese con nosotros.", { align: "center" });

    doc.end();
});

// Ruta para descargar el remito como PDF 

router.post('/descargar-remito', async (req: Request, res: Response) => {
    const { nombre, retiro, carrito, total } = req.body;

    // 1. Verifica que el usuario esté autenticado
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    let email = "";
    try {
        const decoded = jwt.verify(token, SECRET) as { mail: string };
        email = decoded.mail;
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    // 2. Genera el PDF en memoria
    const doc = new PDFDocument({ margin: 40 });
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=remito.pdf');
        res.send(pdfData);
    });

    // --- Remito profesional (igual que en /enviar-remito) ---
    try {
        const logoPath = path.join(__dirname, '../img/LogoVet.png');
        doc.image(logoPath, doc.page.width / 2 - 40, 20, { width: 80 });
        doc.moveDown(4.5);
    } catch (e) {
        doc.moveDown(2);
    }

    doc.fontSize(18).text("Vet Shop S.A.", { align: "center" });
    doc.fontSize(10).text("Av. Siempre Libre 123, Posadas - Misiones", { align: "center" });
    doc.text("Tel: (376) 4379744 | CUIT: 30-12345678-9", { align: "center" });
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text(`REMITO`, { align: "center" });

    const fecha = new Date().toLocaleDateString();
    const nroRemito = Math.floor(Math.random() * 90000 + 10000);
    doc.fontSize(12).text(`Remito N°: ${nroRemito}`, { align: "right" });
    doc.text(`Fecha: ${fecha}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).text(`Cliente: ${nombre}`);
    doc.text(`Email: ${email}`);
    doc.text(`Retiro: ${retiro === "sucursal" ? "Sucursal Posadas" : "Sucursal Posadas"}`);
    doc.moveDown();

    doc.fontSize(12).text("Productos:", { underline: true });
    doc.moveDown(0.5);

    const startY = doc.y;
    doc.font("Helvetica-Bold");
    doc.text("Producto", 40, startY);
    doc.text("Cantidad", 250, startY);
    doc.text("Precio Unit.", 330, startY);
    doc.text("Subtotal", 430, startY);
    doc.font("Helvetica");
    doc.moveDown(0.5);

    let y = doc.y;
    carrito.forEach((prod: any) => {
        doc.text(prod.descripcion, 40, y);
        doc.text(prod.cantidad.toString(), 250, y);
        doc.text(`$${formatNumber(prod.precio_venta)}`, 330, y);
        doc.text(`$${formatNumber(prod.precio_venta * prod.cantidad)}`, 430, y);
        y += 18;
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text(`TOTAL: $${formatNumber(total)}`, { align: "right" });
    doc.font("Helvetica").moveDown();

    doc.moveDown(2);
    doc.fontSize(10).text("¡Gracias por confiar en Vet Shop S.A.!", { align: "center" });
    doc.text("Ante cualquier consulta, comuníquese con nosotros.", { align: "center" });

    doc.end();
});

export default router;