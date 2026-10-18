const { getTime } = global.utils;
module.exports = {
  config: {
    name: "antileave",
    version: "3.1",
    author: "EryXenX Fixed",
    category: "events"
  },
  onStart: async ({ api, event, threadsData, usersData }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const threadID = event.threadID;
    const leftID = event.logMessageData.leftParticipantFbId;
    if (leftID === api.getCurrentUserID()) return;

    const userName = await usersData.getName(leftID);
    const time = getTime("DD/MM/YYYY - HH:mm:ss");

    // 1. Sob somoy leave message dibe
    api.sendMessage(
      `❌ ${userName} group theke leave nise.\n⏰ Time: ${time}\n🆔 ID: ${leftID}`,
      threadID
    );

    // 2. Add dibe sudhu ON thakle
    const isEnabled = await threadsData.get(threadID, "antiLeave");
    if (!isEnabled) return;

    // 3 sec por add dewar try korbe
    setTimeout(async () => {
      try {
        await api.addUserToGroup(leftID, threadID);
        api.sendMessage(`✅ ${userName} ke abar add dewa holo.`, threadID);
      } catch (e) {
        // Already in group error ta hide kore dilam, ar error dekhabe na
        if (e.errorDescription && e.errorDescription.includes("Already in group")) return;
        console.log("AntiLeave Add Error:", e.message);
      }
    }, 3000);
  }
}
