"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { careerChatbot } from "@/ai/flows/career-chatbot";
import type { CareerChatbotInput, CareerChatbotOutput } from "@/ai/flows/career-chatbot";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  avatar?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatbotInput: CareerChatbotInput = { message: inputValue };
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
            {isLoading && (
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
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
          <Input
            type="text"
            placeholder="Ask about careers, skills, or for motivation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
            <Send className="h-5 w-5 text-accent-foreground" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
