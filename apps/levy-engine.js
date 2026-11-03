/* ─────────────────────────────────────────────────────────────────────────
   The Fundable calculation core, lifted out of the full application.

   Every function here is pure: no DOM, no page state, no rendering. That was
   already true in the app — the engine and the interface were separated so
   the maths could be tested on its own — which is the only reason this file
   can exist at all.

   It was extracted by matching braces from each named symbol rather than by
   copying line ranges, because the pieces sit ~4,200 lines apart in a single
   5MB file and a range that is one brace out produces a file that parses and
   lies. The proof that nothing is missing is the suite that runs against it:
   58 cases, each one a published gov.uk worked example. A missing dependency
   throws; a wrong one fails a case.
   ───────────────────────────────────────────────────────────────────────── */
const RULEBOOK={
  version:'FY2025-26',
  asOf:'2026-06-24',
  source:'https://www.gov.uk/government/publications/apprenticeship-funding-rules',
  boundaryMk:2026*12+7,             // Aug 2026 rule-change boundary (month-key = year*12 + monthIndex)
  /* The 10% top-up ended on new funds entering accounts from Aug 2026. Funds
     banked before it kept theirs, so this is boundary-dependent like coInvest
     and expiryMonths - a flat zero would rewrite history too. */
  topUp:{before:0.10,from:0},
  /* offline fallback - these were only ever set from the canonical rulebook,
     so a failed fetch left them undefined. r.125 / gov.uk, verified 2026-08-26. */
  incentives:{employerPayment:1000,hiringPayment:2000,hiringPaymentFrom:'2026-10-01'},
  levyRate:0.005,                   // apprenticeship levy = 0.5% of annual pay bill
  levyAllowance:15000,              // annual levy allowance (only pay bill > £3m actually pays)
  ni:{empRate:0.15,secThreshold:5000,aust:50270}, // employer NIC: 15%, Secondary Threshold £5k, Apprentice Upper Secondary Threshold £50,270 — 0% employer NIC ST→AUST for under-25 apprentices (gov.uk 2025-26)
  draw:{training:0.80,epa:0.20},    // 80% drawn over the practical period, 20% at EPA completion
  transferCapPct:0.50,              // employer may gift up to 50% of annual levy
  /* Employer co-investment. From Aug 2026 the rate depends on WHO the employer
     is and HOW OLD the apprentice is - one number cannot express it:
       non-levy 16-24 nil (214.1) | non-levy 25+ 5% (213.2)
       levy short 16-24 nil (214.2) | levy short 25+ 25% (213.1) */
  coInvest:{before:0.05,from:0.25,nonLevyFrom:0.05,fullyFundedToAge:24,fullyFundedToAgeBefore:21},
  expiryMonths:{before:24,from:12}, // unused funds expire after N months (by declaration date)
  apprenticeshipMinMonths:8,        // minimum apprenticeship duration (reserved for units/duration work)
  achievementBenchmark:0.654,       // national apprenticeship achievement rate 2024/25 (65.4%) — was 0.60 here while the QAR module used 65.4, two benchmarks in one app; single source now, update annually
  ambitionMargin:{keepPace:0,aboveAverage:0.10,sectorLeading:0.20}, // added to the benchmark by ambition; target capped at 90%
  unit:{coInvest:0.05,m1:0.30,m2:0.70,minHours:30,maxHours:140} // apprenticeship units, live Apr 2026 (reserved for #8)
};

function topUpAt(mk){
  return (mk != null && mk < RULEBOOK.boundaryMk) ? RULEBOOK.topUp.before
                                                  : RULEBOOK.topUp.from;
}

