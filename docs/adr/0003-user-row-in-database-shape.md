---
status: accepted
date: 2026-11-10
---

# The user row travels in its database shape (snake_case)

`IUser` describes the real database row, in snake_case, and that row is passed on unchanged. It is not converted to camelCase.

## Why

The same row reaches the browser as JSON. Converting it would change that JSON and could break the header and the generate screen, which read it today.

## Considered options

- **Convert to camelCase at the database edge:** rejected; it is a behaviour change to the browser contract for no customer benefit.
- **Keep `IUser` camelCase while the real row is snake_case:** rejected; the type then lies about the data and the compiler cannot catch a wrong field name.
