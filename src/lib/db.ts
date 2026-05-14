import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

let client: Client | null = null;
let migrated = false;

export function getDb(): Client {
  if (!client) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, "AutoExport.db");
    client = createClient({ url: `file:${dbPath}` });
  }
  if (!migrated) {
    migrated = true;
    client.execute("ALTER TABLE voitures ADD COLUMN prix_achat REAL").catch(() => {});
    client.execute("ALTER TABLE voitures ADD COLUMN prix_souhaite REAL").catch(() => {});
  }
  return client;
}
