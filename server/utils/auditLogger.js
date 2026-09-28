import AuditLog from '../models/AuditLog.js';

/**
 * Append an immutable event record to the audit trail
 */
export const logAuditEvent = async ({
  action,
  entityType,
  entityId,
  actorType = 'System',
  actorId = null,
  actorName = 'System',
  metadata = {}
}) => {
  try {
    const log = await AuditLog.create({
      action,
      entityType,
      entityId,
      actorType,
      actorId,
      actorName,
      metadata,
      timestamp: new Date()
    });
    return log;
  } catch (err) {
    console.error(`[AuditLogger Error] Failed to record event ${action}:`, err.message);
    return null;
  }
};

export default logAuditEvent;
