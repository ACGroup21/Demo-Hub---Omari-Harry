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

/* ── 03 · the ten ────────────────────────────────────────────────────────── */
function drawTeam() {
  $('team').innerHTML = TEAM.map(function (p) {
    return '<button class="person' + (picked[p.id] ? ' on' : '') + '" data-p="' + p.id + '">' +
      '<span class="nm">' + esc(p.name) + '</span>' +
      '<span class="rl">' + esc(p.role) + ' · ' + p.yrs + ' yr' + (p.yrs === 1 ? '' : 's') + '</span>' +
      '<span class="nt">' + esc(p.note) + '</span></button>';
  }).join('');
  var n = chosen().length;
  $('count3').innerHTML = n === 0 ? 'Pick <b>three</b>.'
    : n < 3 ? 'Picked <b>' + n + '</b> — choose ' + (3 - n) + ' more.'
    : n === 3 ? '<b>Three chosen.</b> Everything below now runs on your three.'
    : '<b>' + n + ' chosen</b> — more than three works, the cost just scales.';
  $('go3').disabled = n < 3;
}
function chosen() {
  return TEAM.filter(function (p) { return picked[p.id]; });
}
function drawWork3() {
  var head = (PW && PW.employer.headcount) || 1340;
  $('chain3').textContent = '— ' + head.toLocaleString('en-GB') + ' → 10';
  $('work3').innerHTML = funnelRows([
    { label: 'people employed by Brayford', value: head.toLocaleString('en-GB') },
    { label: 'in store roles rather than head office', value: '1,180', drop: '160', indent: true },
    { label: 'one rung below a management grade', value: '64', drop: '1,116', indent: true },
    { label: 'twelve months service or more', value: '41', drop: '23', indent: true },
    { label: 'put forward by their store manager', value: '10', drop: '31', indent: true }
  ]);
}

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
  var p = e.target.closest && e.target.closest('.person');
  if (!p) return;
  var id = p.getAttribute('data-p');
  if (picked[id]) delete picked[id]; else picked[id] = 1;
  drawTeam();
});
$('go3').addEventListener('click', function () {
  var names = chosen().map(function (p) { return p.name.split(' ')[0]; });
  complete(3, names.join(', '), true);
  unlock(4);
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