const LevyEngine=(function(){
  var R=RULEBOOK;
  return {
    levyFromPayBill:function(pb){return Math.max(0,(+pb||0)*R.levyRate-R.levyAllowance);},   // annual declared levy (0.5% − £15k)
    payBillFromLevy:function(l){return ((+l||0)+R.levyAllowance)/R.levyRate;},                // reverse
    topUp:function(levy,mk){return (+levy||0)*topUpAt(mk);},                                    // nil from Aug 2026; 10% before it
    accountCredit:function(levy,mk){return (+levy||0)*(1+topUpAt(mk));},                     // levy + whatever top-up applied that month
    coInvestShare:function(uncovered,fromBoundary){return (+uncovered||0)*(fromBoundary?R.coInvest.from:R.coInvest.before);}, // 5%→25%
    bandTraining:function(band){return (+band||0)*R.draw.training;},                          // 80% over the practical period
    bandEpa:function(band){return (+band||0)*R.draw.epa;},                                    // 20% at EPA
    nonLevyEmployerShare:function(band){return (+band||0)*R.coInvest.before;},                // non-levy employer 5%
    nonLevyGovShare:function(band){return (+band||0)*(1-R.coInvest.before);},                 // non-levy government 95%
    niReliefPerYear:function(salary){return Math.max(0,R.ni.empRate*(Math.min(+salary||0,R.ni.aust)-R.ni.secThreshold));} // under-25 employer NIC relief
  };
})();

function expMo(mk){return mk<RULE_MK?RULEBOOK.expiryMonths.before:RULEBOOK.expiryMonths.from;}

function simulateLevyFIFO(income,tot,pmk,M,history){
  const decl={},spend={};
  (history==null?(levyData.byMonth||[]):history).forEach(m=>{if(m.mk<pmk){decl[m.mk]=(decl[m.mk]||0)+m.income;spend[m.mk]=(spend[m.mk]||0)+m.paid;}}); // history defaults to live data → byte-identical for UI; pass [] for pure/testable use
  for(let i=0;i<M;i++){const mk=pmk+i;decl[mk]=(decl[mk]||0)+income[i];spend[mk]=(spend[mk]||0)+tot[i];}
  const mks=Object.keys(decl).map(Number);if(!mks.length)return{total:0,byMonth:[],ledger:[]};
  const minMk=Math.min(...mks),maxMk=pmk+M-1;
  const pot=[],ledger=[],byMonth=[];let total=0;
  for(let mk=minMk;mk<=maxMk;mk++){
    const added=decl[mk]||0;if(added>0.5)pot.push({mk,remaining:added});
    let need=spend[mk]||0,drawn=0;
    for(const t of pot){if(need<=0)break;const take=Math.min(t.remaining,need);t.remaining-=take;need-=take;drawn+=take;}
    let expired=0;
    for(const t of pot){if(t.remaining>0.5&&mk>=t.mk+expMo(t.mk)){expired+=t.remaining;t.remaining=0;}}
    const balance=pot.reduce((a,b)=>a+b.remaining,0);
    if(mk>=pmk){ledger.push({mk,added,drawn,expired,balance});if(expired>0.5){byMonth.push({mk,amount:expired});total+=expired;}}
  }
  return{total,byMonth,ledger};
}

function coInvRate(mk){return mk<RULE_MK?RULEBOOK.coInvest.before:RULEBOOK.coInvest.from;}

function coInvShare(mk, payer, age25){
  if (mk < RULE_MK) return RULEBOOK.coInvest.before;
  if (!age25) return 0;                                   /* 214.1 / 214.2 */
  return payer === 'nonlevy' ? RULEBOOK.coInvest.nonLevyFrom   /* 213.2 - 5%  */
                             : RULEBOOK.coInvest.from;         /* 213.1 - 25% */
}

function simCoInvest(income,tot,pmk,uTot,bal0,shr){
  let bal=(bal0==null?levyData.balance:bal0),total=0;const months=[]; // bal0 defaults to the live balance → byte-identical for UI calls; pass explicit for pure/testable use
  for(let i=0;i<tot.length;i++){
    bal+=income[i];
    let aUnc=0,aShare=0,uUnc=0,uShare=0;
    if(tot[i]>bal+0.5){aUnc=tot[i]-bal;
      var f25=(shr&&shr[i]!=null)?Math.max(0,Math.min(1,shr[i])):1;
      aShare=aUnc*f25*coInvShare(pmk+i,'levyshort',true);bal=0;}
    else bal-=tot[i];
    if(uTot){const u=uTot[i]||0; if(u>bal+0.5){uUnc=u-bal;uShare=uUnc*RULEBOOK.unit.coInvest;bal=0;} else bal-=u;}
    const share=aShare+uShare;
    if(share>1e-6){total+=share;months.push({i,uncovered:aUnc+uUnc,share,rate:coInvRate(pmk+i)});}
  }
  return{total,months};
}

