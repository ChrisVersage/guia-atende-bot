const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Variáveis de ambiente
const JUMPAD_ID = process.env.JUMPAD_ID;
const TOKEN = process.env.JUMPAD_TOKEN;
const JUMPAD_URL = `https://api.jumpad.io/agents/${JUMPAD_ID}/respond`; // ✅ Endpoint correto

app.post("/", async (req, res) => {
  const userMessage = req.body.message?.text || "Olá!";
  const userId = req.body.user?.name || "usuario_googlechat";

  try {
    const response = await axios.post(
      JUMPAD_URL,
      {
        user_id: userId,
        message: userMessage
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data?.text || "Não consegui encontrar a resposta.";
    res.status(200).json({ text: botReply });

  } catch (error) {
    console.error("Erro ao consultar o Jumpad:", error.response?.data || error.message);
    res.status(200).json({
      text: "Erro ao responder via Jumpad 😥 Tente novamente mais tarde."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot rodando na porta ${PORT}`);
});
