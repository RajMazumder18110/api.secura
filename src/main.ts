/** @notice library imports */
import "module-alias/register";
/// External imports
import { PORT } from "@/constants";
import { application } from "@/core";
import { CreatedEventListener } from "./listeners/CreatedEventListener";

const main = async () => {
  console.clear();
  /// Sync un synced events
  await CreatedEventListener.syncFailedEventsToSync();

  /// Listeners
  await CreatedEventListener.listen();
  console.log(`🔈 Listening...`);

  /// Runner
  application.listen(PORT, () => {
    console.log(`[${process.pid}] 🐳 api.secura :${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
