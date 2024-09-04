/** @notice library imports */
import NodeCron from "node-cron";
/// External imports
import { CreatedEventListener } from "@/listeners/CreatedEventListener";

/// Sync failed blocks
/// every 5 minutes
NodeCron.schedule("*/5 * * * *", async () => {
  await CreatedEventListener.syncFailedEventsToSync();
});
