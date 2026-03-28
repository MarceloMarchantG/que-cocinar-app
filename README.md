# 🍳 ¿Qué cocinamos hoy? - Generador de Recetas con IA

Una aplicación web minimalista y rápida que resuelve el problema diario de qué cocinar con los ingredientes disponibles en casa. Utiliza Inteligencia Artificial para generar recetas estructuradas, optimizando el tiempo y reduciendo el desperdicio de alimentos.

🔗 **[Prueba la aplicación en vivo aquí](https://que-cocinar-app.vercel.app/)**

---

## 🚀 Características Principales

* **Generación Inteligente:** Integración con la API de Google Gemini (modelo 2.5) para procesar lenguaje natural y devolver recetas coherentes basadas en ingredientes aleatorios o específicos.
* **Interfaz Minimalista y Responsiva:** Diseño limpio enfocado en la experiencia del usuario (UX), con estados de carga claros e interactividad fluida.
* **Formateo Dinámico:** Renderizado de texto en formato Markdown (`react-markdown`) con estilos tipográficos de alto contraste para garantizar una legibilidad perfecta en cualquier dispositivo.
* **Despliegue Continuo (CI/CD):** Configurado con Vercel para integraciones y despliegues automáticos desde GitHub.

## 🛠️ Tecnologías Utilizadas

* **Frontend & Backend:** Next.js (App Router) con React.
* **Estilos:** Tailwind CSS (v4) para un diseño de utilidades rápido y moderno.
* **Inteligencia Artificial:** Google Generative AI SDK (Gemini 2.5).
* **Infraestructura:** Desplegado en Vercel.

## ⚙️ Instalación Local

Si deseas correr este proyecto en tu propia máquina, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/](https://github.com/MarceloMarchantG/que-cocinar-app.git)
    cd que-cocinar-app
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y agrega tu clave de API de Google AI Studio:
    ```env
    GEMINI_API_KEY=tu_clave_secreta_aqui
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 👨‍💻 Sobre el Autor

**Marcelo Marchant*
*Desarrollador y profesional enfocado en la optimización de procesos mediante el uso de tecnología y análisis de datos.*

* [Mi perfil de GitHub](https://github.com/MarceloMarchantG)
* [Mi LinkedIn](www.linkedin.com/in/marcelo-marchant-gangas)