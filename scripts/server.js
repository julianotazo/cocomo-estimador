import express from "express";
import cors from "cors";
import { calculateCOCOMO } from "./cocomo.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/cocomo", (req, res) => {
  try {
    const result = calculateCOCOMO(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));
