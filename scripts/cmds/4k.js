const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "2.0",
    author: "MahMUD | Fixed by Ridoan",
    countDown: 10,
    role: 0,
    category: "AI",
    description: "Enhance or restore image quality using 4k AI.",
    guide: { en: "{pn} [reply to image or url]" }
  },

  onStart: async function ({ message, event, args }) {
    let imgUrl;
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    } else if (args[0]) {
      imgUrl = args[0];
    }

    if (!imgUrl) {
      return message.reply("Please reply to an image or provide an image URL");
    }

    const waitMsg = await message.reply("Loading 4k image... wait baby 😘");
    
    try {
      // base API fetch with fallback
      let baseUrl;
      try {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        baseUrl = base.data.mahmud;
      } catch {
        baseUrl = "https://www.noobs-api.rf.gd"; // fallback
      }

      const apiUrl = `${baseUrl}/api/hd?imgUrl=${encodeURIComponent(imgUrl)}`;
      const res = await axios.get(apiUrl, { responseType: "stream" });

      await message.unsend(waitMsg.messageID);
      return message.reply({
        body: `✅ | Here's your 4k image baby`,
        attachment: res.data
      });

    } catch (error) {
      console.log(error);
      if (waitMsg?.messageID) message.unsend(waitMsg.messageID);
      return message.reply(`Error: API down. Try again later.`);
    }
  }
};
