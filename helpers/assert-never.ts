export function assertNever(value: never, errorMessage?: string) {
  throw new Error(errorMessage ?? `${value} should be handled correctly.`);
}