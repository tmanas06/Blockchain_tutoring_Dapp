import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

const courses = [
  {
    id: "blockchain-basics",
    title: "Blockchain Fundamentals",
    description: "Learn the core concepts of blockchain technology",
    modules: [
      { title: "What is Blockchain?", completed: true },
      { title: "Decentralization and Consensus", completed: true },
      { title: "Cryptography Basics", completed: false },
      { title: "Blockchain Architecture", completed: false },
    ],
    progress: 50,
  },
  {
    id: "smart-contracts",
    title: "Smart Contract Development",
    description: "Master the art of writing and deploying smart contracts",
    modules: [
      { title: "Introduction to Smart Contracts", completed: false },
      { title: "Solidity Programming Language", completed: false },
      { title: "Testing and Debugging", completed: false },
      { title: "Security Best Practices", completed: false },
    ],
    progress: 0,
  },
  {
    id: "dapp-development",
    title: "Decentralized Application Development",
    description: "Build full-stack dApps with modern frameworks",
    modules: [
      { title: "Web3 Integration", completed: false },
      { title: "Frontend Development for dApps", completed: false },
      { title: "User Authentication with Wallets", completed: false },
      { title: "Deploying and Scaling dApps", completed: false },
    ],
    progress: 0,
  },
  {
    id: "edu-chain",
    title: "EDU Chain Specialization",
    description: "Become an expert in EDU Chain development",
    modules: [
      { title: "EDU Chain Architecture", completed: false },
      { title: "Building on EDU Chain", completed: false },
      { title: "EDU Chain Tools and SDKs", completed: false },
      { title: "Advanced EDU Chain Concepts", completed: false },
    ],
    progress: 0,
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blockchain Learning Resources</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive courses to master blockchain technology and smart contract development
          </p>
        </div>

        <div className="grid gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>{course.title}</CardTitle>
                  <Button variant="outline" size="sm">
                    {course.progress > 0 ? "Continue" : "Start Course"}
                  </Button>
                </div>
                <CardDescription>{course.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index}`}>
                      <AccordionTrigger className="py-3">
                        <div className="flex items-center gap-2 text-left">
                          {module.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">{index + 1}</span>
                            </div>
                          )}
                          <span className={module.completed ? "text-muted-foreground" : ""}>{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-7">
                        <div className="py-2">
                          <p className="text-muted-foreground mb-4">
                            Learn about {module.title.toLowerCase()} through interactive lessons and practical examples.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Lesson
                            </Button>
                            {!module.completed && (
                              <Button size="sm" variant="secondary">
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Ready to put your knowledge into practice?</p>
          <Link href="/payment">
            <Button size="lg">Book a Tutoring Session</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

