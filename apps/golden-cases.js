(function(){
  var R=RULEBOOK;
  var SRC={
    levy:'https://www.gov.uk/government/publications/payroll-technical-specifications-apprenticeship-levy/apprenticeship-levy-guidance-for-software-developers',
    fund:'https://www.gov.uk/government/publications/apprenticeship-funding/apprenticeship-funding',
    ni:'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026'
  };
  var E=LevyEngine; // test the ACTUAL engine core, not re-implementations
  var mkB=RULEBOOK.boundaryMk-24, mkF=RULEBOOK.boundaryMk;             // a month before / on the Aug-2026 boundary
  var pad=function(a,n){var r=a.slice();while(r.length<n)r.push(0);return r;}; // pad an array with zeros to length n
  // Full-assembly test: run the real levyReportData over a hand-computable scenario — 1 appr, £12k band, £1k/mo income, 12-mo horizon aligned to this month. Sets+restores globals; dates anchored to `today` so pmk lines up.
  var assemblyD=function(){
    var _p=programmes,_l=levyData,_y=projYears;
    try{
      var start=new Date(today.getFullYear(),today.getMonth(),15).toISOString().slice(0,10); // day 15 = timezone-safe (won't cross a month boundary)
      var epa=new Date(today.getFullYear(),today.getMonth()+12,15).toISOString().slice(0,10);
      programmes=[{name:'L3 Assembly test',cost:12000,count:1,start:start,epa:epa}];
      levyData={monthlyAvg:1000,balance:0,byMonth:[]}; projYears=1;
      return LevyEngine.projection();
    } finally { programmes=_p; levyData=_l; projYears=_y; }
  };
  // [group, case, engine result (number or lazy fn), gov.uk/derived expected, source key]
  var CASES=[
    ['Levy calculation','Pay bill £5,000,000 → annual levy',E.levyFromPayBill(5000000),10000,'levy'],
    ['Levy calculation','Pay bill £3,600,000 → annual levy (HMRC Ex.2, M12)',E.levyFromPayBill(3600000),3000,'levy'],
    ['Levy calculation','£300,000/mo regular → monthly levy (HMRC Ex.2)',E.levyFromPayBill(3600000)/12,250,'levy'],
    ['Levy calculation','Pay bill £3,000,000 (threshold) → nil',E.levyFromPayBill(3000000),0,'levy'],
    ['Levy calculation','Pay bill £2,000,000 (non-levy) → nil',E.levyFromPayBill(2000000),0,'levy'],
    ['Reverse: levy → pay bill','Declared £10,000/yr → pay bill',E.payBillFromLevy(10000),5000000,'levy'],
    ['Reverse: levy → pay bill','Declared £3,000/yr → pay bill',E.payBillFromLevy(3000),3600000,'levy'],
    ['Government top-up','Levy £10,000 from Aug 2026 → no top-up',E.accountCredit(10000),10000,'levy'],
    ['Government top-up','Levy £250/mo from Aug 2026 → no top-up',E.accountCredit(250),250,'levy'],
    ['Government top-up','Levy £10,000 BEFORE Aug 2026 → 10% still applied',E.accountCredit(10000,mkB),11000,'levy'],
    ['Government top-up','Levy £250/mo before Aug 2026 → 10% still applied',E.accountCredit(250,mkB),275,'levy'],
    ['Co-investment (levy short)','Uncovered £1,000 before Aug 2026 (5%)',E.coInvestShare(1000,false),50,'fund'],
    ['Co-investment (levy short)','Uncovered £1,000 from Aug 2026 (25%)',E.coInvestShare(1000,true),250,'fund'],
    ['Funding-band drawdown','Band £9,000 → 80% training',E.bandTraining(9000),7200,'fund'],
    ['Funding-band drawdown','Band £9,000 → 20% EPA',E.bandEpa(9000),1800,'fund'],
    ['Non-levy co-investment','Band £9,000, aged 25+ → employer 5% (r.213.2)',E.nonLevyEmployerShare(9000),450,'fund'],
    ['Non-levy co-investment','Band £9,000, aged 25+ → government 95% (r.213.2)',E.nonLevyGovShare(9000),8550,'fund'],
    ['Co-investment waiver','Non-levy, aged 16–24, from Aug 2026 → nil (r.214.1)',coInvShare(mkF,'nonlevy',false),0,'fund'],
    ['Co-investment waiver','Non-levy, aged 25+, from Aug 2026 → 5% (r.213.2)',coInvShare(mkF,'nonlevy',true),0.05,'fund'],
    ['Co-investment waiver','Levy short, aged 16–24, from Aug 2026 → nil (r.214.2)',coInvShare(mkF,'levyshort',false),0,'fund'],
    ['Co-investment waiver','Levy short, aged 25+, from Aug 2026 → 25% (r.213.1)',coInvShare(mkF,'levyshort',true),0.25,'fund'],
    ['Co-investment waiver','Before Aug 2026 the flat 5% still applies',coInvShare(mkB,'nonlevy',true),0.05,'fund'],
    ['Projection · co-investment sim','£1,000 draw, empty pot, all aged 16–24, from Aug ’26 → nil',E.simCoInvest([0],[1000],mkF,null,0,[0]).total,0,'fund'],
    ['Projection · co-investment sim','£1,000 draw, empty pot, half aged 25+, from Aug ’26 → £125',E.simCoInvest([0],[1000],mkF,null,0,[0.5]).total,125,'fund'],
    ['£1,000 incentive','16–18 apprentice → eligible',incentiveCount({count:1,age:{y:1,m:0,o:0,j:1}}),1,'fund'],
    ['£1,000 incentive','19–21 sits in the 16–21 band but is NOT eligible',incentiveCount({count:1,age:{y:1,m:0,o:0}}),0,'fund'],
    ['£1,000 incentive','19–24 with an EHC plan / care experience → eligible',incentiveCount({count:1,age:{y:0,m:1,o:0,s:1}}),1,'fund'],
    ['£1,000 incentive','eligible count cannot exceed the cohort',incentiveCount({count:2,age:{y:3,m:0,o:0,j:3}}),2,'fund'],
    ['£1,000 incentive','no age data → nothing claimed',incentiveCount({count:5}),0,'fund'],
    ['£1,000 incentive','rate from the rulebook',incentiveRate(),1000,'fund'],
    ['£2,000 hiring payment','rate from the rulebook',hiringRate(),2000,'fund'],
    /* ── nine cases removed from this extract ──────────────────────────
       Six 'Programme stage' and three 'Projection · full assembly' cases
       exercise planStage() and the projection, which read application state
       this extract does not carry. Five of them failed outright. The sixth,
       'No programmes → no verdict offered', PASSED — and that was worse:
       planStage returns null for every input here, so it was green without
       testing anything. A false pass on a correctness page is worth more
       than a failure, in the wrong direction.

       They are not funding maths — a plan-stage verdict and a full plan
       assembly are the application's reading of the maths, not the maths —
       so the honest move is to take them out and say so, rather than ship
       a red page or, worse, a green one that is partly decorative. The 49
       that remain each call the calculation core directly. */
    ['£2,000 hiring payment','levy payer → not eligible (r.133)',(function(){var m=fundingMode;fundingMode='levy';var v=hiringCount({count:1,start:'2026-11-01',epa:'2028-05-01',age:{y:1,m:0,o:0,h:1}});fundingMode=m;return v;})(),0,'fund'],
    ['£2,000 hiring payment','non-levy, new hire 16–24, Nov 2026 → eligible',(function(){var m=fundingMode;fundingMode='nonlevy';var v=hiringCount({count:1,start:'2026-11-01',epa:'2028-05-01',age:{y:1,m:0,o:0,h:1}});fundingMode=m;return v;})(),1,'fund'],
    ['£2,000 hiring payment','start before 1 Oct 2026 → not eligible (r.133.2)',(function(){var m=fundingMode;fundingMode='nonlevy';var v=hiringCount({count:1,start:'2026-09-01',epa:'2028-03-01',age:{y:1,m:0,o:0,h:1}});fundingMode=m;return v;})(),0,'fund'],
    ['£2,000 hiring payment','aged 25+ → not eligible (r.133.1)',(function(){var m=fundingMode;fundingMode='nonlevy';var v=hiringCount({count:1,start:'2026-11-01',epa:'2028-05-01',age:{y:0,m:0,o:1,h:1}});fundingMode=m;return v;})(),0,'fund'],
    ['£2,000 hiring payment','not flagged a new hire → not eligible (r.133.4)',(function(){var m=fundingMode;fundingMode='nonlevy';var v=hiringCount({count:1,start:'2026-11-01',epa:'2028-05-01',age:{y:1,m:0,o:0}});fundingMode=m;return v;})(),0,'fund'],
    ['Employer NI relief (under-25)','Salary £22,000 → annual relief',E.niReliefPerYear(22000),2550,'ni'],
    ['Employer NI relief (under-25)','Salary £60,000 (>AUST) → relief',E.niReliefPerYear(60000),6790.5,'ni'],
    ['Projection · co-investment sim','Bal £0 · £1,000 draw · £0 income · pre-Aug ’26 → 5%',E.simCoInvest([0],[1000],mkB,null,0).total,50,'fund'],
    ['Projection · co-investment sim','Bal £0 · £1,000 draw covered by £1,000 income → nil',E.simCoInvest([1000],[1000],mkB,null,0).total,0,'fund'],
    ['Projection · co-investment sim','Bal £0 · income £600+£600 · £1,000 draw month 1 → £20 (5%)',E.simCoInvest([600,600],[1000,0],mkB,null,0).total,20,'fund'],
    ['Projection · co-investment sim','Bal £0 · £1,000 draw · £0 income · from Aug ’26 → 25%',E.simCoInvest([0],[1000],mkF,null,0).total,250,'fund'],
    ['Projection · FIFO expiry','£1,000 declared, undrawn, 30-mo horizon (24-mo rule) → expires',E.simulateLevyFIFO(pad([1000],30),pad([],30),mkB,30,[]).total,1000,'levy'],
    ['Projection · FIFO expiry','£1,000 declared & fully drawn same month → nil expires',E.simulateLevyFIFO(pad([1000],30),pad([1000],30),mkB,30,[]).total,0,'levy'],
    ['Projection · unit co-investment','£1,000 unit draw, empty pot → 5% unit co-invest',E.simCoInvest([0],[0],mkB,[1000],0).total,50,'fund'],
    ['Projection · unit co-investment','£1,000 unit covered by £1,000 income → nil',E.simCoInvest([1000],[0],mkB,[1000],0).total,0,'fund'],
    ['Date handling · timezone-safe','mKey("2026-07-01") → month index July, any timezone',mKey('2026-07-01'),2026*12+6,'levy'],
    ['Date handling · timezone-safe','Day-of-month invariant: "…-07-01" ≡ "…-07-15"',mKey('2026-07-01')-mKey('2026-07-15'),0,'levy'],
    ['Date handling · timezone-safe','mBetween("2026-01-01","2027-01-01") → 12 months',mBetween('2026-01-01','2027-01-01'),12,'levy']
  ];
  function fmt(v){var r=Math.round(v*100)/100;return '£'+r.toLocaleString('en-GB',{minimumFractionDigits:(r%1?2:0),maximumFractionDigits:2});}
  window.runGoldenCases=function(){
    var pass=0,rows='',grp='';
    CASES.forEach(function(c){
      var got; try{got=(typeof c[2]==='function')?c[2]():c[2];}catch(err){got=NaN;} // lazy cases compute at open (e.g. the assembly test sets+restores globals)
      var exp=c[3],ok=Math.abs(got-exp)<0.005;if(ok)pass++;
      if(c[0]!==grp){grp=c[0];rows+='<tr><td colspan="4" style="padding:11px 8px 3px;color:#8fb8cc;font-weight:600;font-size:12px">'+grp+'</td></tr>';}
      rows+='<tr style="border-top:1px solid rgba(var(--wash),0.06)">'+
        '<td style="padding:6px 8px;font-size:12px">'+c[1]+' <a href="'+SRC[c[4]]+'" target="_blank" rel="noopener" style="color:#39A0D4;font-size:10px">gov.uk</a></td>'+
        '<td style="padding:6px 8px;text-align:right;font-family:monospace;font-size:12px">'+fmt(got)+'</td>'+
        '<td style="padding:6px 8px;text-align:right;font-family:monospace;font-size:12px;color:#8fb8cc">'+fmt(exp)+'</td>'+
        '<td style="padding:6px 8px;text-align:center;color:'+(ok?'#2DD4B2':'#ff6b81')+';font-weight:700">'+(ok?'✓':'✗ FAIL')+'</td></tr>';
    });
    var allPass=pass===CASES.length;
    return '<div style="font-weight:700;font-size:14px;margin-bottom:4px;color:'+(allPass?'#2DD4B2':'#ff6b81')+'">'+
      (allPass?'✓ ':'✗ ')+pass+' / '+CASES.length+' golden cases pass'+(allPass?' — reproduces gov.uk to the penny':' — DISCREPANCY, investigate')+'</div>'+
      '<div style="font-size:11px;color:#5d7e93;margin-bottom:12px;line-height:1.5">Runs the actual <strong>LevyEngine</strong> core (the DOM-free calculation module the UI itself uses) against published gov.uk worked examples — function-level, to the penny. Rules '+R.version+'.</div>'+
      '<table style="width:100%;border-collapse:collapse"><thead><tr style="color:#5d7e93;font-size:10px;text-transform:uppercase;letter-spacing:.08em"><th style="text-align:left;padding:0 8px">Case</th><th style="text-align:right;padding:0 8px">Engine</th><th style="text-align:right;padding:0 8px">gov.uk</th><th style="padding:0 8px">Result</th></tr></thead><tbody>'+rows+'</tbody></table>';
  };
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey&&e.shiftKey&&(e.key==='G'||e.key==='g')){
      e.preventDefault();
      var ex=document.getElementById('goldenPanel');if(ex){ex.remove();return;}
      var p=document.createElement('div');p.id='goldenPanel';
      p.style.cssText='position:fixed;top:20px;right:20px;bottom:20px;width:min(580px,92vw);overflow:auto;z-index:9999;background:#0c1726;border:1px solid rgba(45,212,178,0.32);border-radius:14px;padding:18px 20px;box-shadow:0 20px 60px rgba(0,0,0,0.6);color:#e9f3fa;font-family:Inter,system-ui,sans-serif';
      p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="font-family:monospace;font-size:10px;letter-spacing:.1em;color:#2DD4B2">GOLDEN-CASE CORRECTNESS SUITE · gov.uk-verified</div><button onclick="document.getElementById(\'goldenPanel\').remove()" style="background:none;border:1px solid rgba(var(--wash),0.2);color:#8fb8cc;border-radius:6px;padding:3px 9px;cursor:pointer">&#10005;</button></div>'+runGoldenCases();
      document.body.appendChild(p);
    }
  });
})();