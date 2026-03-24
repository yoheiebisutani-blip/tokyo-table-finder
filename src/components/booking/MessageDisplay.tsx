"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface MessageDisplayProps {
  messageJa: string;
  messageEn: string;
  onSave?: () => void;
}

export default function MessageDisplay({ messageJa, messageEn, onSave }: MessageDisplayProps) {
  const [copiedJa, setCopiedJa] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Japanese message */}
      <div>
        <h3 className="text-sm font-medium text-light-300 mb-2">Japanese Message</h3>
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-light-100 text-base font-sans leading-relaxed">{messageJa}</pre>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="mt-2"
          onClick={() => copyToClipboard(messageJa, setCopiedJa)}
        >
          {copiedJa ? "Copied!" : "Copy Japanese Message"}
        </Button>
      </div>

      {/* English translation */}
      <div>
        <h3 className="text-sm font-medium text-light-300 mb-2">English Translation (Reference)</h3>
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-light-300 text-sm font-sans leading-relaxed">{messageEn}</pre>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => copyToClipboard(messageEn, setCopiedEn)}
        >
          {copiedEn ? "Copied!" : "Copy English Message"}
        </Button>
      </div>

      {onSave && (
        <Button variant="secondary" onClick={onSave} className="w-full">
          Save to My Messages
        </Button>
      )}
    </div>
  );
}
