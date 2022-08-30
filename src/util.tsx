export function isNotNullable<T>(x: T | null | undefined): x is T {
  return x != null;
}
