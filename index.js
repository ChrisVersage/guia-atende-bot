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
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é o Guia de Implantação Atende, especialista no ERP Superlógica. Responda com precisão e clareza técnica.",
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
    res.json({ text: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.json({ text: "Erro ao consultar o GPT 😥 Tente novamente." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
