const TelegramBot = require('node-telegram-bot-api');
const { exec } = require("child_process");
const path = require('path');

let botInstance = null;
const TELEGRAM_BOT_TOKEN = "";

const BotConfig = {
  token: TELEGRAM_BOT_TOKEN,
  opts: { polling: true }
};

async function handleMessage(message, bot) {
  try {
    if (!message.text) return;

    const scriptPath = path.join(__dirname, 'messenger.sh');
    const command = `sh ${scriptPath} onMessage "${message.chat.id}" "${message.text}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing messenger.sh: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Script error output: ${stderr}`);
        return;
      }
    });
  } catch (error) {
    console.error(`Error occurred while processing message: ${error.message}`);
  }
}

async function handlePollingError(error) {
  console.error(`Polling error: ${error.message}`);
}

function getEventHandlers(bot) {
  return [
    { event: 'message', handler: (message) => handleMessage(message, bot) },
    { event: 'polling_error', handler: (error) => handlePollingError(error) }
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

// Initialize bot instance
const bot = getBot();
const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];

  switch (command) {
    case "send":
      if (args.length < 3) {
        console.error("Usage: bot.js send <chatId> <message>");
        process.exit(1);
      }
      const chatId = args[1];
      const message = args.slice(2).join(" ");
      bot.sendMessage(chatId, message)
        .then(() => {
          console.log(`Message sent to ${chatId}: ${message}`);
          process.exit(0);
        })
        .catch((err) => {
          console.error("Error sending message:", err);
          process.exit(1);
        });
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

module.exports = { bot, getEventHandlers, getBot };
