/* ═══════════════════════════════════════════════════════════════════════════
   Sandbox — the Brayford Stores journey.

   Seven steps down a vertical roadmap, each unlocking the next. Two rules the
   whole thing is built on:

   1. NOTHING IS TYPED THAT CAN BE COMPUTED. Every figure comes from the
      governed rulebook or from the standards library at runtime. A number
      written into this file goes stale the moment a rule moves, and a tool
      about trustworthy figures cannot have stale figures in it.

   2. WHERE A JUDGEMENT IS OURS, THE PAGE SAYS SO. The filter chains are data.
      The last hop in each is editorial. They are coloured differently and
      labelled, because a curated list dressed as an algorithm is the exact
      dishonesty this work argues against.
   ═════════════════════════════════════════════════════════════════════════ */

var $ = function (id) { return document.getElementById(id); };
var esc = function (s) { return String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
var fmt = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };
var fmtM = function (n) { return '£' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'm'; };
/* "a, b and c" — a plain join gives "a and b and c", which reads as a fault */
/* Joins "a, b and c". It used to emit `</b>, <b>` as its separator, which
   meant it only produced valid markup if the caller had already opened a <b>
   and would close one after -- an invisible precondition, with no error when
   you got it wrong: the stray leading </b> is dropped and the trailing <b> is
   never closed, so EVERYTHING after the list goes bold to the end of the
   paragraph. Three of its six callers had it wrong, including a recap note
   and the closing slide, and it is invisible until you look at the weight of
   the text rather than its words.

   So it joins and nothing else. A caller that wants each item bold wraps each
   item itself, where the tags are balanced in one expression and visibly so. */
function andList(a, sep) {
  if (a.length < 2) return a.join('');
  return a.slice(0, -1).join(sep || ', ') + ' and ' + a[a.length - 1];
}
function bList(a) { return andList(a.map(function (x) { return '<b>' + x + '</b>'; })); }

/* ── the ten ──────────────────────────────────────────────────────────────
   Brayford is invented, so these people are written. Each JD line is phrased
   the way a real retail job description is, because step 4 scores them against
   the published KSBs of the standards and a sanitised line would score better
   than a real one — which would flatter the tool. */
var TEAM = [
  { id: 1, name: 'Priya N.', role: 'Stock controller', yrs: 4, dept: 'Stock control', deptSize: 3,
    note: 'Owns stock accuracy for the whole store; no formal management training',
    jd: ['Monitor the stock management system and investigate shrinkage',
         'Run weekly counts and reconcile discrepancies with head office',
         'Order replenishment against forecast demand and promotions',
         'Brief the replenishment team on priorities at the start of each shift'] },
  { id: 2, name: 'Marcus W.', role: 'Senior sales assistant', yrs: 5, dept: 'Sales floor', deptSize: 14,
    note: 'Knows the customer base better than anyone; has never been given a team',
    jd: ['Serve customers and resolve complaints at the point of sale',
         'Hit personal and departmental sales targets',
         'Maintain product knowledge across ranges and promotions',
         'Coach new starters on the shop floor during their first weeks'] },
  { id: 3, name: 'Leah M.', role: 'Checkout supervisor', yrs: 6, dept: 'Checkout', deptSize: 18,
    note: 'Longest serving on the list; already supervises without the title',
    jd: ['Supervise checkout staff and set the rota for the front end',
         'Handle escalated customer complaints and refunds',
         'Monitor till performance and queue times against targets',
         'Carry out return-to-work and absence conversations'] },
  { id: 4, name: 'Tom B.', role: 'Visual merchandiser', yrs: 2, dept: 'Visual merchandising', deptSize: 4,
    note: 'Drives the merchandising plan; works largely alone',
    jd: ['Implement the merchandising plan across departments',
         'Build promotional displays for product launches',
         'Track the sales impact of layout changes',
         'Keep brand standards consistent across the store'] },
  { id: 5, name: 'Aisha R.', role: 'Customer service lead', yrs: 3, dept: 'Customer service', deptSize: 7,
    note: 'Fields every escalation in the building',
    jd: ['Lead the customer service desk and its daily workload',
         'Resolve escalated complaints and authorise goodwill',
         'Communicate policy changes to colleagues across departments',
         'Report service metrics to the store manager weekly'] },
  { id: 6, name: 'Dan F.', role: 'Night replenishment lead', yrs: 3, dept: 'Night replenishment', deptSize: 11,
    note: 'Runs the night shift unsupervised; no daytime visibility',
    jd: ['Direct the overnight replenishment team to the morning deadline',
         'Allocate labour hours across aisles against delivery volume',
         'Complete health and safety checks and incident reports',
         'Hand over outstanding issues to the day management team'] },
  { id: 7, name: 'Ellie C.', role: 'Department assistant, Home', yrs: 1, dept: 'Home', deptSize: 9,
    note: 'Strong with customers, newest on the list',
    jd: ['Serve customers and advise on product ranges',
         'Replenish and face the department through the day',
         'Process deliveries and check them against paperwork',
         'Support promotional changeovers'] },
  { id: 8, name: 'Nia K.', role: 'Click and collect co-ordinator', yrs: 2, dept: 'Click and collect', deptSize: 5,
    note: 'Owns the fastest-growing part of the store end to end',
    jd: ['Co-ordinate online order picking against collection slots',
         'Resolve order shortfalls and customer substitutions',
         'Monitor pick accuracy and on-time collection rates',
         'Liaise with the transport provider on failed deliveries'] },
  { id: 9, name: 'Jordan A.', role: 'Goods-in lead', yrs: 4, dept: 'Goods-in', deptSize: 8,
    note: 'Knows the supply chain inside out; rarely leaves the backroom',
    jd: ['Receive and check deliveries against purchase orders',
         'Manage backroom stock location and capacity',
         'Raise and chase supplier claims for damages and shortages',
         'Sequence put-away against replenishment priorities for the day'] },
  { id: 10, name: 'Sam O.', role: 'Store administrator', yrs: 2, dept: 'Store administration', deptSize: 3,
    note: 'Does the payroll, rotas and reporting for 180 colleagues',
    jd: ['Produce accurate records, rotas and payroll submissions',
         'Maintain internal policies and compliance paperwork',
         'Prepare weekly trading reports for the store manager',
         'Act as first point of contact for colleague queries'] }
];

/* ── runtime state ───────────────────────────────────────────────────────── */
var RULES = {
  /* defaults are a fallback only — the canonical rulebook overlays them on load,
     and `src` records which one actually produced the figures on screen */
  levyRate: 0.005, allowance: 15000, topUp: 0, expiryMonths: 12,
  drawTraining: 0.8, drawEpa: 0.2,
  asOf: '2026-10-13', version: '', src: 'built-in defaults'
};
var STD = {}, STDMETA = {}, PW = null;
var payBill = 30000000;
var picked = {};
var PICK = 3;            /* how many the scenario asks for */
var levy = {};

/* ── the step machine ────────────────────────────────────────────────────── */
function step(n) { return $('s' + n); }

function unlock(n) {
  var s = step(n);
  if (!s || !s.classList.contains('locked')) return;
  s.classList.remove('locked');
  s.classList.add('active');
  lightActs();
  syncStepper();
}
function complete(n, summary, foldable) {
  var s = step(n);
  if (!s) return;
  s.classList.remove('active');
  s.classList.add('done');
  if (summary != null) $('sum' + n).innerHTML = summary;
  if (foldable) s.classList.add('folded');
  /* every finished step can be reopened, not just the two that happened to
     have a button in the markup. Injected rather than hand-added five times. */
  var b = s.querySelector('.reopen');
  if (!b) {
    b = document.createElement('button');
    b.className = 'reopen';
    b.setAttribute('data-open', String(n));
    b.textContent = 'review';
    s.querySelector('.card-h').appendChild(b);
  }
  b.hidden = false;
  lightActs();
  syncStepper();
}
function goTo(n) {
  unlock(n);
  /* a completed step keeps its tick — scrolling to it must not re-ring the node */
  if (!step(n).classList.contains('done')) step(n).classList.add('active');
  var top = step(n).getBoundingClientRect().top + window.pageYOffset - 24;
  window.scrollTo({ top: top, behavior: reduced() ? 'auto' : 'smooth' });
}
function reduced() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Opening a details panel inside step 4 or 5 is the action those steps ask
   for, so it releases their gate. Listening on the capture phase because
   toggle does not bubble. */
document.addEventListener('toggle', function (e) {
  var d = e.target;
  if (!d.open || d.tagName !== 'DETAILS') return;
  if (d.closest('#body4')) {
    gate('go4', true, '', 'Evidence reviewed.');
  } else if (d.closest('#body5') && d.closest('.learner')) {
    gate('go5', true, '', 'Breakdown reviewed.');
  }
}, true);

/* ── gates ───────────────────────────────────────────────────────────────
   A step does not unlock the next until its own work is done, and the button
   says what is missing rather than just greying out. A disabled control with
   no reason given is the most annoying thing a page can do. */
/* the gate names a real colleague rather than saying "one colleague" */
function firstName() {
  var c = chosen();
  return c.length ? esc(c[0].name.split(' ')[0]) : 'a colleague';
}

function gate(btnId, ok, why, doneLabel) {
  var b = $(btnId);
  if (!b) return;
  b.disabled = !ok;
  b.title = ok ? '' : why;
  var hint = b.parentNode.querySelector('.gate-why');
  if (!hint) {
    hint = document.createElement('span');
    hint.className = 'gate-why';
    b.parentNode.appendChild(hint);
  }
  hint.textContent = ok ? (doneLabel || '') : why;
  hint.className = 'gate-why' + (ok ? ' ok' : '');
}

/* ── the marker's journey ────────────────────────────────────────────────
   The rail runs red at the top to cyan-green at the bottom, so the spine
   itself reads as heat cooling off: you arrive not knowing what any of it
   costs, you leave with a plan. The node you are ON lights orange, then
   settles into its position colour once done.

   Worth noting it cuts across the page's other colour rule, where cyan means
   funded and warm means your own cost. These nodes are chrome, not data —
   they are a gradient down a rail, which is why they read as position rather
   than as a verdict. */
/* Interpolating RGB from orange to cyan passes through a muddy green, which
   landed step 4 at rgb(120,182,148) — 23.9 dE from step 7's green, close
   enough to read as the same thing. Hand-picking fixed that but gave uneven
   jumps, which is not a gradient.

   A steady gradient means even PERCEPTUAL steps, which RGB cannot give you.
   This one is interpolated in LCH — polar CIELAB, so hue sweeps round the
   wheel instead of cutting across it — from red to mint, then measured:
   consecutive steps are 24/22/21/21/19/19 dE, so the largest and smallest
   differ by under 5. Nothing non-adjacent is confusable, and step 4 sits 56
   from step 7. */
var RAIL_STOPS = ['#c9443a', '#c6662a', '#bc8426', '#ad9f36',
                  '#9ab757', '#85cd80', '#6fe0ae'];

/* A colour that works as a 62px figure does not necessarily work as a 9.5px
   label. Step one's red is 3.90:1 on a card — fine for large text, which needs
   3.0, and a FAILURE for the recap's eyebrow and note headings, which need 4.5.
   So each stop carries two companions, both measured rather than guessed:
     INK  the stop lightened until small text on a dark card clears 4.6:1
     ON   black or white, whichever has more contrast ON the stop itself,
          for the tick inside a filled node
   Only step one actually moves; the rest are already light enough to be
   their own ink. */
var RAIL_INK = ['#cf5950', '#c6662a', '#bc8426', '#ad9f36',
                '#9ab757', '#85cd80', '#6fe0ae'];
var RAIL_ON  = ['#ffffff', '#07121a', '#07121a', '#07121a',
                '#07121a', '#07121a', '#07121a'];
function stepInk(n, total) {
  var t = (n - 1) / Math.max(1, (total || 7) - 1);
  return RAIL_INK[Math.round(t * (RAIL_INK.length - 1))];
}
function stepOn(n, total) {
  var t = (n - 1) / Math.max(1, (total || 7) - 1);
  return RAIL_ON[Math.round(t * (RAIL_ON.length - 1))];
}
function stepColour(n, total) {
  var t = (n - 1) / Math.max(1, (total || 7) - 1);
  return RAIL_STOPS[Math.round(t * (RAIL_STOPS.length - 1))];
}
function paintRail() {
  var steps = document.querySelectorAll('.step');
  [].forEach.call(steps, function (s, i) {
    var c = stepColour(i + 1, steps.length);
    s.style.setProperty('--stepc', c);
    s.style.setProperty('--stepc-ink', stepInk(i + 1, steps.length));
    s.style.setProperty('--stepc-on', stepOn(i + 1, steps.length));
    s.style.setProperty('--stepc-next', stepColour(Math.min(i + 2, steps.length), steps.length));
  });
}

/* ── the stepper ─────────────────────────────────────────────────────────
   A 2,800px page with seven gated stages needs a way to move that is not
   scrolling. This sticks to the top once you are past the header: seven
   dots, each in its own rail colour, each saying what it is and what state
   it is in. Click any unlocked one to jump to it.

   Locked ones are not clickable and say why, because a dead control with no
   explanation is the thing that makes people give up on a page. */
var STEP_NAMES = ['Your levy', 'The readout', 'Choose learners', 'Match JDs',
                  'The report', 'Assign the cohort', 'The pathway'];

function mountStepper() {
  if ($('stepper')) return;
  var n = document.querySelectorAll('.step').length;
  var el = document.createElement('nav');
  el.id = 'stepper';
  el.setAttribute('aria-label', 'Walkthrough stages');
  el.innerHTML = '<div class="stepper-in">' +
    Array.apply(null, Array(n)).map(function (_, i) {
      var s = i + 1;
      return '<button class="sdot" data-goto="' + s + '" style="--stepc:' + stepColour(s, n) + '">' +
        '<span class="sd"></span><span class="sl">' + esc(STEP_NAMES[i] || ('Step ' + s)) + '</span>' +
        '</button>';
    }).join('') +
    '<span class="sprog" id="sprog"></span></div>';
  document.body.appendChild(el);
  syncStepper();
}

function syncStepper() {
  if (!$('stepper')) return;
  var done = 0, total = document.querySelectorAll('.step').length;
  [].forEach.call(document.querySelectorAll('.sdot'), function (b) {
    var s = step(b.getAttribute('data-goto'));
    var locked = s.classList.contains('locked');
    var isDone = s.classList.contains('done');
    if (isDone) done++;
    b.className = 'sdot' + (isDone ? ' done' : '') + (s.classList.contains('active') ? ' active' : '') +
      (locked ? ' locked' : '');
    b.disabled = locked;
    b.title = locked ? 'Finish the stage before this one first' : 'Jump to ' + b.textContent;
  });
  $('sprog').textContent = done + ' of ' + total;
  $('stepper').classList.toggle('show', window.pageYOffset > 320);
}

document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-goto]');
  if (!b || b.disabled) return;
  var n = +b.getAttribute('data-goto');
  var s = step(n);
  if (s.classList.contains('folded')) {
    s.classList.remove('folded');
    var r = s.querySelector('.reopen'); if (r) r.hidden = true;
  }
  goTo(n);
});
window.addEventListener('scroll', function () {
  if ($('stepper')) $('stepper').classList.toggle('show', window.pageYOffset > 320);
}, { passive: true });

/* An act lights once anything inside it is reachable, so the three labels on
   the rail fill in as you descend rather than all being lit from the start. */
var ACT_FIRST = { 'The money': 1, 'The people': 3, 'The decision': 6 };
function lightActs() {
  [].forEach.call(document.querySelectorAll('.act'), function (a) {
    var first = ACT_FIRST[a.getAttribute('data-act')];
    var s = step(first);
    a.classList.toggle('lit', !!s && !s.classList.contains('locked'));
    var tot = document.querySelectorAll('.step').length;
    a.style.setProperty('--stepc', stepColour(first, tot));
    a.style.setProperty('--stepc-ink', stepInk(first, tot));
  });
}

/* reopen a folded step without losing what is below it */
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('.reopen');
  if (!b) return;
  var s = step(b.getAttribute('data-open'));
  s.classList.remove('folded');
  b.hidden = true;
});

/* ── working-out tables ──────────────────────────────────────────────────── */
function funnelRows(rows) {
  return rows.map(function (r) {
    var cls = r.indent ? ' class="indent"' : (r.sum ? ' class="sum"' : '');
    var drop = r.drop ? '<span class="drop">−' + r.drop + '</span>' : '';
    return '<tr' + cls + '><td>' + r.label + drop + '</td><td>' + r.value + '</td></tr>';
  }).join('');
}

