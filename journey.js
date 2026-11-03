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
function andList(a, sep) {
  if (a.length < 2) return a.join('');
  return a.slice(0, -1).join((sep || '</b>, <b>')) + '</b> and <b>' + a[a.length - 1];
}

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
}
function complete(n, summary, foldable) {
  var s = step(n);
  if (!s) return;
  s.classList.remove('active');
  s.classList.add('done');
  if (summary != null) $('sum' + n).innerHTML = summary;
  if (foldable) {
    s.classList.add('folded');
    var b = s.querySelector('.reopen');
    if (b) b.hidden = false;
  }
  lightActs();
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

/* An act lights once anything inside it is reachable, so the three labels on
   the rail fill in as you descend rather than all being lit from the start. */
var ACT_FIRST = { 'The money': 1, 'The people': 3, 'The decision': 6 };
function lightActs() {
  [].forEach.call(document.querySelectorAll('.act'), function (a) {
    var first = ACT_FIRST[a.getAttribute('data-act')];
    var s = step(first);
    a.classList.toggle('lit', !!s && !s.classList.contains('locked'));
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
    { label: '+ government top-up ' + Math.round(RULES.topUp * 100) + '%',
      value: RULES.topUp ? '+' + fmt(levy.monthly - (levy.mGross - levy.mAllow)) : '£0', indent: true },
    { label: 'into your account that month', value: fmt(levy.monthly), sum: true },
    { label: '× 12 months', value: fmt(levy.annual) + '/yr', indent: true }
  ]);
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
    var ok = eligible(p.id);
    return '<button class="person' + (picked[p.id] ? ' on' : '') + (ok ? '' : ' blocked') +
      '" data-p="' + p.id + '"' + (ok ? '' : ' aria-disabled="true"') + '>' +
      avatar(p.name) +
      '<span class="nm">' + esc(p.name) + '</span>' +
      '<span class="rl">' + esc(p.role) + ' · ' + p.yrs + ' yr' + (p.yrs === 1 ? '' : 's') + '</span>' +
      '<span class="nt">' + esc(p.note) + '</span>' +
      (ok ? (isWeaker(p.id) ? '<span class="flag soft">Thinner evidence</span>' : '')
          : '<span class="flag">Not yet — why?</span>') + '</button>';
  }).join('');

  var ready = TEAM.filter(function (p) { return eligible(p.id); }).length;
  var n = chosen().length;
  $('count3').innerHTML =
    '<b>' + ready + ' of your ' + TEAM.length + '</b> can be put forward today. ' +
    (n === 0 ? 'Pick <b>' + PICK + '</b>.'
      : n < PICK ? 'Picked <b>' + n + '</b> — choose ' + (PICK - n) + ' more.'
      : n === PICK ? '<b>' + PICK + ' chosen.</b> Everything below now runs on your ' + PICK + '.'
      : '<b>' + n + ' chosen</b> — more than ' + PICK + ' works, the cost just scales.');
  $('go3').disabled = n < PICK;
}
function chosen() {
  return TEAM.filter(function (p) { return picked[p.id]; });
}

/* why a particular person cannot be put forward — derived from the mapping,
   not written per person, so it cannot drift from the evidence in step 4 */
function explain(p) {
  var t = tally(p.id);
  var areas = PW.coverage.areas;
  var has = t.part.length
    ? 'Their job description touches <b>' + t.part.map(esc).join('</b> and <b>') + '</b>, but only in ' +
      'part &mdash; ' + (t.part.length === 1 ? 'it is' : 'they are') + ' a by-product of the job rather ' +
      'than the job itself.'
    : 'Their job description touches <b>none</b> of the six.';
  $('why3').innerHTML =
    '<div class="why"><h4>' + esc(p.name) + '’s job has nothing to assess yet</h4>' +
    '<p><b>Nobody has to be good at managing to start learning it</b> &mdash; that is what the ' +
    'apprenticeship is for. The bar here is not competence. It is <b>opportunity</b>: an apprentice ' +
    'is assessed on work they actually do, so the role has to let them practise it somewhere.</p>' +
    '<p>' + has + ' With nothing to point an assessor at, ' + esc(p.name.split(' ')[0]) + ' would ' +
    'spend eighteen months learning the theory of a job they are never given, and fail an end-point ' +
    'assessment on evidence they had no chance to produce.</p>' +
    '<p><b>So this is a statement about the job, not about ' + esc(p.name.split(' ')[0]) + '.</b> ' +
    'They may be the most capable person on the list &mdash; the tool has no way of knowing that and ' +
    'will not pretend to.</p>' +
    '<p><b>Change the job first</b>, and they qualify immediately: one of ' +
    '<b>' + andList(areas.map(esc)) + '</b> as a real, standing responsibility. Not mastery of it ' +
    '&mdash; just the chance to do it badly at first, which is the whole point.</p>' +
    '<p><button class="dismiss" id="whyX">Close this</button></p></div>';
  $('why3').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
}

