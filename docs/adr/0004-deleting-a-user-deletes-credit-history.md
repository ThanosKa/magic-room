---
status: accepted
date: 2026-11-10
---

# Deleting a User deletes that User's credit history

When a User is deleted, that User's `transactions` rows are deleted with them. The cascade from the users table to the transactions table (`ON DELETE CASCADE`, migration 001) stays. Stripe keeps the payment records, so the money trail survives outside the database.

This was asked and decided on 2026-11-10 (question Q9 of the architecture review), so it is not asked again.

## Why

Keeping the history of a deleted User would keep personal data the User asked us to remove, and Stripe already holds the payment records.

## Considered options

- **Keep the credit history after deletion (anonymised or not):** rejected; it needs new rules and a new data store for no current need.

## Reopening

Only a new retention or accounting requirement justifies reopening this.