/* ── 01 · the levy ───────────────────────────────────────────────────────── */
/* HMRC works the levy MONTHLY and cumulatively, not as one annual sum: a
   twelfth of the allowance each month, year to date, with unused allowance
   carried forward inside the tax year but never into the next. For a steady
   pay bill the annual answer is identical — but showing annual-minus-£15,000
   would be the wrong path, and a page whose whole claim is "check the
   arithmetic" cannot print arithmetic nobody actually does.
   Source: gov.uk/guidance/pay-apprenticeship-levy */
function calcLevy(pb) {
  var mPay = pb / 12;
  var mAllow = RULES.allowance / 12;
  var mGross = mPay * RULES.levyRate;
  var mNet = Math.max(0, mGross - mAllow);
  var monthly = mNet * (1 + RULES.topUp);
  return {
    payBill: pb, mPay: mPay, mAllow: mAllow, mGross: mGross,
    monthly: monthly, annual: monthly * 12,
    gross: pb * RULES.levyRate, net: Math.max(0, pb * RULES.levyRate - RULES.allowance)
  };
}

/* The threshold is not a separate rule — it is the pay bill at which the
   allowance exactly cancels the levy. Derived so it stays right if either
   constant moves. */
function levyThreshold() { return RULES.allowance / RULES.levyRate; }

/* Brayford's pay bill is an exact derived figure (headcount x the published
   average salary) and the slider moves in half-millions, so the thumb can
   never land on it. The slider is a coarse explorer; payBill is the number.
   Dragging sets payBill from the slider, the snap button sets it exactly. */
function setPayBill(v, syncSlider) {
  payBill = v;
  if (syncSlider) $('paybill').value = v;
  drawStep1();
}

function drawStep1() {
  levy = calcLevy(payBill);
  $('pbOut').innerHTML = fmt(payBill);

  /* Brayford's real pay bill, marked on the track. Explore freely; you cannot
     leave the step on another company's number, because every figure in the
     six steps below is derived from this one. */
  var target = (PW && PW.employer.payBill) || 30000000;
  var el = $('paybill'), lo = +el.min, hi = +el.max;
  var frac = (target - lo) / (hi - lo);
  $('pbMark').style.left = 'calc(9px + (100% - 18px) * ' + frac.toFixed(5) + ')';

  var onTarget = payBill === target;
  var t = calcLevy(target);
  var diff = levy.annual - t.annual;
  var movedOn = !step(3).classList.contains('locked');
  var thresh = levyThreshold();
  var isLevyPayer = payBill > thresh;
  $('go1').disabled = !onTarget;
  $('snapBack').hidden = onTarget;
  $('pbHint').className = 'hint' + (onTarget ? '' : ' off');

  /* the levy is the answer this step is named after, so it is the big figure */
  $('levyOut').className = 'levyout' + (isLevyPayer ? '' : ' nil');
  $('levyOut').innerHTML = isLevyPayer
    ? '<div class="lk">Your apprenticeship levy</div><div class="lv">' + fmt(levy.annual) + ' a year' +
      '</div><div class="ls">' + fmt(levy.monthly) + ' into the account each month. Restricted to ' +
      'apprenticeship training &mdash; it cannot pay a wage.</div>'
    : '<div class="lk">Your apprenticeship levy</div><div class="lv">You do not pay it</div>' +
      '<div class="ls">Under a <b>' + fmt(thresh) + '</b> pay bill there is no levy at all.</div>';

  var src = (PW && PW.employer.payBillFrom) || {};
  $('pbHint').innerHTML = !isLevyPayer
    ? '<b>This is a different kind of employer, not a smaller version of one.</b> Below ' +
      fmt(thresh) + ' you pay no levy and have no account &mdash; training is bought through ' +
      'co-investment instead, with government paying <b>95%</b> and you finding the rest. A ' +
      'separate funding world, and not the one this walkthrough is about. Use the button to ' +
      'go back to Brayford.'
    : onTarget
      ? 'Brayford’s pay bill is <b>' + (src.headcount || '') + ' staff × the UK average ' +
        'salary of ' + fmt(src.avgSalary || 0) + '</b>. Move the slider to see what a bigger or ' +
        'smaller employer would have &mdash; then come back to carry on.'
      : 'At ' + fmt(payBill) + ' the levy would be <b>' + fmt(levy.annual) + '</b> a year, ' +
        '<b>' + fmt(Math.abs(diff)) + '</b> ' + (diff > 0 ? 'more' : 'less') + ' than Brayford’s. ' +
        (movedOn
          ? 'Every figure in the steps below has just moved with it &mdash; <b>they are now this ' +
            'employer’s, not Brayford’s</b>. '
          : '') +
        'Use the button to put it back.';

  $('chain1').textContent = '— ' + fmtM(payBill) + ' → ' + fmt(levy.annual) + '/yr';
  var pbf = (PW && PW.employer.payBillFrom) || {};
  $('work1').innerHTML = funnelRows([
    { label: 'UK average salary &mdash; ' + esc(pbf.source || '') + ', <b>provisional</b>',
      value: fmt(pbf.avgSalary || 0) },
    { label: '× ' + (pbf.headcount || 0).toLocaleString('en-GB') + ' staff → annual pay bill',
      value: fmt(levy.payBill), indent: true },
    { label: '÷ 12 → pay bill that month', value: fmt(levy.mPay) },
    { label: '× levy rate ' + (RULES.levyRate * 100).toFixed(1) + '%', value: fmt(levy.mGross), indent: true },
    { label: '− monthly allowance (' + fmt(RULES.allowance) + ' ÷ 12)',
      value: '−' + fmt(levy.mAllow), indent: true },
    { label: '+ government top-up ' + Math.round(RULES.topUp * 100) + '%' +
        (!RULES.topUp && RULES.topUpWas
          ? ' <b>&mdash; was ' + Math.round(RULES.topUpWas * 100) + '%</b>' : ''),
      value: RULES.topUp ? '+' + fmt(levy.monthly - (levy.mGross - levy.mAllow)) : '£0', indent: true },
    { label: 'into your account that month', value: fmt(levy.monthly), sum: true },
    { label: '× 12 months', value: fmt(levy.annual) + '/yr', indent: true }
  ]);
  /* A 0% line with nothing beside it reads as a bug, or as an error a reader
     will hold against every other figure on the page. The rulebook knows why
     it is 0; this prints the rulebook's own words and its source rather than
     a sentence written here that could drift from them. */
  var tn = $('topupNote');
  if (tn) {
    tn.hidden = !(!RULES.topUp && RULES.topUpNote);
    if (!tn.hidden) {
      /* quoted, because it is the rulebook's wording and not ours — which is
         also why it reads as it does rather than being smoothed out here */
      tn.innerHTML = '<b>That 0% is not a mistake.</b> The rulebook records it as: &ldquo;' +
        esc(RULES.topUpNote) + '&rdquo;' +
        (RULES.topUpSrc ? ' <a href="' + esc(RULES.topUpSrc) + '" target="_blank" ' +
          'rel="noopener">The funding guide</a>, read ' + esc(RULES.topUpAsOf) + '.' : '');
    }
  }

  if (step(2).classList.contains('done') || !step(2).classList.contains('locked')) drawStep2();
  /* a visitor can reopen step 1 and move the slider after the report exists.
     Rebuild anything downstream that carries a money figure, or the report
     quietly keeps quoting a pay bill nobody is looking at any more. */
  if (!step(5).classList.contains('locked')) drawStep5();
}

function drawStep2() {
  var teamLeaderBand = 5000;   /* replaced below by a real band once the library loads */
  var o = STD['ST0325'];
  var band = (o && o.band) || teamLeaderBand;
  var couldFund = Math.floor(levy.annual / band);
  $('readout').innerHTML =
    ro('Arriving', fmt(levy.monthly), 'every month') +
    ro('Over a year', fmt(levy.annual), 'if none of it is spent') +
    ro('Expiry clock', RULES.expiryMonths + ' months', 'from the month it lands') +
    ro('Buys', couldFund + ' people', 'on ' + (o ? o.name + ' L' + o.level : 'a £' + band + ' standard'));
  $('roSum').innerHTML = 'A full month of levy rolls off the far end every month once the account is ' +
    'mature. On this pay bill that is <b>' + fmt(levy.monthly) + ' a month</b> going back to the ' +
    'Treasury unless it is committed to training.';
  $('sum2').innerHTML = fmt(levy.monthly) + '/mo · ' + RULES.expiryMonths + '-month clock';
}
function ro(k, v, s) {
  return '<div class="ro"><div class="k">' + k + '</div><div class="v">' + v + '</div>' +
    '<div class="s">' + s + '</div></div>';
}

/* ── 03 · the ten ────────────────────────────────────────────────────────
   Some of the ten cannot be selected. The bar is NOT a judgement about the
   person — the tool has no basis for one and says so. It is a judgement about
   the JOB: if a job description evidences none of the duties the standard
   assesses, there is nothing for an assessor to look at, and the fix is to
   widen the role before enrolling anybody. That is in the data we have; who
   has potential is not, and never will be. */
function tally(id) {
  var areas = (PW && PW.coverage.areas) || [];
  var by = coverFor(id);
  var yes = [], part = [];
  areas.forEach(function (a) {
    if (!by[a]) return;
    (by[a].state === 'yes' ? yes : part).push(a);
  });
  return { yes: yes, part: part, missing: areas.filter(function (a) { return !by[a]; }) };
}
function eligible(id) { return tally(id).yes.length > 0; }
/* Eligible is not the same as selectable. Of those whose job evidences
   anything, the thinnest two are held back for a year rather than blocked
   outright - the difference matters, and the panel says what to do with the
   year instead of just refusing. */
function selectable(id) { return eligible(id) && !isWeaker(id); }

/* Among those who CAN be put forward, some are better bets than others — and
   that is a ranking, not a gate. The tool advises and the employer decides;
   blocking here would be the tool making a call it has no standing to make.
   Order is by areas clearly evidenced, then by areas touched in part. */
function ranked() {
  return TEAM.filter(function (p) { return eligible(p.id); })
    .map(function (p) { var t = tally(p.id); return { p: p, yes: t.yes.length, part: t.part.length }; })
    .sort(function (a, b) { return (b.yes - a.yes) || (b.part - a.part); });
}
function isWeaker(id) {
  var r = ranked();
  return r.slice(PICK).some(function (x) { return x.p.id === id; });
}

/* Initials, not faces. A generated portrait of an invented colleague would be
   the one thing on this page pretending to be real, and these people are not.
   The hue is derived from the name so it is stable between renders. */
function avatar(name) {
  var initials = name.replace(/[^A-Za-z. ]/g, '').split(/\s+/)
    .map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  var h = 0;
  for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return '<span class="av" aria-hidden="true" style="background:hsl(' + h + ',32%,26%);color:hsl(' +
    h + ',55%,78%)">' + esc(initials) + '</span>';
}

function drawTeam() {
  $('team').innerHTML = TEAM.map(function (p) {
    var ok = selectable(p.id);
    var soon = eligible(p.id) && !ok;
    return '<button class="person' + (picked[p.id] ? ' on' : '') + (ok ? '' : ' blocked') + (soon ? ' soon' : '') +
      '" data-p="' + p.id + '"' + (ok ? '' : ' aria-disabled="true"') + '>' +
      avatar(p.name) +
      '<span class="nm">' + esc(p.name) + '</span>' +
      '<span class="rl">' + esc(p.role) + ' · ' + p.yrs + ' yr' + (p.yrs === 1 ? '' : 's') + '</span>' +
      '<span class="nt">' + esc(p.note) + '</span>' +
      (ok ? '' : soon ? '<span class="flag soft">Not this year — what could you do?</span>'
                     : '<span class="flag">Nothing to assess — why?</span>') + '</button>';
  }).join('');

  var ready = TEAM.filter(function (p) { return eligible(p.id); }).length;
  var n = chosen().length;
  /* The shortlist is already made, and until now the page never said so
     plainly — a reader met ten cards, found five of them unclickable, and had
     to work out why from the flags. This says it up front and points at the
     other five.

     "Suitable" is doing exact work here and has to keep doing it: it means
     their job evidences a duty an assessor could look at, nothing more. The
     page refuses elsewhere to rank who is best, so the pill says what the
     shortlist is on and what it is not on, or it would quietly contradict
     the stage it sits in. */
  /* The pill that used to sit here is gone. Once the stage intro said the
     three were preselected, it was saying it a second time in larger type a
     few inches below — and the progress it also reported is already next to
     the button, which is where you look when you want to move on. */
  gate('go3', n >= PICK, 'Pick ' + (PICK - n) + ' more — then the next stage opens.',
       'Ready — ' + n + ' chosen.');
}
function chosen() {
  return TEAM.filter(function (p) { return picked[p.id]; });
}

/* why a particular person cannot be put forward — derived from the mapping,
   not written per person, so it cannot drift from the evidence in step 4 */
/* These two panels used to open by restating the principle from the stage
   intro a few inches above them -- "nobody has to be good at managing to
   start learning it", "the bar is opportunity, not competence", "a statement
   about the job, not about the person" -- in places word for word. A reader
   who has got as far as clicking a name has read it. So the principle is
   stated once, up there, and what opens here is the diagnosis: this role,
   this evidence, this consequence, this recommendation. */
function explain(p) {
  var t = tally(p.id);
  var by = coverFor(p.id);
  var first = esc(p.name.split(' ')[0]);

  /* cite the line the claim rests on, as everything else on this page does */
  /* every claim beside the line it rests on, which is this page's method.
     The first draft quoted ONE line as the evidence for every area reached,
     which for a role touching two areas from two different lines was simply
     untrue. */
  var reach = t.part.length
    ? '<p>It reaches ' + andList(t.part.map(function (a) {
        return '<b>' + esc(a) + '</b> through &ldquo;' + esc(p.jd[by[a].jd]) + '&rdquo;';
      })) + ' &mdash; but as a by-product of the work rather than as the work. An assessor needs a ' +
      'duty held deliberately and repeatedly, not one that happens to arise.</p>'
    : '<p>None of the four lines in it touches any of the six. The role is scoped to something ' +
      'other than managing people or money, which is a statement about its design and not about ' +
      'its difficulty.</p>';

  /* Name the ones actually within reach rather than listing all six: an area
     the role already brushes is a smaller change to make standing than one it
     has never touched.

     It named ONE at first -- t.part[0] -- which produced "the nearest is
     Financial" for four of the five people here, not because Financial was
     nearest for any of them but because it is first in the areas array. A
     ranking that is really an array order, presented as a judgement. There is
     nothing in the data that ranks one brushed area above another, so it names
     them all and leaves the choice where it belongs. */
  var nearest = t.part.length
    ? 'The nearest ' + (t.part.length === 1 ? 'is' : 'are') + ' ' +
      bList(t.part.map(esc)) + ', which the role already brushes above: making ' +
      (t.part.length === 1 ? 'that' : 'either of those') + ' standing rather than occasional is a ' +
      'smaller change than adding a duty from nothing.'
    : 'Nothing in the role points to one of the six over another, so which to add is a scoping ' +
      'decision for whoever owns the job rather than something this tool should pick.';

  $('why3').innerHTML =
    '<div class="why"><h4>' + esc(p.name) + ': no evidence base for the management duties</h4>' +

    '<p>' + first + ' is a <b>' + esc(p.role.toLowerCase()) + '</b>. ' + esc(p.note) + '.</p>' +
    reach +

    '<p><b>An apprentice evidences the standard from the job they are given.</b> The portfolio is ' +
    'built at work, taken through gateway, and defended at end-point assessment. There is no route ' +
    'to evidence a duty the role never asks for, and the six hours a week off the job do not ' +
    'substitute for it &mdash; that time is for learning the duty, not for inventing the ' +
    'opportunity to perform it.</p>' +

    '<p><b>The cost of getting this wrong is not the full band.</b> A programme that cannot ' +
    'produce evidence tends to end in withdrawal rather than failure, and on withdrawal the ' +
    'provider&rsquo;s instalments stop that month and the completion payment is never released. ' +
    'You pay for the months drawn down and hold no achievement against them &mdash; a smaller ' +
    'invoice and a worse outcome than finishing.</p>' +

    '<p><b>The intervention is a change to the role, not a training decision.</b> ' + nearest +
    ' Whatever is chosen has to be written in and in place <b>before the start date</b> rather ' +
    'than promised during it, so the portfolio has something in it from month one. Competence at ' +
    'the duty is not the requirement; being given it is.</p>' +

    '<p class="scope">Read from the job description alone.</p>' +
    '<p><button class="dismiss" id="whyX">Close this</button></p></div>';
  $('why3').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
}

/* The units explainer opens and closes in place. It is a digression from the
   walkthrough, so it is a disclosure rather than a step — and nothing about
   it navigates anywhere. */
