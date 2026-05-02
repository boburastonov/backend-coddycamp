import "dotenv/config";
import axios from "axios";
import { Markup, Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not defined, .env faylga bot tokenini qo'shing");
  process.exit(1);
}

const bot = new Telegraf(token);

const menuKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Ob-havo", "weather"),
    Markup.button.callback("Valyuta kursi", "currency"),
  ],
  [Markup.button.callback("Yangilash", "refresh")],
]);

bot.start(async (ctx) => {
  await ctx.reply("Kerakli bo'limni tanlang!", menuKeyboard);
});

bot.help(async (ctx) => {
  await ctx.reply(
    "Yordam bo'limi:\n" +
      "/start - Menuni ochish\n" +
      "/help - Yordam ro'yxati\n" +
      "Tugmalar orqali ob-havo yoki valyuta kurslari haqida ma'lumot olishingiz mumkin!",
  );
});

async function getWeather() {
  const lat = Number(process.env.WEATHER_LAT ?? 41.3111);
  const lon = Number(process.env.WEATHER_LON ?? 69.2797);

  const url = "https://api.open.meteo.com/v1/forecast";
  const res = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
    },
    timeout: 10000,
  });

  const d = res.data?.current_weather;
  if (!d) throw new Error("current_weather yo'q");

  return (
    `Ob-havo:\n` +
    `Kordinata: ${d.latitude}, ${d.longitude}\n` +
    `Temperatura: ${d.temperature}\n` +
    `Shamol: ${d.windspeed} km/h`
  );
}

async function getCurrency() {
  const base = (process.env.CURRENCY_BASE || "USD").toUpperCase();
  const symbol = (process.env.CURRENCY_SYMBOL || "EUR").toUpperCase();

  const url = "https://api.frankfurter.app/latest";
  const res = await axios.get(url, {
    params: {
      from: base,
      to: symbol,
    },
    timeout: 10000,
  });

  const rate = res.data?.rates?.[symbol];
  if (!rate) throw new Error("Rate yo'q");

  return `Kurs:\n1 ${base} = ${rate} ${symbol}`;
}

async function getCurrencyUZS() {
  const base = (process.env.CURRENCY_BASE || "USD").toUpperCase(); // USD/EUR/RUB...
  const url = "https://cbu.uz/ru/arkhiv-kursov-valyut/json/";

  const res = await axios.get(url, { timeout: 10000 });
  const arr = Array.isArray(res.data) ? res.data : [];

  const row = arr.find((x) => String(x?.Ccy).toUpperCase() === base);
  if (!row) throw new Error(`CBUda ${base} topilmadi`);

  const rate = Number(String(row.Rate).replace(",", "."));
  if (!Number.isFinite(rate)) throw new Error("Rate noto'g'ri");

  return `Kurs (CBU):\n1 ${base} = ${rate} UZS`;
}

bot.action("weather", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const text = await getWeather();
    await ctx.reply(text, menuKeyboard);
  } catch (e) {
    await ctx.reply(
      "Xatolik, Ob-havo olinmadi. Keyinroq urinib ko'ring.",
      menuKeyboard,
    );
  }
});

bot.action("currency", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const text = await getCurrency();
    await ctx.reply(text, menuKeyboard);
  } catch (e) {
    await ctx.reply(
      "Xatolik, Valyuta kursi olinmadi. Keyinroq urinib ko'ring.",
      menuKeyboard,
    );
  }
});

bot.action("refresh", async (ctx) => {
  await ctx.answerCbQuery("Yangilandi");
  await ctx.reply("Kerakli bo'limni tanlang", menukeyboard);
});

bot.launch();
console.log("Bot ishga tushdi!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
