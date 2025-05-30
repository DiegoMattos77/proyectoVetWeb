import { Request, Response } from 'express';
import { mercadopago } from '../config/mercadopago';
import dotenv from 'dotenv';
dotenv.config();

interface PreferenceRequest {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
    picture_url?: string;
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
  try {
    const { items, payer, back_urls, auto_return, external_reference }: PreferenceRequest = req.body;

    // Validación básica
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Configuración base de la preferencia
    const preferenceConfig = {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: 'ARS', // O la moneda que uses
        description: item.description,

      })),
      payer: payer ? { ...payer } : undefined,
      back_urls: {
        success: `https://cba0-181-92-45-68.ngrok-free.app/payment/success`,
        failure: `https://cba0-181-92-45-68.ngrok-free.app/payment/failure`,
        pending: `https://cba0-181-92-45-68.ngrok-free.app/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `https://cba0-181-92-45-68.ngrok-free.app/api/webhooks/mercado-pago`,
      external_reference: external_reference || undefined
    };

    console.log('preferenceConfig:', preferenceConfig);


    // Crear preferencia en Mercado Pago
    const preference = await mercadopago.preferences.create({ body: preferenceConfig });

    // Responder con los datos necesarios para el frontend
    res.status(200).json({
      id: preference.id,
      init_point: preference.sandbox_init_point,
      items: preference.items
    });

  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({
      error: 'Failed to create payment preference',
      details: error instanceof Error ? error.message : 'Unknown error'
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
  } catch (error) {
    console.error('Error getting preference:', error);
    res.status(500).json({
      error: 'Failed to get payment preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};