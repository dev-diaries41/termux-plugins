const express = require('express');
const { exec } = require("child_process");
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'); 

const app = express();
const PORT = 3000;
const TELEGRAM_BOT_TOKEN = "<YOUR_TOKEN>";
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.use(express.json());

const POLL_INTERVAL = 60000;
const LAST_UPDATE_FILE = 'lastUpdate.txt';

let lastUpdateId = 0;

function readLastUpdateId() {
  try {
    if (fs.existsSync(LAST_UPDATE_FILE)) {
      const data = fs.readFileSync(LAST_UPDATE_FILE, 'utf8');
      return parseInt(data.trim()) || 0;
    }
  } catch (err) {
    console.error(`Error reading last update ID file: ${err.message}`);
  }
  return 0; 
}

function writeLastUpdateId(id) {
  try {
    fs.writeFileSync(LAST_UPDATE_FILE, id.toString());
  } catch (err) {
    console.error(`Error writing last update ID to file: ${err.message}`);
  }
}

lastUpdateId = readLastUpdateId();

function onMessage(message) {
  try {
    if (!message.text) return;
    const chatId = message.chat.id;
    const username = message.from?.username || chatId;
    const command = `termux-notification --id "telegram_${chatId}" --title "New Message from ${username}" --content ${JSON.stringify(message.text)} --button1 "Reply" --button1-action "curl -X POST -H 'Content-Type: application/json' -d '{\\"chatId\\":\\"${chatId}\\",\\"username\\":\\"${username}\\"}' http://localhost:${PORT}/start-dialog"`;
    exec(command, (error) => {
      if (error) {
        console.error(`Error sending notification: ${error.message}`);
      }
    });
  } catch (err) {
    console.error(`Error in onMessage: ${err.message}`);
  }
}

// Polling the Telegram API for updates every POLL_INTERVAL (ms). The bot.on("message") listener was not working effectively so this is a workaround.
setInterval(async () => {
  try {
    const updates = await bot.getUpdates({ offset: lastUpdateId + 1, allowed_updates: ["message"] });
    if (updates.length > 0) {
      updates.forEach(update => {
        lastUpdateId = update.update_id;
        if (update.message) {
          onMessage(update.message);
        }
      });
      writeLastUpdateId(lastUpdateId);
    }
  } catch (err) {
    console.error(`Error in setInterval polling: ${err.message}`);
  }
}, POLL_INTERVAL);

app.post('/reply', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    if (!chatId || !message) {
      return res.status(400).send({ error: 'chatId and message are required.' });
    }
    await bot.sendMessage(chatId, message);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(`Error in /reply: ${err.message}`);
    res.status(500).send({ error: 'Failed to send message.' });
  }
});

app.post('/start-dialog', async (req, res) => {
  try {
    const { chatId, username } = req.body;
    if (!chatId) {
      return res.status(400).send({ error: 'chatId is required.' });
    }
    exec(`termux-dialog text -t "Reply to ${username || chatId}" -i "Type your message..."`, async (error, stdout) => {
      if (error) {
        console.error(`Error opening dialog: ${error.message}`);
        return res.status(500).send({ error: 'Failed to open dialog.' });
      }
      const response = JSON.parse(stdout.trim());
      const message = response.text;
      const payload = { chatId, message };
      try {
        await axios.post(`http://localhost:${PORT}/reply`, payload);
      } catch (err) {
        console.error(`Error sending reply: ${err?.message}`);
      }
      res.status(200).send({ success: true });
    });
  } catch (err) {
    console.error(`Error in /start-dialog: ${err.message}`);
    res.status(500).send({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});