module.exports = {
  config: {
    name: "antileave",
    version: "1.0",
    author: "EryXenX",
    role: 1,
    category: "box chat",
    guide: { en: "{pn} on/off" }
  },
  onStart: async ({ args, message, event, threadsData }) => {
    if (!args[0]) return message.reply("Likhun: /antileave on  ba  /antileave off");
    if (args[0] == "on") {
      await threadsData.set(event.threadID, true, "antiLeave");
      return message.reply("✅ AntiLeave ON - keu leave nile bot auto add dibe.");
    } else if (args[0] == "off") {
      await threadsData.set(event.threadID, false, "antiLeave");
      return message.reply("❌ AntiLeave OFF - ar auto add dibe na.");
    }
  }
}
