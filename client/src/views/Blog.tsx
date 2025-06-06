import React from 'react';
import { useNavigate } from "react-router-dom";
import consejos from '../data/consejos.json';
import { FaBookOpen } from "react-icons/fa";

const Blog: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-10 flex flex-col items-center">
            <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
            >
                Volver al inicio
            </button>
            <h1 className="text-3xl font-bold text-violet-700 mb-4 flex items-center gap-2">
                <FaBookOpen className="text-cyan-400 text-3xl" />
                Blog de Consejos
            </h1>
            <h2 className="text-xl font-semibold text-violet-700 mb-6 text-center">
                Consejos y cuidados para tu mascota
            </h2>
            <div className="w-full">
                {consejos.map((art, i) => (
                    <article key={i} className="mb-8 p-4 border rounded shadow bg-violet-50">
                        <h3 className="text-lg font-bold text-violet-800 mb-2">{art.titulo}</h3>
                        <p className="text-gray-600 text-sm mb-2">Por {art.autor}</p>
                        <div className="text-gray-800">{art.contenido}</div>
                    </article>
                ))}
            </div>
            <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-violet-700 px-8 py-2 rounded-full shadow transition-all"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default Blog;