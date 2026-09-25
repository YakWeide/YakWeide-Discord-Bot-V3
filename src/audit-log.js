const { AuditLogEvent } = require("discord.js");

function formatAuditLog(entry) {
  if (
    !entry.executor?.username ||
    !Number.isInteger(entry.extra?.count) ||
    entry.extra.count < 1
  ) {
    return null;
  }

  if (entry.action === AuditLogEvent.MemberMove) {
    const channel = entry.extra.channel;
    const channelName = channel?.name ?? channel?.id;
    if (!channelName) {
      return null;
    }
    return `${entry.executor.username} moved a user to ${channelName}!`;
  }

  if (entry.action === AuditLogEvent.MemberDisconnect) {
    return `${entry.executor.username} disconnected a user!`;
  }

  return null;
}

module.exports = { formatAuditLog };
