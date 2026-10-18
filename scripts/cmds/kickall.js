module.exports = {
  config: {
    name: "kickall",
    version: "1.1",
    author: "NEXXO Fixed",
    role: 2,
    shortDescription: { en: "Kick everyone from the group" },
    category: "owner",
    guide: { en: "{prefix}kickall confirm - to kick all" }
  },
  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const botID = api.getCurrentUserID();

    // safety - confirm lagbe
    if (args[0] !== "confirm") {
      return api.sendMessage("⚠️ Sobai ke kick korte chaile likho:\n/kickall confirm", threadID);
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      
      // admin check - 2 vabe check
      const adminIDs = threadInfo.adminIDs.map(a => a.id ? a.id : a);
      if (!adminIDs.includes(botID)) {
        return api.sendMessage("❌ Bot ke age Group Admin banao.", threadID);
      }

      const membersToKick = threadInfo.participantIDs.filter(id => id != senderID && id != botID);

      if (membersToKick.length === 0) {
        return api.sendMessage("❌ Kick korar moto keu nai.", threadID);
      }

      api.sendMessage(`⚠️ ${membersToKick.length} jon ke kick kortesi...`, threadID);

      for (const userID of membersToKick) {
        try {
          await api.removeUserFromGroup(userID, threadID);
          await new Promise(res => setTimeout(res, 1000)); // 1 sec delay jate block na khay
        } catch (e) {
          console.log(`Failed ${userID}: ${e.message}`);
        }
      }
      api.sendMessage(`✅ Done. ${membersToKick.length} jon kicked.`, threadID);

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Error: " + e.message, threadID);
    }
  }
};
