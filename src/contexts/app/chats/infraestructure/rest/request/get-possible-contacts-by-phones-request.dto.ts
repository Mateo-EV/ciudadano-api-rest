import z from "zod"

export const getPossibleContactsByPhonesRequestSchema = z
  .string()
  .transform(val =>
    val
      .split(",")
      .map(phone =>
        phone.startsWith("51") ? phone.substring(2).trim() : phone.trim()
      )
  )
  .transform(phones => Array.from(new Set(phones)))
