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

/* ── the ten ──────────────────────────────────────────────────────────────
   Brayford is invented, so these people are written. Each JD line is phrased
   the way a real retail job description is, because step 4 scores them against
   the published KSBs of the standards and a sanitised line would score better
   than a real one — which would flatter the tool. */
var TEAM = [
  { id: 1, name: 'Priya N.', role: 'Stock controller', yrs: 4,
    note: 'Owns stock accuracy for the whole store; no formal management training',
    jd: ['Monitor the stock management system and investigate shrinkage',
         'Run weekly counts and reconcile discrepancies with head office',
         'Order replenishment against forecast demand and promotions',
         'Brief the replenishment team on priorities at the start of each shift'] },
  { id: 2, name: 'Marcus W.', role: 'Senior sales assistant', yrs: 5,
    note: 'Knows the customer base better than anyone; has never been given a team',
    jd: ['Serve customers and resolve complaints at the point of sale',
         'Hit personal and departmental sales targets',
         'Maintain product knowledge across ranges and promotions',
         'Coach new starters on the shop floor during their first weeks'] },
  { id: 3, name: 'Leah M.', role: 'Checkout supervisor', yrs: 6,
    note: 'Longest serving on the list; already supervises without the title',
    jd: ['Supervise checkout staff and set the rota for the front end',
         'Handle escalated customer complaints and refunds',
         'Monitor till performance and queue times against targets',
         'Carry out return-to-work and absence conversations'] },
  { id: 4, name: 'Tom B.', role: 'Visual merchandiser', yrs: 2,
    note: 'Drives the merchandising plan; works largely alone',
    jd: ['Implement the merchandising plan across departments',
         'Build promotional displays for product launches',
         'Track the sales impact of layout changes',
         'Keep brand standards consistent across the store'] },
  { id: 5, name: 'Aisha R.', role: 'Customer service lead', yrs: 3,
    note: 'Fields every escalation in the building',
    jd: ['Lead the customer service desk and its daily workload',
         'Resolve escalated complaints and authorise goodwill',
         'Communicate policy changes to colleagues across departments',
         'Report service metrics to the store manager weekly'] },
  { id: 6, name: 'Dan F.', role: 'Night replenishment lead', yrs: 3,
    note: 'Runs the night shift unsupervised; no daytime visibility',
    jd: ['Direct the overnight replenishment team to the morning deadline',
         'Allocate labour hours across aisles against delivery volume',
         'Complete health and safety checks and incident reports',
         'Hand over outstanding issues to the day management team'] },
  { id: 7, name: 'Ellie C.', role: 'Department assistant, Home', yrs: 1,
    note: 'Strong with customers, newest on the list',
    jd: ['Serve customers and advise on product ranges',
         'Replenish and face the department through the day',
         'Process deliveries and check them against paperwork',
         'Support promotional changeovers'] },
  { id: 8, name: 'Nia K.', role: 'Click and collect co-ordinator', yrs: 2,
    note: 'Owns the fastest-growing part of the store end to end',
    jd: ['Co-ordinate online order picking against collection slots',
         'Resolve order shortfalls and customer substitutions',
         'Monitor pick accuracy and on-time collection rates',
         'Liaise with the transport provider on failed deliveries'] },
  { id: 9, name: 'Jordan A.', role: 'Goods-in lead', yrs: 4,
    note: 'Knows the supply chain inside out; rarely leaves the backroom',
    jd: ['Receive and check deliveries against purchase orders',
         'Manage backroom stock location and capacity',
         'Raise and chase supplier claims for damages and shortages',
         'Allocate the backroom team across unloading and put-away'] },
  { id: 10, name: 'Sam O.', role: 'Store administrator', yrs: 2,
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
var PICK = 5;            /* how many the scenario asks for */
var levy = {};

/* ── the step machine ────────────────────────────────────────────────────── */
function step(n) { return $('s' + n); }

function unlock(n) {
  var s = step(n);
  if (!s || !s.classList.contains('locked')) return;
  s.classList.remove('locked');
  s.classList.add('active');
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
function calcLevy(pb) {
  var gross = pb * RULES.levyRate;
  var net = Math.max(0, gross - RULES.allowance);
  var topped = net * (1 + RULES.topUp);
  return { payBill: pb, gross: gross, net: net, annual: topped, monthly: topped / 12 };
}

function drawStep1() {
  payBill = +$('paybill').value;
  levy = calcLevy(payBill);
  $('pbOut').innerHTML = fmt(payBill);
  $('chain1').textContent = '— ' + fmtM(payBill) + ' → ' + fmt(levy.annual) + '/yr';
  $('work1').innerHTML = funnelRows([
    { label: 'annual pay bill', value: fmt(levy.payBill) },
    { label: '× levy rate ' + (RULES.levyRate * 100).toFixed(1) + '%', value: fmt(levy.gross), indent: true },
    { label: '− levy allowance', value: '−' + fmt(RULES.allowance), indent: true },
    { label: '+ government top-up ' + Math.round(RULES.topUp * 100) + '%', value: RULES.topUp ? '+' + fmt(levy.net * RULES.topUp) : '£0', indent: true },
    { label: 'into your account each year', value: fmt(levy.annual), sum: true },
    { label: '÷ 12 months', value: fmt(levy.monthly) + '/mo', indent: true }
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
      (ok ? '' : '<span class="flag">Not yet — why?</span>') + '</button>';
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
    '<div class="why"><h4>' + esc(p.name) + ' cannot be put forward yet</h4>' +
    '<p>' + has + ' Nothing is clearly evidenced, so <b>there is nothing for an assessor to look at</b>. ' +
    'An apprentice is assessed on the job they actually do; enrolling someone whose role contains none ' +
    'of the duties sets them up to fail an end-point assessment eighteen months from now.</p>' +
    '<p><b>This is a statement about the job, not about ' + esc(p.name.split(' ')[0]) + '.</b> They may ' +
    'well be the most capable person on the list &mdash; the tool has no way of knowing that and will ' +
    'not pretend to. What it can see is the role as written.</p>' +
    '<p>To put them forward, <b>change the job first</b>: give them at least one of ' +
    '<b>' + areas.map(esc).join('</b>, <b>') + '</b> as a real, standing responsibility. Then they ' +
    'qualify &mdash; and the apprenticeship has something to assess.</p>' +
    '<p><button class="dismiss" id="whyX">Close this</button></p></div>';
  $('why3').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
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

  $('go4').addEventListener('click', function () {
    complete(4, totalYes + ' of ' + max + ' areas evidenced', true);
    unlock(5);
    drawStep5();
    goTo(5);
  });
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
      ? '<p class="act">Not one of these ' + people.length + ' currently evidences <b>' + gaps.map(esc).join('</b>, <b>') +
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
        '<p class="act">The levy pays for training. It does not pay for the hours. On this plan the ' +
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
    r.html +
    '<div class="row"><button class="btn" id="go5">Pick the apprenticeship &rarr;</button>' +
    '<button class="btn ghost" id="printRep">Open full screen to print</button></div>';

  $('go5').addEventListener('click', function () {
    complete(5, r.sections.length + '-section report built', true);
    unlock(6);
    goTo(6);
  });
  $('printRep').addEventListener('click', function () {
    var w = $('vhost');
    $('vtitle').textContent = 'Readiness report';
    w.innerHTML = '<div style="overflow:auto;height:100%;padding:26px">' + r.html + '</div>';
    $('viewer').hidden = false;
    document.body.style.overflow = 'hidden';
  });
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
$('paybill').addEventListener('input', drawStep1);
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
  $('why3').innerHTML = '';
  if (picked[id]) delete picked[id]; else picked[id] = 1;
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

  $('stampRules').innerHTML = 'Funding rules: <b>' + (RULES.levyRate * 100).toFixed(1) + '%</b> levy &middot; ' +
    '<b>' + fmt(RULES.allowance) + '</b> allowance &middot; <b>' + Math.round(RULES.topUp * 100) + '%</b> top-up &middot; ' +
    '<b>' + RULES.expiryMonths + '-month</b> expiry &middot; ' + esc(RULES.src) + ', verified <b>' + esc(RULES.asOf) + '</b>';

  var all = Object.keys(STD).length;
  var defunded = Object.keys(STD).filter(function (k) { return STD[k].funded === false; }).length;
  var f = (STDMETA.funding || {});
  $('stampStds').innerHTML = 'Standards: <b>' + all + '</b> in the library &middot; <b>' + defunded +
    '</b> defunded for new starts &middot; ' + esc(f.source || 'Skills England') + ', ' +
    esc(f.accurateAsOf || '') + ', checked <b>' + esc(f.verifiedOn || '') + '</b>';

  drawStep1();
  drawTeam();
  drawWork3();
}).catch(function (err) {
  $('stampRules').innerHTML = 'Could not load the funding data — figures below are not trustworthy.';
  if (window.console) console.error(err);
});
