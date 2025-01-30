const express = require('express');
const { exec } = require("child_process");
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const app = express();
const PORT = 3000;
const TELEGRAM_BOT_TOKEN = "<YOUR_BOT_TOKEN>"
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.use(express.json());

let messageQueue = []; // Queue to store missed messages


function sendNotification(chatId, username, text) {
  const command = `termux-notification --id "telegram_${chatId}_${Date.now()}" --title "New Message from ${username}" --content ${JSON.stringify(text)} --button1 "Reply" --button1-action "curl -X POST -H 'Content-Type: application/json' -d '{\\"chatId\\":\\"${chatId}\\",\\"username\\":\\"${username}\\"}' http://localhost:${PORT}/start-dialog"`;

  exec(command, (error) => {
    if (error) {
      console.error(`Error sending notification: ${error.message}`);
    }
  });
}

function processMessageQueue() {
  while (messageQueue.length > 0) {
    const { chatId, username, text } = messageQueue.shift();
    sendNotification(chatId, username, text);
  }
}

bot.on('text', (msg) => {
  try {
    const chatId = msg.chat.id;
    const username = msg.from?.username || chatId;
    const text = msg.text;
    console.log("New message: ", username, chatId, text);

    messageQueue.push({ chatId, username, text });

    processMessageQueue();
  } catch (err) {
    console.error(`Error in bot.on('text'): ${err.message}`);
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
      await bot.sendMessage(chatId, message);
      console.log("Reply sent: ", username, chatId, message);
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