# 📦 Sistema de Gestión de Stock Automático

## 🎯 Funcionalidad Principal

El sistema ahora descuenta automáticamente el stock de productos cuando se completa un pago exitoso a través de Mercado Pago.

## 🔄 Flujo Completo

### 1. **Compra en el Frontend**
- El usuario agrega productos al carrito
- Al hacer clic en "Pagar con Mercado Pago", se envían los items a `/api/preferences`
- Se crea una preferencia en Mercado Pago con los datos del carrito

### 2. **Procesamiento del Pago**
- El usuario completa el pago en Mercado Pago
- Mercado Pago envía un webhook a nuestro servidor cuando el pago cambia de estado

### 3. **Descuento Automático del Stock**
- Cuando el webhook recibe un pago con status `approved`:
  - Se obtienen los items de la preferencia asociada
  - Se valida que hay suficiente stock para cada producto
  - Se descuenta la cantidad comprada del stock de cada producto
  - Se usa una transacción de base de datos para evitar problemas de concurrencia

### 4. **Limpieza del Carrito**
- Si el pago es exitoso, Mercado Pago redirige automáticamente al usuario a la página principal usando `auto_return: 'approved'`
- El frontend detecta múltiples indicadores de pago exitoso:
  - Parámetros URL: `payment=success`, `status=approved`, `collection_status=approved`
  - Presencia de `preference-id` cuando viene desde Mercado Pago
  - Referrer de mercadopago.com o mercadolibre.com
- El carrito se limpia automáticamente usando múltiples métodos para asegurar la limpieza
- Se muestra un mensaje de confirmación al usuario
- Sistema anti-duplicación: cada pago se procesa solo una vez usando cache en memoria

## 🛠️ Componentes Técnicos

### Backend

#### **Webhook Controller** (`webhook.controller.ts`)
```typescript
const actualizarStock = async (items: any[]) => {
    // Usa transacciones para evitar condiciones de carrera
    // Valida stock suficiente antes de descontar
    // Actualiza el stock de cada producto
}
```

#### **Productos Controller** (`productosController.ts`)
```typescript
// Nuevas funciones agregadas:
export const verificarStock = async (req, res) => {
    // GET /api/productos/:id/stock
    // Retorna el stock actual y disponible
}

export const actualizarStock = async (req, res) => {
    // PUT /api/productos/:id/stock
    // Actualiza manualmente el stock (uso administrativo)
}
```

#### **Payment Controller** (`payment.controller.ts`)
```typescript
// Redirige con parámetros específicos para limpieza del carrito
return res.redirect('http://localhost:5173/?payment=success&clearCart=true');
```

### Frontend

#### **Contexto del Carrito** (`CotextoCarrito.tsx`)
- Ya tenía la función `limpiarCarrito()` implementada

#### **Vista Principal** (`Inicio.tsx`)
```typescript
// Detecta parámetros de URL para pago exitoso
useEffect(() => {
    const paymentStatus = urlParams.get('payment');
    const clearCart = urlParams.get('clearCart');
    
    if (paymentStatus === 'success' && clearCart === 'true') {
        limpiarCarrito(); // Limpia el carrito
        // Muestra mensaje de éxito
    }
}, []);
```

## 📊 Validaciones de Stock

### **Productos Disponibles**
- Solo se muestran productos con `stock > stock_seguridad`
- El sistema valida stock antes de permitir agregar al carrito

### **Transacciones Seguras**
- Se usan transacciones de base de datos para evitar problemas de concurrencia
- Si falla la actualización de algún producto, se revierte toda la operación
- **Sistema anti-duplicación**: Cache en memoria que previene procesar el mismo pago dos veces
- **Bloqueo de filas**: Se usa `FOR UPDATE` en las consultas para evitar condiciones de carrera

### **Logging Detallado**
```typescript
console.log('✅ Stock actualizado - Producto: ${producto.descripcion}');
console.log('❌ Stock insuficiente para producto ${producto.descripcion}');
```

## 🔍 Nuevas Rutas API

### **Verificar Stock**
```
GET /api/productos/:id/stock
```
**Respuesta:**
```json
{
    "id_producto": 1,
    "descripcion": "Alimento para perros",
    "stock_actual": 50,
    "stock_seguridad": 5,
    "stock_disponible": true,
    "cantidad_disponible": 45
}
```

### **Actualizar Stock (Administrativo)**
```
PUT /api/productos/:id/stock
```
**Body:**
```json
{
    "nuevo_stock": 100
}
```

## 🚀 Beneficios del Sistema

1. **✅ Automático**: No requiere intervención manual
2. **🔒 Seguro**: Usa transacciones de base de datos
3. **📱 Responsive**: Funciona en tiempo real
4. **🎯 Preciso**: Descuenta exactamente lo comprado
5. **🔄 Rollback**: Si algo falla, no se pierde consistencia

## 🛠️ Configuración Requerida

### Variables de Entorno
```env
# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=tu_access_token

# Base de Datos
DB_HOST=localhost
DB_NAME=veterinaria
DB_USER=tu_usuario
DB_PASS=tu_password
```

### Webhook URL en Mercado Pago
```
https://tu-dominio.com/api/webhooks/mercado-pago
```

## 🐛 Troubleshooting

### **Stock no se descuenta**
1. Verificar que el webhook esté llegando: revisar logs del servidor
2. Verificar que el pago esté llegando como `approved`
3. Verificar que los items tengan stock suficiente

### **Carrito no se limpia**
1. Verificar que la redirección incluya parámetros de pago exitoso o venga desde mercadopago.com
2. Verificar que el componente `Inicio` esté detectando los parámetros
3. Verificar en la consola del navegador los logs de detección de pago
4. **Nuevo**: El sistema detecta automáticamente cuando viene desde Mercado Pago usando el referrer

### **Usuario no regresa a la página principal**
1. Verificar que `auto_return: 'approved'` esté habilitado en la preferencia
2. Verificar que las `back_urls` estén configuradas correctamente
3. Verificar que no haya errores 500 al crear la preferencia
4. **Nuevo**: Sistema mejorado de detección automática de pago exitoso

### **Error de stock insuficiente**
1. El sistema validará stock antes de descontar
2. Si no hay suficiente stock, la transacción se revierte
3. El pago seguirá siendo válido, pero requerirá atención manual

## 📝 Logs Importantes

```bash
# Pago exitoso
💰 Pago aprobado: 123456789
🛒 Items a descontar del stock: [...]
✅ Stock actualizado correctamente para el pago: 123456789

# Error de stock
❌ Stock insuficiente para producto Alimento Premium
❌ Error al actualizar stock para pago aprobado: Error message
```

¡El sistema está completamente funcional y listo para uso en producción! 🎉
