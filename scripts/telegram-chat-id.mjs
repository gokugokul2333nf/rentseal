#!/usr/bin/env node
/**
 * Finds the chat ID for the order-desk bot.
 *
 * The token identifies the bot; the chat ID says who it talks to, and there is
 * no way to look one up — Telegram only reveals it once someone has messaged
 * the bot. So: message the bot, run this, and it reads the ID back out of the
 * pending updates.
 *
 * Reads TELEGRAM_BOT_TOKEN from .env.local so the token stays in one place and
 * never has to be pasted onto a command line, where it would land in shell
 * history.
 *
 *   npm run telegram:chat-id
 */
import { readFileSync } from "node:fs";

const env = (() => {
  try {
    return Object.fromEntries(
      readFileSync(new URL("../.env.local", import.meta.url), "utf8")
        .split("\n")
        .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
        .filter(Boolean)
        .map((m) => [m[1], m[2].trim()]),
    );
  } catch {
    return {};
  }
})();

const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is not set in .env.local.\nGet one from @BotFather, put it in .env.local, then run this again.");
  process.exit(1);
}

const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then((r) => r.json());
if (!me.ok) {
  console.error("Telegram rejected that token:", me.description);
  process.exit(1);
}
console.log(`Bot: @${me.result.username}\n`);

const updates = await fetch(`https://api.telegram.org/bot${token}/getUpdates`).then((r) => r.json());
const chats = new Map();
for (const u of updates.result ?? []) {
  const chat = (u.message ?? u.channel_post ?? u.my_chat_member)?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (!chats.size) {
  console.log(`No messages yet, so Telegram has nothing to tell us.\n`);
  console.log(`Open https://t.me/${me.result.username}, send it any message`);
  console.log(`(or add it to your group and send one there), then run this again.`);
  console.log(`\nFor a group: turn Privacy off in @BotFather -> /setprivacy, or the`);
  console.log(`bot cannot see group messages and this will stay empty.`);
  process.exit(0);
}

console.log("Put this in .env.local as TELEGRAM_CHAT_ID:\n");
for (const chat of chats.values()) {
  const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || "";
  console.log(`  ${chat.id}   (${chat.type}${name ? ` — ${name}` : ""})`);
}
console.log("\nSeveral? Separate them with commas.");
