export const fetchHypeMessage = async (daysLeft: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return "O evento mais esperado está chegando! 🚀";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://vem-ni-mim-30-04.pages.dev",
        "X-Title": "Vem Ni Mim Countdown",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
        "messages": [
          {
            "role": "system",
            "content": "Você é um 'hype man' extremamente empolgado. Seu objetivo é gerar uma frase curta, explosiva e motivadora em português sobre um evento que vai acontecer no dia 30 de abril de 2026. Use muitos emojis e gírias brasileiras atuais. Mantenha a resposta com menos de 150 caracteres."
          },
          {
            "role": "user",
            "content": `Faltam exatamente ${daysLeft} dias para o grande dia 30 de Abril de 2026. Manda aquela mensagem de motivação braba para quem está esperando!`
          }
        ],
        "temperature": 0.9,
        "max_tokens": 100
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "PREPARA O CORAÇÃO! 🚀";
  } catch (error) {
    console.error("Erro ao buscar hype message:", error);
    return "A contagem regressiva não para! 🔥";
  }
};
