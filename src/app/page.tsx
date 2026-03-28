"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown"; // Añade esta línea

export default function Home() {
  const [ingredientes, setIngredientes] = useState("");
  const [receta, setReceta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Esta función se encarga de hablar con nuestro Back-end
  const generarReceta = async (ingredientesBuscados: string) => {
    if (!ingredientesBuscados.trim()) return;
    
    setCargando(true);
    setError("");
    setReceta(""); // Limpiamos la receta anterior si la hubiera

    try {
      // Llamamos a nuestra API Route
      const respuesta = await fetch("/api/receta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientes: ingredientesBuscados }),
      });

      if (!respuesta.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      // Extraemos el JSON con la receta
      const datos = await respuesta.json();
      setReceta(datos.receta);
      
    } catch (err) {
      console.error(err);
      setError("Ups, se nos quemó el arroz. Hubo un problema, intenta de nuevo.");
    } finally {
      setCargando(false); // Apagamos el estado de carga pase lo que pase
    }
  };

  const handleCocinar = () => generarReceta(ingredientes);
  
  // Le damos a la IA una instrucción para que elija al azar
  const handleSorprendeme = () => {
    generarReceta("ingredientes al azar, sorpréndeme con un plato rico, ojalá algo sureño o reconfortante");
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Cabecera */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-800">
            ¿Qué cocinamos hoy?
          </h1>
          <p className="text-stone-600">
            Dime qué tienes en la despensa y yo me encargo de la receta.
          </p>
        </div>
        
        {/* Formulario */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
          <textarea 
            className="w-full p-4 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-stone-700 bg-stone-50"
            rows={3}
            placeholder="Ej: salmón, papas, ajo, crema..."
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            disabled={cargando}
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleCocinar}
              disabled={!ingredientes.trim() || cargando} 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {cargando ? "Cocinando idea..." : "¡Cocinar!"}
            </button>
            <button 
              onClick={handleSorprendeme}
              disabled={cargando}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sorpréndeme
            </button>
          </div>
        </div>

        {/* Mensajes de Error y Carga */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
            {error}
          </div>
        )}
        
        {cargando && (
          <div className="text-center text-stone-500 animate-pulse">
            Preparando los ingredientes, afilando los cuchillos... 🔪
          </div>
        )}

       {/* Resultado de la Receta - ACTUALIZADO */}
{receta && !cargando && (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100 mt-8">
    {/* Usamos 'ReactMarkdown' para formatear el texto.
      La clase 'prose prose-stone' de Tailwind Typography aplica 
      estilos automáticos y hermosos a títulos, listas y negritas.
      'max-w-none' asegura que ocupe todo el ancho disponible.
    */}
    <article className="prose prose-stone max-w-none 
      prose-headings:font-bold prose-headings:text-stone-800
      prose-p:text-stone-700
      prose-strong:text-emerald-600 prose-strong:font-semibold
      prose-ul:list-disc prose-ul:pl-5">
      
      <ReactMarkdown>{receta}</ReactMarkdown>
      
    </article>
  </div>
)}
        
      </div>
    </main>
  );
}