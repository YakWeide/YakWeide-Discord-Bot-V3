const assert = require("node:assert/strict");
const test = require("node:test");
const { AuditLogEvent } = require("discord.js");
const { formatAuditLog } = require("../src/audit-log");

test("formats a member move", () => {
  const entry = {
    action: AuditLogEvent.MemberMove,
    executor: { username: "Moderator" },
    extra: { count: 1, channel: { name: "Voice" } },
  };

  assert.equal(formatAuditLog(entry), "Moderator moved a user to Voice!");
});

test("uses a channel ID when a moved channel is not cached", () => {
  const entry = {
    action: AuditLogEvent.MemberMove,
    executor: { username: "Moderator" },
    extra: { count: 1, channel: { id: "123" } },
  };

  assert.equal(formatAuditLog(entry), "Moderator moved a user to 123!");
});

test("formats a member disconnect", () => {
  const entry = {
    action: AuditLogEvent.MemberDisconnect,
    executor: { username: "Moderator" },
    extra: { count: 2 },
  };

  assert.equal(formatAuditLog(entry), "Moderator disconnected a user!");
});

test("ignores unrelated or incomplete entries", () => {
  const entry = {
    action: AuditLogEvent.MemberKick,
    executor: { username: "Moderator" },
    extra: { count: 1 },
  };

  assert.equal(formatAuditLog(entry), null);
  assert.equal(
    formatAuditLog({ ...entry, action: AuditLogEvent.MemberMove }),
    null,
  );
  assert.equal(
    formatAuditLog({
      ...entry,
      action: AuditLogEvent.MemberDisconnect,
      extra: null,
    }),
    null,
  );
  assert.equal(
    formatAuditLog({
      ...entry,
      action: AuditLogEvent.MemberDisconnect,
      extra: {},
    }),
    null,
  );
});
