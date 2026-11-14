---
status: accepted
date: 2026-11-10
---

# The webhook intake unifies verification only, not the duplicate rules

One receive function per provider reads the raw body, verifies the signature and returns either a verified, typed event or a ready rejection response. The duplicate rules stay in each route: Stripe checks Redis and relies on SQL; Clerk relies on idempotent handlers.

## Why

The providers' duplicate rules differ. A shared flow for both would be shallow, or would change behaviour that Stripe and Clerk already depend on. Stripe verification must stay asynchronous, because the sync check broke every purchase on Workers.

## Considered options

- **One shared webhook flow:** rejected; it would hide the differing duplicate rules or change them. Do not propose it again while the rules differ.
- **One generic verifier taking the provider as a parameter:** rejected; Stripe and Clerk verify in different ways, so the parameter would only hide a branch.
