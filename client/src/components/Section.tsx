import { useState } from 'react';
import products from './products';
import { obtenerProductos } from '../services/ProductosService';






const Section = () => {
    const addToCart = (product: { id: number; name: string; category: string; price: number; image: string }) => {
        console.log(`${product.name} ha sido agregado al carrito.`);

    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {products.map((product: { id: number; name: string; category: string; price: number; image: string }) => (
                        <div key={product.id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
                            <div className="block relative h-48 rounded overflow-hidden cursor-pointer">
                                <img alt="ecommerce" className="object-cover object-center w-full h-full block" src={product.image} />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{product.category}</h3>
                                <h2 className="text-gray-900 title-font text-lg font-medium">{product.name}</h2>
                                <p className="mt-1">${product.price.toFixed(2)}</p>
                                <button
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section;
