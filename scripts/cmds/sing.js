const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function tempFilePath() {
  return path.join(CACHE_DIR, `sing_${Date.now()}.mp3`);
}

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "music"],
    version: "3.0.0",
    author: "Fixed by Ridh",
    countDown: 10,
    role: 0,
    shortDescription: "YouTube theke gaan",
    category: "media",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ").trim();
    if (!query) return message.reply("❌ Song name den\nEx: sing lofi");

    try { api.setMessageReaction("⏳", event.messageID, () => {}, true); } catch {}

    let filePath;
    try {
      const search = await yts(query);
      const video = search.videos?.[0];
      if (!video) return message.reply(`❌ "${query}" paoa jayni`);

      filePath = tempFilePath();

      // direct ytdl download
      const stream = ytdl(video.url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
      });

      const writeStream = fs.createWriteStream(filePath);
      await new Promise((res, rej) => {
        stream.pipe(writeStream);
        stream.on("error", rej);
        writeStream.on("finish", res);
        writeStream.on("error", rej);
      });

      // file size check - 25MB er beshi hole fb ney na
      const stats = fs.statSync(filePath);
      if (stats.size > 25 * 1024 * 1024) {
        return message.reply("❌ File 25MB er beshi, download kora gelo na. Onno gaan try koro.");
      }

      await message.reply({
        body: `🎶 ${video.title}\n⏱️ ${video.timestamp}\n👤 ${video.author.name}`,
        attachment: fs.createReadStream(filePath)
      });

      try { api.setMessageReaction("✅", event.messageID, () => {}, true); } catch {}

    } catch (err) {
      console.error(err);
      try { api.setMessageReaction("❌", event.messageID, () => {}, true); } catch {}
      return message.reply(`❌ Error: ${err.message.slice(0, 200)}`);
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }
  }
};
