"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Check, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setupNetwork } from "@/lib/contract"
import { ethers } from "ethers"

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/placeholder.svg?height=48&width=48",
    description: "Connect to your MetaMask wallet",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "/placeholder.svg?height=48&width=48",
    description: "Connect to your Phantom wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "/placeholder.svg?height=48&width=48",
    description: "Connect using WalletConnect",
  },
]

export default function WalletPage() {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [network, setNetwork] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setAddress(accounts[0].address)
          updateWalletInfo(provider)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const updateWalletInfo = async (provider) => {
    try {
      const network = await provider.getNetwork()
      setNetwork(network.name)

      if (address) {
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance).substring(0, 7) + " ETH")
      }
    } catch (error) {
      console.error("Error updating wallet info:", error)
    }
  }

  const connectWallet = async (walletId) => {
    setError("")
    setConnecting(true)

    try {
      if (!window.ethereum && walletId === "metamask") {
        window.open("https://metamask.io/download/", "_blank")
        setError("Please install MetaMask to continue")
        return
      }

      if (walletId === "phantom") {
        window.open("https://phantom.app/download", "_blank")
        setError("Please install Phantom to continue")
        return
      }

      await setupNetwork()
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setAddress(accounts[0])
        updateWalletInfo(provider)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError(error.message || "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress("")
    setBalance("")
    setNetwork("")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return ""
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Wallet Connection</h1>
          <p className="text-muted-foreground">Connect your wallet to interact with the EDU Chain testnet</p>
        </div>

        {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6">{error}</div>}

        {!address ? (
          <div className="grid gap-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border">
                      <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} width={48} height={48} />
                    </div>
                    <div>
                      <CardTitle>{wallet.name}</CardTitle>
                      <CardDescription>{wallet.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button onClick={() => connectWallet(wallet.id)} disabled={connecting} className="w-full">
                    {connecting ? "Connecting..." : "Connect"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallet</CardTitle>
              <CardDescription>Your wallet is connected to {network || "EDU Chain Testnet"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-xs text-muted-foreground">{formatAddress(address)}</p>
                </div>
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Balance</p>
                  <p className="text-xs text-muted-foreground">{balance || "Loading..."}</p>
                </div>
                <a href={`https://testnet.eduscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={disconnectWallet} variant="destructive" className="w-full">
                Disconnect Wallet
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