function unitsPack() {
  var U = PW.units;
  return '<div class="infopack"><div class="ip-h"><b>' + esc(U.name) + '</b>' +
    '<button class="dismiss" id="unitsClose">Close</button></div>' +
    '<table class="funnel">' + U.facts.map(function (f) {
      return '<tr><td style="white-space:nowrap;color:var(--cyan)">' + esc(f[0]) +
        '</td><td style="text-align:left;color:var(--muted);white-space:normal">' +
        esc(f[1]) + '</td></tr>';
    }).join('') + '</table>' +
    '<p class="ip-why">' + esc(U.whyHere) + '</p>' +
    '<p class="ip-src"><a href="' + esc(U.source) + '" target="_blank" rel="noopener">' +
    esc(U.sourceName) + '</a> &middot; checked ' + esc(U.checked) + '</p></div>';
}
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'unitsOpen') {
    var h = $('unitsPack');
    h.innerHTML = h.innerHTML ? '' : unitsPack();
    return;
  }
  if (e.target && e.target.id === 'unitsClose') { $('unitsPack').innerHTML = ''; }
});

/* ── what you could do ───────────────────────────────────────────────────
   The two thinnest are held back for a year, so the panel owes them a year's
   worth of plan rather than a refusal. Each suggestion targets a gap the data
   actually found, and none of them makes a funding claim — these are things
   an employer does with a rota and a job description, not things they buy. */
function couldDo(p) {
  var t = tally(p.id);
  var areas = PW.coverage.areas;
  /* the areas NOBODY in the eligible pool clearly evidences -- the real hole */
  var holes = areas.filter(function (a) {
    return !TEAM.filter(function (q) { return eligible(q.id); })
      .some(function (q) { return tally(q.id).yes.indexOf(a) > -1; });
  });
  var first = esc(p.name.split(' ')[0]);
  var pool = TEAM.filter(function (q) { return eligible(q.id); }).length;

  $('why3').innerHTML =
    '<div class="why"><h4>' + esc(p.name) + ': the thinnest evidence base of those who could go</h4>' +

    '<p>Their role evidences <b>' + t.yes.length + '</b> of the six clearly' +
    (t.part.length ? ' and touches <b>' + t.part.length + '</b> more in part' : '') +
    ' &mdash; past the bar, and the weakest of the ' + pool + ' who clear it. The practical effect ' +
    'is that much of the first year goes on building the job the programme is meant to assess, ' +
    'instead of on the programme. <b>The recommendation is to defer ' + first + ' by one cohort ' +
    'and spend the year on the four changes below</b>, which cost nothing like a programme does ' +
    'and are worth making whether or not they lead to one.</p>' +

    '<p><b>1. Give them a reporting line.</b> One or two colleagues accountable to ' + first +
    ', informally and in writing &mdash; not a promotion and not a pay change. That single change ' +
    'turns <b>Team performance</b> and <b>Developing self</b> from theory into something an ' +
    'assessor can examine.</p>' +

    '<p><b>2. Assign a project with a budget and a deadline.</b>' +
    (holes.length
      ? ' Across everyone who could be put forward, ' + bList(holes.map(esc)) + ' ' +
        (holes.length === 1 ? 'appears' : 'appear') + ' in nobody&rsquo;s role at all &mdash; a ' +
        'gap in the cohort, not just in one person. A defined piece of work with a number attached ' +
        'is the cheapest way to create it.'
      : ' A defined piece of work with a number attached and a date to finish evidences the ' +
        'financial and planning duties a day job rarely reaches.') + '</p>' +

    '<p><b>3. Fund a unit in the meantime.</b> Weeks rather than eighteen months, from the same ' +
    'levy, aimed at the duties the role does not yet cover. ' +
    '<button class="linklike" id="unitsOpen">What is an apprenticeship unit?</button></p>' +
    '<div id="unitsPack"></div>' +

    '<p><b>4. Name them in next year&rsquo;s cohort now.</b> A named place twelve months out, with ' +
    'the three changes above as its conditions &mdash; not a vague undertaking. Deferral without a ' +
    'date reads as a refusal, and people leave over it.</p>' +

    /* This said "nothing prevents enrolling Priya this year" — on a panel that
       only appears because she cannot be picked. Verified: clicking her leaves
       the cohort at zero. The advice was sound; the claim about what a reader
       was free to do was not. */
    '<p class="scope">The three preselected are the three with the most for an assessor to ' +
    'look at. ' + first + ' is the argument for next year, not this one.</p>' +
    '<p><button class="dismiss" id="whyX">Close this</button></p></div>';
  $('why3').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
}

/* Advice, not a veto. Two of the five who CAN be put forward evidence less
   than the other three, and picking one is a worse use of the same £5,000 —
   but it is a legitimate choice an employer might make for reasons the tool
   cannot see, so it says so and gets out of the way. */

function drawWork3() {
  var head = (PW && PW.employer.headcount) || 1340;
  var ready = TEAM.filter(function (p) { return eligible(p.id); }).length;
  $('chain3').textContent = '— ' + head.toLocaleString('en-GB') + ' → ' + TEAM.length +
    ' → ' + ready;
  $('work3').innerHTML = funnelRows([
    { label: 'people employed by Brayford', value: head.toLocaleString('en-GB') },
    { label: 'in store roles rather than head office', value: '1,180', drop: '160', indent: true },
    { label: 'one rung below a management grade', value: '64', drop: '1,116', indent: true },
    { label: 'twelve months service or more', value: '41', drop: '23', indent: true },
    { label: 'put forward by their store manager', value: String(TEAM.length), drop: '31', indent: true },
    { label: 'whose JD evidences a management duty to assess',
      value: String(ready), drop: String(TEAM.length - ready), sum: true }
  ]);
}

/* ── 04 · the duty gap ───────────────────────────────────────────────────
   Read, not scored. A keyword overlap between these JDs and the published
   KSBs finds management vocabulary in 2 of 60 person-area pairs, and misses
   the clearest manager on the list — the standard says "recruit, retain and
   develop" where her JD says "return-to-work conversations". Same duty, no
   shared words. So the mapping is a judgement, and every claim is shown next
   to the line of her job description it rests on, to be argued with. */
function coverFor(id) {
  var c = (PW && PW.coverage && PW.coverage.byPerson[String(id)]) || [];
  var by = {};
  c.forEach(function (x) { by[x.area] = x; });
  return by;
}

function drawStep4() {
  var areas = PW.coverage.areas;
  var people = chosen();

  var cards = people.map(function (p) {
    var by = coverFor(p.id);
    var yes = areas.filter(function (a) { return by[a] && by[a].state === 'yes'; }).length;
    var part = areas.filter(function (a) { return by[a] && by[a].state === 'partly'; }).length;

    var chips = areas.map(function (a) {
      var st = by[a] ? by[a].state : 'no';
      var tip = by[a] ? 'From their JD: ' + p.jd[by[a].jd] : 'Not described in their job description';
      return '<span class="chip ' + st + '" title="' + esc(tip) + '">' + esc(a) + '</span>';
    }).join('');

    var lines = p.jd.map(function (line, i) {
      var hits = areas.filter(function (a) { return by[a] && by[a].jd === i; });
      return '<li class="' + (hits.length ? 'ev' : '') + '">' + esc(line) +
        (hits.length ? '<em>→ ' + hits.map(function (a) {
          return esc(a) + ' (' + by[a].state + ')'; }).join(' · ') + '</em>' : '') + '</li>';
    }).join('');

    return '<div class="learner"><div class="lh">' +
      '<span class="ln">' + esc(p.name) + '</span><span class="lr">' + esc(p.role) + '</span>' +
      '<span class="lscore"><b>' + yes + '</b> of ' + areas.length + ' clearly' +
      (part ? ' · ' + part + ' in part' : '') + '</span></div>' +
      '<div class="chips">' + chips + '</div>' +
      '<details><summary>' +
      '<span class="s-shut">Open ' + esc(p.name.split(' ')[0]) + '\u2019s job description</span>' +
      '<span class="s-open">Their job description, and what each line evidences</span>' +
      '</summary>' +
      '<ul class="jd">' + lines + '</ul></details></div>';
  }).join('');

  var totalYes = people.reduce(function (t, p) {
    var by = coverFor(p.id);
    return t + areas.filter(function (a) { return by[a] && by[a].state === 'yes'; }).length;
  }, 0);
  var max = people.length * areas.length;
  var never = areas.filter(function (a) {
    return !people.some(function (p) { var b = coverFor(p.id)[a]; return b && b.state === 'yes'; });
  });

  $('body4').innerHTML =
    '<p class="sub">These six are the areas of the published <b>Retail manager</b> standard that are ' +
    'about managing people or money. An apprenticeship assumes the apprentice is already doing the job ' +
    'well enough to be assessed on it &mdash; so the question is not whether your ' + people.length + ' are capable, ' +
    'but whether <b>the job you currently give them</b> contains any of this.</p>' +
    cards +
    '<div class="check"><h3>The reality check</h3>' +
    '<p>Across your ' + people.length + ', <b>' + totalYes + ' of ' + max + '</b> management areas are clearly evidenced ' +
    'by their current job descriptions.' +
    (never.length ? ' Not one of them has <b>' + never.map(esc).join('</b>, <b>') + '</b> in their role ' +
      'today.' : '') + '</p>' +
    '<p>That is a finding about <b>the jobs, not the people</b>. The gap does not close by enrolling ' +
    'them &mdash; it closes by widening what they are actually asked to do, before they start. An ' +
    'apprentice who cannot evidence a duty at work cannot pass an assessment on it, however good the ' +
    'training is.</p>' +
    '<p>And the <b>six hours a week</b> each of them spends training is time off a shop floor that is ' +
    'already covered to the hour. Nobody funds that, and it is the reason retail programmes fall over ' +
    'more often than the training does.</p></div>' +
    '<div class="row"><button class="btn" id="go4">See the readiness report &rarr;</button></div>' +
    '<details class="work"><summary>How this mapping was made <span class="chain">— read, not scored</span></summary>' +
    '<table class="funnel">' +
    '<tr><td>areas in the published Retail manager standard</td><td>' + PW.ksb.ST0325.areas.length + '</td></tr>' +
    '<tr class="indent"><td>classified by us as managing people or money</td><td>' + areas.length + '</td></tr>' +
    '<tr class="indent"><td>person &times; area judgements made</td><td>' + max + '</td></tr>' +
    '<tr class="sum"><td>found by a plain keyword match instead</td><td>2 of 60</td></tr>' +
    '</table>' +
    '<p class="ours"><b>This one is a judgement, and the method is why.</b> Scoring the JDs against the ' +
    'published KSBs by word overlap finds management vocabulary in 2 of 60 person-area pairs &mdash; and ' +
    'marks a checkout supervisor who sets rotas and holds absence conversations as doing no people ' +
    'management at all, because the standard says &ldquo;recruit, retain and develop&rdquo; where her JD ' +
    'says &ldquo;return-to-work conversations&rdquo;. Same duty, no shared words. So this mapping is read ' +
    'by a person, every claim is shown beside the line it rests on, and you are invited to disagree with ' +
    'any of it. Which of the six areas count as management is our call too, not the standard&rsquo;s.</p>' +
    '</details>';

  gate('go4', false, 'Open ' + firstName() + '’s job description below to see what each line — ' +
       'and what it does not — evidences, then move to the next stage.');
  $('go4').onclick = function () {
    complete(4, totalYes + ' of ' + max + ' areas evidenced', true);
    unlock(5);
    drawStep5();
    goTo(5);
  };
  $('sum4').innerHTML = '';
}

/* ── 05 · the readiness report ───────────────────────────────────────────
   The document is BUILT, then its contents list is read back off what was
   built. Describing a report you have not assembled is how a page ends up
   promising sections that are not in it. */
function hourlyRate() {
  /* derived from the pay bill the visitor set, not a number typed in here:
     average earnings over contracted hours. Moves when the slider moves. */
  var head = PW.employer.headcount;
  var hoursPerYear = 37.5 * 52;
  return payBill / head / hoursPerYear;
}

function otjFor(ref, n) {
  var o = STD[ref];
  if (!o || !o.otjHours) return null;
  var rate = hourlyRate();
  return {
    std: o, hours: o.otjHours, people: n,
    perWeek: o.otjHours / (o.months * 52 / 12),
    totalHours: o.otjHours * n,
    cost: o.otjHours * n * rate,
    rate: rate
  };
}

/* ── KSB coverage, measured against the published standard ───────────────
   This is the part the JD Matcher does properly and the earlier version of
   this page faked. A percentage needs a real denominator: ST0070 publishes
   21 KSBs — 8 knowledge, 8 skills, 5 behaviours — and each colleague's job
   description was read against all 21, with the JD line that justifies every
   mark. 56 marks across 105 person-KSB pairs.

   The 50% line is the guidance convention the matcher reports against. It is
   a convention, not a funding rule, and the report says so. */
var KSB_THRESHOLD = 0.5;
var KSB_GROUPS = [['K', 'Knowledge'], ['S', 'Skills'], ['B', 'Behaviours']];

/* two KSB sets now: the standard they start on and the one they move up to */
function ksbSet(ref) {
  return [PW.ksbFull, PW.ksbFull2].filter(Boolean)
    .filter(function (f) { return f.ref === ref; })[0] || null;
}
function ksbFor(id, ref) {
  var F = ref ? ksbSet(ref) : PW.ksbFull;
  if (!F) return null;
  var ev = F.evidenced[String(id)];
  if (!ev) return null;
  var by = {};
  F.items.forEach(function (it) { by[it.group] = { have: 0, of: 0 }; });
  var items = F.items.map(function (it) {
    /* one set is keyed by code, the other by area name — both are legitimate
       shapes for the data, so read either rather than forcing one */
    var line = (it.code in ev) ? ev[it.code] : ev[it.area];
    by[it.group].of++;
    if (line != null) by[it.group].have++;
    return { it: it, jd: line };
  });
  var have = items.filter(function (x) { return x.jd != null; }).length;
  return {
    items: items, by: by, have: have, of: items.length,
    pct: have / items.length,
    pass: have / items.length >= KSB_THRESHOLD
  };
}

function ring(pct, low) {
  var r = 26, c = 2 * Math.PI * r;
  return '<div class="ring' + (low ? ' low' : '') + '">' +
    '<svg width="62" height="62" viewBox="0 0 62 62" aria-hidden="true">' +
    '<circle cx="31" cy="31" r="' + r + '" fill="none" stroke="rgba(159,177,202,.17)" stroke-width="5"/>' +
    '<circle cx="31" cy="31" r="' + r + '" fill="none" stroke="' + (low ? '#f0a35c' : '#00C9CC') +
    '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) +
    '" stroke-dashoffset="' + (c * (1 - pct)).toFixed(1) + '"/></svg>' +
    '<div class="rv">' + Math.round(pct * 100) + '%</div></div>';
}

function ksbCard(p, ref) {
  var k = ksbFor(p.id, ref);
  if (!k) return '';
  var groups = Object.keys(k.by);
  return '<div class="learner">' +
    '<div class="ksb-h">' + ring(k.pct, !k.pass) +
    '<div class="ksb-who"><div class="n">' + esc(p.name) + '</div>' +
    '<div class="r">' + esc(p.role) + '</div></div>' +
    '<span class="ksb-band' + (k.pass ? '' : ' low') + '">' +
      (k.pass ? 'Compatible — gaps to develop' : 'Below the 50% guidance line') + '</span>' +
    '<div class="ksb-tot"><b>' + k.have + '</b> of ' + k.of + ' evidenced<br>' +
      (k.of - k.have) + ' to develop</div></div>' +
    (groups.length > 1
      ? '<div class="ksb-areas">' + groups.map(function (g) {
          var b = k.by[g];
          return '<div class="ka ' + esc(g.charAt(0)) + '"><span class="kl">' + esc(g) + '</span>' +
            '<span class="kb"><i style="width:' + (b.have / b.of * 100) + '%"></i></span>' +
            '<span class="kn">' + b.have + ' / ' + b.of + '</span></div>';
        }).join('') + '</div>'
      : '') +
    '<details><summary>' +
    '<span class="s-shut">Open ' + esc(p.name.split(' ')[0]) + '\u2019s full breakdown</span>' +
    '<span class="s-open">All ' + k.of + ' published areas, and which line of their JD evidences ' +
    'each</span></summary><ul class="ksb-list">' + k.items.map(function (x) {
      return '<li class="' + (x.jd != null ? 'ev' : '') + '">' +
        '<span class="c">' + esc(x.it.code) + '</span><span>' +
        (x.jd != null ? '<b>' + esc(x.it.area) + '</b>' : esc(x.it.area)) +
        (x.jd != null ? '<span class="ln">' + esc(p.jd[x.jd]) + '</span>' : '') +
        '</span></li>';
    }).join('') + '</ul></details></div>';
}

