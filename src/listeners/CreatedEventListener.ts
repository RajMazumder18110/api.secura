/** @notice library imports */
import { Contract, ContractEventPayload, EventLog } from "ethers";
/// External imports
import {
  ERC20Services,
  LockerServices,
  EventsLoggerServices,
} from "@/services";
import { NewLockerParams } from "@/schemas";
import { SecuraEvents } from "@/listeners/constants";
import { erc20Abi } from "@/listeners/abis/ERC20Abi";
import { securaContract, blockchainProvider } from "@/listeners/core";

/// Types
type ERC20Details = [
  Promise<string>,
  Promise<string>,
  Promise<number>,
  Promise<bigint>
];

type LockerDetailsParams = [
  bigint,
  boolean,
  string,
  string,
  bigint,
  string,
  bigint,
  bigint
];

/// CreatedEventListener
export class CreatedEventListener {
  /**
   * @description Listen events and save logs & locker.
   *  - Destructure all params
   *  - Save raw log into database.
   *  - Save locker details into database.
   */
  public static async listen() {
    await securaContract.on(
      SecuraEvents.SecureLockCreated,
      async (
        lockId: bigint,
        lockerDetails: LockerDetailsParams,
        payload: ContractEventPayload
      ) => {
        try {
          /// Destructure locker params
          const [, , owner, erc20, amount, name, lockedOn, unlockOn] =
            lockerDetails;
          /// Destructure event payload params
          const { blockNumber, blockHash, transactionHash, data, topics } =
            payload.log;

          /// Saving event log
          await this.saveCreatedEventLog(payload.log);
          /// Saving locker & erc20 details
          await this.saveLockerAndErc20Details({
            /// Core params
            name,
            owner,
            erc20,
            lockedOn,
            unlockOn,
            amount: amount.toString(),
            lockId: lockId.toString(),
            /// Blockchain params
            data,
            topics,
            blockHash,
            blockNumber,
            transactionHash,
            event: SecuraEvents.SecureLockCreated,
          });
          /// Complete sync
          await EventsLoggerServices.completeSyncUptoBlock({
            syncedBlockNumber: blockNumber,
            event: SecuraEvents.SecureLockCreated,
          });
          console.log(`🔒[${lockId}] locked till block ${unlockOn}`);
        } catch (error) {
          console.error(SecuraEvents.SecureLockCreated, error);
        }
      }
    );
  }

  /**
   * @description Sync failed to detect events.
   *    - Grabbing the current block & last synced block.
   *    - Filter the events if any.
   *    - Adding log into database.
   *    - Adding locker details into database.
   *    - Mark the current block as synced.
   */
  public static async syncFailedEventsToSync() {
    try {
      /// Grabbing the block details
      const currentBlock = await blockchainProvider.getBlockNumber();
      const lastSyncedBlock =
        await EventsLoggerServices.lastSyncedBlockNoOfCreatedEvent();

      if (currentBlock > lastSyncedBlock) {
        /// Grabbing missing events.
        const filteredEvents = (await securaContract.queryFilter(
          SecuraEvents.SecureLockCreated,
          lastSyncedBlock + 1
        )) as EventLog[];

        /// Inserting all events
        for (const filteredEvent of filteredEvents) {
          /// Destructure locker params
          const [lockId, [, , owner, erc20, amount, name, lockedOn, unlockOn]] =
            filteredEvent.args;
          /// Destructure event payload params
          const { blockNumber, blockHash, transactionHash, data, topics } =
            filteredEvent;

          /// Saving event log
          await this.saveCreatedEventLog(filteredEvent);
          /// Saving locker & erc20 details
          await this.saveLockerAndErc20Details({
            /// Core params
            name,
            owner,
            erc20,
            lockedOn,
            unlockOn,
            amount: amount.toString(),
            lockId: lockId.toString(),
            /// Blockchain params
            data,
            topics,
            blockHash,
            blockNumber,
            transactionHash,
            event: SecuraEvents.SecureLockCreated,
          });
          console.log(`🔒[${lockId}][SYNC] locked till block ${unlockOn}`);
        }
      }

      /// Complete sync
      await EventsLoggerServices.completeSyncUptoBlock({
        syncedBlockNumber: currentBlock,
        event: SecuraEvents.SecureLockCreated,
      });
    } catch (error) {
      console.error(
        "FAILED_TO_SYNC_FAILED_EVENTS",
        SecuraEvents.SecureLockCreated,
        error
      );
    }
  }

  /**
   * @description Save data after getting the `SecureLockCreated` log.
   *    - Destructure parameters from event log.
   *    - Save into logger table.
   */
  private static async saveCreatedEventLog(event: EventLog) {
    /// Destructure params
    const { blockNumber, blockHash, transactionHash, data, topics } = event;
    /// Saving into logger table
    await EventsLoggerServices.createNewEventLog({
      blockNumber,
      blockHash,
      transactionHash,
      data,
      topics,
      event: SecuraEvents.SecureLockCreated,
    });
  }

  /**
   * @description Save new locker details with ERC20 details if not available.
   *    - Check for erc20 availability.
   *    - Save ERC20 details if not available.
   *    - Save new locker details.
   * @param {NewLockerParams} params The new locker event params.
   */
  private static async saveLockerAndErc20Details(params: NewLockerParams) {
    /// Checking if any ERC20 available
    const address = params.erc20;
    const erc20 = await ERC20Services.findERC20ByAddress({
      address,
    });

    /// Incase of no entry found for that token address.
    if (!erc20) {
      /// Grabbing ERC20 details
      const erc20Contract = new Contract(address, erc20Abi, blockchainProvider);
      const [name, symbol, decimals, totalSupply] =
        await Promise.all<ERC20Details>([
          erc20Contract.name(),
          erc20Contract.symbol(),
          erc20Contract.decimals(),
          erc20Contract.totalSupply(),
        ]);

      /// Saving into ERC20 table
      await ERC20Services.createNewERC20({
        name,
        symbol,
        address,
        decimals,
        totalSupply: totalSupply.toString(),
      });
    }

    /// Saving Locker details into database.
    await LockerServices.createNewLocker(params);
  }
}
