import { ethers } from "ethers"

const contractAddress = "0x65f2001c4353150d67f8a4d2b615ae4ace0f9404"
const contractAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tutor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "feedback",
        type: "string",
      },
    ],
    name: "FeedbackLeft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tutor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tutor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "SessionScheduled",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "address",
        name: "tutor",
        type: "address",
      },
    ],
    name: "getSession",
    outputs: [
      {
        internalType: "uint256",
        name: "scheduledTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isPaid",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedback",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tutor",
        type: "address",
      },
      {
        internalType: "string",
        name: "feedback",
        type: "string",
      },
    ],
    name: "leaveFeedback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tutor",
        type: "address",
      },
    ],
    name: "makePayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tutor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "scheduleTutoring",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "sessions",
    outputs: [
      {
        internalType: "uint256",
        name: "scheduledTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isPaid",
        type: "bool",
      },
      {
        internalType: "string",
        name: "feedback",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// EDU Chain Testnet configuration
const eduChainConfig = {
  chainId: "0xa045c", // 656476 in decimal
  chainName: "EDU Chain Testnet",
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18,
  },
  rpcUrls: ["https://open-campus-codex-sepolia.drpc.org", "https://rpc.open-campus-codex.gelato.digital"],
  blockExplorerUrls: ["https://testnet.eduscan.io"],
}

// Helper function to handle wallet errors
const handleWalletError = (error) => {
  if (error.code === 4001) {
    return "Please connect your wallet to continue."
  }
  if (error.code === -32002) {
    return "Please check MetaMask for pending actions."
  }
  if (error.data) {
    return error.data.message
  }
  return error.message || "An unknown error occurred"
}

export const setupNetwork = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask!")
  }

  try {
    // Try to switch to the EDU Chain network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: eduChainConfig.chainId }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [eduChainConfig],
        })
      } catch (addError) {
        throw new Error("Failed to add EDU Chain to your wallet: " + handleWalletError(addError))
      }
    } else {
      throw new Error("Failed to switch to EDU Chain: " + handleWalletError(switchError))
    }
  }
}

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this feature")
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)

    // Verify the contract exists
    const code = await provider.getCode(contractAddress)
    if (code === "0x") {
      throw new Error("Contract not found at the specified address")
    }

    return contract
  } catch (error) {
    console.error("Error getting contract:", error)

    // Handle specific error cases
    if (error.code === "CALL_EXCEPTION") {
      if (error.reason) {
        throw new Error(`Contract error: ${error.reason}`)
      } else {
        throw new Error("Transaction failed. Please check your wallet has sufficient EDU tokens and try again.")
      }
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR") {
      throw new Error("Network error. Please check your connection to EDU Chain Testnet.")
    }

    // Handle user rejected errors
    if (error.code === "ACTION_REJECTED") {
      throw new Error("Transaction was rejected by user.")
    }

    // Handle other errors
    throw new Error(error.message || "Failed to interact with the contract")
  }
}

export const setupContractEvents = (contract, callbacks = {}) => {
  if (!contract) return

  try {
    contract.on("SessionScheduled", (student, tutor, time, event) => {
      console.log("Session Scheduled:", { student, tutor, time: new Date(Number(time) * 1000).toLocaleString() })
      callbacks.onSessionScheduled?.(student, tutor, time, event)
    })

    contract.on("PaymentMade", (student, tutor, amount, event) => {
      console.log("Payment Made:", { student, tutor, amount: ethers.formatEther(amount) + " EDU" })
      callbacks.onPaymentMade?.(student, tutor, amount, event)
    })

    contract.on("FeedbackLeft", (student, tutor, feedback, event) => {
      console.log("Feedback Left:", { student, tutor, feedback })
      callbacks.onFeedbackLeft?.(student, tutor, feedback, event)
    })

    // Return cleanup function
    return () => {
      contract.removeAllListeners()
    }
  } catch (error) {
    console.error("Error setting up event listeners:", error)
    throw new Error("Failed to setup event listeners: " + handleWalletError(error))
  }
}

export const getSessionDetails = async (contract, studentAddress, tutorAddress) => {
  try {
    const session = await contract.getSession(studentAddress, tutorAddress)
    return {
      scheduledTime: new Date(Number(session.scheduledTime) * 1000),
      payment: ethers.formatEther(session.payment) + " EDU",
      isPaid: session.isPaid,
      feedback: session.feedback,
    }
  } catch (error) {
    console.error("Error fetching session details:", error)
    throw new Error("Failed to get session details: " + handleWalletError(error))
  }
}

export const formatContractError = (error) => {
  if (error.code === "CALL_EXCEPTION") {
    return "Transaction failed. Please check your wallet has sufficient EDU tokens and try again."
  }

  if (error.code === "NETWORK_ERROR") {
    return "Network error. Please check your connection to EDU Chain Testnet."
  }

  if (error.code === "ACTION_REJECTED") {
    return "Transaction was rejected."
  }

  if (error.reason) {
    return `Error: ${error.reason}`
  }

  return error.message || "An unexpected error occurred"
}

