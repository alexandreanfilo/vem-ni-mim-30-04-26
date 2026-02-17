export const fetchHypeMessage = async (daysLeft: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
  
  if (!apiKey) {
    console.warn("VITE_OPENROUTER_API_KEY não encontrada nos envs. Usando fallback.");
    return "Está chegando o grande dia! 🚀";
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
            "content": "Você é um 'hype man' da liberdade financeira, com humor ácido e foco no dia 30 de abril de 2026. Gere frases curtas e explosivas sobre o dia em que o trabalho vira opcional. Foque no sentimento de 'não aguento mais bater ponto', na vontade de morar na praia, fazer um concurso ou simplesmente reduzir a carga horária drasticamente porque a grana tá no bolso. Resposta com menos de 150 caracteres."
          },
          {
            "role": "user",
            "content": `Faltam ${daysLeft} dias para o dia da libertação em 30/04/2026. Manda aquela motivação de quem já está com um pé na areia e não tem mais paciência pra reunião que poderia ter sido um e-mail!`
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
    return data.choices?.[0]?.message?.content?.trim() || "PREPARA O CHINELO PRA MORAR NA PRAIA! 🚀";
  } catch (error) {
    console.error("Erro ao buscar hype message:", error);
    return "A contagem regressiva não para! 🔥";
  }
};
