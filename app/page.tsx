import { ArrowRight, BookOpen, Coins, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="space-y-6 pb-12 pt-10 md:pb-16 md:pt-16 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Learn Blockchain Technology on{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">EDU Chain</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Master blockchain concepts, smart contracts, and decentralized applications with our comprehensive learning
            platform built on EDU Chain testnet.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about">
              <Button size="lg" className="gap-2">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/wallet">
              <Button size="lg" variant="outline" className="gap-2">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6 py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Platform Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Our platform offers a unique learning experience with real blockchain interactions
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Comprehensive Resources</CardTitle>
              <CardDescription>Access a wide range of learning materials on blockchain technology</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                From beginner concepts to advanced topics, our curated resources help you master blockchain development
                at your own pace.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/about" className="text-primary hover:underline">
                Explore Resources
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <GraduationCap className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Tutoring Sessions</CardTitle>
              <CardDescription>Schedule one-on-one sessions with blockchain experts</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                Get personalized guidance from experienced tutors who can help you overcome challenges and accelerate
                your learning.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/payment" className="text-primary hover:underline">
                Book a Session
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <Coins className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Real Blockchain Experience</CardTitle>
              <CardDescription>Practice on EDU Chain testnet with real transactions</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                Gain hands-on experience by interacting with smart contracts on a real blockchain network without the
                risk of using real funds.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/wallet" className="text-primary hover:underline">
                Connect Wallet
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}

