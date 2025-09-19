// ==========================
// Alpine Connexion Bot - Render + Webhook + SQLite + React
// ==========================

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
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

// Définir le webhook
bot.setWebHook(`${url}/bot${token}`);

// Middleware Express pour traiter les updates Telegram
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ==========================
// Base de données SQLite
// ==========================
const db = new sqlite3.Database("users.db", (err) => {
  if (err) {
    console.error("❌ Erreur connexion DB:", err.message);
  } else {
    console.log("✅ Connecté à SQLite (users.db)");
  }
});

// Créer la table si elle n’existe pas
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT
  )
`);

const ADMIN_ID = "8424992186"; // Ton ID admin

// Ajouter un utilisateur
function addUser(user) {
  db.get("SELECT id FROM users WHERE id = ?", [user.id], (err, row) => {
    if (err) return console.error("❌ Erreur SELECT:", err.message);

    if (!row) {
      db.run(
        "INSERT INTO users (id, first_name, last_name, username) VALUES (?, ?, ?, ?)",
        [user.id, user.first_name, user.last_name, user.username],
        (err) => {
          if (err) console.error("❌ Erreur INSERT:", err.message);
          else console.log(`✅ Nouvel utilisateur ajouté: ${JSON.stringify(user)}`);
        }
      );
    }
  });
}

// Récupérer tous les utilisateurs
function getUsers(callback) {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("❌ Erreur SELECT:", err.message);
      callback([]);
    } else {
      callback(rows);
    }
  });
}

// ==========================
// Textes traduits
// ==========================
const texts = {
  fr: {
    welcome: "💛 Bienvenue chez *Alpine Connexion* 💛",
    info: `📦 *Envois*
• Suisse 🇨🇭 et International ✈️ avec suivi et assurance

🤝 *Meetup*
📍 Valais Centre
🕒 7j/7

💳 *Paiement*
• 💶 Cash
• ₿ Crypto (paiement anticipé)

✨ Qualité garantie, service premium.`,
    back: "⬅️ Retour au menu principal",
  },
  en: {
    welcome: "💛 Welcome to *Alpine Connexion* 💛",
    info: `📦 *Shipping*
• Switzerland 🇨🇭 & International ✈️ with tracking and insurance

🤝 *Meetup*
📍 Valais Center
🕒 7 days a week

💳 *Payment*
• 💶 Cash
• ₿ Crypto (advance payment)

✨ Guaranteed quality, premium service.`,
    back: "⬅️ Back to main menu",
  },
  de: {
    welcome: "💛 Willkommen bei *Alpine Connexion* 💛",
    info: `📦 *Versand*
• Schweiz 🇨🇭 & International ✈️ mit Sendungsverfolgung und Versicherung

🤝 *Treffen*
📍 Valais Zentrum
🕒 7 Tage die Woche

💳 *Zahlung*
• 💶 Bargeld
• ₿ Krypto (Vorauszahlung)

✨ Garantierte Qualität, Premium-Service.`,
    back: "⬅️ Zurück zum Hauptmenü",
  },
};

// ==========================
// Commande /start
// ==========================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = {
    id: chatId,
    first_name: msg.chat.first_name || "",
    last_name: msg.chat.last_name || "",
    username: msg.chat.username || "",
  };

  addUser(user);

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
bot.on("callback_query", (query) => {
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
        [{ text: "📱 Mini-App", url: "https://alpine-417.pages.dev/" }],
      ],
    },
  });
}

// ==========================
// Commande /sendall
// ==========================
bot.onText(/\/sendall (.+)/, (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(
      msg.chat.id,
      "⛔️ Tu n’es pas autorisé à utiliser cette commande."
    );
  }

  const text = match[1];
  getUsers((users) => {
    users.forEach((user) => {
      bot
        .sendMessage(user.id, `📢 *Annonce* :\n\n${text}`, { parse_mode: "Markdown" })
        .catch(() => {});
    });

    bot.sendMessage(msg.chat.id, `✅ Message envoyé à ${users.length} utilisateurs.`);
  });
});

// ==========================
// Commande /listusers
// ==========================
bot.onText(/\/listusers/, (msg) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé.");
  }

  getUsers((users) => {
    if (users.length === 0) {
      return bot.sendMessage(msg.chat.id, "📂 Aucun utilisateur enregistré.");
    }

    let list = users
      .map((u) => `• ${u.first_name} (@${u.username || "aucun"}) – ${u.id}`)
      .join("\n");
    bot.sendMessage(msg.chat.id, `📋 *Utilisateurs enregistrés* :\n\n${list}`, {
      parse_mode: "Markdown",
    });
  });
});

// ==========================
// Express server + React
// ==========================
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Express 5 → utiliser une regex pour catch-all
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
