import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import Pedidos from "../models/Pedidos.models";
import DetallePedidos from "../models/DetallePedidos.models";
import Productos from "../models/Productos.models";
import Clientes from "../models/Clientes.models";

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

function formatNumber(n: any) {
    const num = parseFloat(n);
    if (isNaN(num)) return '0.00';
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}

// Función para llenar el template HTML con los datos
function llenarTemplateFactura(datos: {
    numeroFactura: string;
    fecha: string;
    nombreCliente: string;
    direccionCliente: string;
    telefonoCliente: string;
    cuitCuil: string;
    productos: any[];
    total: number;
    logoPath: string;
}) {
    // Leer el template HTML
    const templatePath = path.join(__dirname, '../../factura.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Convertir logo a base64
    let logoBase64 = '';
    try {
        const logoBuffer = fs.readFileSync(datos.logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
        logoBase64 = ''; // Imagen vacía si no se puede cargar
    }

    // Generar las filas de productos
    const filasProductos = datos.productos.map(prod => `
        <tr>
            <td>${prod.id_producto || ''}</td>
            <td>${prod.descripcion}</td>
            <td>$${formatNumber(prod.precio_venta)}</td>
            <td>${prod.cantidad}</td>
        </tr>
    `).join('');

    // Reemplazar los placeholders
    html = html.replace('{{imagen}}', logoBase64);
    html = html.replace('{{numeroFactura}}', datos.numeroFactura);
    html = html.replace('{{fecha}}', datos.fecha);
    html = html.replace('{{nombreCliente}}', datos.nombreCliente);
    html = html.replace('{{direccionCliente}}', datos.direccionCliente || 'No especificada');
    html = html.replace('{{telefonoCliente}}', datos.telefonoCliente || 'No especificado');
    html = html.replace('{{cuitCuil}}', datos.cuitCuil || 'No especificado');
    html = html.replace('{{filasProductos}}', filasProductos);
    html = html.replace('{{total}}', `$${formatNumber(datos.total)}`);

    return html;
}

// Función para generar PDF usando puppeteer
async function generarPDFDesdeHTML(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        return Buffer.from(pdf);
    } finally {
        await browser.close();
    }
}

router.post('/enviar-factura', async (req: Request, res: Response) => {
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

    try {
        // 3. Preparar datos para la factura
        const fecha = new Date().toLocaleDateString();
        const numeroFactura = Math.floor(Math.random() * 90000 + 10000).toString(); // Ejemplo simple
        const logoPath = path.join(__dirname, '../img/LogoVet.png');

        const datosFactura = {
            numeroFactura,
            fecha,
            nombreCliente: nombre,
            direccionCliente: 'No especificada', // Puedes obtener esto de la base de datos
            telefonoCliente: 'No especificado', // Puedes obtener esto de la base de datos
            cuitCuil: 'No especificado', // Puedes obtener esto de la base de datos
            productos: carrito,
            total,
            logoPath
        };

        // 4. Generar HTML con los datos
        const html = llenarTemplateFactura(datosFactura);

        // 5. Generar PDF
        const pdfBuffer = await generarPDFDesdeHTML(html);

        // 6. Enviar por email
        await transporter.sendMail({
            from: '"Veterinaria" <tucorreo@gmail.com>',
            to: email,
            subject: 'Factura de tu compra',
            text: 'Adjuntamos la factura de tu compra.',
            attachments: [
                { filename: 'factura.pdf', content: pdfBuffer }
            ]
        });

        res.json({ ok: true });
    } catch (error) {
        console.error('Error al enviar la factura:', error);
        res.status(500).json({ error: 'Error al enviar la factura' });
    }
});

router.post('/descargar-factura', async (req: Request, res: Response) => {
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

    try {
        // 2. Preparar datos para la factura
        const fecha = new Date().toLocaleDateString();
        const numeroFactura = Math.floor(Math.random() * 90000 + 10000).toString(); // Ejemplo simple
        const logoPath = path.join(__dirname, '../img/LogoVet.png');

        const datosFactura = {
            numeroFactura,
            fecha,
            nombreCliente: nombre,
            direccionCliente: 'No especificada', // Puedes obtener esto de la base de datos
            telefonoCliente: 'No especificado', // Puedes obtener esto de la base de datos
            cuitCuil: 'No especificado', // Puedes obtener esto de la base de datos
            productos: carrito,
            total,
            logoPath
        };

        // 3. Generar HTML con los datos
        const html = llenarTemplateFactura(datosFactura);

        // 4. Generar PDF
        const pdfBuffer = await generarPDFDesdeHTML(html);

        // 5. Enviar como descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error al generar la factura:', error);
        res.status(500).json({ error: 'Error al generar la factura' });
    }
});

// Endpoint para generar factura por ID de pedido (uso interno del webhook)
router.post('/generar-factura-pedido/:pedidoId', async (req: Request, res: Response) => {
    try {
        const pedidoId = req.params.pedidoId;

        // Buscar el pedido en la base de datos (sin include)
        const pedido = await Pedidos.findByPk(pedidoId);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Buscar cliente por separado
        const cliente = await Clientes.findByPk(pedido.id_cliente);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Buscar detalles del pedido por separado
        const detallesPedido = await DetallePedidos.findAll({
            where: { id_pedido: pedidoId }
        });

        // Buscar productos para cada detalle
        const productos = await Promise.all(detallesPedido.map(async (detalle) => {
            const producto = await Productos.findByPk(detalle.id_producto);
            return {
                id_producto: detalle.id_producto,
                descripcion: producto?.descripcion || 'Producto',
                precio_venta: detalle.precio_venta,
                cantidad: detalle.cantidad
            };
        }));

        // Preparar datos para la factura
        const fecha = new Date(pedido.fecha_pedido).toLocaleDateString();
        const numeroFactura = pedido.id_pedido.toString().padStart(7, '0');
        const logoPath = path.join(__dirname, '../img/LogoVet.png');

        const datosFactura = {
            numeroFactura,
            fecha,
            nombreCliente: `${cliente.nombre} ${cliente.apellido}`,
            direccionCliente: cliente.domicilio || 'No especificada',
            telefonoCliente: cliente.telefono || 'No especificado',
            cuitCuil: cliente.dni || 'No especificado',
            productos,
            total: pedido.importe,
            logoPath
        };

        // Generar HTML con los datos
        const html = llenarTemplateFactura(datosFactura);

        // Generar PDF
        const pdfBuffer = await generarPDFDesdeHTML(html);

        // Guardar PDF en el servidor para descarga posterior
        const pdfPath = path.join(__dirname, '../../facturas', `factura_${numeroFactura}.pdf`);

        // Crear directorio si no existe
        const dirPath = path.dirname(pdfPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(pdfPath, pdfBuffer);

        console.log(`✅ Factura ${numeroFactura} generada y guardada en: ${pdfPath}`);

        res.json({
            success: true,
            numeroFactura,
            mensaje: `Factura ${numeroFactura} generada correctamente`,
            downloadUrl: `/api/descargar-factura-pedido/${pedidoId}`
        });

    } catch (error) {
        console.error('Error al generar factura por pedido:', error);
        res.status(500).json({ error: 'Error al generar la factura' });
    }
});

// Endpoint para descargar factura por ID de pedido
router.get('/descargar-factura-pedido/:pedidoId', async (req: Request, res: Response) => {
    try {
        const pedidoId = req.params.pedidoId;
        const numeroFactura = pedidoId.padStart(7, '0');
        const pdfPath = path.join(__dirname, '../../facturas', `factura_${numeroFactura}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: 'Factura no encontrada. Puede que aún no haya sido generada.' });
        }

        const pdfBuffer = fs.readFileSync(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura_${numeroFactura}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error al descargar factura:', error);
        res.status(500).json({ error: 'Error al descargar la factura' });
    }
});

// Endpoint para listar las facturas de un cliente
router.get('/facturas-cliente/:clienteId', async (req: Request, res: Response) => {
    try {
        const clienteId = req.params.clienteId;

        // Buscar todos los pedidos del cliente (sin include por ahora)
        const pedidos = await Pedidos.findAll({
            where: {
                id_cliente: clienteId,
                venta_web: 1 // Solo ventas web (que tienen factura)
            },
            order: [['fecha_pedido', 'DESC']]
        });

        // Mapear a formato amigable
        const facturas = await Promise.all(pedidos.map(async (pedido) => {
            const numeroFactura = pedido.id_pedido.toString().padStart(7, '0');
            const facturaPath = path.join(__dirname, '../../facturas', `factura_${numeroFactura}.pdf`);
            const facturaExiste = fs.existsSync(facturaPath);

            // Obtener la cantidad de productos del pedido
            const detalles = await DetallePedidos.findAll({
                where: { id_pedido: pedido.id_pedido }
            });

            return {
                id_pedido: pedido.id_pedido,
                numeroFactura,
                fecha: pedido.fecha_pedido,
                importe: pedido.importe,
                estado: facturaExiste ? 'disponible' : 'procesando',
                downloadUrl: facturaExiste ? `/api/descargar-factura-pedido/${pedido.id_pedido}` : null,
                productos: detalles.length
            };
        }));

        res.json({
            success: true,
            facturas
        });

    } catch (error) {
        console.error('Error al listar facturas del cliente:', error);
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
});

export default router;
