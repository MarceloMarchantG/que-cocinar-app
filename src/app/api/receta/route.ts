import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Recibimos los datos que nos envía el Front-end
    const body = await request.json();
    const { ingredientes } = body;

    // 2. Nos conectamos a Gemini usando tu clave secreta
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Usamos el modelo "gemini-1.5-flash", que es rapidísimo e ideal para esto
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Escribimos las instrucciones secretas para la IA (El Prompt)
    const prompt = `
      Actúa como un chef experto y amigable. 
      El usuario tiene los siguientes ingredientes: ${ingredientes}.
      Crea una receta deliciosa y fácil de preparar usando la mayoría o todos estos ingredientes. 
      Devuelve la respuesta con el siguiente formato estricto:
      - Título de la receta
      - Lista de ingredientes (con cantidades aproximadas)
      - Instrucciones paso a paso.
      No agregues introducciones largas, ve directo a la receta.
    `;

    // 4. Enviamos el mensaje a la IA y esperamos la respuesta
    const result = await model.generateContent(prompt);
    const respuestaTexto = result.response.text();

    // 5. Devolvemos la receta al Front-end
    return NextResponse.json({ receta: respuestaTexto });
    
  } catch (error) {
    console.error("Error al generar la receta:", error);
    return NextResponse.json(
      { error: "Hubo un problema al crear la receta." },
      { status: 500 }
    );
  }
}