/* ═══════════════════════════════════════════════════════════════════════════
   The guided journey.

   The three-panel version worked but had no stakes — a visitor saw three boxes
   and no reason to care. This gives them a situation instead: you run a team,
   five of them need developing, what does that actually cost?

   STEP 1 IS A CHOICE, NOT AN ASSESSMENT. Ten people with roles and tenure, pick
   five. Identifying who has potential is talent mapping, which is not built —
   inventing it for a demo would be showing a capability that does not exist,
   and the whole point of this work is that it doesn't do that. Choosing is
   honest, costs nothing, and still carries the journey: every later step runs
   on the five THEY picked.
   ═════════════════════════════════════════════════════════════════════════ */

/* A believable mid-sized operations team. Roles are deliberately ordinary —
   the ones employers actually put through apprenticeships — and each carries a
   hint so the choice is informed rather than arbitrary. */
var TEAM = [
  { id: 1, name: 'Priya N.',  role: 'Warehouse supervisor',  yrs: 4, note: 'Runs the late shift, no formal management training' },
  { id: 2, name: 'Jordan A.', role: 'Customer service lead', yrs: 3, note: 'Handles escalations, wants to move into ops' },
  { id: 3, name: 'Sam O.',    role: 'Finance assistant',     yrs: 2, note: 'Part-qualified, doing month-end unsupervised' },
  { id: 4, name: 'Leah M.',   role: 'Team leader',           yrs: 6, note: 'Longest serving, never been developed' },
  { id: 5, name: 'Tom B.',    role: 'Data administrator',    yrs: 1, note: 'Building the reporting nobody asked him to' },
  { id: 6, name: 'Aisha R.',  role: 'HR administrator',      yrs: 2, note: 'Covering recruitment single-handed' },
  { id: 7, name: 'Marcus W.', role: 'Logistics co-ordinator',yrs: 5, note: 'Knows the operation better than anyone' },
  { id: 8, name: 'Ellie C.',  role: 'Account handler',       yrs: 1, note: 'Strong with clients, new to the sector' },
  { id: 9, name: 'Dan F.',    role: 'Operations assistant',  yrs: 3, note: 'Deputising for the ops manager already' },
  { id: 10,name: 'Nia K.',    role: 'Quality co-ordinator',  yrs: 4, note: 'Owns the audit process end to end' }
];

/* Ten standards, not 322. A browsable database is not a demo — these are the
   ones this team's roles actually point at, and a visitor can read all ten.
   Every figure still comes from the real library, so nothing here is invented. */
var SHORTLIST = [
  'ST0384',  /* Team leader              L3  £5,000  15mo  — the supervisors   */
  'ST0070',  /* Business administrator   L3  £5,000  18mo  — the all-rounder   */
  'ST0071',  /* Customer service spec.   L3  £4,000  15mo  — the escalations   */
  'ST0608',  /* Accounts/finance asst    L2  £7,000  12mo  — the part-qualified*/
  'ST0118',  /* Data analyst             L4  £15,000 24mo  — the reporting one */
  'ST0239',  /* HR support               L3  £4,500  18mo  — recruitment cover */
  'ST0201',  /* Supply chain practitioner L3 £15,000 30mo  — logistics         */
  'ST0310',  /* Associate project manager L4 £7,000  18mo  — the deputy        */
  'ST0853',  /* Quality practitioner     L4  £6,000  14mo  — the audit owner   */
  'ST0809'   /* Coaching professional    L5  £5,000  14mo  — growing the rest  */
];

var picked = {};          /* who the visitor chose */
var journeyStd = null;    /* the standard they settled on */

/* ── step 1 ──────────────────────────────────────────────────────────────── */
function drawTeam() {
  $('team').innerHTML = TEAM.map(function (p) {
    var on = picked[p.id];
    return '<button class="person' + (on ? ' on' : '') + '" data-p="' + p.id + '">' +
      '<span class="pname">' + esc(p.name) + '</span>' +
      '<span class="prole">' + esc(p.role) + ' · ' + p.yrs + ' yr' + (p.yrs === 1 ? '' : 's') + '</span>' +
      '<span class="pnote">' + esc(p.note) + '</span></button>';
  }).join('');
  var n = Object.keys(picked).length;
  $('teamCount').innerHTML = n === 0
    ? 'Pick <b>five</b> to develop.'
    : (n < 5 ? 'Picked <b>' + n + '</b> — choose ' + (5 - n) + ' more.'
             : (n === 5 ? '<b>Five chosen.</b> Everything below now runs on your five.'
                        : '<b>' + n + ' chosen</b> — more than five is fine, the cost just scales.'));
  var step2 = $('s2');
  if (n >= 1) step2.classList.remove('locked'); else step2.classList.add('locked');
  if (typeof planJourney === 'function') planJourney();
}

