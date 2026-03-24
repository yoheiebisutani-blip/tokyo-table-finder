"use client";

import { useState } from "react";
import { getMessages } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function MessagesPage() {
  const messages = getMessages();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-light-100 mb-4">My Messages</h1>
        <p className="text-light-300 mb-6">No messages yet. Find a restaurant and generate your first booking message!</p>
        <Link href="/search">
          <Button>Find Restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-6">My Messages</h1>

      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-light-100">{msg.restaurant_name}</h3>
                <p className="text-sm text-light-300 mt-1">
                  {msg.reservation_date} at {msg.reservation_time} · {msg.party_size} {msg.party_size === 1 ? "person" : "people"}
                </p>
              </div>
              <span className="text-light-300 text-sm shrink-0">{expandedId === msg.id ? "▲" : "▼"}</span>
            </div>

            {expandedId === msg.id && (
              <div className="mt-4 pt-4 border-t border-dark-600 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                <div>
                  <h4 className="text-sm font-medium text-light-300 mb-2">Japanese Message</h4>
                  <pre className="whitespace-pre-wrap text-light-100 text-sm font-sans bg-dark-700 rounded-lg p-3 leading-relaxed">
                    {msg.message_ja}
                  </pre>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => copyToClipboard(msg.message_ja, msg.id + "-ja")}
                  >
                    {copiedId === msg.id + "-ja" ? "Copied!" : "Copy Japanese"}
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-light-300 mb-2">English Translation</h4>
                  <pre className="whitespace-pre-wrap text-light-300 text-sm font-sans bg-dark-700/50 rounded-lg p-3 leading-relaxed">
                    {msg.message_en}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => copyToClipboard(msg.message_en, msg.id + "-en")}
                  >
                    {copiedId === msg.id + "-en" ? "Copied!" : "Copy English"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