/* Advice, not a veto. Two of the five who CAN be put forward evidence less
   than the other three, and picking one is a worse use of the same £5,000 —
   but it is a legitimate choice an employer might make for reasons the tool
   cannot see, so it says so and gets out of the way. */
function adviseIfWeaker(p) {
  if (!isWeaker(p.id)) { $('why3').innerHTML = ''; return; }
  var t = tally(p.id);
  var better = ranked().slice(0, PICK).filter(function (x) { return !picked[x.p.id]; });
  $('why3').innerHTML =
    '<div class="why"><h4>' + esc(p.name) + ' is a thinner bet &mdash; your call</h4>' +
    '<p>Their job description clearly evidences <b>' + t.yes.length + '</b> of the six' +
    (t.part.length ? ' and touches <b>' + t.part.length + '</b> more in part' : '') +
    '. That is enough of a foothold to be assessed on, so they are not blocked — and being '+
      'thin on management is not a reason to exclude anyone from learning it.</p>' +
    (better.length
      ? '<p>But <b>' + andList(better.map(function (x) { return esc(x.p.name); })) +
        '</b> evidence more for <b>the same ' + fmt((STD[PW.pathway.instances[0].ref] || {}).band || 0) +
        '</b>, and would start with less of their role to change first.</p>'
      : '') +
    '<p>You may still have good reasons &mdash; retention, succession, someone who has been waiting. ' +
    'The tool cannot see any of that, so it is <b>not stopping you</b>.</p>' +
    '<p><button class="dismiss" id="whyX">Close this</button></p></div>';
}

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
      '<details><summary>Their job description, and what each line evidences</summary>' +
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

