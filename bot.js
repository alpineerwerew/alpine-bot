const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
require("dotenv").config(); // ✅ charge .env

// 🔑 Token du bot depuis .env
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN manquant dans .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// 📌 Fichier pour sauvegarder les utilisateurs
const USERS_FILE = "users.json";

// Charger les utilisateurs existants
let users = [];
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// ID admin pour /sendall
const ADMIN_ID = "8424992186";

// ➤ Sauvegarde utilisateurs
function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ➤ Textes traduits
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

// ➤ Quand un utilisateur lance /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = {
    id: chatId,
    first_name: msg.chat.first_name || "",
    last_name: msg.chat.last_name || "",
    username: msg.chat.username || "",
  };

  if (!users.find((u) => u.id === chatId)) {
    users.push(user);
    saveUsers();
  }

  bot.sendMessage(chatId, "🌍 Choisissez votre langue / Choose your language / Wählen Sie Ihre Sprache :", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇫🇷 Français", callback_data: "lang_fr" }],
        [{ text: "🇬🇧 English", callback_data: "lang_en" }],
        [{ text: "🇩🇪 Deutsch", callback_data: "lang_de" }],
      ],
    },
  });
});

// ➤ Gestion des boutons
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

// ➤ Fonction d’affichage du menu principal
function sendMainMenu(chatId, lang) {
  bot.sendPhoto(chatId, "https://i.ibb.co/Xk75qN15/logo.jpg", {
    caption: texts[lang].welcome,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ℹ️ Informations", callback_data: `info_${lang}` }],
        [{ text: "📞 Contact", url: "https://linktr.ee/alpinec" }],
        [{ text: "📱 Mini-App", url: "https://hghg-cqz.pages.dev/" }],
      ],
    },
  });
}

// ➤ Commande /sendall pour admin
bot.onText(/\/sendall (.+)/, (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé à utiliser cette commande.");
  }

  const text = match[1];
  users.forEach((user) => {
    bot.sendMessage(user.id, `📢 *Annonce* :\n\n${text}`, { parse_mode: "Markdown" }).catch(() => {});
  });

  bot.sendMessage(msg.chat.id, `✅ Message envoyé à ${users.length} utilisateurs.`);
});


// ==========================
// ✅ SERVEUR EXPRESS POUR RENDER
// ==========================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot Alpine Connexion est en ligne 🚀");
});

// Render fournit PORT automatiquement
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur Express lancé sur le port ${PORT}`);
});
