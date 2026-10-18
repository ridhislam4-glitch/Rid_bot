const fs = require("fs");
const path = require("path");
const approvedPath = path.join(__dirname, "../../approvedThreads.json");

module.exports = {
  config: {
    name: "approvalCheck",
    version: "1.0",
    author: "Ridh Islam Ayan"
  },
  onChat: async function({ event, api }) {
    if (!event.isGroup) return;
    if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
    const approved = JSON.parse(fs.readFileSync(approvedPath));
    
    // jodi approved list e na thake, bot kichu korbe na
    if (!approved.includes(event.threadID)) {
      // chaile ekhane auto leave korate paro, ekhon sudhu off thakbe
      return;
    }
  },
  onEvent: async function({ event, api }) {
    // bot ke keu notun GC te add korle
    if (event.logMessageType === "log:subscribe" && event.logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) {
      const threadID = event.threadID;
      if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
      const approved = JSON.parse(fs.readFileSync(approvedPath));
      
      if (!approved.includes(threadID)) {
        api.sendMessage(`⚠️ This GC is not approved yet.\nPlease wait for approval by Ridh Islam Ayan.\n\nThread ID: ${threadID}`, threadID);
      }
    }
  }
};
