/** @notice library imports */
import "module-alias/register";
/// External imports
import { PORT } from "@/constants";
import { application } from "@/core";

/// Runner
application.listen(PORT, () => {
  console.clear();
  console.log(`[${process.pid}] 🐳 api.secura :${PORT}`);
});
