# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Runtime
- Node.js v23.11.0
- pnpm (preferred package manager)
- macOS (darwin 25.3.0), Apple Silicon

## External Dependencies
- No databases required
- No external APIs required
- Unsplash images used via direct URLs (no API key needed)
- E-commerce backend (Shopify or custom) to be integrated later by another developer

## Notes
- No `.env` file needed for the frontend build
- All data is hardcoded in `src/lib/constants.ts` for easy backend swap later
- Forms submit to console.log (no backend endpoints yet)
