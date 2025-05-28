const PreguntasFrecuentes = () => (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-8 mt-4 mb-10 text-justify">
        
        <button
            onClick={() => window.location.href = "/"}
            className="mt-8 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
        >
            Volver al inicio
        </button>

        <h2 className="text-2xl font-semibold text-violet-700 mb-8">Preguntas Frecuentes</h2>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Cómo puedo registrarme en VetWeb?</h3>
            <p>
                Para registrarte, haz clic en el botón "Registrarse" en la parte superior derecha y completa el formulario con tus datos personales. Recibirás un correo de confirmación para activar tu cuenta.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Cómo realizo una compra?</h3>
            <p>
                Ingresa a tu cuenta, selecciona los productos que deseas comprar, agrégalos al carrito y sigue los pasos para completar el pago y la entrega.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Qué métodos de pago aceptan?</h3>
            <p>
                Aceptamos tarjetas de crédito, débito, transferencias bancarias y pagos a través de plataformas como MercadoPago.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Realizan envíos a domicilio?</h3>
            <p>
                Sí, realizamos envíos a domicilio en toda la zona de cobertura. El costo y tiempo de entrega se calculan al finalizar la compra.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Puedo retirar mi compra en la sucursal?</h3>
            <p>
                Sí, puedes seleccionar la opción de retiro en sucursal al momento de finalizar tu compra. Te avisaremos cuando tu pedido esté listo para retirar.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Cómo puedo contactar al soporte?</h3>
            <p>
                Puedes escribirnos a <a href="mailto:contacto@vetweb.com.ar" className="underline text-violet-700">contacto@vetweb.com.ar</a> o comunicarte por WhatsApp al +54 376-4379723.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Puedo devolver un producto?</h3>
            <p>
                Sí, aceptamos devoluciones dentro de los 10 días de recibido el producto, siempre que esté en perfectas condiciones. Para iniciar una devolución, contáctanos por mail o WhatsApp.
            </p>
        </div>

        <div className="mb-6">
            <h3 className="font-bold text-violet-700 mb-2">¿Cómo puedo modificar mis datos personales?</h3>
            <p>
                Ingresa a tu cuenta y accede a la sección "Mi perfil" para actualizar tus datos personales y de contacto.
            </p>
        </div>

        <button
            onClick={() => window.location.href = "/"}
            className="mt-8 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
        >
            Volver al inicio
        </button>
    </div>
);

export default PreguntasFrecuentes;