function ksbFor(id) {
  var F = PW.ksbFull;
  if (!F) return null;
  var ev = F.evidenced[String(id)];
  if (!ev) return null;
  var by = {};
  KSB_GROUPS.forEach(function (g) { by[g[0]] = { have: 0, of: 0 }; });
  var items = F.items.map(function (it) {
    var line = ev[it.code];
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

function ksbCard(p, std) {
  var k = ksbFor(p.id);
  if (!k) return '';
  return '<div class="learner">' +
    '<div class="ksb-h">' + ring(k.pct, !k.pass) +
    '<div class="ksb-who"><div class="n">' + esc(p.name) + '</div>' +
    '<div class="r">' + esc(p.role) + '</div></div>' +
    '<span class="ksb-band' + (k.pass ? '' : ' low') + '">' +
      (k.pass ? 'Compatible — gaps to develop' : 'Below the 50% guidance line') + '</span>' +
    '<div class="ksb-tot"><b>' + k.have + '</b> of ' + k.of + ' evidenced<br>' +
      (k.of - k.have) + ' to develop</div></div>' +
    '<div class="ksb-areas">' + KSB_GROUPS.map(function (g) {
      var b = k.by[g[0]];
      return '<div class="ka ' + g[0] + '"><span class="kl">' + g[1] + '</span>' +
        '<span class="kb"><i style="width:' + (b.have / b.of * 100) + '%"></i></span>' +
        '<span class="kn">' + b.have + ' / ' + b.of + '</span></div>';
    }).join('') + '</div>' +
    '<details><summary>All ' + k.of + ' knowledge, skills and behaviours</summary>' +
    '<ul class="ksb-list">' + k.items.map(function (x) {
      return '<li class="' + (x.jd != null ? 'ev' : '') + '">' +
        '<span class="c">' + esc(x.it.code) + '</span><span>' +
        (x.jd != null ? '<b>' + esc(x.it.area) + '</b>' : esc(x.it.area)) +
        (x.jd != null ? '<span class="ln">' + esc(p.jd[x.jd]) + '</span>' : '') +
        '</span></li>';
    }).join('') + '</ul></details></div>';
}

function ksbSection() {
  var std = STD[chosenStd] || STD[PW.pathway.instances[0].ref];
  var F = PW.ksbFull;
  if (!F || F.ref !== std.ref) {
    return '<p class="subhead">Coverage against the standard</p>' +
      '<p class="sub">Per-KSB coverage has been read for <b>' + esc(STD[F.ref].name) + '</b> only. ' +
      'Pick that standard at step 6 to see it &mdash; measuring against ' + esc(std.name) +
      ' would need its own pass, and estimating it would be the thing this page refuses to do.</p>';
  }
  var ppl = chosen().filter(function (p) { return F.evidenced[String(p.id)]; });
  var tot = ppl.reduce(function (t, p) { var k = ksbFor(p.id); return t + k.have; }, 0);
  var max = ppl.length * F.items.length;
  var below = ppl.filter(function (p) { return !ksbFor(p.id).pass; });

  return '<p class="subhead">Coverage against the standard</p>' +
    '<p class="sub">Each job description read against <b>all ' + F.items.length + ' published ' +
    'knowledge, skills and behaviours</b> of ' + esc(std.name) + ' &mdash; ' + F.items.filter(
      function (i) { return i.group === 'K'; }).length + ' knowledge, ' + F.items.filter(
      function (i) { return i.group === 'S'; }).length + ' skills, ' + F.items.filter(
      function (i) { return i.group === 'B'; }).length + ' behaviours. <b>' + tot + ' of ' + max +
    '</b> evidenced across your ' + ppl.length + '.</p>' +
    ppl.map(function (p) { return ksbCard(p, std); }).join('') +
    (below.length
      ? '<p class="caveat"><b>' + andList(below.map(function (p) { return esc(p.name); })) +
        '</b> ' + (below.length === 1 ? 'sits' : 'sit') + ' below the 50% line. That is not a bar to ' +
        'starting &mdash; it is a measure of how much of the role has to widen first, and where.</p>'
      : '') +
    '<p class="caveat"><b>How this was measured.</b> ' + esc(F._method) + ' ' +
    esc(F._codes) + ' <a href="' + esc(F.source) + '" target="_blank" rel="noopener">The standard ' +
    'on Skills England</a>, checked ' + esc(F.checked) + '.</p>';
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
      '<tr><td><b>Left unspent against this year’s levy</b></td><td class="num"><b>' +
        fmt(Math.max(0, levy.annual - inst1.band * people.length)) + '</b></td></tr></table>') +

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

function progCard(inst, o, step, isDrop) {
  var n = chosen().length;
  return '<div class="prog' + (isDrop ? '' : ' later') + '">' +
    '<div class="prog-h"><span class="yr">Year ' + inst.startYear + ' · step ' + step + '</span>' +
    '<span class="pn">' + esc(o.name) + '</span>' +
    (inst.soldAs ? '<span class="pv">— ' + esc(inst.soldAs) + '</span>' : '') +
    '<span class="pm">L' + o.level + ' · ' + o.months + ' mo · <b>' + fmt(o.band) +
    '</b> each</span></div>' +
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
  $('go6').disabled = inZone.length === 0;
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
      ? '<p class="caveat" style="color:var(--bad)">This cohort puts <b>' +
        andList(breaches.map(esc)) + '</b> over the limit.</p>'
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
      return '<div class="tl-mark" style="left:' + pct(m.year) + '" data-label="' + esc(m.label) + '"></div>';
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
    '<div class="t waste"><div class="k">Expires unused</div><div class="v">' + fmt(lost) +
      '</div><div class="s">about ' + fmt(perYear) + ' <b>every year</b></div></div>' +
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
    above.slice(0, 3).map(function (s) {
      return '<li><span class="rn">' + esc(s.name) + '</span>' +
        '<span class="rl">Level ' + s.level + '</span>' +
        '<span class="rm">' + s.months + ' months · <b>' + fmt(s.band) + '</b></span></li>';
    }).join('') + '</ul>' +

    '<div class="row"><button class="btn ghost" id="restart">Start again &rarr;</button></div>';

  $('restart').onclick = function () {
    picked = {}; chosenStd = null; assigned = {};
    [7, 6, 5, 4, 3, 2].forEach(function (i) {
      var s = step(i);
      s.className = 'step locked';
      var b = s.querySelector('.reopen'); if (b) b.hidden = true;
      $('sum' + i).innerHTML = '';
    });
    ['body4', 'body5', 'body6', 'body7'].forEach(function (id) {
      $(id).innerHTML = '<p class="sub">Built next.</p>';
    });
    step(1).className = 'step active';
    $('sum1').innerHTML = '';
    step(1).querySelector('.reopen').hidden = true;
    $('why3').innerHTML = '';
    drawTeam();
    lightActs();
    goTo(1);
  };

  complete(7, fmt(spend) + ' over 5 years · ' + fmt(lost) + ' expired', false);
}

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
  complete(2, null, false);
  unlock(3);
  goTo(2);
});
document.addEventListener('click', function (e) {
  if (e.target.id === 'whyX') { $('why3').innerHTML = ''; return; }
  var el = e.target.closest && e.target.closest('.person');
  if (!el) return;
  var id = +el.getAttribute('data-p');
  var person = TEAM.filter(function (p) { return p.id === id; })[0];
  if (!eligible(id)) { explain(person); return; }   /* blocked: explain, do not select */
  if (picked[id]) { delete picked[id]; $('why3').innerHTML = ''; }
  else { picked[id] = 1; adviseIfWeaker(person); }
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
  lightActs();
}).catch(function (err) {
  $('stampRules').innerHTML = 'Could not load the funding data — figures below are not trustworthy.';
  if (window.console) console.error(err);
});
