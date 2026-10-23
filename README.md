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

## The apps

| | |
|---|---|
| **[Apprentice Tracker](apps/apprentice-tracker-demo.html)** | Progress reviews, off-the-job tracking and a cohort dashboard, reconciled against e-portfolio exports (OneFile / Bud). One engine, per-client config. |

*More to follow: the funding calculator, its UX research lab, the KSB document
builder, and the job-description → standard matcher.*

---

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
