const TerminosCondiciones = () => (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-8 mt-4 mb-10" text-justify>
        <button
            onClick={() => window.location.href = "/"}
            className="mt-8 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
        >
            Volver al inicio
        </button>
        <h2 className="text-2xl font-semibold text-violet-700 mb-4 mt-8">Términos y Condiciones de Uso del Sitio Web Vetweb</h2>
        <p className="mb-4">
            Bienvenido a VetWeb. Al acceder y utilizar nuestro sitio web <span className="font-mono">https://vetweb.com.ar/</span>, usted acepta cumplir y estar sujeto a los siguientes Términos y Condiciones de uso, los cuales, junto con nuestra Política de Privacidad, rigen la relación de Bacanes con usted en relación a este sitio web. Si no está de acuerdo con alguna parte de estos términos y condiciones, por favor, no utilice nuestro sitio web.
        </p>

        <ol className="list-decimal list-inside space-y-4 text-gray-700" >
            <li>
                <strong>Definiciones</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>«VetWeb» se refiere a la empresa propietaria del sitio web https://vetweb.com.ar/.</li>
                    <li>«Usuario» se refiere a cualquier persona que accede y/o utiliza el sitio web de VetWeb.</li>
                </ul>
            </li>
            <li>
                <strong>Uso del Sitio Web</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>El contenido de las páginas de este sitio web es para su información general y uso personal únicamente. Está sujeto a cambios sin previo aviso.</li>
                    <li>Ni nosotros ni terceros proporcionamos ninguna garantía sobre la exactitud, integridad, rendimiento, adecuación o idoneidad de la información y los materiales encontrados u ofrecidos en este sitio web para ningún propósito particular. Usted reconoce que dicha información y materiales pueden contener inexactitudes o errores y excluimos expresamente la responsabilidad por tales inexactitudes o errores en la máxima medida permitida por la ley.</li>
                    <li>El uso de cualquier información o material en este sitio web es completamente bajo su propio riesgo, por lo cual no seremos responsables. Será su propia responsabilidad asegurarse de que cualquier producto, servicio o información disponible a través de este sitio web cumpla con sus requisitos específicos.</li>
                </ul>
            </li>
            <li>
                <strong>Propiedad Intelectual</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>Este sitio web contiene material que es de nuestra propiedad o nos ha sido licenciado. Este material incluye, pero no se limita a, el diseño, disposición, aspecto, apariencia y gráficos. Está prohibida la reproducción de acuerdo con el aviso de copyright, que forma parte de estos términos y condiciones.</li>
                    <li>Todas las marcas comerciales reproducidas en este sitio web, que no son propiedad del operador ni licenciadas al operador, se reconocen en el sitio web.</li>
                </ul>
            </li>
            <li>
                <strong>Enlaces a Otros Sitios Web</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>Este sitio web puede incluir enlaces a otros sitios web. Estos enlaces se proporcionan para su conveniencia para proporcionar más información. No significan que respaldamos el(los) sitio(s) web. No tenemos ninguna responsabilidad por el contenido del(los) sitio(s) web enlazado(s).</li>
                </ul>
            </li>
            <li>
                <strong>Uso Prohibido</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>No debe utilizar el sitio web de una manera que cause, o pueda causar, que el sitio web o el acceso a él se vea interrumpido, dañado o deteriorado de alguna manera.</li>
                    <li>No debe utilizar el sitio web para ningún propósito fraudulento o en conexión con una ofensa criminal o actividad ilegal.</li>
                </ul>
            </li>
            <li>
                <strong>Limitación de Responsabilidad</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>Bacanes no será responsable por ningún daño indirecto, especial, incidental o consecuente, incluyendo, pero no limitado a, pérdida de datos, pérdida de beneficios, o interrupción de negocios, que surja del uso o la imposibilidad de uso del sitio web.</li>
                </ul>
            </li>
            <li>
                <strong>Modificaciones de los Términos</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>VetWeb se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio web.</li>
                </ul>
            </li>
            <li>
                <strong>Ley Aplicable y Jurisdicción</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de [Tu País], y cualquier disputa que surja de o en conexión con estos términos y condiciones estará sujeta a la jurisdicción exclusiva de los tribunales de [Tu País].</li>
                </ul>
            </li>
            <li>
                <strong>Contacto</strong>
                <ul className="list-disc list-inside ml-6">
                    <li>Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de <a href="mailto:info@bacanes.com.ar" className="underline text-violet-700">info@vetweb.com.ar</a>.</li>
                </ul>
            </li>
        </ol>

        <p className="text-gray-600 mt-8">Para más información, contáctanos a <a href="mailto:contacto@vetweb.com.ar" className="underline text-violet-700">contacto@vetweb.com.ar</a></p>
        <button
            onClick={() => window.location.href = "/"}
            className="mt-8 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
        >
            Volver al inicio
        </button>
    </div>

    
);

export default TerminosCondiciones;