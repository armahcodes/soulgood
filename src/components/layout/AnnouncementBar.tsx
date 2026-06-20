"use client";

import { ANNOUNCEMENT_MESSAGES } from "@/lib/constants";

export function AnnouncementBar() {
  // Duplicate messages for seamless infinite scroll
  const messages = [...ANNOUNCEMENT_MESSAGES, ...ANNOUNCEMENT_MESSAGES];

  return (
    <div className="bg-primary text-white overflow-hidden" role="banner">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {messages.map((message, index) => (
          <span
            key={index}
            className="font-sans text-xs uppercase tracking-[0.08em] font-medium mx-8 inline-block"
          >
            {message}
            <span className="mx-8 inline-block">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
