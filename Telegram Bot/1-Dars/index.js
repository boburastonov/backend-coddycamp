import "dotenv/config";
import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not defined, .env faylga bot tokenini qo'shing");
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply("Assalomu alaykum, Botimizga xush kelibsiz!");
});

bot.help((ctx) => {
  ctx.reply(
    "Yordam bo'limi:\n" +
      "/start - Botni ishga tushirish\n" +
      "/help - Yordam ro'yxati\n",
  );
});

bot.launch();
console.log("Bot ishga tushdi!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
