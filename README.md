# Sandbox — Omari Harry

**[Open it](https://acgroup21.github.io/Demo-Hub---Omari-Harry/)** — it runs in the page, nothing to
install.

A retail chain with forty-two stores, a £30m pay bill and five years to build its own managers.
Seven steps, each unlocking the next: here is your levy, here is what it actually buys, choose who
to develop, find out what their jobs don't yet evidence, read the report, pick the apprenticeship,
see the five-year pathway.

The employer is invented. **Everything else is real and dated** — the levy arithmetic, the funding
bands, the published duties, and which apprenticeships you can still buy.

---

## The idea behind it

These tools tell employers what training will cost them, and a figure that is merely plausible is
worthless. So the work is built to be **audited rather than trusted**, and that shows up in three
habits.

**Every narrowing shows its working.** When the page puts four apprenticeships in front of you, it
shows how it got there from 322 — funded for new starts, right level, right route, properly indexed
— with live counts that move if the library moves. Nothing in that chain is typed into the page.

**Where a judgement is mine, the page says so, in those words.** The last hop in every filter is
editorial and is coloured differently and labelled. Two of the four options on screen were removed
by the tool's own filters and put back deliberately, and it says which filter removed each and why
they are still there. The classification of which published duties count as "management" is mine,
and the page says that too.

**It refuses to guess.** Picking who has potential is a judgement an employer makes; the tool will
not fake it. What it will do is say whose *current job* evidences a duty an assessor could look at,
because that is written in a job description rather than carried around in someone's head. Five of
the ten are blocked on that basis, and clicking one explains that the finding is about the job, not
the person — and what would have to change.

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

A £30m pay bill is £135,000 of levy a year. Three colleagues on two programmes across five years
commits £30,000 of £675,000 — so **£645,000 expires unused**, enough for another 129 people, because
the money has already left the payroll. And the training the levy pays for is matched almost pound
for pound by **off-the-job hours nobody funds**: 348 published hours per apprentice, about 4.5 a week,
off a shop floor already covered to the hour.

## The full calculator

Sandbox was cut from [`apps/fundable.html`](apps/fundable.html) — a single 5MB file carrying 35
navigable functions. It opens inside Sandbox rather than in a new tab. It is where the claims above
are checkable: **open it and press the button to run 58 golden cases** that reproduce gov.uk's own
worked examples to the penny, and click any figure to see its arithmetic, the funding rule behind it
and the date that rule was last verified.

Funding constants live in a single JSON file every app fetches at runtime and applies over its own
defaults. That discipline once found the app overstating employer co-investment **five-fold**, still
applying a **10% government top-up that had been abolished**, and treating 22–24 year-olds as
chargeable after they became fully funded — with two test cases pinning the removed rule, which is
why the suite had stayed green while the number was wrong.

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

## Stack

Vanilla JavaScript, HTML and CSS. No build step, no framework, no dependencies beyond what is in the
file. Deployed as static pages. The constraint is deliberate — these go to small employers and
training providers who need a link that works, not an install.
