export function BowlIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2.5rem] bg-clay">
      <svg
        viewBox="0 0 560 560"
        role="img"
        aria-label="An illustrated Soul Bowl with grains, greens, and roasted vegetables"
        className="h-full w-full"
      >
        <circle cx="280" cy="270" r="218" fill="#F3C96B" />
        <path d="M72 165C128 88 221 51 316 62" fill="none" stroke="#F8F3EC" strokeWidth="3" opacity="0.65" />
        <path d="M434 115C492 173 514 249 498 329" fill="none" stroke="#F8F3EC" strokeWidth="3" opacity="0.65" />

        <ellipse cx="280" cy="285" rx="187" ry="74" fill="#F8F3EC" />
        <ellipse cx="280" cy="282" rx="169" ry="59" fill="#ECD6BC" />

        <g fill="#F8F3EC">
          <circle cx="241" cy="268" r="28" />
          <circle cx="284" cy="252" r="31" />
          <circle cx="324" cy="272" r="29" />
          <circle cx="274" cy="294" r="28" />
        </g>
        <g fill="#C17A5E">
          <circle cx="184" cy="273" r="29" />
          <circle cx="210" cy="241" r="24" />
          <circle cx="367" cy="253" r="27" />
          <circle cx="397" cy="283" r="25" />
        </g>
        <g fill="#77916F">
          <path d="M138 275C129 227 166 207 211 229C197 266 171 282 138 275Z" />
          <path d="M390 228C430 209 458 235 449 278C414 282 390 262 390 228Z" />
          <path d="M335 222C351 184 389 185 407 220C387 244 359 244 335 222Z" />
        </g>
        <g fill="#2C3A34">
          <circle cx="227" cy="278" r="5" />
          <circle cx="253" cy="239" r="5" />
          <circle cx="301" cy="278" r="5" />
          <circle cx="347" cy="264" r="5" />
        </g>

        <path d="M93 286H467C454 408 378 488 280 488S106 408 93 286Z" fill="#2C3A34" />
        <path d="M93 286H467" stroke="#F8F3EC" strokeWidth="5" strokeLinecap="round" />
        <text x="280" y="382" textAnchor="middle" fill="#F8F3EC" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" letterSpacing="4">
          SOUL BOWLS™
        </text>
        <text x="280" y="417" textAnchor="middle" fill="#F8F3EC" fontFamily="Arial, sans-serif" fontSize="15" letterSpacing="3" opacity="0.72">
          FIVE FOR $55
        </text>
      </svg>

      <div className="absolute right-5 bottom-5 rounded-full bg-oat px-4 py-2 text-xs font-bold tracking-[0.16em] text-forest uppercase shadow-sm">
        Delivered Sunday
      </div>
    </div>
  );
}