/* Coverage against BOTH steps of the pathway, because the contrast is the
   whole argument for it: they are close to ready for the first standard and
   nowhere near the second, which is why there are three years in between. */
function ksbBlock(inst) {
  var F = ksbSet(inst.ref);
  var std = STD[inst.ref];
  if (!F) return '';
  var ppl = chosen().filter(function (p) { return F.evidenced[String(p.id)]; });
  if (!ppl.length) return '';
  var pass = ppl.filter(function (p) { return ksbFor(p.id, inst.ref).pass; });
  return '<p class="subhead">Year ' + inst.startYear + ' · ' + esc(std.name) + '</p>' +
    '<p class="sub">Each job description read against <b>all ' + F.items.length +
    ' published areas</b> of this standard. <b>' + pass.length + ' of ' + ppl.length +
    '</b> clear the 50% guidance line.</p>' +
    ppl.map(function (p) { return ksbCard(p, inst.ref); }).join('');
}

function ksbSection() {
  var insts = PW.pathway.instances;
  var one = insts[0], two = insts[1];
  var set1 = ksbSet(one.ref) || { evidenced: {} };
  var ppl = chosen().filter(function (p) { return set1.evidenced[String(p.id)]; });
  if (!ppl.length) return '';
  var passOne = ppl.filter(function (p) { var k = ksbFor(p.id, one.ref); return k && k.pass; }).length;
  var passTwo = ppl.filter(function (p) { var k = ksbFor(p.id, two.ref); return k && k.pass; }).length;

  return '<p class="subhead">Coverage against the standards</p>' +
    '<p class="sub">Not a score of the people — a measure of how much of each standard their ' +
    '<b>current job</b> already puts in front of an assessor.</p>' +
    ksbBlock(one) +
    ksbBlock(two) +
    '<p class="payoff"><b>That gap is the pathway.</b> Against ' + esc(STD[one.ref].name) +
    ', <b>' + passOne + ' of ' + ppl.length + '</b> clear the line today. Against ' +
    esc(STD[two.ref].name) + ', <b>' + passTwo + ' of ' + ppl.length + '</b> do' +
    (passTwo === 0 ? ' — not one of them' : '') + '. Which is precisely why the second ' +
    'programme sits <b>three years out</b> rather than beside the first: the job they do after ' +
    'eighteen months on the first standard is what makes them ready for the second.</p>' +
    '<p class="caveat"><b>How this was measured.</b> ' + esc(PW.ksbFull._method) + ' ' +
    esc(PW.ksbFull._codes) + ' Sources: <a href="' + esc(PW.ksbFull.source) +
    '" target="_blank" rel="noopener">' + esc(STD[one.ref].name) + '</a> and <a href="' +
    esc(PW.ksbFull2.source) + '" target="_blank" rel="noopener">' + esc(STD[two.ref].name) +
    '</a> on Skills England, both checked ' + esc(PW.ksbFull.checked) + '.</p>';
}

function buildReport() {
  var people = chosen();
  var areas = PW.coverage.areas;
  var inst1 = STD[PW.pathway.instances[0].ref];
  var otj = otjFor(PW.pathway.instances[0].ref, people.length);
  var sections = [];

  function sec(title, html) { sections.push(title); return '<h4>' + esc(title) + '</h4>' + html; }

  /* who, and what their jobs evidence */
  var rows = people.map(function (p) {
    var t = tally(p.id);
    return '<tr><td><b>' + esc(p.name) + '</b><br>' + esc(p.role) + '</td>' +
      '<td>' + (t.yes.length ? t.yes.map(esc).join(', ') : '—') + '</td>' +
      '<td>' + (t.part.length ? t.part.map(esc).join(', ') : '—') + '</td>' +
      '<td class="num">' + t.yes.length + ' / ' + areas.length + '</td></tr>';
  }).join('');

  /* what has to change: areas no one clearly evidences */
  var gaps = areas.filter(function (a) {
    return !people.some(function (p) { return tally(p.id).yes.indexOf(a) > -1; });
  });

  var body =
    sec('The money', '<table><tr><td>Annual pay bill</td><td class="num">' + fmt(payBill) + '</td></tr>' +
      '<tr><td>Apprenticeship levy into the account</td><td class="num">' + fmt(levy.annual) + ' / yr</td></tr>' +
      '<tr><td>Arriving each month, on a ' + RULES.expiryMonths + '-month expiry clock</td><td class="num">' +
        fmt(levy.monthly) + '</td></tr>' +
      '<tr><td>Committed by this plan (' + people.length + ' × ' + esc(inst1.name) + ')</td>' +
        '<td class="num">' + fmt(inst1.band * people.length) + '</td></tr>' +
      '<tr><td><b>Gone within ' + RULES.expiryMonths + ' months of landing</b></td><td class="num"><b>' +
        fmt(Math.max(0, levy.annual - inst1.band * people.length)) + '</b></td></tr></table>' +
      '<p class="warnline">Not a balance carried forward. Levy lands monthly and dies ' +
      RULES.expiryMonths + ' months later, so this is an <b>annual loss that repeats</b> &mdash; not ' +
      'a pot building up somewhere waiting to be spent.</p>') +

    sec('Who is being put forward',
      '<p>Chosen from <b>' + TEAM.filter(function (p) { return eligible(p.id); }).length + '</b> of ' +
      TEAM.length + ' colleagues whose current role evidences a duty the standard assesses.</p>' +
      '<table><tr><th>Colleague</th><th>Clearly evidenced</th><th>In part</th><th>&nbsp;</th></tr>' +
      rows + '</table>') +

    sec('What has to change before anyone enrols', gaps.length
      ? '<p class="warnline">Not one of these ' + people.length + ' currently evidences <b>' + gaps.map(esc).join('</b>, <b>') +
        '</b>. An apprentice is assessed on the job they do, so each needs to become a real, standing ' +
        'responsibility <b>before</b> the programme starts &mdash; not something the training is expected ' +
        'to supply.</p>'
      : '<p>All six areas are evidenced somewhere across the ' + people.length + '. No role changes needed before enrolment.</p>') +

    sec('The cost nobody funds', otj
      ? '<table><tr><td>Minimum off-the-job training, per apprentice</td><td class="num">' +
        otj.hours + ' hrs</td></tr>' +
        '<tr><td>Across ' + otj.people + ' apprentices over ' + otj.std.months + ' months</td>' +
        '<td class="num">' + otj.totalHours.toLocaleString('en-GB') + ' hrs</td></tr>' +
        '<tr><td>About, per person, per week</td><td class="num">' + otj.perWeek.toFixed(1) + ' hrs</td></tr>' +
        '<tr><td>Hourly cost — your pay bill over your headcount, over contracted hours</td>' +
        '<td class="num">£' + otj.rate.toFixed(2) + '</td></tr>' +
        '<tr><td><b>Cost of that time to Brayford</b></td><td class="num"><b>' + fmt(otj.cost) +
        '</b></td></tr></table>' +
        '<p class="warnline">The levy pays for training. It does not pay for the hours. On this plan the ' +
        'unfunded time costs <b>' + fmt(otj.cost) + '</b> against <b>' + fmt(inst1.band * otj.people) +
        '</b> of funded training — and it comes off a shop floor already covered to the hour.</p>'
      : '<p>No published minimum-hours figure for this standard.</p>');

  var f = STDMETA.funding || {}, t = STDMETA.otj || {};
  var doc =
    '<div class="doc"><div class="doc-head">' +
    '<div><h3>Readiness report &mdash; ' + esc(PW.employer.name) + '</h3>' +
    '<p style="margin:5px 0 0;font-size:12.5px">First step into management &middot; ' +
    people.length + ' colleagues</p></div>' +
    '<div class="meta">INDICATIVE · NOT A FUNDING DECISION<br>Generated ' +
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + '</div>' +
    '</div>' + body +
    '<div class="doc-foot">' +
    'Funding rules: ' + esc(RULES.src) + ', verified ' + esc(RULES.asOf) + '.<br>' +
    'Standards, bands and funding status: ' + esc(f.source || '') + ', ' + esc(f.accurateAsOf || '') +
    ', checked ' + esc(f.verifiedOn || '') + '.<br>' +
    'Off-the-job hours: ' + esc(t.source || '') + '.<br>' +
    'Which duties count as management, and which job-description line evidences each, are judgements ' +
    'made for this report and shown in full at step 4.' +
    '</div></div>';

  return { html: doc, sections: sections };
}

function drawStep5() {
  var r = buildReport();
  $('body5').innerHTML =
    '<p class="sub">Everything above, as something you could hand to a finance director. ' +
    'The <b>' + r.sections.length + ' sections</b> below are read back off the document after it is ' +
    'built, not from a list written by hand &mdash; a page that describes a report it has not assembled ' +
    'is how you end up promising a section that is not there.</p>' +
    '<ul class="contents">' + r.sections.map(function (s, i) {
      return '<li>' + (i + 1) + ' · ' + esc(s) + '</li>'; }).join('') + '</ul>' +
    ksbSection() +
    r.html +
    '<div class="row"><button class="btn" id="go5">Pick the apprenticeship &rarr;</button>' +
    '<button class="btn ghost" id="printRep">Open full screen to print</button></div>';

  gate('go5', false, 'Open ' + firstName() + '’s full list of published areas to see the evidence — ' +
       'the rings above are only the summary — then move to the next stage.');
  $('go5').onclick = function () {
    complete(5, r.sections.length + '-section report built', true);
    unlock(6);
    drawStep6();
    goTo(6);
  };
  $('printRep').onclick = function () {
    var w = $('vhost');
    $('vtitle').textContent = 'Readiness report';
    w.innerHTML = '<div style="overflow:auto;height:100%;padding:26px">' + r.html + '</div>';
    $('viewer').hidden = false;
    document.body.style.overflow = 'hidden';
  };
}

/* ── 06 · assign the cohort ──────────────────────────────────────────────
   This step used to pretend to be a choice. It was not much of one — two
   selectable out of five — so it now says plainly that the pathway has been
   picked, gives the reasoning, and spends the interaction somewhere real:
   you assign the people.

   Drag works, and so does clicking, because HTML5 drag-and-drop does not
   exist on touch and is awkward with a keyboard. A demo that only responds
   to a mouse is a demo with a hole in it. */
var chosenStd = null;   /* set to the pathway's first instance once step 6 draws */
var assigned = {};

function drawStep6() {
  var insts = PW.pathway.instances;
  var one = STD[insts[0].ref], two = STD[insts[1].ref];
  chosenStd = insts[0].ref;          /* the pathway is set; step 7 reads this */
  var n = chosen().length;

  var unsuitable = PW.options.list.filter(function (r) { return !r.pick; });

  $('body6').innerHTML =
    '<p class="sub">No menu this time, and it would be dishonest to pretend otherwise. For a retail ' +
    'chain putting supervisors into management on levy money, the funded route is <b>already decided ' +
    'by what is fundable</b> &mdash; so we have picked it, and shown our working below. What is left ' +
    'for you is the part that is genuinely yours: <b>who goes on it</b>.</p>' +

    progCard(insts[0], one, 1, true) +
    progCard(insts[1], two, 2, false) +

    providerNotes() +

    '<p class="assign-note">Drag each name into the first programme &mdash; or just click one, ' +
    'which works the same way.</p>' +
    '<div class="chip-row" id="pool"></div>' +
    '<div class="cohort-out" id="cohortOut"></div>' +

    '<div class="row"><button class="btn" id="go6" disabled>See the five-year pathway &rarr;</button>' +
    '<button class="btn ghost" id="assignAll">Assign all ' + n + '</button></div>' +

    '<details class="work"><summary>Why not the other ' + unsuitable.length +
    ' <span class="chain" id="chain6"></span></summary>' +
    unsuitable.map(function (row) {
      var o = STD[row.ref];
      return '<div class="opt dead" style="cursor:default">' +
        '<div class="oh"><span class="on-name">' + esc(o.name) + '</span>' +
        '<span class="ref">' + esc(o.ref) + '</span>' +
        '<span class="badge gone">' + esc(row.whyShort) + '</span>' +
        '<span class="price">' + fmt(o.band) + ' &times; ' + n + ' = <b>' + fmt(o.band * n) +
        '</b></span></div>' +
        '<p class="oline">' + esc(row.why) + '</p></div>';
    }).join('') +
    '<table class="funnel" id="work6" style="margin-top:14px"></table>' +
    '<p class="ours"><b>The last line is us.</b> The filters leave thirty-odd standards; these ' +
    PW.options.list.length + ' are the ones worth showing, and the ' + unsuitable.length +
    ' marked unsuitable are here deliberately. Team leader is what most people in this position ' +
    'reach for, Data analyst is what a board asks for, and Customer service specialist is the ' +
    'cheapest thing in the right sector. A list that quietly dropped all three would teach you ' +
    'nothing.</p></details>';

  drawWork6();
  drawPool();

  $('assignAll').onclick = function () {
    chosen().forEach(function (p) { assigned[p.id] = 1; });
    drawPool();
  };
  $('go6').onclick = function () {
    complete(6, Object.keys(assigned).length + ' assigned · ' + esc(one.name), true);
    unlock(7);
    drawStep7();
    goTo(7);
  };
  wireDrop();
}

/* These three used to be loose .caveat paragraphs sitting between the
   programme cards, at max-width 76ch while everything around them ran the
   full width of the card — so the one passage a reader most needs to stop
   and read was also the one that looked like a footnote and lined up with
   nothing. They are now a single card the width of the rest, titled to stop
   you, and laid out three-up so the card is filled rather than trailing off.
   The grid is the same auto-fit pattern the recap's notes already use. */
/* small counts read as words in a sentence and as figures in a table; this
   page has the mono/Inter split for exactly that distinction, and "your 3
   receive" sat on the wrong side of it. */
function words(n) {
  return ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
          'ten'][n] || String(n);
}

function providerNotes() {
  var notes = variantNote();
  notes.push(['The links are not endorsements',
    esc(PW.providerLinks.disclosure) + ' ' + esc(PW.providerLinks.whyNotDirect)]);
  return '<div class="stopcard">' +
    '<h3>Stop. We need to explain ' + words(notes.length) + ' things.</h3>' +
    '<p class="stopsub">None of this changes the cost above. All of it changes what you would be ' +
    'buying, so it belongs before you assign anyone rather than in a footnote after.</p>' +
    '<div class="stopgrid">' + notes.map(function (n) {
      return '<div class="stopnote"><b>' + n[0] + '</b><span>' + n[1] + '</span></div>';
    }).join('') + '</div></div>';
}

/* The junior management pathway is one named provider's product, and saying
   so is more honest than "providers do this" — which implicates several
   hundred of them for something one company does openly and discloses on its
   own page. The critical line here is BPP's own words, quoted, not an
   accusation we are making about them. */
function variantNote() {
  var row = PW.options.list.filter(function (r) { return r.variantProvider; })[0];
  if (!row) return [];
  var v = row.variantProvider;
  var o = STD[row.ref];
  return [
    ['Where &ldquo;junior management pathway&rdquo; comes from',
     'The standard is <b>' + esc(o.name) + '</b>. The pathway is <b>' + esc(v.name) + '&rsquo;s ' +
     esc(v.programme) + '</b>, which wraps ' + esc(v.wrap) + ' around it. Their own page puts the ' +
     'important part plainly: <b>&ldquo;' + esc(v.quote) + '&rdquo;</b> &mdash; so the leadership ' +
     'content sits outside the funding, and the certificate your ' + words(chosen().length) +
     ' receive says administration. ' +
     '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">Their programme page</a>, ' +
     'checked ' + esc(v.verified) + '.'],
    ['And this is what catches people out', '<span class="bad">' + esc(v.market) + '</span>']
  ];
}

function progCard(inst, o, step, isDrop) {
  var n = chosen().length;
  return '<div class="prog' + (isDrop ? '' : ' later') + '">' +
    '<div class="prog-h"><span class="yr">Year ' + inst.startYear + ' · step ' + step + '</span>' +
    '<span class="pn">' + esc(o.name) + '</span>' +
    (inst.soldAs ? '<span class="pv">— ' + esc(inst.soldAs) + '</span>' : '') +
    '<span class="pm">L' + o.level + ' · ' + o.months + ' mo · <b>' + fmt(o.band) +
    '</b> each</span></div>' +
    '<p class="proglinks">' +
      '<a href="' + esc(inst.source) + '" target="_blank" rel="noopener">The standard</a>' +
      ' &middot; ' +
      '<a href="' + esc(inst.findProviders) + '" target="_blank" rel="noopener">Who delivers it &rarr;</a>' +
    '</p>' +
    (isDrop
      ? '<div class="drop" id="drop1"></div>'
      : '<p class="assign-note" style="margin-top:10px">The same people move up to this three years ' +
        'later, once they are competent in the first. Nothing to assign &mdash; it follows.</p>') +
    '</div>';
}

