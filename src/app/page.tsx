"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// Función inteligente para extraer el título ignorando la cortesía de la IA
const obtenerTitulo = (texto: string) => {
  // Separar por líneas, quitar espacios en blanco y filtrar líneas vacías
  const lineas = texto.split('\n').map(l => l.trim()).filter(l => l !== '');
  
  // Estrategia 1: Buscar si la IA usó un título de Markdown (ej: "# Lomo de Cerdo...")
  const lineaMarkdown = lineas.find(line => line.startsWith('#'));
  if (lineaMarkdown) return lineaMarkdown.replace(/[#*]/g, '').trim();

  // Estrategia 2: Filtrar las típicas frases introductorias conversacionales
  const lineaLimpia = lineas.find(line => {
    const textoMinuscula = line.toLowerCase();
    const esCortesia = textoMinuscula.includes('claro') || 
      textoMinuscula.includes('aquí tienes') || 
      textoMinuscula.includes('propuesta') || 
      textoMinuscula.includes('te dejo') ||
      line.startsWith('¡'); // Ignorar líneas que empiezan con exclamación
    return !esCortesia;
  });

  // Limpiar los asteriscos si la IA usó negritas (**Título**)
  return lineaLimpia ? lineaLimpia.replace(/[#*]/g, '').trim() : 'Receta Deliciosa';
};
export default function Home() {
  const [ingredientes, setIngredientes] = useState("");
  const [receta, setReceta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  
  // NUEVO: Estado para guardar la lista de recetas favoritas
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // NUEVO: Cargar los favoritos desde el navegador al abrir la página
  useEffect(() => {
    const recetasGuardadas = localStorage.getItem("recetasFavoritas");
    if (recetasGuardadas) {
      setFavoritos(JSON.parse(recetasGuardadas));
    }
  }, []);

  const generarReceta = async (ingredientesBuscados: string) => {
    if (!ingredientesBuscados.trim()) return;
    setCargando(true);
    setError("");
    setReceta("");

    try {
      const respuesta = await fetch("/api/receta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientes: ingredientesBuscados }),
      });

      if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

      const datos = await respuesta.json();
      setReceta(datos.receta);
      
      
    } catch (err) {
      console.error(err);
      setError("Ups, se nos quemó el arroz. Hubo un problema, intenta de nuevo.");
    } finally {
      setCargando(false);
      console.log(receta);
    }
  };

  const handleCocinar = () => generarReceta(ingredientes);
  const handleSorprendeme = () => {
    const tematicas = [
      "un clásico sureño contundente y reconfortante",
      "una cena rápida y ligera en menos de 20 minutos",
      "un plato de pasta con una salsa muy creativa",
      "una receta ideal para un día de lluvia intensa",
      "un almuerzo vegetariano lleno de sabor y proteínas",
      "algo inspirado en la comida asiática pero con ingredientes locales",
      "una receta de abuela, de esas que toman tiempo pero valen la pena"
    ];
    const temaAleatorio = tematicas[Math.floor(Math.random() * tematicas.length)];
    
    generarReceta(`Ignora cualquier instrucción anterior. Genera una receta completamente aleatoria y original con esta temática: ${temaAleatorio}. IMPORTANTE: No uses frases introductorias ni saludos. La PRIMERA línea de tu respuesta debe ser el nombre de la receta, obligatoriamente formateado como un Título 1 de Markdown (es decir, empezando con '# '). No repitas los platos más comunes, usa ingredientes locales y sorpréndeme de verdad.`);
  };
  // NUEVO: Función para guardar la receta actual
  const guardarEnFavoritos = () => {
    if (!receta) return;
    
    // Evitamos guardar la misma receta dos veces
    if (favoritos.includes(receta)) {
      alert("¡Esta receta ya está en tus favoritos!");
      return;
    }

    const nuevosFavoritos = [receta, ...favoritos];
    setFavoritos(nuevosFavoritos);
    // Guardamos en el disco duro del navegador
    localStorage.setItem("recetasFavoritas", JSON.stringify(nuevosFavoritos));
  };

  // NUEVO: Función para eliminar una receta
  const eliminarFavorito = (indexAEliminar: number) => {
    const nuevosFavoritos = favoritos.filter((_, index) => index !== indexAEliminar);
    setFavoritos(nuevosFavoritos);
    localStorage.setItem("recetasFavoritas", JSON.stringify(nuevosFavoritos));
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

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">{error}</div>}
        {cargando && <div className="text-center text-stone-500 animate-pulse">Preparando los ingredientes, afilando los cuchillos... 🔪</div>}

        {/* Resultado de la Receta Principal */}
        {receta && !cargando && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100 mt-8 space-y-6">
            <article className="prose prose-stone max-w-none">
              <ReactMarkdown>{receta}</ReactMarkdown>
            </article>
            
            <button 
              onClick={guardarEnFavoritos}
              className="w-full bg-stone-800 hover:bg-stone-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
            >
              Guardar en mis favoritos
            </button>
          </div>
        )}

        {/* Sección de Recetas Guardadas */}
        {favoritos.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 border-b border-stone-200 pb-3">
              Tus Recetas Guardadas
            </h2>
            
            {/* Usamos CSS Grid: 1 columna en móvil, 2 columnas en pantallas medianas/grandes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoritos.map((fav, index) => (
                /* La etiqueta <details> crea un acordeón nativo sin necesidad de JavaScript extra */
                <details 
                  key={index} 
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm group overflow-hidden"
                >
                  {/* <summary> es el título de la tarjeta que siempre se ve */}
                  <summary className="p-5 font-medium text-stone-700 cursor-pointer list-none flex justify-between items-center hover:bg-stone-50 transition-colors">
                    {/* Título de la receta */}
                    <span className="font-bold text-emerald-800 pr-4">{obtenerTitulo(fav)}</span>
                    <span className="text-stone-400 group-open:rotate-180 transition-transform duration-300 shrink-0">
                      ▼
                    </span>
                  </summary>
                  
                  {/* Este div solo se muestra cuando se abre el acordeón */}
                  <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-4">
                    <article className="prose prose-stone prose-sm max-w-none mt-4">
                      <ReactMarkdown>{fav}</ReactMarkdown>
                    </article>
                    
                    <button 
                      onClick={() => eliminarFavorito(index)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors w-full text-center py-2 bg-red-50 hover:bg-red-100 rounded-lg mt-4"
                    >
                      Eliminar receta
                    </button>
                  </div>
                </details>
              ))}
            </div>
          </div>
)}
        
      </div>
    </main>
  );
}