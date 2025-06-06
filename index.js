const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const userMessage = req.body.message?.text || "Olá";

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é o Guia de Implantação Atende, especialista no ERP Superlógica. Responda com precisão, clareza técnica e um tom acolhedor.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices[0].message.content;

    // ✅ Retorno corrigido para o Google Chat
    res.status(200).json({ text: botReply });

  } catch (error) {
    console.error("Erro ao consultar o GPT:", error.response?.data || error.message);
    res.status(200).json({ text: "Erro ao consultar o GPT 😥 Tente novamente." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