function planStage(d){
  try{
    d = d || levyReportData();
    if(fundingMode==='nonlevy') return null;      /* no pot, so no utilisation */
    if(!d || !d.heads || !d.progCount) return null;
    var exp=+d.expiry||0, co=+d.coInvest||0;
    var avail=+d.levyAvail||0, committed=+d.levyPlanCost||+d.planCost||0;
    var head=Math.max(0, avail-committed);
    var per=+d.perHead||0;
    var more=per>0?Math.floor(head/per):0;
    var firstExp=(d.expiryFirst&&d.expiryFirst.mo)||null;

    /* Both at once, and this is the COMMON middle - not an exception. Tested
       across 20 plan shapes, no plan reached "nothing expires and no
       co-investment": the 12-month expiry means committing slowly enough to
       avoid a shortfall guarantees something ages out. */
    if(exp>1 && co>1){
      var covers = avail >= committed;
      return {
        key:'mistimed', label:'Out of step', tone:'amber',
        head:fmt(Math.round(exp))+' expires while '+fmt(Math.round(co))+' comes from your own cash',
        body: covers
          ? 'Your levy covers this plan in total &mdash; the money and the training are simply not '+
            'arriving at the same time. That is a timing problem rather than a size one, and it is '+
            'the cheapest kind to fix.'
          : 'This plan also commits more than your levy will hold ('+fmt(Math.round(committed))+
            ' against '+fmt(Math.round(avail))+'), so part of the gap is size and part of it is '+
            'timing. Fixing the timing will not close all of it.',
        move: covers
          ? 'Bringing a start forward, or spreading a payment, moves both numbers at once. Try it '+
            'in <b>What if</b> before committing.'
          : 'Re-timing recovers the '+fmt(Math.round(exp))+' that expires; the rest needs a smaller '+
            'plan, a transfer received, or accepting the co-investment.'
      };
    }

    if(exp>1) return {
      key:'underusing', label:'Under-using', tone:'amber',
      head:fmt(Math.round(exp))+' of levy will expire unused',
      body:'You are earning levy faster than you are committing it, so a share returns to the '+
           'Treasury'+(firstExp?(' &mdash; the first tranche in <b>'+escHtml(String(firstExp))+'</b>'):'')+
           '. Funds now expire '+RULEBOOK.expiryMonths.from+' months after they land.',
      move:more>0
        ? 'About <b>'+more+'</b> more apprentice'+(more!==1?'s':'')+' at your average of '+
          fmt(Math.round(per))+' would absorb it. You can also gift up to '+
          fmt(Math.round(d.transferCap||0))+' a year as a transfer rather than lose it.'
        : 'Gifting is the other route &mdash; up to '+fmt(Math.round(d.transferCap||0))+
          ' a year can be transferred to another employer rather than expire.'
    };

    if(co>1) return {
      key:'capacity', label:'At capacity', tone:'money',
      head:'Your levy is fully committed; '+fmt(Math.round(co))+' comes from your own cash',
      body:'Nothing is being wasted &mdash; this plan asks for more than the pot holds in the '+
           'months it is drawn, so the balance is co-investment.',
      move:'A transfer received from another employer covers 100% of a band up to the maximum. '+
           'Deferring or spreading a start also moves the shortfall &mdash; both are costed in <b>What if</b>.'
    };

    /* Reachable, but only just: it needs the draw to land almost exactly as the
       levy does. Described as the rare state it is, never as the expected one. */
    return {
      key:'matched', label:'Fully matched', tone:'teal',
      head:'Nothing expires, and none of it comes from your own cash',
      body:'This is the narrow best case: you are committing levy about as fast as it lands, and no '+
           'month runs short. Under the '+RULEBOOK.expiryMonths.from+'-month expiry very few plans '+
           'hold this position &mdash; commit any slower and funds age out, any faster and a month '+
           'goes short.',
      move:more>0
        ? 'Headroom of <b>'+fmt(Math.round(head))+'</b> &mdash; about <b>'+more+'</b> more apprentice'+
          (more!==1?'s':'')+' at your average of '+fmt(Math.round(per))+', though adding them will '+
          'usually tip you into one side or the other.'
        : 'Headroom of <b>'+fmt(Math.round(head))+'</b> remains.'
    };
  }catch(e){ return null; }
}

