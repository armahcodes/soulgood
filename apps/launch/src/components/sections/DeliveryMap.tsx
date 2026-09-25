import { DELIVERY_MAP } from "@/lib/geo/delivery-map";
import { EAT_NOW } from "@/lib/ordering";
import { SERVICE_AREA } from "@/lib/brand";
import { cn } from "@/lib/utils";

const { width, height, projection, kitchen, onDemandRadius, counties } = DELIVERY_MAP;

function point(lon: number, lat: number) {
  return {
    x: (lon - projection.west) * projection.cosLat * projection.scale,
    y: (projection.north - lat) * projection.scale,
  };
}

const NEIGHBORS = ["ventura", "kern", "sanBernardino", "riverside", "sanDiego"] as const;

const LABELS = [
  { text: "LOS ANGELES", sub: "COUNTY", ...point(-118.12, 34.25) },
  { text: "ORANGE", sub: "COUNTY", ...point(-117.7, 33.7) },
];

const OCEAN = point(-118.62, 33.6);
/** Frame: the LA basin and Orange County (northern LA County continues above). */
const VIEW = { x: 110, y: 300, width: 890, height: 740 };

/**
 * Service-area map drawn from U.S. Census county boundaries: weekly Sunday
 * delivery across Los Angeles and Orange County, and the on-demand radius
 * around the Long Beach kitchen. Pure SVG — no third-party map scripts.
 */
export function DeliveryMap({ className }: { className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-lg border border-forest/12 bg-card", className)}>
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-labelledby="delivery-map-title delivery-map-desc"
        className="block h-auto w-full"
      >
        <title id="delivery-map-title">Soul Good delivery areas</title>
        <desc id="delivery-map-desc">
          Weekly Sunday delivery covers {SERVICE_AREA.weekly}. On-demand delivery covers about{" "}
          {EAT_NOW.radiusMiles} miles around our {SERVICE_AREA.kitchen} kitchen.
        </desc>
        <defs>
          <pattern id="map-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" className="stroke-sage/25" strokeWidth="3" />
          </pattern>
        </defs>

        <rect x="0" y="0" width={width} height={height} className="fill-[#e7ece3]" />

        <g className="fill-oat stroke-forest/15" strokeWidth="1.5" strokeLinejoin="round">
          {NEIGHBORS.map((key) => (
            <path key={key} d={counties[key]} />
          ))}
        </g>

        <g strokeWidth="2" strokeLinejoin="round">
          <path d={counties.losAngeles} className="fill-sage/30 stroke-sage" />
          <path d={counties.orange} className="fill-sage/30 stroke-sage" />
          <path d={counties.losAngeles} fill="url(#map-hatch)" />
          <path d={counties.orange} fill="url(#map-hatch)" />
        </g>

        <circle
          cx={kitchen.x}
          cy={kitchen.y}
          r={onDemandRadius}
          className="fill-clay/14 stroke-clay"
          strokeWidth="3"
          strokeDasharray="10 8"
        />

        <g className="fill-forest/70" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" letterSpacing="4" textAnchor="middle">
          {LABELS.map((label) => (
            <text key={label.text} x={label.x} y={label.y} fontSize="24">
              {label.text}
              <tspan x={label.x} dy="28" fontSize="18" className="fill-forest/55">
                {label.sub}
              </tspan>
            </text>
          ))}
          <text x={kitchen.x} y={kitchen.y - onDemandRadius - 12} fontSize="18" letterSpacing="2" className="fill-clay">
            {EAT_NOW.radiusMiles} MI
          </text>
          <text x={OCEAN.x} y={OCEAN.y} fontSize="20" fontStyle="italic" fontWeight="400" letterSpacing="3" className="fill-forest/40">
            Pacific Ocean
          </text>
        </g>

        <g>
          <circle cx={kitchen.x} cy={kitchen.y} r="22" className="fill-clay/25" />
          <circle cx={kitchen.x} cy={kitchen.y} r="11" className="fill-forest stroke-oat" strokeWidth="4" />
          <rect x={kitchen.x - 128} y={kitchen.y + 30} width="256" height="42" rx="8" className="fill-forest" />
          <text x={kitchen.x} y={kitchen.y + 58} fontSize="19" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" className="fill-oat">
            Our Long Beach kitchen
          </text>
        </g>
      </svg>

      <figcaption className="grid gap-3 border-t border-forest/10 p-4 text-sm sm:grid-cols-2 sm:p-5">
        <span className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-sm border-2 border-sage bg-sage/30" />
          <span>
            <strong className="block text-forest">Weekly delivery · Sundays</strong>
            <span className="text-forest/72">Anywhere in {SERVICE_AREA.weekly}</span>
          </span>
        </span>
        <span className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-dashed border-clay bg-clay/15" />
          <span>
            <strong className="block text-forest">On demand · {EAT_NOW.days}</strong>
            <span className="text-forest/72">About {EAT_NOW.radiusMiles} miles from our {SERVICE_AREA.kitchen} kitchen</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
