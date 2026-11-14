---
status: accepted
date: 2026-11-10
---

# Synchronous generate with a Refund on failure, no job table

`POST /api/generate` lasts as long as the AI call. Every failure after the Charge gives the Credits back within the same request, using the keep-alive window on Workers, and the browser hears "refunded" only when the Refund was really written. There is no polling and no job table.

## Why

A job table would need a queue, a worker, polling and a way to refund jobs that die unseen. That is more places to lose a User's money. Room photos and Designs must also stay in memory (never stored), which a job table would break.

## Considered options

- **Job table with polling:** rejected for the reasons above.
- **Charge only after success:** rejected; it lets a User start Designs they cannot pay for.