function incentiveCount(p){
  if(!p||!p.age||p.type==='unit')return 0;
  return Math.min((+p.age.j||0)+(+p.age.s||0), +p.count||0);
}

function hiringCount(p){
  if(fundingMode!=='nonlevy')return 0;                 /* r.133 - non-levy only */
  if(!p||p.type==='unit'||!p.age)return 0;
  if(mKey(p.start)<HIRE_FROM_MK)return 0;              /* r.133.2 */
  var young=(+p.age.y||0)+(+p.age.m||0);               /* 16-24, r.133.1 */
  return Math.min(+p.age.h||0, young, +p.count||0);
}

const RULE_MK=RULEBOOK.boundaryMk;

function mKey(date){if(typeof date==='string'){var m=date.match(/^(\d{4})-(\d{1,2})/);if(m)return (+m[1])*12+(+m[2]-1);}const d=new Date(date);return d.getFullYear()*12+d.getMonth();} // parse 'YYYY-MM-DD' by its literal year-month (timezone-independent); Date objects keep local getMonth (byte-identical)

function mBetween(a,b){return Math.max(1,mKey(b)-mKey(a));}

function incentiveRate(){
  try{ var v=RULEBOOK.incentives&&+RULEBOOK.incentives.employerPayment; return v>0?v:1000; }
  catch(e){ return 1000; }
}

function hiringRate(){
  try{ var v=RULEBOOK.incentives&&+RULEBOOK.incentives.hiringPayment; return v>0?v:2000; }
  catch(e){ return 2000; }
}


/* The handful of module-level values the projection reads. The three
   full-assembly cases set these, run the real projection over a
   hand-computable scenario, and put them back afterwards. */