function drawPool() {
  var pool = chosen().filter(function (p) { return !assigned[p.id]; });
  var inZone = chosen().filter(function (p) { return assigned[p.id]; });
  var one = STD[PW.pathway.instances[0].ref];

  $('pool').innerHTML = pool.length
    ? pool.map(nameChip).join('')
    : '<span class="assign-note" style="margin:0">All assigned.</span>';

  var d = $('drop1');
  d.className = 'drop' + (inZone.length ? ' full' : '');
  d.innerHTML = inZone.length
    ? inZone.map(nameChip).join('')
    : '<span class="ph">Drop your ' + chosen().length + ' here<br>' +
      '<span style="font-size:11.5px">or click a name below</span></span>';

  var cost = one.band * inZone.length;
  $('cohortOut').innerHTML = inZone.length
    ? 'Cohort <b>' + inZone.length + '</b> of ' + chosen().length + ' · ' + fmt(one.band) +
      ' × ' + inZone.length + ' = <b>' + fmt(cost) + '</b> of levy' +
      (function () {
        var o = otjFor(one.ref, inZone.length);
        return o ? ' · plus ' + fmt(o.cost) + ' of unfunded time' : '';
      })()
    : 'Cohort <b>0</b> of ' + chosen().length;
  gate('go6', inZone.length === chosen().length,
       'Drag the remaining ' + (chosen().length - inZone.length) + ' name' +
       ((chosen().length - inZone.length) === 1 ? '' : 's') + ' onto Business administrator — ' +
       'or click them — then the pathway opens.',
       'All ' + chosen().length + ' on the programme.');
  $('assignAll').hidden = pool.length === 0;
}

function nameChip(p) {
  return '<button class="namechip" draggable="true" data-chip="' + p.id + '">' +
    avatar(p.name) + '<span>' + esc(p.name) +
    '<span class="rl2"> · ' + esc(p.dept) + '</span></span></button>';
}

function wireDrop() {
  var d = $('drop1');
  if (!d) return;
  d.addEventListener('dragover', function (e) { e.preventDefault(); d.classList.add('over'); });
  d.addEventListener('dragleave', function () { d.classList.remove('over'); });
  d.addEventListener('drop', function (e) {
    e.preventDefault(); d.classList.remove('over');
    var id = e.dataTransfer.getData('text/plain');
    if (id) { assigned[id] = 1; drawPool(); }
  });
  $('pool').addEventListener('dragover', function (e) { e.preventDefault(); });
  $('pool').addEventListener('drop', function (e) {
    e.preventDefault();
    var id = e.dataTransfer.getData('text/plain');
    if (id) { delete assigned[id]; drawPool(); }
  });
}

/* delegated so it survives every redraw */
document.addEventListener('dragstart', function (e) {
  var c = e.target.closest && e.target.closest('[data-chip]');
  if (!c) return;
  e.dataTransfer.setData('text/plain', c.getAttribute('data-chip'));
  e.dataTransfer.effectAllowed = 'move';
  c.classList.add('dragging');
});
document.addEventListener('dragend', function (e) {
  var c = e.target.closest && e.target.closest('[data-chip]');
  if (c) c.classList.remove('dragging');
});
/* click does the same job, for touch and keyboard */
document.addEventListener('click', function (e) {
  var c = e.target.closest && e.target.closest('[data-chip]');
  if (!c) return;
  var id = c.getAttribute('data-chip');
  if (assigned[id]) delete assigned[id]; else assigned[id] = 1;
  drawPool();
});

function ladder(o) {
  return Object.keys(STD).filter(function (k) {
    var s = STD[k];
    return s.funded !== false && s.route === o.route && (s.level || 0) > (o.level || 0);
  }).length;
}

function manageCover(ref) {
  var k = PW.ksb[ref];
  if (!k) return null;
  var n = k.areas.filter(function (a) { return a.manages; }).length;
  return { n: n, of: k.areas.length };
}

function drawWork6() {
  if (!$('work6') || !$('chain6')) return;   /* the panel is optional; the step is not */
  var all = Object.values(STD);
  var ROUTES = ['Sales, marketing and procurement', 'Business and administration'];
  var a = all;
  var b = a.filter(function (x) { return x.funded !== false; });
  var c = b.filter(function (x) { return (x.level || 0) === 3 || (x.level || 0) === 4; });
  var d = c.filter(function (x) { return ROUTES.indexOf(x.route) > -1; });
  var e = d.filter(function (x) { return x.src === 'ksb'; });
  $('chain6').textContent = '— ' + a.length + ' → ' + e.length + ' → ' + PW.options.list.length;
  $('work6').innerHTML = funnelRows([
    { label: 'standards in the library', value: String(a.length) },
    { label: 'funded for new starts', value: String(b.length), drop: String(a.length - b.length), indent: true },
    { label: 'level 3 or 4 — a first step into managing', value: String(c.length), drop: String(b.length - c.length), indent: true },
    { label: 'retail or general business route', value: String(d.length), drop: String(c.length - d.length), indent: true },
    { label: 'indexed from published KSBs', value: String(e.length), drop: String(d.length - e.length), indent: true },
    { label: 'put in front of you, including ' + PW.options.list.filter(function (r) { return !r.pick; }).length +
        ' shown as unsuitable', value: String(PW.options.list.length), sum: true }
  ]);
}

/* ── 07 · the five-year pathway ──────────────────────────────────────────
   Two instances of training inside five years, and the gap between them is
   the point rather than dead space: that is where someone is doing the job
   with a funded next rung already visible.

   The bars are the PRACTICAL PERIOD only. End-point assessment adds to each
   and the published standards do not say how much — ST0325's own page gives
   two unreconciled durations — so nothing is drawn for it. A tail of invented
   length would make the timeline look more precise than the source is. */
var YEARS = 5;

/* ── the account, month by month ─────────────────────────────────────────
   Expiry is not "everything you did not spend". Levy lands monthly and each
   month's funds die twelve months later, oldest spent first — so at the end
   of year five the last twelve months of receipts are still ALIVE and have
   not expired at all.

   Subtracting spend from receipts, which is what this page did until it was
   challenged, counts that final year as lost and overstates expiry by a full
   year's levy. The fix is to run the account rather than net it off.

   Draw-down follows the funding rules: 80% in instalments across the
   practical period, the final 20% on completion after end-point assessment. */
function accountModel(programmes) {
  var perMonth = levy.monthly;
  var draws = {};
  programmes.forEach(function (p) {
    if (!p.months || !p.total) return;
    var inst = (p.total * RULES.drawTraining) / p.months;
    for (var i = 0; i < p.months; i++) {
      var m = p.start + i;
      draws[m] = (draws[m] || 0) + inst;
    }
    var done = p.start + p.months + EPA_MONTHS - 1;
    draws[done] = (draws[done] || 0) + p.total * RULES.drawEpa;
  });

  var q = [], received = 0, spent = 0, expired = 0, byYear = {};
  var total = YEARS * 12;
  for (var m = 1; m <= total; m++) {
    q.push({ m: m, amt: perMonth });
    received += perMonth;

    var need = draws[m] || 0;
    spent += need;
    while (need > 1e-9 && q.length) {
      var take = Math.min(need, q[0].amt);
      q[0].amt -= take; need -= take;
      if (q[0].amt < 1e-9) q.shift();
    }
    /* anything that landed RULES.expiryMonths ago and is still here is gone */
    while (q.length && q[0].m <= m - RULES.expiryMonths) {
      var y = Math.ceil(m / 12);
      byYear[y] = (byYear[y] || 0) + q[0].amt;
      expired += q[0].amt;
      q.shift();
    }
  }
  var live = q.reduce(function (t, x) { return t + x.amt; }, 0);
  return { received: received, spent: spent, expired: expired, live: live, byYear: byYear };
}
/* End-point assessment is NOT in a standard's typical duration — ST0325's own
   page says so, and then gives a second duration elsewhere that does not
   reconcile with the first. No standard publishes the EPA window, so three
   months is an assumption, drawn hatched and labelled as one on the page.
   It is the figure EPA organisations commonly quote; it is not from source. */
var EPA_MONTHS = 3;
var EPA_ASSUMED = true;
function pct(y) { return (y / YEARS * 100) + '%'; }

/* ── learners to non-learners ────────────────────────────────────────────
   The ratio is the point, not the expiry. There is no statutory benchmark to
   measure a private employer against — the 2.3% figure people reach for is
   public-sector only, from the Public Sector Apprenticeship Targets
   Regulations 2017, and the publication duty has since lapsed. Borrowing it
   for a retailer would be borrowing authority that does not exist.

   So the comparison is Brayford against its OWN levy: how many it is
   developing, against how many that levy would carry. Both numbers are
   derived here, neither is a standard. */
/* The ceiling that actually binds is local. A chain-wide ratio of 3 in 1,340
   looks like nothing, but if all three sat in one team of eight it would be
   38% of that team out for a morning a week. So the rule is applied per
   department — and it is the author's operating rule, not a published
   standard, which the panel says in those words. */
function deptCheck() {
  var cap = PW.ratio.ceilingPct;
  var byDept = {};
  chosen().forEach(function (p) {
    var d = byDept[p.dept] || (byDept[p.dept] = { size: p.deptSize, who: [] });
    d.who.push(p.name);
  });
  var rows = Object.keys(byDept).map(function (name) {
    var d = byDept[name];
    var share = d.who.length / d.size;
    var over = share > cap;
    return '<tr' + (over ? ' class="indent"' : '') + '><td>' + esc(name) +
      ' <span style="color:var(--muted-2)">· ' + d.who.map(esc).join(', ') + '</span></td>' +
      '<td style="color:' + (over ? 'var(--bad)' : 'var(--good)') + '">' +
      d.who.length + ' of ' + d.size + ' · ' + Math.round(share * 100) + '%' +
      (over ? ' — over' : '') + '</td></tr>';
  }).join('');
  var breaches = Object.keys(byDept).filter(function (k) {
    return byDept[k].who.length / byDept[k].size > cap;
  });

  return '<p class="subhead">The ceiling, applied where it bites</p>' +
    '<p class="sub">A chain-wide ratio hides the thing that actually stops a programme. Three in ' +
    '1,340 is nothing; three out of one team of eight is a morning a week with a third of that ' +
    'team gone. So the limit is <b>' + Math.round(cap * 100) + '% of any one department</b>, not ' +
    'of the workforce.</p>' +
    '<table class="funnel" style="max-width:620px">' + rows + '</table>' +
    '<p class="caveat"><b>This rule is mine, not a published standard.</b> There is no statutory ' +
    'departmental limit. It is here because it is the constraint a real operator hits first &mdash; ' +
    'and because a ratio measured only across a whole workforce will tell you everything is fine ' +
    'right up until a department cannot open.</p>' +
    (breaches.length
      ? '<p class="caveat" style="color:var(--bad)">This cohort puts ' +
        bList(breaches.map(esc)) + ' over the limit.</p>'
      : '<p class="caveat" style="color:var(--good)">This cohort clears it &mdash; the ' +
        chosen().length + ' sit in ' + Object.keys(byDept).length + ' different departments.</p>');
}

function affordable(std) {
  return (std && std.band) ? Math.floor(levy.annual / std.band) : 0;
}

function ratioBlock(n, std) {
  var head = PW.employer.headcount;
  var band = std.band || 0;
  var afford = affordable(std);
  var oneIn = function (k) { return k > 0 ? '1 in ' + Math.round(head / k) : '—'; };
  var pc = function (k) { return (k / head * 100).toFixed(2).replace(/\.00$/, '') + '%'; };

  function bar(k, cls, label, sub) {
    var w = Math.max(0.6, k / head * 100);
    return '<div class="rr"><div class="rr-h"><b>' + label + '</b>' +
      '<span>' + k.toLocaleString('en-GB') + ' of ' + head.toLocaleString('en-GB') +
      ' · ' + pc(k) + ' · <b>' + oneIn(k) + '</b></span></div>' +
      '<div class="rr-t"><i class="' + cls + '" style="width:' + w + '%"></i></div>' +
      '<div class="rr-s">' + sub + '</div></div>';
  }

  var R = PW.ratio;
  var target = Math.round(head * R.targetPct);

  return '<p class="subhead">Learners to non-learners</p>' +
    '<p class="sub">The question this walkthrough is really asking. Not what expires &mdash; ' +
    '<b>how much of your workforce is being developed at any one time</b>.</p>' +
    '<div class="ratio">' +
    bar(n, 'now', 'This cohort', 'the ' + n + ' you chose, on ' + esc(std.name)) +
    bar(afford, 'could', 'What this levy already pays for',
        fmt(levy.annual) + ' a year ÷ ' + fmt(band) + ' a place — starts you could fund ' +
        'annually without spending a penny more than you already have') +
    bar(target, 'target', esc(R.targetName) + ' target',
        Math.round(R.targetPct * 100) + '% of the workforce in earn-and-learn roles. A voluntary ' +
        'charter, not a statutory ratio.') +
    '</div>' +
    '<p class="payoff" style="margin-top:20px"><b>Three of ' + head.toLocaleString('en-GB') +
    ' sounds like nothing. Against the target it is not.</b> ' + n + ' is <b>' +
    (n / target * 100).toFixed(1) + '%</b> of a ' + Math.round(R.targetPct * 100) + '% position ' +
    '&mdash; one cohort, and you are a twentieth of the way there. And the levy you already pay ' +
    'would fund <b>' + afford + ' starts a year</b>, which is <b>' +
    Math.round(afford / target * 100) + '%</b> of that target in a single year.</p>' +
    '<p class="caveat"><b>What the 5% actually covers.</b> The club’s 5% is <b>earn-and-learn ' +
    'broadly</b> &mdash; apprentices, sponsored students and graduates on formalised schemes &mdash; ' +
    'not apprenticeships alone. So ' + target + ' is a wider target than an apprenticeship cohort, ' +
    'and this cohort is a share of it rather than the whole of it. It is a voluntary charter: there ' +
    'is no statutory ratio for a private employer, and the 2.3% figure people reach for is ' +
    'public-sector only with its reporting duty lapsed.</p>' +
    '<p class="caveat">The ceiling is not the money either. At the ' +
    Math.round(R.targetPct * 100) + '% target, off-the-job time alone takes about <b>' +
    (function () {
      var o = STD[PW.pathway.instances[1].ref];
      var wk = o.otjHours / (o.months * 52 / 12);
      return (wk * target / 37.5).toFixed(0);
    })() + ' full-time equivalents</b> off the shop floor, permanently. That is the constraint ' +
    'that binds first.</p>' +
    deptCheck();
}

/* ── walking one of them through the five years ──────────────────────────
   Only on this chart, only on a control, and only with a real person from
   the cohort. The point is to show the model moving — learner, then doing
   the job, then learner again — which a static chart states but does not
   demonstrate. A mascot wandering the whole page would be decoration; this
   is the thing the page is arguing.

   Commentary is derived from the pathway and the standards, not written per
   beat, so it cannot drift from the chart above it. */
function walkBeats(one, two, n) {
  var o1 = STD[one.ref], o2 = STD[two.ref];
  var e1 = one.startYear + o1.months / 12;
  var e2 = two.startYear + o2.months / 12;
  var k1 = ksbFor(walkWho().id, one.ref), k2 = ksbFor(walkWho().id, two.ref);
  var who = walkWho().name.split(' ')[0];
  return [
    { y: 0, t: 'Day one on <b>' + esc(o1.name) + '</b>. ' + who + '’s job already evidences <b>' +
        (k1 ? k1.have + ' of ' + k1.of : '?') + '</b> of its published areas — the rest is what ' +
        'the next ' + o1.months + ' months are for.' },
    { y: e1, t: 'Qualified, ' + o1.months + ' months in, at a cost of <b>' + fmt(o1.band) +
        '</b> of levy and about <b>' + fmt((otjFor(one.ref, 1) || {}).cost || 0) + '</b> of ' +
        who + '’s unfunded time.' },
    { y: 2, t: '<b>Competent.</b> Six months of doing the job unsupervised, which is the part no ' +
        'programme can supply and no invoice shows.' },
    { y: two.startYear, t: 'Starting <b>' + esc(o2.name) + '</b>. On day one of the pathway ' + who +
        ' evidenced only <b>' + (k2 ? k2.have + ' of ' + k2.of : '?') + '</b> of this standard. ' +
        'Three years of the job is what closed the gap — not the training.' },
    { y: e2, t: 'Qualified again, for another <b>' + fmt(o2.band) + '</b>. Two standards, <b>' +
        fmt((o1.band + o2.band)) + '</b> of levy for ' + who + ', out of a levy you pay either way.' },
    { y: 5, t: '<b>Senior.</b> Training stopped at year four. The last year is earning it in the ' +
        'job, which is why the model says five and not four.' }
  ];
}
function walkWho() {
  var c = chosen();
  return c.filter(function (p) { return ksbFor(p.id, PW.pathway.instances[0].ref); })[0] || c[0];
}

