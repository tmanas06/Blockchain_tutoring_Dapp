"use client";

import * as React from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const initialCourses = [
  {
    id: "blockchain-basics",
    title: "Blockchain Fundamentals",
    description: "Learn the core concepts of blockchain technology",
    modules: [
      { 
        title: "What is Blockchain?", 
        completed: false,
        content: "Blockchain is a decentralized, distributed digital ledger that records transactions across a network of computers. Each block contains transaction data and is linked to previous blocks, forming a chain.",
        liveLink: "https://www.youtube.com/watch?v=yubzJw0uiE4" // Add live link for each module
      },
      { 
        title: "Decentralization and Consensus", 
        completed: false,
        content: "Decentralization removes the need for a central authority, while consensus mechanisms ensure agreement among network participants about the state of the blockchain.",
        liveLink: "https://www.youtube.com/watch?v=M3RYFJsLC_A"
      },
      { 
        title: "Cryptography Basics", 
        completed: false,
        content: "Cryptography secures blockchain networks through public-private key pairs, digital signatures, and hash functions.",
        liveLink: "https://www.youtube.com/watch?v=GQvu49c0ZZc"
      },
      { 
        title: "Blockchain Architecture", 
        completed: false,
        content: "Blockchain architecture consists of nodes, blocks, transactions, and the consensus mechanism working together to maintain the network.",
        liveLink: "https://www.youtube.com/watch?v=sTFZras-1Lo"
      },
    ],
    progress: 0,
    currentModule: 0,
  },
  // Add more courses here...
];

export default function AboutPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setCourses(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('courseProgress', JSON.stringify(courses));
  }, [courses]);

  const calculateProgress = (modules: any[]) => {
    const completedModules = modules.filter(module => module.completed).length;
    return Math.round((completedModules / modules.length) * 100);
  };

  const toggleModuleCompletion = (courseId: string, moduleIndex: number) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedModules = [...course.modules];
          updatedModules[moduleIndex] = {
            ...updatedModules[moduleIndex],
            completed: !updatedModules[moduleIndex].completed
          };
          return {
            ...course,
            modules: updatedModules,
            progress: calculateProgress(updatedModules)
          };
        }
        return course;
      });
    });
  };

  const startCourse = (courseId: string) => {
    setActiveCourse(courseId);
    setShowLesson(true);
  };

  const nextModule = (courseId: string) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          const currentModule = course.currentModule;
          const nextModule = currentModule + 1;
          if (nextModule < course.modules.length) {
            const updatedModules = course.modules.map((module, index) => 
              index === currentModule ? { ...module, completed: true } : module
            );
            
            const newProgress = calculateProgress(updatedModules);
            
            return {
              ...course,
              currentModule: nextModule,
              modules: updatedModules,
              progress: newProgress
            };
          }
        }
        return course;
      });
    });
  };

  const getCurrentModule = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.modules[course.currentModule] : null;
  };

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
                  {!activeCourse && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startCourse(course.id)}
                    >
                      Start Course
                    </Button>
                  )}
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
                {activeCourse === course.id && showLesson ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{getCurrentModule(course.id)?.title}</h3>
                      <p className="text-muted-foreground">{getCurrentModule(course.id)?.content}</p>
                      <a 
                        href={getCurrentModule(course.id)?.liveLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        View Live Lesson
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowLesson(false)}
                      >
                        Back to Modules
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => nextModule(course.id)}
                        disabled={course.currentModule === course.modules.length - 1}
                      >
                        Next Module
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module, index) => (
                      <AccordionItem key={index} value={`module-${index}`}>
                        <AccordionTrigger className="py-3">
                          <div className="flex items-center gap-2 text-left">
                            {module.completed ? (
                              <CheckCircle 
                                className="h-5 w-5 text-green-500 flex-shrink-0 cursor-pointer hover:text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleModuleCompletion(course.id, index)
                                }}
                              />
                            ) : (
                              <div 
                                className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-primary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleModuleCompletion(course.id, index)
                                }}
                              >
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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setActiveCourse(course.id)
                                  setShowLesson(true)
                                }}
                              >
                                View Lesson
                              </Button>
                              <a 
                                href={module.liveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600"
                              >
                                View Live Lesson
                              </a>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
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
  );
};