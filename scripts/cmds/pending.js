const fs = require("fs");
const path = require("path");
const approvedPath = path.join(__dirname, "../../approvedThreads.json");

module.exports = {
  config: {
    name: "pending",
    version: "1.0",
    author: "Ridh Islam Ayan",
    role: 2, // sudhu admin use korte parbe
    description: "Show pending GC list",
    category: "admin"
  },
  onStart: async function({ api, event, message }) {
    if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
    const approved = JSON.parse(fs.readFileSync(approvedPath));
    
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const pending = allThreads.filter(t => t.isGroup && !approved.includes(t.threadID));

    if (pending.length == 0) return message.reply("✅ No pending GC. All approved.");

    let msg = `📋 Pending GC List (${pending.length}):\n\n`;
    pending.forEach((t, i) => {
      msg += `${i+1}. ${t.name}\nID: ${t.threadID}\n\n`;
    });
    msg += `Use: !approve <threadID> or !approve (reply in that GC)`;
    return message.reply(msg);
  }
};