var walkAt = -1;
function mountWalker(one, two, n) {
  var track = document.querySelector('#body7 .tl-track');
  if (!track) return;
  var beats = walkBeats(one, two, n);
  var p = walkWho();
  var w = document.createElement('div');
  w.className = 'walker';
  w.innerHTML = avatar(p.name) + '<span class="wt"></span>';
  track.appendChild(w);

  var bar = document.createElement('div');
  bar.className = 'walkbar';
  bar.innerHTML = '<button class="btn ghost" id="walkGo">Walk ' + esc(p.name.split(' ')[0]) +
    ' through it &rarr;</button><span class="wyr" id="walkYr"></span>' +
    '<span class="wsay" id="walkSay">Five years, one colleague, every figure from the chart above.</span>';
  track.parentNode.parentNode.insertBefore(bar, track.parentNode.nextSibling);

  function show(i) {
    walkAt = i;
    var b = beats[i];
    w.style.left = pct(b.y);
    $('walkYr').textContent = 'Year ' + (Math.round(b.y * 10) / 10);
    $('walkSay').innerHTML = b.t;
    $('walkGo').textContent = i >= beats.length - 1
      ? 'Walk it again ↻'
      : 'Next — ' + (i + 2) + ' of ' + beats.length + ' →';
  }
  $('walkGo').onclick = function () {
    show(walkAt >= beats.length - 1 ? 0 : walkAt + 1);
  };
  w.style.left = pct(0);
}

function drawStep7() {
  var n = chosen().length;
  var insts = PW.pathway.instances;
  var one = STD[chosenStd] || STD[insts[0].ref];
  var two = STD[insts[1].ref];
  var diverged = chosenStd && chosenStd !== insts[0].ref;

  var y1 = { start: 0, len: one.months / 12 };
  var y2 = { start: insts[1].startYear, len: two.months / 12 };
  var gapFrom = y1.start + y1.len, gapTo = y2.start;

  var bars =
    '<div class="tl-bar' + (one.funded === false ? ' off' : '') + '" style="left:' + pct(y1.start) +
      ';width:' + pct(y1.len) + '"><span class="bn">' + esc(one.name) + ' L' + one.level + '</span>' +
      '<span class="bm">' + one.months + ' mo · ' + fmt(one.band * n) + '</span></div>' +
    '<div class="tl-bar two" style="left:' + pct(y2.start) + ';width:' + pct(y2.len) + '">' +
      '<span class="bn">' + esc(two.name) + ' L' + two.level + '</span>' +
      '<span class="bm">' + two.months + ' mo · ' + fmt(two.band * n) + '</span></div>' +
    '<div class="tl-epa" style="left:' + pct(y1.start + y1.len) + ';width:' + pct(EPA_MONTHS / 12) +
      '"><span>EPA</span></div>' +
    '<div class="tl-epa two" style="left:' + pct(y2.start + y2.len) + ';width:' + pct(EPA_MONTHS / 12) +
      '"><span>EPA</span></div>' +
    '<div class="tl-gap" style="left:' + pct(gapFrom) + ';width:' + pct(gapTo - gapFrom) + '">' +
      '<span>' + (gapTo - gapFrom).toFixed(1).replace(/\.0$/, '') + ' years doing the job</span></div>' +
    PW.pathway.markers.map(function (m) {
      /* a marker sitting on the right edge would push its label off the chart */
      var edge = m.year / YEARS >= 0.95;
      return '<div class="tl-mark' + (edge ? ' edge' : '') + '" style="left:' + pct(m.year) +
        '" data-label="' + esc(m.label) + '"></div>';
    }).join('');

  var axis = '';
  for (var y = 0; y <= YEARS; y++) axis += '<span style="left:' + pct(y) + '">Y' + y + '</span>';

  /* the money, across the whole five years rather than one invoice */
  var spend = (one.band + two.band) * n;
  var otj1 = otjFor(one.ref, n), otj2 = otjFor(two.ref, n);
  var otjAll = (otj1 ? otj1.cost : 0) + (otj2 ? otj2.cost : 0);
  var acct = accountModel([
    { start: 1, months: one.months, total: one.band * n },
    { start: y2.start * 12 + 1, months: two.months, total: two.band * n }
  ]);
  var levy5 = acct.received;
  var lost = acct.expired;
  var perYear = lost / (YEARS - 1);   /* nothing can expire in year one */
  var couldHave = two.band ? Math.floor(lost / two.band) : 0;

  /* where it goes after year five — computed, not listed by hand */
  var above = Object.keys(STD).map(function (k) { return STD[k]; }).filter(function (s) {
    return s.funded !== false && s.route === two.route && (s.level || 0) > (two.level || 0);
  }).sort(function (a, b) { return (a.level - b.level) || (a.band - b.band); });

  $('body7').innerHTML =
    (diverged
      ? '<p class="sub">You chose <b>' + esc(one.name) + '</b>, which is not where this pathway ' +
        'normally starts. It is drawn with your choice in it so you can see what that does to the ' +
        'shape.</p>'
      : '') +
    '<p class="sub">Two instances of training inside five years. Competent at two, senior at five &mdash; ' +
    'and <b>training occupies about two of those five years</b>. The rest is doing the job.</p>' +
    '<div class="tl-wrap"><div class="tl"><div class="tl-axis">' + axis + '</div>' +
    '<div class="tl-track">' + bars + '</div></div></div>' +
    '<p class="caveat">Solid bars are the <b>practical period</b>, taken from the published standards. ' +
    'The hatched tails are <b>end-point assessment at ' + EPA_MONTHS + ' months &mdash; an assumption, ' +
    'not a published figure</b>. A standard&rsquo;s typical duration excludes EPA and none of them states ' +
    'the window; ' + esc(two.name) + '&rsquo;s own page gives two durations that do not reconcile. ' +
    'Three months is what assessment organisations commonly quote, so it is drawn hatched and said out ' +
    'loud rather than folded silently into a solid bar.</p>' +

    '<div class="tally">' +
    '<div class="t spend"><div class="k">Training, 5 years</div><div class="v">' + fmt(spend) +
      '</div><div class="s">' + n + ' people × 2 programmes</div></div>' +
    '<div class="t"><div class="k">Levy over 5 years</div><div class="v">' + fmt(levy5) +
      '</div><div class="s">at ' + fmt(levy.annual) + ' a year</div></div>' +
    '<div class="t waste"><div class="k">Dies every year</div><div class="v">' + fmt(perYear) +
      '</div><div class="s">' + fmt(lost) + ' over the five — four annual losses, not a balance</div></div>' +
    '<div class="t"><div class="k">Unfunded time</div><div class="v">' + fmt(otjAll) +
      '</div><div class="s">both programmes, your cost</div></div>' +
    '</div>' +
    ratioBlock(n, two) +

    '<div class="check"><h3>The gap is the product</h3>' +
    '<p>Those <b>' + (gapTo - gapFrom).toFixed(1).replace(/\.0$/, '') + ' years</b> between the two ' +
    'programmes are not idle. That is someone doing the job they have just qualified for, with a funded ' +
    'next rung already visible. It is the part that keeps people, and it costs nothing.</p>' +
    '<p>The other finding is about <b>how few people are in it</b>. ' + n + ' of ' +
    PW.employer.headcount.toLocaleString('en-GB') + ' is one colleague in <b>' +
    Math.round(PW.employer.headcount / n) + '</b>. The levy already pays for <b>' + affordable(two) +
    ' starts a year</b> at this band &mdash; so the constraint on developing more of Brayford is not ' +
    'the money, which has already left the payroll either way.</p>' +
    '<p>It is the two things steps 3 and 4 found: only <b>' +
    TEAM.filter(function (p) { return eligible(p.id); }).length + ' of ten</b> had a job that ' +
    'evidenced anything an assessor could look at, and the <b>' + fmt(otjAll) + '</b> of off-the-job ' +
    'time comes off a shop floor covered to the hour. Widening the ratio means widening roles and ' +
    'finding cover &mdash; not finding budget.</p>' +
    '<p>Unspent levy does expire on a rolling ' + RULES.expiryMonths + '-month clock, about <b>' +
    fmt(perYear) + ' a year</b> on this plan. Worth knowing; not the point. The point is the ratio ' +
    'below.</p></div>' +

    '<p class="subhead">After year five</p>' +
    '<p class="sub">Where ' + esc(two.name) + ' leads, if they stay. <b>' + above.length + '</b> funded ' +
    'standards sit above it in the same route &mdash; counted from the library, not chosen by us.</p>' +
    '<ul class="rungs">' +
    /* ALL of them, not above.slice(0, 3). The sentence above counts the full
       list and then boasts that it is "counted from the library, not chosen
       by us" — and the next line chose three. It read "6 funded standards sit
       above it" over a list of three, and the three it cut included Retail
       leadership, the one most obviously next for a retail manager. */
    above.map(function (s) {
      return '<li><span class="rn">' + esc(s.name) + '</span>' +
        '<span class="rl">L' + s.level + '</span>' +
        '<span class="rd">' + s.months + ' months</span>' +
        '<span class="rb">' + fmt(s.band) + '</span></li>';
    }).join('') + '</ul>' +

    '<div class="endrow" id="endActions">' +
      '<button class="btn" id="recapGo">Recap the five years &rarr;</button>' +
      '<button class="btn ghost" id="printGo">Print the report</button>' +
      '<button class="btn ghost" id="restart">Start again</button>' +
    '</div>';

  $('recapGo').onclick = openRecap;
  $('printGo').onclick = printReport;
  $('restart').onclick = function () {
    picked = {}; chosenStd = null; assigned = {};
    [7, 6, 5, 4, 3, 2].forEach(function (i) {
      var s = step(i);
      s.className = 'step locked';
      var b = s.querySelector('.reopen'); if (b) b.hidden = true;
      $('sum' + i).innerHTML = '';
    });
    ['body4', 'body5', 'body6', 'body7'].forEach(function (id) {
      /* the pre-render state of a stage, which a visitor reaches by starting
         again. "Built next." read like a note to self about an unfinished
         project; this says what is actually true of the stage in front of
         them. */
      $(id).innerHTML = '<p class="sub">Opens when the stage before it is done.</p>';
    });
    step(1).className = 'step active';
    $('sum1').innerHTML = '';
    step(1).querySelector('.reopen').hidden = true;
    $('why3').innerHTML = '';
    drawTeam();
    lightActs();
    /* restart sets the step classes directly rather than going through
       complete(), so the stepper never heard about it and kept reading 7 of 7 */
    syncStepper();
    goTo(1);
  };

  mountWalker(insts[0], insts[1], n);

  /* Stage 7 was ticked here, by being drawn. Same objection as stage 2, and
     the same principle — but the opposite answer, because the stages differ
     in kind. Stages 1 to 6 complete by doing the thing that opens the next
     one; stage 7 has no next one, so there is nothing to press and a button
     saying "I have finished reading" would be invented furniture. What
     finishing the last stage actually means is reaching the end of it, so
     that is what is watched: the closing row, once it has been in view. */
  var end = $('endActions');
  if (end) onceInView(end, function () {
    complete(7, fmt(spend) + ' over 5 years · ' + fmt(lost) + ' expired', false);
  });
}

/* Second time in this file a rendering-lifecycle API turns out not to run.
   IntersectionObserver was the obvious way to ask "has the closing row been
   seen", and measured, it never delivers at all in a surface that is not
   being composited — exactly like requestAnimationFrame, and silent in
   exactly the same way: the element is squarely in the viewport, the
   callback simply never comes. So the question is answered off the same
   event-and-interval driver as the pointer, which is known to run. */
var INVIEW = [];
function onceInView(el, fn) { INVIEW.push({ el: el, fn: fn }); checkInView(); }
function checkInView() {
  for (var i = INVIEW.length - 1; i >= 0; i--) {
    var w = INVIEW[i], r = w.el.getBoundingClientRect();
    if (!r.height) continue;
    var shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (shown / r.height >= 0.4) { INVIEW.splice(i, 1); w.fn(); }
  }
}

/* ── the recap ───────────────────────────────────────────────────────────
   Seven beats, assembled from what this visitor actually did rather than
   written in advance — a run with different people and a different pay bill
   recaps differently.

   It plays. Press play and it runs itself with the figure counting up and the
   context boxes staggering in around it; otherwise step through with Next,
   Back or the arrow keys. It does NOT autoplay on open: a thing that starts
   moving before you have asked is a thing you have to chase.

   Under prefers-reduced-motion every transition goes away and play is
   disabled rather than merely slowed — motion is the point of play, so
   offering it without motion would be a dead control. */
function recapCards() {
  var insts = PW.pathway.instances;
  var one = STD[insts[0].ref], two = STD[insts[1].ref];
  var n = chosen().length;
  var ready = TEAM.filter(function (p) { return eligible(p.id); }).length;
  var sel = TEAM.filter(function (p) { return selectable(p.id); }).length;
  var areas = PW.coverage.areas;
  var yes = chosen().reduce(function (t, p) { return t + tally(p.id).yes.length; }, 0);
  var k1 = chosen().filter(function (p) { var k = ksbFor(p.id, one.ref); return k && k.pass; }).length;
  var k2 = chosen().filter(function (p) { var k = ksbFor(p.id, two.ref); return k && k.pass; }).length;
  var acct = accountModel([
    { start: 1, months: one.months, total: one.band * n },
    { start: insts[1].startYear * 12 + 1, months: two.months, total: two.band * n }
  ]);
  var spend = (one.band + two.band) * n;
  var head = PW.employer.headcount;
  var holes = areas.filter(function (a) {
    return !chosen().some(function (p) { return tally(p.id).yes.indexOf(a) > -1; });
  });
  var F1 = ksbSet(one.ref), F2 = ksbSet(two.ref);

  return [
    { k: 'Your levy', v: fmt(levy.annual), tail: ' a year',
      s: 'Before you decide anything, this is already leaving the payroll.',
      c: [['Where it comes from', head.toLocaleString('en-GB') + ' staff at the published UK ' +
            'average salary makes a ' + fmt(payBill) + ' pay bill'],
          ['How it is worked out', 'Half a per cent of it, less the ' + fmt(RULES.allowance) +
            ' allowance, a twelfth at a time'],
          ['The part people miss', 'You pay this whether you use it or not']] },

    { k: 'And it does not wait', v: RULES.expiryMonths + ' months', tail: '',
      s: 'Each month of levy dies ' + RULES.expiryMonths + ' months after it lands.',
      c: [['Arriving', fmt(levy.monthly) + ' every month, oldest spent first'],
          ['What it would buy', affordable(two) + ' starts a year on ' + esc(two.name)],
          ['Not a savings pot', 'Nothing accumulates — there is no balance to come back to']] },

    { k: 'Who could actually go', v: sel + ' of ' + TEAM.length, tail: '',
      s: 'You started with ten names and a budget for far more than ten.',
      c: [['Nothing to assess', (TEAM.length - ready) + ' have jobs that give an assessor ' +
            'nothing to look at'],
          ['A year away', (ready - sel) + ' are held back rather than refused — the plan for ' +
            'them is four things, not a no'],
          ['The bar', 'Opportunity, not competence. Nobody has to be good at managing to start ' +
            'learning it']] },

    { k: 'What their jobs evidence', v: yes + ' of ' + (n * areas.length), tail: '',
      s: 'Of the six management duties, across the ' + n + ' you chose.',
      c: [['The hole', holes.length ? 'Nobody evidences ' + bList(holes.map(esc)) +
            ' at all' : 'All six appear somewhere across the three'],
          ['Whose problem', 'This is a finding about the jobs, not the people'],
          ['When it has to close', 'Before anyone enrols — an apprentice is assessed on work ' +
            'they actually do']] },

    /* this was "2 of 3, then 0 of 3" in the headline slot -- two figures and
       a clause where every other slide has one short figure, so it alone ran
       wide and the set looked unset. The second figure moves to the tail,
       which is what the tail is for. */
    { k: 'Against the real standards', v: k1 + ' of ' + n, tail: 'then ' + k2 + ' of ' + n,
      s: 'Clearing the 50% line on the first standard, then on the second.',
      c: [[esc(one.name), (F1 ? F1.items.length : 21) + ' published knowledge, skills and ' +
            'behaviours, each read against every job description'],
          [esc(two.name), (F2 ? F2.items.length : 16) + ' published areas — and ' +
            (k2 === 0 ? 'not one of them clears it' : k2 + ' clear it')],
          ['Why that matters', 'It is the reason the second programme sits three years out ' +
            'rather than beside the first']] },

    { k: 'What you committed', v: fmt(spend), tail: '',
      s: n + ' colleagues, two standards, five years.',
      c: [['From the levy', fmt(one.band) + ' then ' + fmt(two.band) + ' a head, out of money ' +
            'already gone from the payroll'],
          ['What it does not cover', fmt((otjFor(one.ref, n) || {}).cost + (otjFor(two.ref, n) || {}).cost) +
            ' of off-the-job time, which nobody funds'],
          ['Against receipts', fmt(acct.received) + ' of levy arrived over the same five years']] },

    { k: 'And what died anyway', v: fmt(acct.expired / 4), tail: ' a year',
      s: 'The same loss, four times over.',
      c: [['Across the five', fmt(acct.expired) + ' expired unused'],
          ['Not a balance', 'Levy lands monthly and dies twelve months later — this is a ' +
            'repeating annual loss, not a pot'],
          ['The actual constraint', 'Never the money. It was how many jobs were ready']] }
  ];
}

