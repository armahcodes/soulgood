/** Configuration sanity check, not an entropy estimate. Generate secrets randomly. */
export function hasStrongSecret(value: string | undefined): value is string {
  return Boolean(
    value &&
    value.length >= 32 &&
    !/placeholder|change.?me|replace.?me|example|better-auth-secret|your.?secret/i.test(
      value,
    ),
  );
}
