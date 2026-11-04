# Sandbox — Omari Harry

**[Open it](https://acgroup21.github.io/Demo-Hub---Omari-Harry/)** — it runs in the page, nothing to
install. **Built for a desktop screen**: below 1024px the walkthrough doesn't run, and you get a
page explaining why instead of a squeezed version of it.

A retail chain with forty-two stores, 1,340 staff and five years to build its own managers. Seven
stages, each one locked until the last is finished: here is your levy, here is what it actually
buys, choose who to develop, find out what their jobs don't yet evidence, read the report, assign
the cohort, see the five-year pathway. It ends on a recap built from your own run, and a report
you can print.

The employer is invented. **Everything else is real and dated** — the levy arithmetic, the funding
bands, the published duties, and which apprenticeships you can still buy.

---

## The idea behind it

These tools tell employers what training will cost them, and a figure that is merely plausible is
worthless. So the work is built to be **audited rather than trusted**, and that shows up in three
habits.

**Every narrowing shows its working.** When the page puts five apprenticeships in front of you, it
shows how it got there from 322 — funded for new starts, right level, right route, properly indexed
— with live counts that move if the library moves. Nothing in that chain is typed into the page.

**Where a judgement is mine, the page says so, in those words.** The last hop in every filter is
editorial and is coloured differently and labelled. Three of the five options on screen were
removed by the tool's own filters and put back deliberately, and it says which filter removed each
and why they are still there. The classification of which published duties count as "management" is mine,
and the page says that too.

**It judges the jobs, and names which judgement it is making.** It ranks the ten on what their job
descriptions evidence and puts three forward — and the page says *three have been preselected*
rather than letting a shortlist look as though it arrived from nowhere. Who has *potential* is
subjective, and worth a conversation in a real situation where nuance can be considered — for the
purposes of illustration, selection here is limited to definite eligibility. Nobody has to be
*good* at managing to start learning it either: the bar is **opportunity, not competence**, because an
apprentice is assessed on work they actually do, so the role has to let them practise it somewhere.
Five of the ten have jobs that give an assessor nothing to look at. Two more are argued against for
this year rather than refused on their merits, with four things to do about it in the meantime — a
dotted line, a project with a budget, an apprenticeship unit, and a named place in next year's
cohort. Every one of those is a statement about the job, not the person.

**It measures against the published standards, not a summary of them.** Each job description was
read against all 21 knowledge, skills and behaviours of Business administrator and all 16 published
areas of Retail manager — 185 person-by-area judgements, each carrying the line of the JD that
justifies it. That is what makes a percentage mean anything, and the page shows its working rather
than the number alone.

## What it caught

Building it turned up things worth more than the demo:

**Team leader L3 was defunded for new starts on 1 September 2026.** It was going to be the "right
answer" in the walkthrough. Checking Skills England rather than assuming meant the whole scenario
changed — and the real story is better: the *generic* management ladder lost funding (Team leader,
Operations manager, Chartered manager, Coaching professional) while the *sector-specific* retail one
did not. The standards library here now carries funding status for all 322, and ten of them are
flagged.

**A keyword match on job descriptions is not good enough for this.** Scoring the JDs against
published KSBs by word overlap finds management vocabulary in 2 of 60 person-area pairs, and marks a
checkout supervisor who sets rotas and holds absence conversations as doing no people management at
all — because the standard says *"recruit, retain and develop"* where her JD says *"return-to-work
conversations"*. Same duty, no shared words. So that mapping is read rather than scored, every claim
sits beside the line of the JD it rests on, and the page reports the failed experiment as the reason.

**The filter chain threw out its own best answer.** Retail manager carried a five-word summary index
rather than published KSBs, so the honest chain dropped it. That was the filter working, not failing.
Its index was rebuilt from source and it now survives on merit.

## The numbers it lands on

1,340 staff at the published UK average salary is a £54.8m pay bill, which is **£259,104 of levy a
year**. Three colleagues on two standards commits £30,000 of it across five years — so roughly
**a quarter of a million dies every year**, because levy lands monthly and expires twelve months
later. It is not a balance building up somewhere: it is the same annual loss, repeated.

Expiry is not the point, though, and the page says so. The point is the ratio: three of 1,340 is
**one colleague in 447**, against a 5% Club target of 67 and a levy that would already fund 51
starts a year. **The constraint was never the money.** It was that only five of the ten had a job
evidencing anything an assessor could look at — and that the off-the-job hours nobody funds come
off a shop floor already covered to the hour.

## Checking the maths

Every figure in the walkthrough comes out of one calculation core, and that core is published on its
own: [`apps/levy-engine.js`](apps/levy-engine.js), 21KB of pure functions with no interface, no data
and no client work attached. Beside it is
[a page that runs it](https://acgroup21.github.io/Demo-Hub---Omari-Harry/apps/golden.html) against
**49 published gov.uk worked examples** — the levy formula, the August 2026 top-up boundary,
co-investment and its age waivers, funding-band drawdown, FIFO expiry, the incentive and hiring
payments, and timezone-safe date handling.

It runs in your browser rather than showing you a screenshot of a result. Each case calls the
function, prints what came back beside what gov.uk says it should be, and links the rule it rests
on. All 49 pass.

The full suite has 58. Nine test the application's projection and plan-stage verdict — its *reading*
of the maths rather than the maths — and need page state this extract doesn't carry. One of those
nine was passing without testing anything, which is why none of the nine are here rather than
eight-ninths of them; a false pass on a correctness page is worse than a failure. The page says all
of that on itself.

Funding constants live in a single JSON file every app fetches at runtime and applies over its own
defaults. That discipline once found the app overstating employer co-investment **five-fold**, still
applying a **10% government top-up that had been abolished**, and treating 22–24 year-olds as
chargeable after they became fully funded — with two test cases pinning the removed rule, which is
why the suite had stayed green while the number was wrong. It is the same mechanism that makes
stage 1 show a **0% top-up** today, and say in the rulebook's own words, with its gov.uk source and
the date it was read, that the 10% was removed from August 2026.

## Notes

**A standalone work sample.** Built in-house for Arthur Curtis Education, a levy-funded
apprenticeship consultancy, and shown here as an example of my work. There is nothing to sign up to
and nothing is collected.

**All data is invented.** Brayford Stores and its ten colleagues are written. No real employer,
learner or provider appears anywhere.

**Client work is not published here.** Several of these tools run live for named organisations.
Those instances, their branding and their data stay private.

**The standards library is partial, and the page says so.** It carries 8 of the 15 occupational
routes, with no construction or engineering.

**Desktop only, deliberately.** The layout survives down to about 760px and the first real break is
at 632 — but surviving isn't being the thing it is meant to be. This is a seven-stage rail you move
down, a five-year timeline read across, a drag step and a pointer that tracks a target across the
page. A phone build is its own exercise, not a squeeze of this one.

## Stack

Vanilla JavaScript, HTML and CSS. No build step, no framework, no dependencies beyond what is in the
file. Deployed as static pages. The constraint is deliberate — these go to small employers and
training providers who need a link that works, not an install.

What there is instead of a framework is a short set of rules, each one arrived at by measuring the
page rather than by taste.

- **Four corner radii** where thirteen had accumulated, encoding nesting: a panel inside a card is
  less round than the card, so the hierarchy reads from the corners alone.
- **One reading measure**, in pixels rather than ch. ch is relative to each element’s own font
  size, so a single token in ch still resolved to six different widths across the text sizes in
  these cards — one token, six edges.
- **Content inside a bordered panel fills it.** The frame already shortens the line, so a measure
  inside a frame only adds a second ragged edge within the box.

Twelve right-hand edges became one, measured across all seven stages with every card open.

Two typefaces, split by what the text is rather than for contrast: **mono for the machine-readable
layer** — figures, codes, dates and the small labels that index them — and Inter for the argument.
Figures quoted inside a sentence stay in the prose face, because there they are part of the
sentence; it is the ones you would go and check that are set apart.
