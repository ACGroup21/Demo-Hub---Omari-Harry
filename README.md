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

### Sandbox — a team of ten, costed

The one I built for this repository rather than extracted from the product. It gives you a
situation instead of a form: you run a team of ten, five of them need developing, *what does
that actually cost you?* You pick your five, choose from ten apprenticeship standards drawn from
the real library of 322 — or paste a job description and let it match — and read the bill.

The first step is deliberately **a choice, not an assessment**. Working out which of your people
has potential is talent mapping; I have not built it, and a demo that faked it would be
advertising a capability that does not exist, which is the one thing a tool about trustworthy
numbers must not do. So the visitor chooses, and every figure downstream runs on the five they
picked. The same honesty governs the final panel: alongside the funded training cost it shows
the **off-the-job time nobody funds** — six hours a week per apprentice, which on most plans is
larger than the training itself. It is the number employers are surprised by, which is exactly
why it is on screen.

### Levy Expiry Clock

A forecasting problem with a consequence attached. Unused apprenticeship levy now expires
**12 months** after it lands, down from 24, so an employer sitting on an untouched account is
losing a month of contributions off the far end every month. Move the pay bill slider and the
loss moves with it: a £25m pay bill puts roughly **£110,000 a year** back with the Treasury.

The useful part is the distinction the tool insists on — an account still building is in a
different position from a mature one, and collapsing the two would make the headline number
wrong for half the people reading it. The expiry window, the levy rate and the £15,000 allowance
are all read from the governed rulebook and shown with their source, not typed into the page.

### JD Matcher

A ranking problem, not a lookup. A pasted job description is scored against **322 standards**,
and the result shows which of your terms it matched and how strongly. Terms are weighted by
**how distinctive they are** — `log(1 + N/df)`, so a word that appears in every standard
contributes almost nothing while a rare one carries the match. Two earlier scoring approaches
were built and thrown away before this one worked; a straight overlap count just returns
whichever standard has the longest vocabulary.

Two decisions matter more than the formula. The index is built from each standard's **published
Knowledge, Skills and Behaviours** rather than its summary, because that is the vocabulary the
role is actually described in — and where KSBs have not been published, the app says the index
is thin instead of quietly scoring it the same. And when nothing clears the bar it reports
**"no good match"** rather than returning its least-bad guess, which is the failure mode that
makes a matcher untrustworthy.

### What can you claim?

A governed rules engine with a plain-English front end. Set the details of one hire — salary,
age, levy status, care leaver, EHC plan, new or existing staff — and it lists **every grant,
incentive and saving**, each with the condition that unlocks it and a link to the gov.uk page
it came from. Levers you do not qualify for stay visible with their condition shown, because
"you get nothing" is a much less useful answer than "you get nothing *because*".

The amounts are not written into the page. Every lever's value comes from the shared engine,
which overlays the canonical rulebook over its own defaults on load — so a corrected rule
reaches this app the next time someone opens it, with no redeploy. This is the clearest small
example of the architecture behind all of these: the apps are views, and the rules live
somewhere they can be versioned, sourced and verified.

### Fundable — the full tool

The calculator the three lite demos were cut from, in
[`apps/fundable.html`](apps/fundable.html): a single 5.1 MB HTML file carrying **35 navigable
functions across ten sections**, from levy forecasting and cohort planning through to a report
builder — press `/` or `Ctrl-K` inside it and the command palette lists all 35, plus five
app-level commands. It is where
the claims at the top of this page are actually demonstrable — **the 58-case golden suite runs
from inside the app** (open it and press the button; it reports 58/58 against gov.uk's published
worked examples), and the per-figure provenance lets you click any number and see its
arithmetic, its governing rule and the date that rule was last checked.

It is included unabridged, warts included, because a tidied-up excerpt would prove less than the
real thing. The three lite demos share one `engine.js`, left as a separate file on purpose — one
engine behind three apps is the architecture, and inlining it would hide it.

## Notes

**A standalone work sample.** These were built in-house for Arthur Curtis Education, a
levy-funded apprenticeship consultancy, and are shown here as examples of my work. The demos
have had their cross-tool navigation, outbound links and email capture removed, so there is
nothing to sign up to and nothing is collected.

**All data is invented.** No real employer, learner or provider appears anywhere in this
repository.

**Client work is not published here.** Several of these tools run live for named organisations.
Those instances, their branding and their data stay private.

**The standards library is partial, and the apps say so.** It carries 8 of the 15 occupational
routes — business, digital, health and science, legal and finance, sales, care, hospitality,
transport and logistics — with **no construction or engineering**. Sandbox prints that in its
header rather than letting a visitor discover it by getting a bad answer.

## Stack

Vanilla JavaScript, HTML and CSS. No dependencies beyond what is vendored in the
file. Deployed as static pages. The constraint is deliberate — these go to small
employers and training providers who need a link that works, not an install.
