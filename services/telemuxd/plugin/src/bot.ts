import TelegramBot from 'node-telegram-bot-api';
import { exec } from "child_process";

const TELEGRAM_BOT_TOKEN = "";

const BotConfig: {token: string, opts: TelegramBot.ConstructorOptions} = {
  token: TELEGRAM_BOT_TOKEN,
  opts: {polling: true},
} as const


async function handleMessage(message: TelegramBot.Message, bot: TelegramBot): Promise<void> {
  try {
    const chatId = message.chat.id;
    const txt = message.text;
    if (!txt) return;

    const command = `sh messenger.sh onMessage "${chatId}" "${txt}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing messenger.sh: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Script error output: ${stderr}`);
        return;
      }
      // console.log(`Script output: ${stdout}`);
    });
  } catch (error: any) {
    console.error(`Error occurred while processing message: ${error?.message}`);
  }
}


async function handlePollingError(error: Error) {
    console.error(`Polling error: ${error.message}`);
}

interface EventHandler {
  event: string;
  handler: (args: any) => void;
}

function getEventHandlers(bot: TelegramBot): EventHandler[]{
    return [
        { event: 'message', handler: (message: TelegramBot.Message) => handleMessage(message, bot) },
        { event: 'polling_error', handler: (error: Error) => handlePollingError(error) }
    ];
}


class Bot extends TelegramBot {
  
  constructor(config: {token: string, opts: TelegramBot.ConstructorOptions}, slashCommands?: {
    command: string;
    description: string;
}[]) {
    super(config.token, config.opts);
    if(slashCommands){
      this.setupSlashCommands(slashCommands);
    }
  }

  private setupSlashCommands(slashCommands: TelegramBot.BotCommand[]) {
    this.setMyCommands(slashCommands).then(() => {
      console.log('Slash commands set successfully!');
    }).catch((err) => {
      console.error('Error setting slash commands:', err);
    });
  }

  public start(eventHandlers: EventHandler[]) {
    eventHandlers.forEach(({ event, handler }) => {
        this.on(event, handler);
    });
    console.log('Bot listening...');
  }
}

const bot = new Bot(BotConfig);

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];

  switch (command) {
    case "send":
      if (args.length < 3) {
        console.error("Usage: bot.ts sendMessage <chatId> <message>");
        process.exit(1);
      }
      const chatId = args[1];
      const message = args.slice(2).join(" ");
      bot.sendMessage(chatId, message)
        .then(() => console.log(`Message sent to ${chatId}: ${message}`))
        .catch((err) => console.error("Error sending message:", err));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

export {bot, getEventHandlers}