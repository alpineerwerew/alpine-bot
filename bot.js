// ==========================
// Alpine Connexion Bot - Render + Webhook + PostgreSQL (simplifié, sans "lang")
// ==========================

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

// 🔑 Token du bot depuis Render (.env)
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN manquant dans .env ou Render");
  process.exit(1);
}

// ==========================
// Initialisation Bot + Express
// ==========================
const app = express();
const bot = new TelegramBot(token, { webHook: true });

// ⚠️ URL Render → adapte avec ton vrai lien
const url = "https://alpine-bot-p68h.onrender.com";
bot.setWebHook(`${url}/bot${token}`);

app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ==========================
// PostgreSQL
// ==========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Créer table si elle n'existe pas
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      username TEXT
    )
  `);
  console.log("✅ Table users prête");
})();

// Ajouter un utilisateur
async function addUser(user) {
  try {
    await pool.query(
      `INSERT INTO users (id, first_name, last_name, username)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.first_name, user.last_name, user.username]
    );
    console.log(`✅ Utilisateur ajouté : ${JSON.stringify(user)}`);
  } catch (err) {
    console.error("❌ Erreur INSERT:", err.message);
  }
}

// Récupérer tous les utilisateurs
async function getUsers() {
  try {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
  } catch (err) {
    console.error("❌ Erreur SELECT:", err.message);
    return [];
  }
}

const ADMIN_ID = "8424992186"; // Ton ID admin

// ==========================
// Textes traduits
// ==========================
const texts = {
  fr: {
    welcome: "💛 Bienvenue chez *Alpine Connexion* 💛",
    info: `💖 *Alpine Connexion – Informations*

📦 *Envois*
• 🇨🇭 Suisse & ✈️ International  
• Avec suivi + assurance  

💳 *Paiements*  
• 💶 Cash  
• ₿ Crypto (paiement anticipé)  

✨ *Notre Engagement*  
Qualité garantie & service premium 💎`,
    back: "⬅️ Retour au menu principal",
  },
  en: {
    welcome: "💛 Welcome to *Alpine Connexion* 💛",
    info: `💖 *Alpine Connexion – Information*

📦 *Shipping*  
• 🇨🇭 Switzerland & ✈️ International  
• With tracking + insurance  

💳 *Payment Methods*  
• 💶 Cash  
• ₿ Crypto (advance payment)  

✨ *Our Commitment*  
Guaranteed quality & premium service 💎`,
    back: "⬅️ Back to main menu",
  },
  de: {
    welcome: "💛 Willkommen bei *Alpine Connexion* 💛",
    info: `💖 *Alpine Connexion – Informationen*

📦 *Versand*  
• 🇨🇭 Schweiz & ✈️ International  
• Mit Sendungsverfolgung + Versicherung  

💳 *Zahlungsarten*  
• 💶 Bargeld  
• ₿ Krypto (Vorauszahlung)  

✨ *Unser Versprechen*  
Garantierte Qualität & Premium-Service 💎`,
    back: "⬅️ Zurück zum Hauptmenü",
  },
};

// ==========================
// Commande /start
// ==========================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = {
    id: chatId,
    first_name: msg.chat.first_name || "",
    last_name: msg.chat.last_name || "",
    username: msg.chat.username || "",
  };

  await addUser(user);

  // Demande la langue à chaque fois (pas sauvegardée)
  bot.sendMessage(
    chatId,
    "🌍 Choisissez votre langue / Choose your language / Wählen Sie Ihre Sprache :",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇫🇷 Français", callback_data: "lang_fr" }],
          [{ text: "🇬🇧 English", callback_data: "lang_en" }],
          [{ text: "🇩🇪 Deutsch", callback_data: "lang_de" }],
        ],
      },
    }
  );
});

// ==========================
// Boutons
// ==========================
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("lang_")) {
    const lang = data.split("_")[1];
    sendMainMenu(chatId, lang);
  }

  if (data.startsWith("info_")) {
    const lang = data.split("_")[1];
    bot.sendMessage(chatId, texts[lang].info, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: texts[lang].back, callback_data: `lang_${lang}` }]],
      },
    });
  }
});

// ==========================
// Menu principal
// ==========================
function sendMainMenu(chatId, lang) {
  bot.sendPhoto(chatId, "https://i.ibb.co/Xk75qN15/logo.jpg", {
    caption: texts[lang].welcome,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ℹ️ Informations", callback_data: `info_${lang}` }],
        [{ text: "📞 Contact", url: "https://linktr.ee/alpinec" }],
        [{ text: "📱 Mini-App", url: "https://alpine-bot-p68h.onrender.com/" }],
      ],
    },
  });
}

// ==========================
// Commande /sendall
// ==========================
bot.onText(/\/sendall (.+)/, async (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé à utiliser cette commande.");
  }

  const text = match[1];
  const users = await getUsers();

  for (const user of users) {
    bot.sendMessage(user.id, `📢 *Annonce* :\n\n${text}`, { parse_mode: "Markdown" }).catch(() => {});
  }

  bot.sendMessage(msg.chat.id, `✅ Message envoyé à ${users.length} utilisateurs.`);
});

// ==========================
// Commande /listusers
// ==========================
bot.onText(/\/listusers/, async (msg) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé.");
  }

  const users = await getUsers();
  if (users.length === 0) {
    return bot.sendMessage(msg.chat.id, "📂 Aucun utilisateur enregistré.");
  }

  let list = users.map(u => `• ${u.first_name} (@${u.username || "aucun"}) – ${u.id}`).join("\n");
  bot.sendMessage(msg.chat.id, `📋 *Utilisateurs enregistrés* :\n\n${list}`, { parse_mode: "Markdown" });
});

// ==========================
// Express server + React
// ==========================
app.use(express.static(path.join(__dirname, "dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
