import { Request, Response } from 'express';
import { mercadopago } from '../config/mercadopago';
import dotenv from 'dotenv';
import ClienteLogin from '../models/Clientes.models';

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

  let items: any[] = [];
  let preferenceConfig: any = {};

  try {
    const { items: requestItems, external_reference, id_cliente } = req.body;
    items = requestItems;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Validar que todos los items tengan los campos requeridos
    for (const item of items) {
      if (!item.id || !item.title || !item.quantity || !item.unit_price) {
        console.error('❌ Item inválido:', item);
        return res.status(400).json({
          error: 'Cada item debe tener id, title, quantity y unit_price',
          invalid_item: item
        });
      }

      // Validar que unit_price sea un número válido
      const unitPrice = Number(item.unit_price);
      if (isNaN(unitPrice) || unitPrice <= 0) {
        console.error('❌ unit_price inválido:', item.unit_price);
        return res.status(400).json({
          error: 'unit_price debe ser un número válido mayor a 0',
          invalid_unit_price: item.unit_price
        });
      }

      // Validar que quantity sea un número válido
      const quantity = Number(item.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        console.error('❌ quantity inválido:', item.quantity);
        return res.status(400).json({
          error: 'quantity debe ser un número válido mayor a 0',
          invalid_quantity: item.quantity
        });
      }
    }

    // Buscar cliente
    const cliente = await ClienteLogin.findByPk(id_cliente);
    if (!cliente) {
      console.error(`Cliente con ID ${id_cliente} no encontrado`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    console.log(`Cliente encontrado: ${cliente.mail}`);

    // Obtener la URL base desde variables de entorno o construirla dinámicamente
    const baseUrl = process.env.NGROK_URL || process.env.BASE_URL;
    console.log('🔗 URL base para redirecciones:', baseUrl);

    // Configuración de la preferencia con datos reales
    preferenceConfig = {
      items: items.map(item => ({
        id: item.id.toString(),
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: 'ARS',
        description: item.description || item.title,
      })),
      payer: {
        email: cliente.mail, // Tomado de la base de datos
      },
      back_urls: {
        success: `http://localhost:5173/payment-confirmation?status=approved&clearCart=true`,
        failure: `http://localhost:5173/payment-confirmation?status=rejected`,
        pending: `http://localhost:5173/payment-confirmation?status=pending`
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhooks/mercado-pago`,
      external_reference: external_reference || `pedido_${Date.now()}_cliente_${id_cliente}`,
      metadata: {
        // Agregar metadata con información del carrito para fallback
        carrito_items: JSON.stringify(items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))),
        cliente_id: id_cliente.toString()
      }
    };

    console.log('🔧 Configuración completa de la preferencia:');
    console.log('   - Items:', preferenceConfig.items.length);
    console.log('   - Back URLs:', JSON.stringify(preferenceConfig.back_urls, null, 2));
    console.log('   - Auto return:', preferenceConfig.auto_return);
    console.log('   - Notification URL:', preferenceConfig.notification_url);
    console.log('   - External reference:', preferenceConfig.external_reference);
    console.log('   - Payer email:', preferenceConfig.payer?.email);

    // Validar configuración antes de enviar
    if (!preferenceConfig.back_urls || !preferenceConfig.back_urls.success) {
      throw new Error('back_urls.success es requerido');
    }

    if (!preferenceConfig.items || preferenceConfig.items.length === 0) {
      throw new Error('Items son requeridos');
    }

    // Validar que cada item tenga los campos necesarios
    for (const item of preferenceConfig.items) {
      if (!item.id || !item.title || !item.quantity || !item.unit_price) {
        throw new Error(`Item inválido: ${JSON.stringify(item)}`);
      }
      // Validar que unit_price sea un número válido y no tenga decimales problemáticos
      if (typeof item.unit_price !== 'number' || isNaN(item.unit_price) || item.unit_price <= 0) {
        throw new Error(`unit_price inválido para item ${item.id}: ${item.unit_price}`);
      }
    }

    // Validar URLs de redirección
    const urlRegex = /^https?:\/\/localhost:\d+\/payment-confirmation\?status=\w+$/;
    if (!urlRegex.test(preferenceConfig.back_urls.success)) {
      console.warn('⚠️ URL de success tiene formato inusual:', preferenceConfig.back_urls.success);
    }

    // Crear preferencia en Mercado Pago
    console.log('📤 Enviando preferencia a Mercado Pago...');

    let preference;
    try {
      // Intentar con auto_return primero
      preference = await mercadopago.preferences.create({ body: preferenceConfig });
    } catch (autoReturnError: any) {
      if (autoReturnError?.message?.includes('auto_return')) {
        console.log('⚠️ Error con auto_return, intentando sin auto_return...');

        // Crear configuración sin auto_return
        const configSinAutoReturn = { ...preferenceConfig };
        delete configSinAutoReturn.auto_return;

        console.log('🔄 Reintentando sin auto_return...');
        preference = await mercadopago.preferences.create({ body: configSinAutoReturn });
        console.log('✅ Preferencia creada sin auto_return');
      } else {
        throw autoReturnError;
      }
    }

    console.log('✅ Preferencia creada exitosamente:', preference.id);
    //console.log('Preferencia creada:', preference);

    res.status(200).json({
      id: preference.id,
      init_point: preference.sandbox_init_point,
      items: preference.items,
    });

  } catch (error: any) {
    console.error('❌ Error creating preference:', error?.message || error);

    // Log más detallado del error
    if (error?.response?.data) {
      console.error('📋 MercadoPago error data:', JSON.stringify(error.response.data, null, 2));
    }

    // Log del status code si está disponible
    if (error?.response?.status) {
      console.error('📊 Status code:', error.response.status);
    }

    // Log de la configuración que causó el error (sin información sensible)
    console.error('🔧 Configuración que causó el error:', JSON.stringify({
      items_count: items?.length || 0,
      has_back_urls: !!preferenceConfig?.back_urls,
      has_success_url: !!preferenceConfig?.back_urls?.success,
      has_payer_email: !!preferenceConfig?.payer?.email,
      has_notification_url: !!preferenceConfig?.notification_url,
      items_valid: items?.every(item => item.id && item.title && item.quantity && item.unit_price) || false
    }, null, 2));

    // Log específico para errores comunes
    if (error?.message?.includes('auto_return')) {
      console.error('🔍 Error relacionado con auto_return - verificar configuración de back_urls');
    }

    if (error?.message?.includes('unit_price')) {
      console.error('🔍 Error relacionado con unit_price - verificar que sea un número válido');
    }

    res.status(500).json({
      error: 'Failed to create payment preference',
      details: error instanceof Error ? error.message : 'Unknown error',
      mercadopago_error: error?.response?.data || null
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

export const getPublicKey = async (req: Request, res: Response) => {
  try {
    const publicKey = process.env.MP_PUBLIC_KEY;

    if (!publicKey) {
      return res.status(500).json({ error: 'Public key not configured' });
    }

    res.status(200).json({
      public_key: publicKey
    });
  } catch (error: any) {
    console.error('Error getting public key:', error?.message || error);
    res.status(500).json({
      error: 'Failed to get public key',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};