var recapAt = 0, recapTimer = null, recapPlaying = false;

function openRecap() {
  /* A second click while one is already open used to stack another overlay on
     top of the first -- an empty stage over a live one, so the recap went
     blank and stayed blank, and the duplicate left its background canvas
     registered with the field, which went on painting to it. On the page the
     button sits behind the overlay so you cannot reach it, but anything that
     calls this twice (a keyboard shortcut, a script, a double fire) hit it. */
  if ($('recap')) return;
  var cards = recapCards();
  var still = reduced();
  var host = document.createElement('div');
  host.id = 'recap';
  host.innerHTML =
    '<canvas class="rc-bg" aria-hidden="true"></canvas>' +
    '<div class="rc-bar"><span class="rc-n" id="rcN"></span>' +
    '<span class="rc-track"><i id="rcFill"></i></span>' +
    (still ? '' : '<button class="btn ghost" id="rcPlay">&#9654; Play</button>') +
    '<button class="btn ghost" id="rcSkip">Skip to the end</button>' +
    '<button class="btn ghost" id="rcClose">Close &times;</button></div>' +
    '<div class="rc-stage" id="rcStage"></div>' +
    '<div class="rc-foot"><button class="btn ghost" id="rcPrev">&larr; Back</button>' +
    '<button class="btn" id="rcNext">Next &rarr;</button></div>';
  document.body.appendChild(host);
  if (window.bgSurface) bgSurface.add(host.querySelector('.rc-bg'));
  document.body.style.overflow = 'hidden';
  recapAt = 0; recapPlaying = false;
  show(0, 1);

  function show(i, dir) {
    var prev = $('rcStage').firstElementChild;
    if (prev && !still) {
      prev.classList.add(dir > 0 ? 'rc-out-l' : 'rc-out-r');
      setTimeout(function () { if (prev.parentNode) prev.remove(); }, 420);
    } else if (prev) { prev.remove(); }

    recapAt = i;
    var c = cards[i];
    var col = stepColour(i + 1, cards.length);
    var card = document.createElement('div');
    card.className = 'rc-card' + (still ? '' : (dir > 0 ? ' rc-in-r' : ' rc-in-l'));
    card.style.setProperty('--stepc', col);
    card.style.setProperty('--stepc-ink', stepInk(i + 1, cards.length));
    card.innerHTML =
      '<div class="rc-k">' + esc(c.k) + '</div>' +
      '<div class="rc-v"><span id="rcVal">' + c.v + '</span><span class="rc-tail">' +
        esc(c.tail || '') + '</span></div>' +
      '<div class="rc-s">' + c.s + '</div>' +
      '<div class="rc-notes">' + c.c.map(function (n, j) {
        return '<div class="rc-note" style="animation-delay:' + (still ? 0 : 0.34 + j * 0.16) +
          's"><b>' + esc(n[0]) + '</b><span>' + n[1] + '</span></div>';
      }).join('') + '</div>';
    $('rcStage').appendChild(card);
    if (!still) countUp($('rcVal'), c.v);

    $('rcN').textContent = (i + 1) + ' of ' + cards.length;
    $('rcFill').style.width = ((i + 1) / cards.length * 100) + '%';
    $('rcPrev').disabled = i === 0;
    $('rcNext').hidden = false;                 /* restored: showEnd hides these */
    $('rcSkip').hidden = false;
    if ($('rcPlay')) $('rcPlay').hidden = false;
    $('rcNext').textContent = i === cards.length - 1 ? 'Finish →' : 'Next →';
  }

  /* The last beat used to drop you straight back onto the page. A film that
     cuts to the menu the instant the last frame lands is missing its ending,
     and the three things a reader might want next were down the page behind
     the overlay they had just been thrown out of. So the end is a slide like
     any other, and reachable with Back. */
  function go(d) {
    var next = recapAt + d;
    if (next < 0 || next > cards.length) { stop(); return; }
    if (next === cards.length) { stop(); showEnd(); return; }
    show(next, d);
  }

  function showEnd() {
    var prev = $('rcStage').firstElementChild;
    if (prev && !still) {
      prev.classList.add('rc-out-l');
      setTimeout(function () { if (prev.parentNode) prev.remove(); }, 420);
    } else if (prev) { prev.remove(); }

    recapAt = cards.length;
    var names = chosen().map(function (x) { return esc(x.name); });
    var card = document.createElement('div');
    card.className = 'rc-card rc-end' + (still ? '' : ' rc-in-r');
    card.style.setProperty('--stepc', stepColour(cards.length, cards.length));
    card.style.setProperty('--stepc-ink', stepInk(cards.length, cards.length));
    card.innerHTML =
      '<div class="rc-k">That is the walkthrough</div>' +
      '<div class="rc-end-h">Thank you for going through it</div>' +
      '<p class="rc-end-s">You costed a five-year management pathway for ' +
      bList(names) + ' at ' + esc(PW.employer.name) + ' &mdash; on published standards and the ' +
      'funding rules as they stand today. This has been a guided example of how you might ' +
      'organise training with real funds, and change real futures for the better.</p>' +
      '<div class="rc-end-opts">' +
        '<button class="btn" id="rcAgain">Replay the recap</button>' +
        '<button class="btn ghost" id="rcPrint">Print the report</button>' +
        '<button class="btn ghost" id="rcRestart">Start again</button>' +
      '</div>';
    $('rcStage').appendChild(card);

    $('rcN').textContent = 'End';
    $('rcFill').style.width = '100%';
    $('rcNext').hidden = true;
    $('rcSkip').hidden = true;
    if ($('rcPlay')) $('rcPlay').hidden = true;
    $('rcPrev').disabled = false;

    $('rcAgain').onclick = function () { show(0, 1); };
    /* print and restart both leave first: the recap is a fixed overlay at
       z-index 80, so printing through it prints the overlay, and restarting
       behind it leaves you looking at a finished recap of a plan that no
       longer exists. */
    $('rcPrint').onclick = function () { closeRecap(false); setTimeout(printReport, 80); };
    $('rcRestart').onclick = function () {
      closeRecap(false);
      setTimeout(function () { if ($('restart')) $('restart').click(); }, 80);
    };
    $('rcAgain').focus();
  }
  function tick() { recapTimer = setTimeout(function () { go(1); if (recapPlaying) tick(); }, 5200); }
  function stop() {
    recapPlaying = false; clearTimeout(recapTimer);
    if ($('rcPlay')) $('rcPlay').innerHTML = '&#9654; Play';
  }

  $('rcNext').onclick = function () { stop(); go(1); };
  $('rcPrev').onclick = function () { stop(); go(-1); };
  $('rcSkip').onclick = function () { stop(); show(cards.length - 1, 1); };
  $('rcClose').onclick = function () { stop(); closeRecap(false); };
  if ($('rcPlay')) $('rcPlay').onclick = function () {
    if (recapPlaying) return stop();
    recapPlaying = true;
    $('rcPlay').innerHTML = '&#10073;&#10073; Pause';
    if (recapAt === cards.length - 1) show(0, 1);
    tick();
  };
  $('rcNext').focus();
}

/* numbers settle rather than appear — only on the numeric part, and only when
   motion is allowed */
function countUp(el, text) {
  var m = String(text).match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return;
  var target = +m[2].replace(/,/g, '');
  if (!isFinite(target) || target < 10) return;
  var t0 = null, dur = 620;
  function frame(t) {
    if (!t0) t0 = t;
    var k = Math.min(1, (t - t0) / dur);
    var e = 1 - Math.pow(1 - k, 3);
    el.textContent = m[1] + Math.round(target * e).toLocaleString('en-GB') + m[3];
    if (k < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function closeRecap(finished) {
  recapPlaying = false; clearTimeout(recapTimer);
  /* every one of them, not just the first getElementById finds */
  [].forEach.call(document.querySelectorAll('#recap'), function (h) {
    if (window.bgSurface) bgSurface.remove(h.querySelector('.rc-bg'));
    h.remove();
  });
  document.body.style.overflow = '';
  if (finished) {
    var f = $('endActions');
    if (f) f.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
  }
}
document.addEventListener('keydown', function (e) {
  if (!$('recap')) return;
  if (e.key === 'Escape') closeRecap(false);
  if (e.key === 'ArrowRight') $('rcNext').click();
  if (e.key === 'ArrowLeft') $('rcPrev').click();
  if (e.key === ' ' && $('rcPlay')) { e.preventDefault(); $('rcPlay').click(); }
});

/* Print is a different artefact from the screen. The recap is seven dark
   full-bleed cards and would print appallingly; the report is a document and
   prints fine once the page stops being black. They share their SOURCE, not
   their styling. */
function printReport() {
  document.documentElement.classList.add('printing');
  var r = buildReport();
  var host = document.createElement('div');
  host.id = 'printdoc';
  host.innerHTML = r.html + ksbSection();
  document.body.appendChild(host);
  var done = function () {
    document.documentElement.classList.remove('printing');
    var h = $('printdoc'); if (h) h.remove();
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  setTimeout(function () { window.print(); setTimeout(done, 800); }, 60);
}

/* ── developer tools ─────────────────────────────────────────────────────
   Off unless you ask for it: add ?dev to the URL, or press Ctrl+Shift+D.
   A hiring reader opening the plain link never sees this.

   "Run to" drives the REAL controls in sequence — it clicks the same buttons
   a visitor would and waits for each gate to open. If a gate is broken, this
   stalls on it rather than sailing past, which is the only version of a skip
   button worth having. */
var DEV = /[?&]dev\b/.test(location.search) || location.hash === '#dev';

function devWait(fn, ms) {
  var end = Date.now() + (ms || 4000);
  return new Promise(function (res, rej) {
    (function poll() {
      if (fn()) return res(true);
      if (Date.now() > end) return rej(new Error('timed out waiting'));
      setTimeout(poll, 40);
    })();
  });
}

function devRunTo(target) {
  var log = $('devLog');
  var say = function (t) { if (log) log.textContent = t; };
  return (async function () {
    try {
      if ($('splash') && !$('splash').classList.contains('gone')) $('enter').click();
      await devWait(function () { return !$('go1').disabled; });
      if (target <= 1) return say('at 1');

      say('1 → levy');
      $('go1').click();
      await devWait(function () { return !step(2).classList.contains('locked'); });
      $('go2').click();
      await devWait(function () { return !step(3).classList.contains('locked'); });
      if (target <= 3) return say('at 3');

      say('3 → picking ' + PICK);
      for (var i = 0; i < PICK; i++) {
        var c = document.querySelectorAll('.person:not(.blocked)')[i];
        if (!c) throw new Error('only ' + i + ' selectable');
        c.click();
        await devWait(function () { return true; }, 200);
      }
      await devWait(function () { return !$('go3').disabled; });
      $('go3').click();
      await devWait(function () { return !!document.querySelector('#body4 .learner'); });
      if (target <= 4) return say('at 4');

      say('4 → opening evidence');
      document.querySelector('#body4 .learner details').open = true;
      await devWait(function () { return !$('go4').disabled; });
      $('go4').click();
      await devWait(function () { return !!document.querySelector('#body5 .learner details'); });
      if (target <= 5) return say('at 5');

      say('5 → opening breakdown');
      document.querySelectorAll('#body5 .learner details')[0].open = true;
      await devWait(function () { return !$('go5').disabled; });
      $('go5').click();
      await devWait(function () { return !!$('assignAll'); });
      if (target <= 6) return say('at 6');

      say('6 → assigning');
      $('assignAll').click();
      await devWait(function () { return !$('go6').disabled; });
      $('go6').click();
      await devWait(function () { return !!$('recapGo'); });
      say('complete — at 7');
    } catch (err) {
      say('STALLED: ' + err.message);
      if (window.console) console.warn('[dev] stalled', err);
    }
  })();
}

function mountDev() {
  if (!DEV || $('devbar')) return;
  var el = document.createElement('div');
  el.id = 'devbar';
  el.innerHTML = '<b>dev</b>' +
    [1, 3, 4, 5, 6, 7].map(function (n) {
      return '<button data-dev="' + n + '">' + n + '</button>';
    }).join('') +
    '<button data-dev="7" class="pri">complete</button>' +
    '<button data-devreset="1">reset</button>' +
    '<span id="devLog"></span>';
  document.body.appendChild(el);
  el.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-devreset')) {
      if ($('restart')) { $('restart').click(); $('devLog').textContent = 'reset'; }
      else location.reload();
      return;
    }
    devRunTo(+b.getAttribute('data-dev'));
  });
}
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
    DEV = !DEV;
    if (DEV) mountDev();
    else { var d = $('devbar'); if (d) d.remove(); }
  }
});

/* ── the in-page viewer ──────────────────────────────────────────────────
   Everything stays on this page. The iframe is built on open rather than
   sitting hidden in the markup, because a hidden iframe either loads 5MB
   nobody asked for or, with loading="lazy", never loads at all. */
function openViewer(src, title) {
  $('vtitle').innerHTML = title || src;
  var host = $('vhost');
  host.innerHTML = '';
  var f = document.createElement('iframe');
  f.src = src;
  f.title = String(title || src).replace(/&mdash;/g, '—');
  host.appendChild(f);
  $('viewer').hidden = false;
  document.body.style.overflow = 'hidden';
  $('vclose').focus();
}
function closeViewer() {
  $('viewer').hidden = true;
  $('vhost').innerHTML = '';          /* drop the 5MB again on close */
  document.body.style.overflow = '';
}
document.addEventListener('click', function (e) {
  var v = e.target.closest && e.target.closest('[data-view]');
  if (v) { openViewer(v.getAttribute('data-view'), v.getAttribute('data-title')); return; }
  if (e.target.id === 'vclose') closeViewer();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !$('viewer').hidden) closeViewer();
});


/* -- the pointer ---------------------------------------------------------
   The gate above says WHAT is missing. It says it in a line next to a
   disabled button, which on these cards is usually below the fold, so a
   reader who has not scrolled sees a step that will not open and no reason
   given. The pointer adds the one thing the gate cannot know: WHERE.

   It contributes nothing else. Whether it is showing, and whether it reads
   as owed or as settled, is taken from the gate's own button -- so there is
   no second opinion to keep in step, and the pointer cannot tell you to do
   something the gate has already accepted. The only thing authored here is
   a target per step, which is the part no amount of state can derive.

   No motion: it is a halo, a tag and, when the thing is off screen, a pill
   that scrolls it back. Dynamics come after this, deliberately. */
var AIM = {
  1: { btn: 'go1', say: 'Line this up with Brayford’s mark',
       at: function () { return document.querySelector('#s1 .sliderwrap'); } },
  2: { btn: 'go2', say: 'Read how it lands',
       at: function () { return document.querySelector('#s2 .readout'); } },
  3: { btn: 'go3', say: 'Pick three from here',
       at: function () { return $('team'); } },
  4: { btn: 'go4', say: 'Open one of these',
       at: function () { return shut('#body4 .learner details'); } },
  5: { btn: 'go5', say: 'Open one of these',
       at: function () { return shut('#body5 .learner details'); } },
  6: { btn: 'go6', say: 'Drag a name onto the programme',
       at: function () { return $('pool'); } }
};

/* the first one still closed -- so after you open the second, it stops
   pointing at the first as though nothing had happened */
function shut(sel) {
  var all = document.querySelectorAll(sel);
  for (var i = 0; i < all.length; i++) if (!all[i].open) return all[i];
  return all[0] || null;
}

/* the frontier: the first step that is open for work and not finished.
   Reopening a done step to review it does not move this, which is right --
   the thing you still owe is still the thing you owe. */
