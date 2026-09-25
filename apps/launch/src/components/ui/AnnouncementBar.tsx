import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMMUNITY_DRIVE } from "@/lib/community-drive";

/** Site-wide announcement — brand adaptation of 21st.dev cnippet-dev/announcement-banner. */
export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Announcement">
    <Link
      href={COMMUNITY_DRIVE.path}
      className="group flex min-h-11 items-center justify-center gap-x-2 bg-forest px-5 py-2.5 text-center text-[0.8rem] text-oat transition-colors hover:bg-[#25312c]"
    >
      <span className="hidden rounded-sm bg-gold px-1.5 py-0.5 text-[0.6rem] font-medium tracking-[0.16em] text-forest uppercase sm:inline">
        Community
      </span>
      <span>
        <span className="font-bold">{COMMUNITY_DRIVE.name}</span>
        <span aria-hidden="true" className="px-1.5 text-gold">·</span>
        <span>Our October 15 community meal drive</span>
      </span>
      <span className="inline-flex items-center gap-1 font-bold underline decoration-oat/35 underline-offset-4 transition-colors group-hover:decoration-gold">
        <span className="hidden sm:inline">Get involved</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
    </div>
  );
}
