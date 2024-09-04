/** @notice Exports Secura contract events */
export const securaContractEventAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "lockId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isUnlocked",
            type: "bool",
          },
          {
            internalType: "address",
            name: "lockOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "lockedERC20",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "lockedAmount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "lockName",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "lockedOn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockUnlockOn",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Locker",
        name: "lockerDetails",
        type: "tuple",
      },
    ],
    name: "SecureLockCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockBlock",
        type: "uint256",
      },
    ],
    name: "SecureLockExtended",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockBlock",
        type: "uint256",
      },
    ],
    name: "SecureLockUnlocked",
    type: "event",
  },
] as const;
