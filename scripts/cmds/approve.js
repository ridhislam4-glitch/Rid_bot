const fs = require("fs");
const path = require("path");
const approvedPath = path.join(__dirname, "../../approvedThreads.json");

module.exports = {
  config: {
    name: "approve",
    version: "1.0",
    author: "Ridh Islam Ayan",
    role: 2,
    description: "Approve GC",
    category: "admin"
  },
  onStart: async function({ api, event, args, message }) {
    if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
    let approved = JSON.parse(fs.readFileSync(approvedPath));

    let targetID = args[0] || event.threadID;
    
    if (approved.includes(targetID)) return message.reply("✅ This GC is already approved.");

    approved.push(targetID);
    fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));

    message.reply(`✅ Approved thread: ${targetID}`);

    // je GC approve korla oi GC te message jabe
    return api.sendMessage(`✅ | This GC has been approved by Ridh Islam Ayan\nBot is now active here! ✨`, targetID);
  }
};
