const { onReply } = require('./bot'); 

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];

  switch (command) {
    case "reply":
      if (args.length < 2) {
        console.error("Usage: cli.js reply <chatId> [username]");
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
