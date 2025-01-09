import { bot } from "./src/bot";
import { getEventHandlers } from "./src/bot";

bot.start(getEventHandlers(bot))
