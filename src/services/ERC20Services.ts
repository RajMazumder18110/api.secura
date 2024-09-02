/** @notice library imports */
import { eq } from "drizzle-orm";
/// External imports
import { database } from "@/clients";
import { erc20s, NewERC20Params, ERC20 } from "@/schemas/erc20sTable";

// ERC20 table services.
export class ERC20Services {
  /**
   * @description Creates a new ERC20 based on parameters.
   * @param params The ERC20 details.
   */
  public static async createNewERC20(params: NewERC20Params) {
    await database.insert(erc20s).values({
      ...params,
      address: params.address.toLowerCase(),
    });
  }

  /**
   * @description Returns a ERC20 details based on contract address.
   * @param params The ERC20 contract address.
   * @return The ERC20 details or undefined if not found.
   */
  public static async findERC20ByAddress({
    address,
  }: {
    address: string;
  }): Promise<ERC20 | undefined> {
    return database.query.erc20s.findFirst({
      where: eq(erc20s.address, address.toLowerCase()),
    });
  }
}
