const TelegramBot = require('node-telegram-bot-api');
const { exec } = require("child_process");
const path = require('path');

let botInstance = null;
const TELEGRAM_BOT_TOKEN = "<YOUR_TOKEN_HERE>";

const BotConfig = {
  token: TELEGRAM_BOT_TOKEN,
  opts: { polling: true }
};

const SCRIPT_DIR = path.dirname(__filename);

async function onReply(chatId, username) {
  try {
    const reply = await new Promise((resolve, reject) => {
      exec(`termux-dialog text -t "Reply to ${username || chatId}" -i "Type your message..."`, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error executing termux-dialog: ${error.message}`));
          return;
        }
        if (stderr) {
          reject(new Error(`Dialog error: ${stderr}`));
          return;
        }
        resolve(stdout.trim());
      });
    });

    if (reply === "") {
      exec("termux-toast 'Reply canceled or empty!'");
      return;
    }

    try {
      const response = JSON.parse(reply);
      const message = response.text;
      const bot = getBot()
      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error(`JSON parsing error: ${err}`);
    }

  } catch (err) {
    console.error(err.message);
  }
}

function onMessage(message, bot) {
  try {
    if (!message.text) return;

    exec(`termux-notification --id "telegram_${message.chat.id}" --title "New Telegram Message_${message.from?.username||message.chat.id}" --content "${message.text}" --button1 "Reply" --button1-action "${SCRIPT_DIR}/bot.js reply ${message.chat.id} ${message.from?.username||''}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing termux-notification: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Notification error: ${stderr}`);
      }
    });
  } catch (error) {
    console.error(`Error occurred while processing message: ${error.message}`);
  }
}

function onPollingError(error) {
  console.error(`Polling error: ${error.message}`);
}

function getEventHandlers(bot) {
  return [
    { event: 'message', handler: (message) => onMessage(message, bot) },
    { event: 'polling_error', handler: (error) => onPollingError(error) }
  ];
}

function getBot() {
  if (!botInstance) {
    botInstance = new Bot(BotConfig);
  }
  return botInstance;
}

class Bot extends TelegramBot {
  constructor(config, slashCommands) {
    super(config.token, config.opts);
    if (slashCommands) {
      this.setupSlashCommands(slashCommands);
    }
  }

  setupSlashCommands(slashCommands) {
    this.setMyCommands(slashCommands).then(() => {
    }).catch((err) => {
      console.error('Error setting slash commands:', err);
    });
  }

  start(eventHandlers) {
    eventHandlers.forEach(({ event, handler }) => {
      this.on(event, handler);
    });
    console.log('Bot listening...');
  }
}

const bot = getBot();

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];

  switch (command) {
    case "reply":
      if (args.length < 2) {
        console.error("Usage: bot.js reply <chatId> [username]");
        process.exit(1);
      }
      const chatId = args[1];
      const username = args[2] || null; // if username defined
      onReply(chatId, username);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}


module.exports = { bot, getEventHandlers, getBot };
