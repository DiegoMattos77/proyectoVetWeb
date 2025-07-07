import { Request, Response } from 'express';
import { mercadopago } from '../config/mercadopago';
import dotenv from 'dotenv';
import ClienteLogin from '../models/Clientes.models';
import clientes from '../router/authRouter'
dotenv.config();

console.log(ClienteLogin);
interface PreferenceRequest {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
  }>;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
    address?: {
      street_name?: string;
      street_number?: string;
      zip_code?: string;
    };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  notification_url?: string;
  external_reference?: string;
}

export const createPreference = async (req: Request, res: Response) => {
  console.log('🔁 Entró al controlador createPreference');
  console.log("PREFERENCIA BODY:", req.body);

  try {
    const { items, external_reference, id_cliente } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Buscar cliente
    const cliente = await ClienteLogin.findByPk(id_cliente);
    if (!cliente) {
      console.error(`Cliente con ID ${id_cliente} no encontrado`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    console.log(`Cliente encontrado: ${cliente.mail}`);

    // Configuración de la preferencia con datos reales
    const preferenceConfig = {
      items: items.map(item => ({
        id: item.id.toString(),
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: 'ARS',
        description: item.description,
      })),
      payer: {
        email: cliente.mail, // Tomado de la base de datos
      },
      back_urls: {
        success: `https://fb73eea22a4a.ngrok-free.app/api/payment-redirect?status=success`,
        failure: `https://fb73eea22a4a.ngrok-free.app/api/payment-redirect?status=failure`,
        pending: `https://fb73eea22a4a.ngrok-free.app/api/payment-redirect?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `https://fb73eea22a4a.ngrok-free.app/api/webhooks/mercado-pago`,
      external_reference: external_reference || undefined,
    };


    //console.log('Configuración completa de la preferencia:', preferenceConfig);

    // Crear preferencia en Mercado Pago
    //console.log('Enviando preferencia a Mercado Pago...');
    const preference = await mercadopago.preferences.create({ body: preferenceConfig });
    //console.log('Preferencia creada:', preference);

    res.status(200).json({
      id: preference.id,
      init_point: preference.sandbox_init_point,
      items: preference.items,
    });

  } catch (error: any) {
    console.error('Error creating preference:', error?.message || error);
    if (error?.response?.data) {
      console.error('MercadoPago error data:', error.response.data);
    }
    res.status(500).json({
      error: 'Failed to create payment preference',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPreference = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Preference ID is required' });
    }

    const preference = await mercadopago.preferences.get({ preferenceId: id });

    res.status(200).json({
      id: preference.id,
      items: preference.items,
      init_point: preference.init_point,
      date_created: preference.date_created,
      expiration_date_to: preference.expiration_date_to
    });
  } catch (error: any) {
    console.error('Error getting preference:', error?.message || error);
    res.status(500).json({
      error: 'Failed to get payment preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }


};