/* ── step 2 ──────────────────────────────────────────────────────────────── */
function drawShortlist() {
  var rows = SHORTLIST.map(function (ref) { return BY[ref]; }).filter(Boolean);
  if (!rows.length) { $('shortlist').innerHTML = '<li class="note">Standards still loading…</li>'; return; }
  $('shortlist').innerHTML = rows.map(function (o) {
    return '<li><button class="hit' + (o.ref === journeyStd ? ' on' : '') + '" data-jstd="' + esc(o.ref) + '">' +
      '<span class="nm">' + esc(o.name) +
      '<span class="why">Level ' + esc(o.level) + ' · ' + esc(o.route || '') + '</span></span>' +
      '<span class="mt">' + (o.months ? o.months + ' months' : 'n/a') + ' · ' +
      (o.band ? fmt(o.band) : 'no band') + '</span></button></li>';
  }).join('');
}

/* ── step 3 ──────────────────────────────────────────────────────────────── */
function planJourney() {
  var o = BY[journeyStd];
  var n = Object.keys(picked).length;
  if (!o || !n) {
    $('jfigs').innerHTML = '';
    $('jsplit').textContent = '';
    $('jotj').textContent = '';
    return;
  }
  var band = +o.band || 0;
  var payer = $('jpayer').value;
  var young = Math.min(+$('jyoung').value || 0, n);
  var older = n - young;
  var rate = (payer === 'nonlevy') ? R.nonLevy25 : R.levyShort25;
  var total = band * n;
  var yourCash = (payer === 'nonlevy') ? band * older * rate : 0;
  var fromLevy = (payer === 'levy') ? total : 0;

  $('jfigs').innerHTML =
    fig('Your cohort', Object.keys(picked).map(function (id) {
      return TEAM.filter(function (p) { return p.id == id; })[0].name.split(' ')[0];
    }).join(', '), n + ' on ' + o.name, 'who') +
    fig('Training value', fmt(total), n + ' × ' + fmt(band), '') +
    (payer === 'levy'
      ? fig('From your levy', fmt(fromLevy), 'drawn from your account', 'fund')
      : fig('Government pays', fmt(total - yourCash), young + ' fully funded', 'fund')) +
    fig('Your own cash', yourCash ? fmt(yourCash) : '£0',
        payer === 'levy' ? 'nil while the account holds' :
        (older ? older + ' aged 25+ at ' + Math.round(rate * 100) + '%' : 'all aged 16–24'), 'cash');

  $('jsplit').innerHTML = payer === 'levy'
    ? 'You already pay the levy, so this is <b>money you have handed over anyway</b>. The band is ' +
      'drawn from your account — the question is whether you spend it before it expires, not whether ' +
      'you can afford it.'
    : 'Apprentices aged 16–' + R.fullyFundedToAge + ' are <b>fully funded</b>. Only the ' +
      (older || 'none') + ' aged 25 or over cost you anything, at ' + Math.round(rate * 100) + '%.';

  var hrs = 6, weeks = Math.round((o.months || 12) * 4.33), wage = 13.5;
  $('jotj').innerHTML = '<b>' + fmt(hrs * weeks * n * wage) + ' of off-the-job time on top.</b> ' +
    'Each of your ' + n + ' spends about ' + hrs + ' hours a week training instead of working. ' +
    'Nobody funds that — and on most plans it is larger than the training itself. It is the number ' +
    'employers are surprised by, which is exactly why it is shown.';
}

/* ── wiring ──────────────────────────────────────────────────────────────── */
document.addEventListener('click', function (e) {
  var p = e.target.closest ? e.target.closest('.person') : null;
  if (p) {
    var id = p.getAttribute('data-p');
    if (picked[id]) delete picked[id]; else picked[id] = 1;
    drawTeam();
    return;
  }
  var j = e.target.closest ? e.target.closest('[data-jstd]') : null;
  if (j) {
    journeyStd = j.getAttribute('data-jstd');
    drawShortlist();
    planJourney();
    $('s4').classList.remove('locked');
    $('s4').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
});
