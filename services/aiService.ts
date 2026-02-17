export const fetchHypeMessage = async (daysLeft: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
  
  if (!apiKey) {
    console.warn("VITE_OPENROUTER_API_KEY não encontrada nos envs. Usando fallback.");
    return "O evento mais esperado está chegando! 🚀";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-lite-001",
        "messages": [
          {
            "role": "system",
            "content": "Você é um 'hype man' focado no mundo tech e corporativo, com humor ácido e gírias de desenvolvedor/logística. Seu objetivo é gerar uma frase curta e explosiva sobre o fim da tortura corporativa no dia 30 de abril de 2026. Foque na liberdade: fim de dailies, cobranças de GP, clientes chatos, e problemas de logística. Pode usar palavrões leves para dar impacto. Resposta com menos de 150 caracteres."
          },
          {
            "role": "user",
            "content": `Faltam ${daysLeft} dias para o grande dia 30 de Abril de 2026. Manda aquela motivação braba focada em quem não aguenta mais daily, sprint, backlog e GP cobrando status!`
          }
        ],
        "temperature": 1,
        "max_tokens": 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro OpenRouter:", errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "PREPARA O CORAÇÃO! 🚀";
  } catch (error) {
    console.error("Erro ao buscar hype message:", error);
    return "A contagem regressiva não para! 🔥";
  }
};
