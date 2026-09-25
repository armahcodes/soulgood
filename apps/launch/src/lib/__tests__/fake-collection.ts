/**
 * A tiny in-memory stand-in for a MongoDB collection, supporting the operators
 * our modules use ($set, $setOnInsert, $addToSet, $unset, $gt, array contains).
 */
type Doc = Record<string, unknown> & { _id: string };

function matches(doc: Doc, filter: Record<string, unknown>): boolean {
  return Object.entries(filter).every(([key, condition]) => {
    const value = doc[key];
    if (condition && typeof condition === "object" && !Array.isArray(condition) && !(condition instanceof Date)) {
      const ops = condition as Record<string, unknown>;
      if ("$gt" in ops) return value instanceof Date && ops.$gt instanceof Date ? value > ops.$gt : (value as number) > (ops.$gt as number);
      return false;
    }
    if (Array.isArray(value)) return value.includes(condition);
    return value === condition;
  });
}

function apply(doc: Doc, update: Record<string, Record<string, unknown>>, inserting: boolean): Doc {
  const next: Doc = { ...doc };
  Object.assign(next, update.$set ?? {});
  if (inserting) Object.assign(next, update.$setOnInsert ?? {});
  for (const [key, value] of Object.entries(update.$addToSet ?? {})) {
    const list = Array.isArray(next[key]) ? [...(next[key] as unknown[])] : [];
    if (!list.includes(value)) list.push(value);
    next[key] = list;
  }
  for (const key of Object.keys(update.$unset ?? {})) delete next[key];
  return next;
}

export function fakeCollection() {
  const docs = new Map<string, Doc>();
  const find = (filter: Record<string, unknown>) => [...docs.values()].find((doc) => matches(doc, filter)) ?? null;
  return {
    docs,
    async findOne(filter: Record<string, unknown>) {
      return find(filter);
    },
    async insertOne(doc: Doc) {
      if (docs.has(doc._id)) throw Object.assign(new Error("duplicate key"), { code: 11000 });
      docs.set(doc._id, doc);
      return { insertedId: doc._id };
    },
    async updateOne(filter: Record<string, unknown>, update: Record<string, Record<string, unknown>>, options: { upsert?: boolean } = {}) {
      const existing = find(filter);
      if (existing) docs.set(existing._id, apply(existing, update, false));
      else if (options.upsert) {
        const base = { ...(filter as Doc) };
        docs.set(base._id, apply(base, update, true));
      }
      return { matchedCount: existing ? 1 : 0 };
    },
    async findOneAndUpdate(filter: Record<string, unknown>, update: Record<string, Record<string, unknown>>, options: { upsert?: boolean } = {}) {
      const existing = find(filter);
      if (!existing && !options.upsert) return null;
      const next = apply(existing ?? ({ ...(filter as Doc) }), update, !existing);
      docs.set(next._id, next);
      return next;
    },
  };
}
