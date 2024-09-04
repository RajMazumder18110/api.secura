/** @notice library imports */
import { and, eq } from "drizzle-orm";
/// External imports
import { database } from "@/clients";
import {
  Locker,
  lockers,
  NewLockerParams,
  UnlockLockerParams,
  UpdateLockerUnlockParams,
} from "@/schemas/lockersTable";

// Lockers table services.
export class LockerServices {
  /**
   * @description Creates a new Locker based on parameters.
   * @param {NewLockerParams} params The Locker details.
   */
  public static async createNewLocker(params: NewLockerParams) {
    await database
      .insert(lockers)
      .values({
        ...params,
        erc20: params.erc20.toLowerCase(),
        owner: params.owner.toLowerCase(),
      })
      .onConflictDoNothing();
  }

  /**
   * @description Updates a Locker unlock block based on parameters.
   * @param {UpdateLockerUnlockParams} params The update Locker details.
   */
  public static async extendLockerUnlockBlock(
    params: UpdateLockerUnlockParams
  ) {
    await database
      .update(lockers)
      .set({
        unlockOn: params.unlockOn,
      })
      .where(
        and(eq(lockers.lockId, params.lockId), eq(lockers.isUnlocked, false))
      );
  }

  /**
   * @description Unlocks a Locker unlock block based on parameters.
   * @param {UnlockLockerParams} params The unlock Locker details.
   */
  public static async unlockLocker(params: UnlockLockerParams) {
    await database
      .update(lockers)
      .set({
        isUnlocked: true,
        unlockOn: params.unlockOn,
      })
      .where(eq(lockers.lockId, params.lockId));
  }

  /**
   * @description Returns a Locker details based on `lockerId`.
   * @param params The lockers id.
   * @return The locker details or undefined if not found.
   */
  public static async findLockerById({
    id,
  }: {
    id: string;
  }): Promise<Locker | undefined> {
    return database.query.lockers.findFirst({
      where: eq(lockers.lockId, id),
    });
  }

  /**
   * @description Returns a Lockers details based on `erc20` token address.
   * @param params The erc20 token address.
   * @return The lockers details.
   */
  public static async findLockersByERC20({
    erc20,
  }: {
    erc20: string;
  }): Promise<Locker[]> {
    return database.query.lockers.findMany({
      where: eq(lockers.erc20, erc20.toLowerCase()),
    });
  }

  /**
   * @description Returns a Lockers details based on `owner` address.
   * @param params The owner address.
   * @return The lockers details.
   */
  public static async findLockersByOwner({
    owner,
  }: {
    owner: string;
  }): Promise<Locker[]> {
    return database.query.lockers.findMany({
      where: eq(lockers.owner, owner.toLowerCase()),
    });
  }
}
