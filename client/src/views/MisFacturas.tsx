import React, { useState, useEffect } from 'react';
import { getUserId } from '../services/AuthService';
import { formatCurrency } from '../helpers';

interface Factura {
    id_pedido: number;
    numeroFactura: string;
    fecha: string;
    importe: number;
    estado: 'disponible' | 'procesando';
    downloadUrl: string | null;
    productos: number;
}

const MisFacturas: React.FC = () => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = getUserId();

    useEffect(() => {
        if (!userId) {
            setError('Debes iniciar sesión para ver tus facturas');
            setLoading(false);
            return;
        }

        cargarFacturas();
    }, [userId]);

    const cargarFacturas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/api/facturas-cliente/${userId}`);

            if (!response.ok) {
                throw new Error('Error al cargar las facturas');
            }

            const data = await response.json();
            if (data.success) {
                setFacturas(data.facturas);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            setError('Error al cargar las facturas. Inténtalo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const descargarFactura = async (factura: Factura) => {
        if (!factura.downloadUrl) {
            alert('La factura aún no está disponible. Inténtalo en unos minutos.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000${factura.downloadUrl}`);

            if (!response.ok) {
                throw new Error('Error al descargar la factura');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factura_${factura.numeroFactura}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar factura:', error);
            alert('Error al descargar la factura. Inténtalo más tarde.');
        }
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                        Cargando tus facturas...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        Error
                    </h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                    📄 Mis Facturas
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Aquí puedes ver y descargar todas tus facturas de compras online.
                                </p>
                            </div>
                            <div>
                                <a
                                    href="http://localhost:5173/"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    🏠 Volver al Inicio
                                </a>
                            </div>
                        </div>
                    </div>

                    {facturas.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📄</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No tienes facturas aún
                            </h3>
                            <p className="text-gray-600">
                                Las facturas aparecerán aquí después de realizar compras online.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Vista desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Factura
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Importe
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {facturas.map((factura) => (
                                            <tr key={factura.id_pedido} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{factura.numeroFactura}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Pedido #{factura.id_pedido} • {factura.productos} productos
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatearFecha(factura.fecha)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(factura.importe)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${factura.estado === 'disponible'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {factura.estado === 'disponible' ? '✅ Disponible' : '⏳ Procesando'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {factura.estado === 'disponible' ? (
                                                        <button
                                                            onClick={() => descargarFactura(factura)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm w-full min-w-[120px]"
                                                        >
                                                            📄 Descargar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="bg-gray-300 text-gray-500 px-3 py-2 rounded-lg cursor-not-allowed text-sm w-full min-w-[120px]"
                                                        >
                                                            ⏳ Generando...
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Vista móvil */}
                            <div className="md:hidden">
                                {facturas.map((factura) => (
                                    <div key={factura.id_pedido} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Factura #{factura.numeroFactura}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Pedido #{factura.id_pedido} • {factura.productos} productos
                                                    </div>
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${factura.estado === 'disponible'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {factura.estado === 'disponible' ? '✅ Disponible' : '⏳ Procesando'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-sm text-gray-500">Fecha</div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatearFecha(factura.fecha)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">Total</div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(factura.importe)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full">
                                                {factura.estado === 'disponible' ? (
                                                    <button
                                                        onClick={() => descargarFactura(factura)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        📄 Descargar PDF
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="w-full bg-gray-300 text-gray-500 px-4 py-3 rounded-lg cursor-not-allowed text-sm font-medium"
                                                    >
                                                        ⏳ Generando factura...
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Total: {facturas.length} factura{facturas.length !== 1 ? 's' : ''}
                            </div>
                            <button
                                onClick={cargarFacturas}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                🔄 Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MisFacturas;
