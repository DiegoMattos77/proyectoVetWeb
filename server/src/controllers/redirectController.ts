import { Request, Response } from 'express';

export const handlePaymentRedirect = (req: Request, res: Response) => {
    const { status } = req.query; // Leer el parámetro "status" de la URL

    if (status === 'success') {
        // Redirigir al frontend con el estado de éxito
        return res.redirect('http://localhost:5173?message=success');
    } else if (status === 'failure') {
        // Redirigir al frontend con el estado de fallo
        return res.redirect('http://localhost:5173?message=failure');
    } else if (status === 'pending') {
        // Redirigir al frontend con el estado pendiente
        return res.redirect('http://localhost:5173?message=pending');
    } else {
        // Redirigir al frontend con un mensaje de error desconocido
        return res.redirect('http://localhost:5173?message=unknown');
    }
};