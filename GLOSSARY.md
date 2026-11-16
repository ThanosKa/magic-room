# Magic Room

AI interior design web app: a User uploads one Room photo, picks a Room type and a Style, and gets one Design back, paid for with Credits bought in Credit packs.

## Language

**Credit**:
The unit a User spends on one Design.
_Avoid_: token, point

**Balance**:
How many Credits a User has now.
_Avoid_: credits left, wallet

**Credit pack**:
A one-time purchase of Credits (Starter, Growth, Premium).
_Avoid_: package, plan, bundle, subscription

**Quality**:
Quick, Pro or Ultra; it sets a Design's cost and model.
_Avoid_: tier, model

**Design**:
One AI redesign of one Room photo.
_Avoid_: prediction, render, generation (in prose)

**Room photo**:
The photo a User uploads. It is never stored.
_Avoid_: upload, image

**Style**:
The look a User asks for (Japandi, Coastal, and so on).
_Avoid_: theme

**Room type**:
The kind of room (kitchen, bedroom, and so on).
_Avoid_: room, space

**Charge**:
Credits taken for a Design before it is made.
_Avoid_: deduction, debit

**Refund**:
Credits given back when a Design fails after the Charge.
_Avoid_: credit back, reversal

**Purchase grant**:
Credits added once per paid purchase.
_Avoid_: top-up, deposit

**Credit ledger**:
The record of every Balance change (usage, refund, purchase, bonus).
_Avoid_: transactions log, history

**Free sign-up credit**:
The one Credit every new User gets once.
_Avoid_: trial, bonus

**User**:
A person signed in through Clerk, with a Balance.
_Avoid_: customer, member, account (as a code name)
