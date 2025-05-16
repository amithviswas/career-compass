
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2, FileText, MessageCircle, Search, Brain } from "lucide-react";
import { careerChatbot } from "@/ai/flows/career-chatbot";
import type { CareerChatbotInput, CareerChatbotOutput } from "@/ai/flows/career-chatbot";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  avatar?: string;
}

interface Suggestion {
  text: string; 
  icon?: React.ElementType;
}

interface SuggestionCategory {
  name: string;
  icon: React.ElementType;
  prompts: Suggestion[];
}

const suggestionData: SuggestionCategory[] = [
  {
    name: "General",
    icon: MessageCircle,
    prompts: [
      { text: "What are some in-demand tech skills?" },
      { text: "How can I improve my networking skills?" },
      { text: "Give me some motivation for my job search." },
      { text: "What's the difference between a mentor and a sponsor?" },
    ],
  },
  {
    name: "Resume Help",
    icon: FileText,
    prompts: [
      { text: "How do I tailor my resume for a specific job?" },
      { text: "What are common resume mistakes to avoid?" },
      { text: "Should I include a summary on my resume?" },
      { text: "How to write impactful bullet points?" },
    ],
  },
  {
    name: "Interview Prep",
    icon: Search,
    prompts: [
      { text: "Common behavioral questions for a software engineer?" },
      { text: "How to answer 'Tell me about yourself'?" },
      { text: "Tips for a virtual interview." },
      { text: "Good questions to ask the interviewer?" },
    ],
  },
  {
    name: "Career Guidance",
    icon: Brain,
    prompts: [
      { text: "Should I consider a career change?" },
      { text: "How do I ask for a promotion?" },
      { text: "What are some good certifications for project managers?" },
      { text: "How to deal with job rejection?" },
    ],
  },
];


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<string>(suggestionData[0].name);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const submitMessageToBot = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const chatbotInput: CareerChatbotInput = { message: messageText };
      const response: CareerChatbotOutput = await careerChatbot(chatbotInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const messageToSend = inputValue;
    setInputValue(""); 
    await submitMessageToBot(messageToSend);
  };

  const handleSuggestionClick = async (promptText: string) => {
    if (isLoading) return;
    await submitMessageToBot(promptText);
  };

  const currentPrompts = suggestionData.find(cat => cat.name === activeSuggestionCategory)?.prompts || [];

  return (
    <Card className="w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">AI Career Advisor</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-secondary-foreground rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
               <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md bg-secondary text-secondary-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
               </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4 flex flex-col gap-4">
        <div className="w-full">
          <p className="text-xs font-semibold mb-2 text-muted-foreground">Topic Suggestions:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestionData.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={activeSuggestionCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSuggestionCategory(category.name)}
                  className="text-xs px-3 py-1.5 h-auto"
                  disabled={isLoading}
                >
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
          <ScrollArea className="h-auto max-h-[70px] w-full"> {/* Adjusted max-h */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {currentPrompts.map(prompt => (
                  <Button
                    key={prompt.text}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuggestionClick(prompt.text)}
                    className="text-xs h-auto px-2.5 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground justify-start text-left leading-snug"
                    disabled={isLoading}
                  >
                    {prompt.text}
                  </Button>
                ))}
              </div>
          </ScrollArea>
        </div>

        <form onSubmit={handleFormSubmit} className="flex w-full items-center gap-3">
          <Input
            type="text"
            placeholder="Ask about careers, skills, or for motivation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

