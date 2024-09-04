/** @notice library imports */
import { Contract, WebSocketProvider } from "ethers";
/// External imports
import { BLOCKCHAIN_WSS_URL, SECURA_CONTRACT_ADDRESS } from "@/constants";
import { securaContractEventAbi } from "@/listeners/abis/SecuraEventsAbi";

/// Contract instance
export const blockchainProvider = new WebSocketProvider(BLOCKCHAIN_WSS_URL);
export const securaContract = new Contract(
  SECURA_CONTRACT_ADDRESS,
  securaContractEventAbi,
  blockchainProvider
);
