import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// necessário para ES Modules (Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// webhook Discord (COLOCA AQUI O TEU LINK)
const webhookURL = "SEU_WEBHOOK_AQUI";

// servir ficheiros do site (css, js, imagens)
app.use(express.static(__dirname));

// rota principal (abre o index.html)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// endpoint de compra (webhook Discord)
app.post("/compra", async (req, res) => {
    try {
        const { produto, preco, quantidade, cliente } = req.body;

        await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: "🛒 Nova compra!",
                embeds: [
                    {
                        title: "Detalhes da compra",
                        fields: [
                            { name: "Produto", value: produto || "N/A" },
                            { name: "Preço", value: preco || "N/A" },
                            { name: "Quantidade", value: String(quantidade || 1) },
                            { name: "Cliente", value: cliente || "Desconhecido" }
                        ]
                    }
                ]
            })
        });

        res.sendStatus(200);
    } catch (error) {
        console.error("Erro no webhook:", error);
        res.sendStatus(500);
    }
});

// PORTA do Render (OBRIGATÓRIO)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
