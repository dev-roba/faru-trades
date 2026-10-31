"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { timeOf } from "@/lib/format";

export default function Chat({ withId }: { withId: string }) {
  const { s, send, nameOf } = useStore();
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const thread = s.messages.filter((m) => (m.from === s.actingAs && m.to === withId) || (m.from === withId && m.to === s.actingAs));
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [thread.length]);

  return (
    <div className="panel chat" id="chat">
      <h2>Chat with {nameOf(withId)}</h2>
      <div className="msgs" aria-live="polite">
        {thread.length === 0 && <p className="empty">No messages yet. Describe what you need and agree the price before ordering.</p>}
        {thread.map((m) => (
          <div key={m.id} style={{ display: "contents" }}>
            <div className={`bub ${m.from === s.actingAs ? "me" : ""}`}>{m.text}<time>{timeOf(m.at)}</time></div>
            {m.warn && <div className="warnbar" role="alert">Heads up: deals made outside Faru Trades are at your own risk. Escrow protection only covers orders paid here.</div>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form className="compose" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send(withId, text.trim()); setText(""); } }}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" aria-label="Message" />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}
