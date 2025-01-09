const { getBot } = require("./src/bot") ;
const { getEventHandlers }= require( "./src/bot");

const bot = getBot()
bot.start(getEventHandlers(bot))
