# Portfolio — Omari Harry

Working software for UK apprenticeship funding and delivery. Every app here is a
single self-contained HTML file: no build step, no framework, no server. Open one
and it runs.

The through-line is **numbers you can check**. These tools tell employers what
training will cost them, and a figure that is merely plausible is worthless — so
the work is built to be audited rather than trusted.

---

## What that means in practice

**A golden-case suite, run inside the app.** 58 cases reproduce gov.uk's own
worked examples to the penny — levy calculation, co-investment at every
age/employer combination, fund expiry, the 80/20 drawdown, projection
arithmetic. Anyone can open the app and run them.

**Every figure explains itself.** Click a number and it shows its arithmetic,
names the funding rule it came from, and gives the date that rule was last
verified against gov.uk.

**One governed source of truth.** Funding constants live in a single JSON file
that every app fetches at runtime and applies over its own defaults. Each
constant carries its gov.uk source URL and verification date. A quarterly
routine re-checks them and stamps the result — *including when nothing has
changed*, because an unstamped "no change" is indistinguishable from nobody
looking.

**That discipline catches real money.** In one pass it found the app was
overstating employer co-investment **five-fold** (charging 25% where the rules
say 5%), still applying a **10% government top-up that had been abolished**, and
treating 22–24 year-olds as chargeable when they had become fully funded. Two of
the test cases were themselves pinning the removed rule — which is why the suite
had stayed green while the number was wrong.

---

## The demos

**[Open the hub](https://acgroup21.github.io/Demo-Hub---Omari-Harry/)** — each one runs in the
page, no download.

| | what it shows |
|---|---|
| **Levy Expiry Clock** | Time-series forecasting with a consequence attached: unused levy now
expires after 12 months instead of 24, so this puts a date and a number on what goes back to the
Treasury. |
| **JD Matcher** | A ranking problem, not a lookup — a job description scored against 255
standards, showing which terms matched and by how much. Two earlier scoring approaches were
thrown away before this one worked. |
| **What can you claim?** | A governed rules engine: every grant and incentive for one hire,
each with its condition and its gov.uk source. It reads the rulebook live rather than hardcoding
figures, so when a rule changed it corrected itself. |

All three run on one shared `engine.js`, left as a separate file on purpose — one engine behind
three apps is the architecture, and inlining it would hide it.

The full calculator they were cut from is in [`apps/fundable.html`](apps/fundable.html), along
with the apprentice tracker, the KSB document builder and a UX study. Fundable is where the
58-case suite and the per-figure provenance actually live.

## Notes on the demos

**All data is invented.** Northwind Group and Contoso Training are fictional
companies. No real employer, learner or provider appears anywhere in this
repository.

**Client work is not published here.** Several of these tools run live for named
organisations. Those instances, their branding and their data stay private; what
is shown is the engine with a demo configuration.

---

## Stack

Vanilla JavaScript, HTML and CSS. No dependencies beyond what is vendored in the
file. Deployed as static pages. The constraint is deliberate — these go to small
employers and training providers who need a link that works, not an install.
