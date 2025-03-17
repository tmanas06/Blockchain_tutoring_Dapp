"use client"

import { useState } from "react"
import { Calendar, Clock, DollarSign, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContract, formatContractError, setupNetwork } from "@/lib/contract"
import { ethers } from "ethers"

export default function PaymentPage() {
  const [tutorAddress, setTutorAddress] = useState("")
  const [sessionDate, setSessionDate] = useState("")
  const [sessionTime, setSessionTime] = useState("")
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleConnectWallet = async () => {
    try {
      await setupNetwork()
      setSuccess("Successfully connected to EDU Chain")
    } catch (error) {
      setError(error.message || "Failed to connect to EDU Chain")
    }
  }

  const scheduleTutoring = async () => {
    if (!tutorAddress || !sessionDate || !sessionTime) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await setupNetwork()
      const contract = await getContract()

      // Convert date and time to timestamp
      const dateTime = new Date(`${sessionDate}T${sessionTime}`)
      const timestamp = Math.floor(dateTime.getTime() / 1000)

      const tx = await contract.scheduleTutoring(tutorAddress, timestamp)
      await tx.wait()

      setSuccess("Tutoring session scheduled successfully!")
      console.log("Tutoring scheduled successfully")
    } catch (error) {
      console.error("Error scheduling tutoring:", error)
      setError(formatContractError(error))
    } finally {
      setLoading(false)
    }
  }

  const makePayment = async () => {
    if (!tutorAddress) {
      setError("Please enter tutor address")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await setupNetwork()
      const contract = await getContract()

      const tx = await contract.makePayment(tutorAddress, {
        value: ethers.parseEther("0.001"), // Pay 0.001 EDU
      })
      await tx.wait()

      setSuccess("Payment made successfully!")
      console.log("Payment made successfully")
    } catch (error) {
      console.error("Error making payment:", error)
      setError(formatContractError(error))
    } finally {
      setLoading(false)
    }
  }

  const leaveFeedback = async () => {
    if (!tutorAddress || !feedback) {
      setError("Please enter tutor address and feedback")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await setupNetwork()
      const contract = await getContract()

      const tx = await contract.leaveFeedback(tutorAddress, feedback)
      await tx.wait()

      setSuccess("Feedback submitted successfully!")
      console.log("Feedback left successfully")
      setFeedback("")
    } catch (error) {
      console.error("Error leaving feedback:", error)
      setError(formatContractError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Tutoring Sessions</h1>
          <p className="text-muted-foreground text-lg">
            Schedule, pay for, and provide feedback on your blockchain tutoring sessions
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect to EDU Chain</CardTitle>
            <CardDescription>
              Before proceeding, make sure your wallet is connected to EDU Chain testnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnectWallet} className="w-full">
              Connect to EDU Chain
            </Button>
          </CardContent>
        </Card>

        {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6">{error}</div>}

        {success && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Tutoring Session</CardTitle>
                <CardDescription>Book a one-on-one session with a blockchain expert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tutor-address">Tutor Address</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input
                      id="tutor-address"
                      placeholder="0x..."
                      value={tutorAddress}
                      onChange={(e) => setTutorAddress(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-date">Date</Label>
                    <div className="flex">
                      <Calendar className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="session-date"
                        type="date"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-time">Time</Label>
                    <div className="flex">
                      <Clock className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="session-time"
                        type="time"
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={scheduleTutoring} disabled={loading} className="w-full">
                  {loading ? "Processing..." : "Schedule Session"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Pay for your scheduled tutoring session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-tutor-address">Tutor Address</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input
                      id="payment-tutor-address"
                      placeholder="0x..."
                      value={tutorAddress}
                      onChange={(e) => setTutorAddress(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span>Session Fee</span>
                    </div>
                    <span className="font-medium">0.001 EDU</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={makePayment} disabled={loading} className="w-full">
                  {loading ? "Processing..." : "Pay 0.001 EDU"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Leave Feedback</CardTitle>
                <CardDescription>Share your experience with your tutor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-tutor-address">Tutor Address</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input
                      id="feedback-tutor-address"
                      placeholder="0x..."
                      value={tutorAddress}
                      onChange={(e) => setTutorAddress(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-text">Your Feedback</Label>
                  <textarea
                    id="feedback-text"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Share your experience with this tutor..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={leaveFeedback} disabled={loading} className="w-full">
                  {loading ? "Processing..." : "Submit Feedback"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

