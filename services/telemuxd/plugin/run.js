import { getBot } from "./src/bot";
import { getEventHandlers } from "./src/bot";

const bot = getBot()
bot.start(getEventHandlers(bot))