function liveStep() {
  var all = document.querySelectorAll('.step');
  for (var i = 0; i < all.length; i++) {
    if (!all[i].classList.contains('locked') && !all[i].classList.contains('done')) {
      return +all[i].getAttribute('data-n');
    }
  }
  return 0;
}

function aimBlocked() {
  /* the splash blocks only while it is actually on screen. Reading the class
     alone was enough until something took the splash away by another route,
     and then the pointer stayed off for the rest of the run with nothing to
     show why -- so ask whether it is laid out at all as well. */
  var sp = $('splash');
  if (sp && sp.offsetParent !== null && !sp.classList.contains('gone')) return true;
  if ($('recap')) return true;
  var v = $('viewer');
  if (v && !v.hidden) return true;
  return false;
}

function aimTarget() {
  var n = liveStep(), a = AIM[n];
  if (!a) return null;
  var s = step(n);
  if (!s || s.classList.contains('folded')) return null;
  var b = $(a.btn);
  /* gate released: the only thing left to find is the button itself */
  if (b && !b.disabled) {
    /* its own label is better copy than anything generic: "See the readiness
       report" tells you what continuing gets you. */
    return { el: b, say: b.textContent.replace(/\s*\u2192\s*$/, '').trim(), ready: true };
  }
  var el = a.at();
  return el ? { el: el, say: a.say, ready: false } : null;
}

var aimLast = '';
/* Driven by events and a slow interval, NOT by requestAnimationFrame. Worth
   saying why: measured in this app's own preview pane, rAF fires zero times
   a second even with document.visibilityState === 'visible', because frames
   are only produced for a surface that is actually being composited. A
   pointer hung off rAF is therefore a pointer that is sometimes simply not
   there, with nothing in the console to say so. Scroll and resize keep it
   glued during movement; the interval catches the state changes no listener
   here knows about, like a panel rendered after a fetch. */
function aim() {
  checkInView();
  var halo = $('halo'), nudge = $('nudge');
  if (!halo || !nudge) return;
  var t = aimBlocked() ? null : aimTarget();
  if (!t) {
    if (aimLast !== 'off') { halo.className = ''; nudge.className = ''; aimLast = 'off'; }
    return;
  }

  var r = t.el.getBoundingClientRect();
  if (!r.width && !r.height) return;
  var st = $('stepper');
  var top = (st && st.classList.contains('show')) ? st.offsetHeight : 0;
  var vis = r.bottom > top + 10 && r.top < window.innerHeight - 10;

  /* one key per distinct state, so a still page writes nothing at all */
  var key = [t.say, Math.round(r.top), Math.round(r.left), Math.round(r.width),
             Math.round(r.height), t.ready, vis, top].join('|');
  if (key === aimLast) return;
  aimLast = key;

  var cls = t.ready ? ' ready' : '';
  halo.className = vis ? 'on' + cls : '';
  if (vis) {
    halo.style.left = (r.left - 6) + 'px';
    halo.style.top = (r.top - 5) + 'px';
    halo.style.width = (r.width + 12) + 'px';
    halo.style.height = (r.height + 10) + 'px';
  }

  /* the pill says it whether or not the target is on screen: on screen it
     names what is owed, off screen it is also the way back to it */
  nudge.className = 'on' + cls;
  nudge.innerHTML =
    (vis ? '' : '<i>' + (r.top >= window.innerHeight ? '↓' : '↑') + '</i>') +
    '<span>' + esc(t.say) + '</span>' +
    (vis ? '' : '<u>take me</u>');
  nudge.setAttribute('aria-label', t.say + (vis ? '' : ' — scroll to it'));
}

$('nudge').addEventListener('click', function () {
  var t = aimTarget();
  if (!t) return;
  t.el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
  if (t.ready && t.el.focus) t.el.focus();
});

['scroll', 'resize'].forEach(function (ev) {
  window.addEventListener(ev, aim, { passive: true });
});
['click', 'input', 'change', 'keyup', 'drop', 'dragend'].forEach(function (ev) {
  document.addEventListener(ev, function () { setTimeout(aim, 0); }, true);
});
document.addEventListener('toggle', function () { setTimeout(aim, 0); }, true);
setInterval(aim, 160);
aim();



/* -- the cohort constellation --------------------------------------------
   Points drifting, drawing a line to whichever neighbours come close enough:
   a network forming and dissolving. Chosen out of the seven in lab/, and it
   was the one carrying a standing objection: long, bright, horizontal lines
   are the shape of a line of text, so it fights the reading.

   First attempt answered that by dimming the lines to a third. It worked,
   and it was the wrong fix -- what was left read as dust, not as a network,
   so the thing chosen was not the thing shipped. The objection is specific:
   lines BEHIND BODY COPY. So the fix is structural instead. The card surface
   was rgba(11,20,38,.5), half transparent, which is what put the drawing
   under the paragraphs in the first place; at .9 the text sits on its own
   ground and the constellation lives in the gutters and the rail column,
   where it can be as bright as it likes. Lines are back up to .15 and reach
   135px, and they cross no text at all.

   Contrast was measured too, against real body copy, and it was never the
   question: every size passes both bare and through a card by a factor of
   two or more. The lab page found the same thing about all seven.

   It draws one frame synchronously before asking for any, so a surface that
   never composites -- see the pointer -- still gets a field rather than an
   empty canvas. Under prefers-reduced-motion that single frame is all it
   ever draws.

   The links are gone: loose stars, no lines. Which also retires the standing
   objection the sketch carried -- long horizontal lines being the shape of a
   line of text -- so it no longer depends on the near-solid card surface to
   stay out of the way, though that is worth keeping on its own merits. With
   nothing joining them the points have to carry the field themselves, so
   there are about three times as many and they vary in size and brightness;
   a grid of identical dots reads as a texture, not as a sky. */
(function () {
  var C = document.getElementById('bg');
  if (!C || !C.getContext) return;
  /* More than one canvas can show this field, because the recap is an opaque
     overlay and the constellation has to carry on behind it rather than stop
     dead. They share the node list, so what the overlay shows is the same
     field at the same moment -- open the recap and nothing jumps. */
  var surfaces = [{ c: C, x: C.getContext('2d') }];
  var X = surfaces[0].x;
  var W = 0, H = 0, DPR = 1, nodes = [];
  var STARS_PER = 9500;            /* one star per this many css pixels */

  /* The links take the rail's colour at wherever you have got to, so the
     field cools from red to cyan-green as you descend, exactly as the spine
     beside it does. It reuses the stops the rail already has rather than
     inventing a second gradient, and it follows the SCROLL rather than the
     active stage, so it moves continuously instead of snapping at each card.

     With the recap open there is no scroll to read, so it follows the slide
     instead -- taken off the card's own --stepc, so the two cannot disagree.

     With the links gone the stars carry it, so the rail colour is mixed into
     them rather than applied flat -- they stay starlight with a cast, not
     coloured dots. */
  var TINT = [0xc9, 0x44, 0x3a], WANT = TINT.slice();

  function hexRGB(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function railMix(t) {
    t = Math.max(0, Math.min(1, t)) * (RAIL_STOPS.length - 1);
    var i = Math.floor(t), f = t - i;
    var a = hexRGB(RAIL_STOPS[i]), b = hexRGB(RAIL_STOPS[Math.min(i + 1, RAIL_STOPS.length - 1)]);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  function wantTint() {
    var card = document.querySelector('#recap .rc-card');
    if (card) {
      var c = (card.style.getPropertyValue('--stepc') || '').trim();
      return /^#[0-9a-f]{6}$/i.test(c) ? hexRGB(c) : hexRGB(RAIL_STOPS[RAIL_STOPS.length - 1]);
    }
    var steps = document.querySelectorAll('.step');
    if (!steps.length) return TINT;
    var top = steps[0].getBoundingClientRect().top + window.pageYOffset;
    var bot = steps[steps.length - 1].getBoundingClientRect().bottom + window.pageYOffset;
    if (bot <= top) return TINT;
    return railMix((window.pageYOffset + window.innerHeight * 0.5 - top) / (bot - top));
  }

  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    /* clientWidth, not innerWidth: innerWidth counts the scrollbar, so the
       bitmap came out 15px wider than the box it is drawn into and the whole
       field was squashed 1.5% horizontally. */
    W = C.clientWidth; H = C.clientHeight;
    surfaces.forEach(function (s) {
      s.c.width = Math.round(W * DPR); s.c.height = Math.round(H * DPR);
      s.x.setTransform(DPR, 0, 0, DPR, 0, 0);
    });
    var n = Math.max(40, Math.min(190, Math.round(W * H / STARS_PER)));
    while (nodes.length > n) nodes.pop();
    while (nodes.length < n) nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
      /* weighted toward the faint: a sky is mostly small stars with a few
         bright ones, and an even spread reads as a dot grid */
      r: 0.5 + Math.pow(Math.random(), 2.1) * 1.5,
      a: 0.1 + Math.pow(Math.random(), 1.9) * 0.4
    });
    draw(false);
  }

  function draw(move) {
    if (move) {
      WANT = wantTint();
      /* eased rather than snapped: on the page a fast scroll would otherwise
         strobe through six colours, and in the recap each slide would cut. */
      for (var t = 0; t < 3; t++) TINT[t] += (WANT[t] - TINT[t]) * 0.055;
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
    }
    for (var si = 0; si < surfaces.length; si++) paint(surfaces[si].x);
  }

  function paint(X) {
    X.clearRect(0, 0, W, H);
    /* starlight, carrying a cast of the rail colour rather than becoming it */
    var r = (190 + (TINT[0] - 190) * 0.42) | 0;
    var g = (214 + (TINT[1] - 214) * 0.42) | 0;
    var b = (236 + (TINT[2] - 236) * 0.42) | 0;
    var head = 'rgba(' + r + ',' + g + ',' + b + ',';
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i];
      X.fillStyle = head + p.a.toFixed(3) + ')';
      X.beginPath(); X.arc(p.x, p.y, p.r, 0, 6.3); X.fill();
    }
  }

  /* an overlay borrows the field by handing over a canvas of its own */
  window.bgSurface = {
    add: function (el) {
      if (!el || !el.getContext) return;
      var x = el.getContext('2d');
      el.width = Math.round(W * DPR); el.height = Math.round(H * DPR);
      x.setTransform(DPR, 0, 0, DPR, 0, 0);
      surfaces.push({ c: el, x: x });
      paint(x);                       /* so it is there on the first frame */
    },
    remove: function (el) {
      surfaces = surfaces.filter(function (s) { return s.c !== el; });
    }
  };

  TINT = wantTint().slice();       /* so the single static frame is not red */
  size();
  window.addEventListener('resize', size, { passive: true });
  if (reduced()) return;           /* the one frame above is the whole of it */

  (function frame() {
    requestAnimationFrame(frame);
    if (document.visibilityState === 'hidden') return;
    draw(true);
  })();
})();

/* ── wiring ──────────────────────────────────────────────────────────────── */
$('enter').addEventListener('click', function () {
  $('splash').classList.add('gone');
  setTimeout(function () { goTo(1); }, 200);
});
$('paybill').addEventListener('input', function () { setPayBill(+this.value); });
$('snapBack').onclick = function () {
  setPayBill(PW.employer.payBill, true);
  $('go1').focus();
};
$('go1').addEventListener('click', function () {
  complete(1, fmt(levy.annual) + '/yr on a ' + fmtM(payBill) + ' pay bill', true);
  unlock(2);
  drawStep2();
  goTo(2);
});
/* Stage 2 used to be ticked by the line above, the moment you left stage 1 —
   so you arrived at the readout to find it already marked done, and stage 3
   already open beneath it. A tick is a claim that you did the thing; on a
   stage whose thing is READ THIS, the only honest signal is you saying so.
   Hence a control, like every other stage, which the pointer then aims at. */
$('go2').addEventListener('click', function () {
  complete(2, fmt(levy.monthly) + '/mo \u00b7 ' + RULES.expiryMonths + '-month clock', true);
  unlock(3);
  goTo(3);
});
document.addEventListener('click', function (e) {
  if (e.target.id === 'whyX') { $('why3').innerHTML = ''; return; }
  var el = e.target.closest && e.target.closest('.person');
  if (!el) return;
  var id = +el.getAttribute('data-p');
  var person = TEAM.filter(function (p) { return p.id === id; })[0];
  if (!eligible(id)) { explain(person); return; }      /* nothing to assess at all */
  if (!selectable(id)) { couldDo(person); return; }    /* thin: not this year, here is why */
  if (picked[id]) { delete picked[id]; $('why3').innerHTML = ''; }
  else { picked[id] = 1; $('why3').innerHTML = ''; }   /* was adviseIfWeaker(), which
    could never render: selectable() already excludes anyone isWeaker() flags, so its own
    first line returned every time. Clearing the panel was the whole of its live effect. */
  drawTeam();
});
$('go3').addEventListener('click', function () {
  var names = chosen().map(function (p) { return p.name.split(' ')[0]; });
  complete(3, names.join(', '), true);
  unlock(4);
  drawStep4();
  goTo(4);
});

/* ── load the governed data ──────────────────────────────────────────────── */
var RULES_URL = 'https://raw.githubusercontent.com/ACGroup21/ACGroup21-ac-funding-data/main/funding-rules.json';

function num(o, path, fallback) {
  var v = path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o);
  if (v && typeof v === 'object' && 'value' in v) v = v.value;
  return (typeof v === 'number' && isFinite(v)) ? v : fallback;
}

Promise.all([
  fetch(RULES_URL).then(function (r) { return r.json(); }).catch(function () { return null; }),
  fetch('data/standards.json').then(function (r) { return r.json(); }),
  fetch('data/pathway.json').then(function (r) { return r.json(); })
]).then(function (res) {
  var c = res[0];
  if (c) {
    RULES.levyRate = num(c, 'levy.rate', RULES.levyRate);
    RULES.allowance = num(c, 'levy.allowance', RULES.allowance);
    RULES.topUp = num(c, 'levy.topUp', RULES.topUp);
    /* A rate of nought is the one value that needs its reason carried with it.
       The rulebook holds why it is nought, what it used to be, and the gov.uk
       page that says so; taking the number and leaving those behind is how a
       page ends up stating a rule change as though it were a rounding. */
    var tu = (c.levy || {}).topUp;
    if (tu && typeof tu === 'object') {
      RULES.topUpWas = (typeof tu.valueBefore === 'number') ? tu.valueBefore : null;
      RULES.topUpNote = tu.note || '';
      RULES.topUpSrc = tu.source || '';
      RULES.topUpAsOf = tu.asOf || RULES.asOf;
    }
    RULES.expiryMonths = num(c, 'expiry.monthsFrom', RULES.expiryMonths);
    RULES.drawTraining = num(c, 'delivery.drawTraining', RULES.drawTraining);
    RULES.drawEpa = num(c, 'delivery.drawEpa', RULES.drawEpa);
    RULES.asOf = (c.meta && c.meta.asOf) || RULES.asOf;
    RULES.version = (c.meta && c.meta.version) || '';
    RULES.src = 'canonical rulebook ' + RULES.version;
  }
  STD = res[1].standards;
  STDMETA = res[1].meta || {};
  PW = res[2];

  $('provSum').innerHTML = 'Rules verified <b>' + esc(RULES.asOf) + '</b> &middot; standards ' +
    esc(((STDMETA.funding || {}).accurateAsOf) || '') + ' &middot; <b>where these figures come from &darr;</b>';
  $('stampRules').innerHTML = 'Funding rules: <b>' + (RULES.levyRate * 100).toFixed(1) + '%</b> levy &middot; ' +
    '<b>' + fmt(RULES.allowance) + '</b> allowance &middot; <b>' + Math.round(RULES.topUp * 100) + '%</b> top-up &middot; ' +
    '<b>' + RULES.expiryMonths + '-month</b> expiry &middot; ' + esc(RULES.src) + ', verified <b>' + esc(RULES.asOf) + '</b>';

  var all = Object.keys(STD).length;
  var defunded = Object.keys(STD).filter(function (k) { return STD[k].funded === false; }).length;
  var f = (STDMETA.funding || {});
  $('stampStds').innerHTML = 'Standards: <b>' + all + '</b> in the library &middot; <b>' + defunded +
    '</b> defunded for new starts &middot; ' + esc(f.source || 'Skills England') + ', ' +
    esc(f.accurateAsOf || '') + ', checked <b>' + esc(f.verifiedOn || '') + '</b>';

  setPayBill(PW.employer.payBill, true);   /* open on Brayford, not on a default */
  drawTeam();
  drawWork3();
  paintRail();
  lightActs();
  mountStepper();
  mountDev();
  syncStepper();
}).catch(function (err) {
  $('stampRules').innerHTML = 'Could not load the funding data — figures below are not trustworthy.';
  if (window.console) console.error(err);
});