function levyReportData(){
  var M=projYears*12, ps=new Date(today.getFullYear(),today.getMonth(),1), pmk=mKey(ps);
  var income=Array(M).fill(levyData.monthlyAvg);
  var ts=Array(M).fill(0),es=Array(M).fill(0),us=Array(M).fill(0),ev=[];
  /* the 25+ slice of each month's draw - from Aug 2026 they are the only
     apprentices whose shortfall carries co-investment at all */
  var ts25=Array(M).fill(0),es25=Array(M).fill(0);
  programmes.forEach(function(p){
    if(p.type==='unit'){
      var usm=mKey(p.start),uwks=Math.max(1,+p.weeks||4),urate=(+p.cost||0)*(+p.count||0);
      var ui1=usm+Math.round(uwks*0.30/4.345)-pmk; if(ui1>=0&&ui1<M)us[ui1]+=urate*RULEBOOK.unit.m1;
      var ui2=usm+Math.round(uwks/4.345)-pmk; if(ui2>=0&&ui2<M)us[ui2]+=urate*RULEBOOK.unit.m2;
      return;
    }
    var sm=mKey(p.start),em=mKey(p.epa),dur=mBetween(p.start,p.epa);
    var ec=lvyEligCount(p), mt=(p.cost*RULEBOOK.draw.training/dur)*ec, et=p.cost*RULEBOOK.draw.epa*ec;
    /* no age recorded = treat the whole cohort as 25+, so a waiver is never
       granted on data we do not hold */
    var pc=+p.count||0, f25=(p.age&&pc)?Math.min(1,(+p.age.o||0)/pc):1;
    for(var mk=sm;mk<em;mk++){var i=mk-pmk;if(i>=0&&i<M){ts[i]+=mt;ts25[i]+=mt*f25;}}
    var ei=em-pmk;if(ei>=0&&ei<M){es[ei]+=et;es25[ei]+=et*f25;ev.push({idx:ei,name:p.name,count:p.count,amount:et});}
  });
  var tot=ts.map(function(s,i){return s+es[i];});
  var tot25=ts25.map(function(s,i){return s+es25[i];});
  var shr25=tot.map(function(t,i){return t>0?tot25[i]/t:1;});
  var combined=tot.map(function(s,i){return s+us[i];});
  var b=levyData.balance, bals=combined.map(function(s,i){b=Math.max(0,b+income[i]-s);return b;});
  var tT=ts.reduce(function(a,c){return a+c;},0), tE=es.reduce(function(a,c){return a+c;},0);
  var unitDraw=us.reduce(function(a,c){return a+c;},0);
  var ci=simCoInvest(income,tot,pmk,us,null,shr25), exp=simulateLevyFIFO(income,combined,pmk,M);
  var coFloor=0; if(ci.total>1){var trainOnly=tot.slice();ev.forEach(function(e){trainOnly[e.idx]-=e.amount;});coFloor=simCoInvest(income,trainOnly,pmk,us,null,shr25).total;}
  var heads=programmes.reduce(function(a,p){return a+(+p.count||0);},0);
  var planCost=programmes.reduce(function(a,p){return a+(+p.cost||0)*(+p.count||0);},0);
  var levyPlanCost=programmes.reduce(function(a,p){return a+(+p.cost||0)*lvyEligCount(p);},0); // excludes L7 22+ self-fund
  var selfFundCost=Math.max(0,planCost-levyPlanCost);
  var annual=levyData.monthlyAvg*12, transferCap=annual*RULEBOOK.transferCapPct;
  var expVal=exp.total>1?exp.total:0, perHead=heads?planCost/heads:0;
  var expiry12=(exp.byMonth||[]).filter(function(m){return m.mk-pmk<12;}).reduce(function(a,m){return a+m.amount;},0);
  var giftable=expVal?Math.min(expVal,transferCap):0, svEnabled=perHead?Math.floor(giftable/perHead):0;
  var subjMap={}; programmes.forEach(function(p){var s=lvySubject(p.name); if(s)subjMap[s.toLowerCase()]=s;});
  var subjectNames=Object.keys(subjMap).map(function(k){return subjMap[k];});
  var levels=programmes.map(function(p){return lvyLevel(p.name);}).filter(Boolean);
  var maxLevel=levels.length?Math.max.apply(null,levels):0;
  var incomeTotal=levyData.monthlyAvg*M, util=incomeTotal?(tT+tE+unitDraw)/incomeTotal:0;
  var stage=ci.total>0?'Scaling':(expVal>annual*0.15?'Under-using':'Optimising');
  var yearUtil=[];
  for(var yy=0;yy<projYears;yy++){var dd=0,ip=0;for(var mm=0;mm<12;mm++){var ix=yy*12+mm;if(ix<M){dd+=combined[ix];ip+=income[ix];}}yearUtil.push(ip?dd/ip:0);}
  // Off-the-job / true cost — apprenticeship: otj[level] x weeks x count x rate; unit: delivery hours x count x rate
  var otjMap=planCfg.otj||{}, payRate=planCfg.rate||0, weekHrs=planCfg.hours||37.5;
  var otjCost=0, otjHrsWk=0, otjFTE=0;
  // A programme may carry its own wage and off-the-job hours. Both are optional
  // and fall back to the plan figures, so a plan with none set costs exactly what
  // it costed before — a Level 7 leader and a Level 2 operative only stop sharing
  // one blended rate once someone says otherwise.
  programmes.forEach(function(p){
    var rate=(+p.wage>0)?+p.wage:payRate;
    if(p.type==='unit'){var uh=(+p.hours||0),uw=Math.max(1,+p.weeks||4),uc=(+p.count||0);otjCost+=uh*uc*rate;otjHrsWk+=(uh/uw)*uc;otjFTE+=(uh/uw)*uc/weekHrs;return;}
    var oh=(+p.otj>0)?+p.otj:(otjMap[progLevel(p)]||6), weeks=Math.max(1,Math.round((new Date(p.epa)-new Date(p.start))/(7*864e5)));
    otjCost+=oh*weeks*(+p.count||0)*rate; otjHrsWk+=oh*(+p.count||0); otjFTE+=oh*(+p.count||0)/weekHrs;
  });
  // Employer NIC relief on under-25 apprentices (0% ST→AUST). Salary est = plan hourly rate x weekly hours x 52. gov.uk 2025-26.
  var niSalary=(planCfg.rate||0)*(planCfg.hours||37.5)*52;
  var niPerYr=Math.max(0,RULEBOOK.ni.empRate*(Math.min(niSalary,RULEBOOK.ni.aust)-RULEBOOK.ni.secThreshold));
  var niUnder25=0,niRelief=0,l7SelfFund=0,l7Crossover=0,l7SelfFundCost=0,l7NameSet={};
  programmes.forEach(function(p){
    if(!p.age)return;
    var y=(+p.age.y||0),m=(+p.age.m||0),o=(+p.age.o||0),u=y+m; // 16-21 + 22-24 = under 25
    var pdur=(p.type==='unit')?Math.max(1,(+p.weeks||4))/4.345:(p.start&&p.epa?mBetween(p.start,p.epa):12);
    if(u){niUnder25+=u;niRelief+=u*niPerYr*(pdur/12);}
    // L7 age gate: from Jan 2026, 22+ on Level 7 can't be levy-funded → self-fund. 22-24 keep the NI relief (the crossover).
    if((lvyLevel(p.name)||0)>=7){var sf=m+o;if(sf>0){l7SelfFund+=sf;l7Crossover+=m;l7SelfFundCost+=(+p.cost||0)*sf;l7NameSet[p.name]=1;}}
  });
  var incv=incentiveTotal();
  return {years:projYears,M:M,balance:levyData.balance,avg:levyData.monthlyAvg,annual:annual,
    niRelief:niRelief,niUnder25:niUnder25,niPerYr:niPerYr,niSalary:niSalary,
    /* employer income, NOT a funding reduction - never subtracted from planCost
       or coInvest, only reported alongside them */
    incentive:incv.value,incentiveCount:incv.count,incentiveRate:incv.rate,
    incentiveAsked:incentiveAsked(),
    l7SelfFund:l7SelfFund,l7Crossover:l7Crossover,l7SelfFundCost:l7SelfFundCost,l7Names:Object.keys(l7NameSet),
    levyAvail:levyData.balance+levyData.monthlyAvg*M,
    planCost:planCost,drawn:tT+tE,tT:tT,tE:tE,coInvest:ci.total,coFloor:coFloor,co25:ci.months.some(function(m){return m.rate>=0.25;}),coMonths:ci.months.length,
    levyPlanCost:levyPlanCost,selfFundCost:selfFundCost,
    levyCovered:Math.max(0,levyPlanCost-ci.total),expiry:expVal,expiry12:expiry12,expiryFirst:exp.byMonth&&exp.byMonth[0],
    heads:heads,progCount:programmes.length,perHead:perHead,endBal:bals[M-1],transferCap:transferCap,
    programmes:programmes.slice(),giftable:giftable,svEnabled:svEnabled,
    subjectNames:subjectNames,subjectCount:subjectNames.length,maxLevel:maxLevel,util:util,stage:stage,yearUtil:yearUtil,
    otjCost:otjCost,otjHrsWk:otjHrsWk,otjFTE:otjFTE,trueCost:planCost+otjCost,payRate:payRate};
}
let programmes=[];let projChart=null;let projYears=3;
const today=new Date();
var fundingMode='levy';

/* The simulation and projection functions are attached to the engine in
   the app after they are defined; without these the engine object exists
   but is missing half its surface. */
LevyEngine.simCoInvest=simCoInvest; LevyEngine.simulateLevyFIFO=simulateLevyFIFO; LevyEngine.coInvRate=coInvRate; LevyEngine.expMo=expMo;
LevyEngine.projection=levyReportData;


/* boundary constants the incentive and hiring rules read */
var HIRE_FROM_MK = 2026 * 12 + 9;            /* October 2026, r.133.2 */
let levyData={monthlyAvg:0,balance:0,byMonth:[]};
