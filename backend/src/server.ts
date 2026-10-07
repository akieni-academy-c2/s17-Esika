import app from "./app.ts";
import "dotenv/config";
import { ensureCompatSchema } from "./config/ensure-compat-schema.ts";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  await ensureCompatSchema();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((error) => {
  console.error("Impossible d'initialiser la base ESIKA:", error);
  process.exit(1);
});
