/** @notice library imports */
import { desc, eq } from "drizzle-orm";
/// External imports
import { database } from "@/clients";
import { events, NewEventRecordParams } from "@/schemas/eventsTable";
import { CONTRACT_MINED_ON_BLOCK, SecuraEvents } from "@/listeners/constants";

// EventsLogger table services.
export class EventsLoggerServices {
  /**
   * @description Creates a new event log based on parameters.
   * @param params The event log details.
   */
  public static async createNewEventLog(params: NewEventRecordParams) {
    await database.insert(events).values(params);
  }

  /**
   * @description Returns the last synced block number of `SecureLockCreated` event.
   *   - Query database for last block number.
   *   - Return blockNumber.
   * @returns The last synced blockNumber.
   */
  public static async lastSyncedBlockNoOfCreatedEvent() {
    /// Query database
    return await this.getLastSyncedBlockOfEvent({
      eventName: SecuraEvents.SecureLockCreated,
    });
  }

  /**
   * @description Returns the last synced block number of `SecureLockExtended` event.
   *   - Query database for last block number.
   *   - Return blockNumber.
   * @returns The last synced blockNumber.
   */
  public static async lastSyncedBlockNoOfExtendedEvent() {
    /// Query database
    return await this.getLastSyncedBlockOfEvent({
      eventName: SecuraEvents.SecureLockExtended,
    });
  }

  /**
   * @description Returns the last synced block number of `SecureLockUnlocked` event.
   *   - Query database for last block number.
   *   - Return blockNumber.
   * @returns The last synced blockNumber.
   */
  public static async lastSyncedBlockNoOfUnlockedEvent() {
    /// Query database
    return await this.getLastSyncedBlockOfEvent({
      eventName: SecuraEvents.SecureLockUnlocked,
    });
  }

  /**
   * @description Returns the last synced block number of contract event.
   *   - Query database for last block number.
   *   - If data found then return the `blockNumber`
   *   - If not found (first entry) then return the blockNumber of contract mined.
   * @param eventName The contract event name.
   * @returns The last synced blockNumber or Contract blockNumber.
   */
  private static async getLastSyncedBlockOfEvent({
    eventName,
  }: {
    eventName: SecuraEvents;
  }) {
    /// Query database
    const data = await database.query.events.findFirst({
      columns: {
        blockNumber: true,
      },
      orderBy: desc(events.blockNumber),
      where: eq(events.event, eventName),
    });
    /// Return blockNumber
    return data ? data.blockNumber : CONTRACT_MINED_ON_BLOCK;
  }
}
