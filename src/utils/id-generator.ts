import cuid from "cuid"

export function generateId(): string {
  return cuid()
}
