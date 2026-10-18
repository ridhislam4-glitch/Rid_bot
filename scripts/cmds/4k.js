const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "3.0",
    author: "Fixed by Ridoan",
    countDown: 15,
    role: 0,
    category: "AI",
    guide: { en: "{pn} reply to image" }
  },

  onStart: async function ({ message, event, args }) {
    let imgUrl;
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    } else if (args[0] && args[0].startsWith("http")) {
      imgUrl = args[0];
    } else {
      return message.reply("❌ Please reply to an image.");
    }

    const wait = await message.reply("⏳ Enhancing to 4K... Please wait 15s");

    // 3 ta different API try korbe, ekta na cholle arekta
    const apis = [
      `https://api.ryzendesu.vip/api/ai/upscale?url=${encodeURIComponent(imgUrl)}`,
      `https://api.qasimali.dev/api/remini?imageUrl=${encodeURIComponent(imgUrl)}`,
      `https://api.princetechn.com/api/tools/remini?url=${encodeURIComponent(imgUrl)}`
    ];

    for (const apiUrl of apis) {
      try {
        const res = await axios.get(apiUrl, { responseType: "stream", timeout: 30000 });
        // jodi stream pay
        if (res.data) {
          await message.unsend(wait.messageID);
          return message.reply({
            body: "✅ | Here's your 4K image",
            attachment: res.data
          });
        }
      } catch (e) {
        continue; // ekta fail korle porer ta try korbe
      }
    }

    // sob fail korle
    await message.unsend(wait.messageID);
    return message.reply("❌ All 4K APIs are down now. Try again after 5 minutes. Facebook image URL diye try koro, Google link e hoy na.");
  }
};
