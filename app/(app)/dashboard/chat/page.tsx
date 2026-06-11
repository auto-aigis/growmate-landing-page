"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { ChatMessage, ChatUsage } from "@/app/_lib/types";
import { Loader2, Send, AlertCircle } from "lucide-react";
import Link from "next/link";

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<ChatUsage | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tier = user?.tier || "free";
  const isPro = tier === "pro" || tier === "plus";

  useEffect(() => {
    async function load() {
      try {
        const [hist, usg] = await Promise.all([
          chatApi.history(),
          isPro ? null : chatApi.usage(),
        ]);
        setMessages(hist);
        if (usg) {
          setUsage(usg);
          setLimitReached(usg.used >= usg.limit);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [isPro]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!isPro && limitReached) return;

    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg, created_at: new Date().toISOString() },
    ]);

    try {
      const assistantMsg = await chatApi.send(userMsg);
      setMessages((prev) => [...prev, assistantMsg]);
      if (!isPro && usage) {
        const newUsage = { used: usage.used + 1, limit: usage.limit };
        setUsage(newUsage);
        setLimitReached(newUsage.used >= newUsage.limit);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Ask Your Grow Coach</h1>
        <p className="text-gray-600">Get personalized advice for your space and goals</p>
      </div>

      {!isPro && usage && (
        <div className={`mb-4 p-3 rounded-lg ${limitReached ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
          <div className="flex items-center justify-between">
            <span className={limitReached ? "text-amber-700" : "text-green-700"}>
              {limitReached
                ? "You've reached your free message limit"
                : `${usage.used} of ${usage.limit} messages used this month`}
            </span>
            {limitReached && (
              <Link href="/pricing">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Upgrade to Pro</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Ask me anything about growing food in your space!</p>
<p className="text-sm mt-2">e.g., &quot;Why are my tomato leaves yellowing?&quot;</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={limitReached ? "Upgrade to send more messages" : "Ask a question..."}
              disabled={loading || limitReached}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading || !input.trim() || limitReached}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}