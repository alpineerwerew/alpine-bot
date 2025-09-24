// ==========================
// Alpine Connexion Bot - Render + Webhook + PostgreSQL (parse_mode = HTML)
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
    welcome: "💛 Bienvenue chez <b>Alpine Connexion</b> 💛",
    info: `💖 <b>Alpine Connexion – Informations</b>

📦 <b>Envois</b>
• 🇨🇭 Suisse & ✈️ International  
• Avec suivi + assurance  

💳 <b>Paiements</b>  
• 💶 Cash  
• ₿ Crypto (paiement anticipé)  

✨ <b>Notre Engagement</b>  
Qualité garantie & service premium 💎`,
    back: "⬅️ Retour au menu principal",
  },
  en: {
    welcome: "💛 Welcome to <b>Alpine Connexion</b> 💛",
    info: `💖 <b>Alpine Connexion – Information</b>

📦 <b>Shipping</b>  
• 🇨🇭 Switzerland & ✈️ International  
• With tracking + insurance  

💳 <b>Payment Methods</b>  
• 💶 Cash  
• ₿ Crypto (advance payment)  

✨ <b>Our Commitment</b>  
Guaranteed quality & premium service 💎`,
    back: "⬅️ Back to main menu",
  },
  de: {
    welcome: "💛 Willkommen bei <b>Alpine Connexion</b> 💛",
    info: `💖 <b>Alpine Connexion – Informationen</b>

📦 <b>Versand</b>  
• 🇨🇭 Schweiz & ✈️ International  
• Mit Sendungsverfolgung + Versicherung  

💳 <b>Zahlungsarten</b>  
• 💶 Bargeld  
• ₿ Krypto (Vorauszahlung)  

✨ <b>Unser Versprechen</b>  
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
      parse_mode: "HTML",
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
    parse_mode: "HTML",
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
// Commande /sendall (HTML + debug Render)
// ==========================
const DELETE_DELAY = 24 * 60 * 60 * 1000;

bot.onText(/\/sendall([\s\S]*)/, async (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé à utiliser cette commande.");
  }

  const text = match[1].trim();
  const users = await getUsers();

  console.log("=== 📡 DEBUG SENDALL ===");
  console.log(`Texte envoyé : "${text}"`);
  console.log(`Nombre d’utilisateurs en DB : ${users.length}`);

  for (const user of users) {
    console.log(`📤 Envoi prévu pour ID: ${user.id} (@${user.username || "aucun"})`);
    bot.sendMessage(user.id, `<b>📢 Annonce :</b>\n\n${text}`, { parse_mode: "HTML" })
      .then((sentMsg) => {
        console.log(`✅ Succès pour ${user.id}`);
        setTimeout(() => {
          bot.deleteMessage(user.id, sentMsg.message_id).catch(() => {});
        }, DELETE_DELAY);
      })
      .catch((err) => {
        console.error(`❌ Erreur pour ${user.id}:`, err.message);
      });
  }

  bot.sendMessage(msg.chat.id, `🔎 Tentative d’envoi à ${users.length} utilisateurs... Voir logs Render.`);
});

// ==========================
// Commande /sendalltest (uniquement admin)
// ==========================
bot.onText(/\/sendalltest([\s\S]*)/, async (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé à utiliser cette commande.");
  }

  const text = match[1].trim();

  bot.sendMessage(msg.chat.id, `<b>📢 TEST Annonce :</b>\n\n${text}`, { parse_mode: "HTML" })
    .then((sentMsg) => {
      setTimeout(() => {
        bot.deleteMessage(msg.chat.id, sentMsg.message_id).catch(() => {});
      }, DELETE_DELAY);

      bot.sendMessage(msg.chat.id, "✅ Message test envoyé uniquement à toi (sera supprimé dans 24h).", { parse_mode: "HTML" })
        .then((confirmMsg) => {
          setTimeout(() => {
            bot.deleteMessage(msg.chat.id, confirmMsg.message_id).catch(() => {});
          }, DELETE_DELAY);
        });
    })
    .catch(() => {});
});

// ==========================
// Commande /sendto <user_id> <message>
// ==========================
bot.onText(/^\/sendto (\d+) (.+)/, async (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé.");
  }

  const targetId = match[1];   // ID utilisateur
  const text = match[2];       // Texte du message

  console.log(`📤 Tentative d'envoi à ${targetId} : ${text}`);

  bot.sendMessage(targetId, `<b>📩 Message privé :</b>\n\n${text}`, { parse_mode: "HTML" })
    .then(() => {
      bot.sendMessage(msg.chat.id, `✅ Message envoyé à l’utilisateur ${targetId}`, { parse_mode: "HTML" });
    })
    .catch((err) => {
      console.error(`❌ Erreur envoi à ${targetId}:`, err.message);
      bot.sendMessage(msg.chat.id, `⚠️ Erreur lors de l’envoi à ${targetId} : ${err.message}`, { parse_mode: "HTML" });
    });
});

// ==========================
// Commande /listusers
// ==========================
bot.onText(/^\/listusers?/, async (msg) => {
  if (msg.chat.id.toString() !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "⛔️ Tu n’es pas autorisé.");
  }

  const users = await getUsers();
  if (users.length === 0) {
    return bot.sendMessage(msg.chat.id, "📂 Aucun utilisateur enregistré.");
  }

  let list = users
    .map((u) => `• ${u.first_name || ""} (@${u.username || "aucun"}) – ${u.id}`)
    .join("\n");

  bot.sendMessage(msg.chat.id, `📋 Utilisateurs enregistrés :\n\n${list}`);
});

// ==========================
// Express server + React
// ==========================
app.use(express.static(path.join(__dirname, "dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Port Render
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
