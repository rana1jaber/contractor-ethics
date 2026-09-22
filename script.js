// Contractor Ethics Check - logic and charts
// Element references
const addBtn = document.getElementById('addBtn');
const barChart = document.getElementById('barChart');
const cancelBtn = document.getElementById('cancelBtn');
const critList = document.getElementById('critList');
const dPill = document.getElementById('dPill');
const dTitle = document.getElementById('dTitle');
const dlg = document.getElementById('dlg');
const donutChart = document.getElementById('donutChart');
const donutHint = document.getElementById('donutHint');
const fDept = document.getElementById('fDept');
const fName = document.getElementById('fName');
const flagChecks = document.getElementById('flagChecks');
const flagList = document.getElementById('flagList');
const frm = document.getElementById('frm');
const kBad = document.getElementById('kBad');
const kGood = document.getElementById('kGood');
const kTotal = document.getElementById('kTotal');
const kWarn = document.getElementById('kWarn');
const radarChart = document.getElementById('radarChart');
const resetBtn = document.getElementById('resetBtn');
const sliders = document.getElementById('sliders');
const tbody = document.getElementById('tbody');

const CRITERIA=[
  {k:'safety',n:'Safety record',w:.20,h:'incidents, PPE, HSE audits'},
  {k:'license',n:'Licensing & permits',w:.15,h:'valid CR, certifications'},
  {k:'labor',n:'Labor & worker rights',w:.20,h:'wages paid on time, hours, housing'},
  {k:'bribery',n:'Anti-bribery & conflicts',w:.15,h:'gifts, conflicts of interest'},
  {k:'env',n:'Environmental compliance',w:.10,h:'waste, emissions, permits'},
  {k:'payment',n:'Payment & contract integrity',w:.10,h:'invoicing, subcontractor pay'},
  {k:'complaints',n:'Complaint history',w:.10,h:'10 = no complaints'}
];
const FLAGS={bribe:'Bribery or kickbacks',forged:'Forged documents or licenses',forced:'Child or forced labor',fatal:'Fatal safety violation (negligence)'};
const SAMPLE=[
  {id:'CTR-1250',name:'Al Noor Contracting',dept:'Maintenance',s:{safety:9,license:10,labor:8,bribery:9,env:8,payment:9,complaints:8},f:[]},
  {id:'CTR-1249',name:'Desert Peak Builders',dept:'Construction',s:{safety:6,license:8,labor:5,bribery:7,env:6,payment:6,complaints:5},f:[]},
  {id:'CTR-1248',name:'Sahel Tech Services',dept:'IT Services',s:{safety:9,license:9,labor:9,bribery:8,env:9,payment:8,complaints:9},f:[]},
  {id:'CTR-1247',name:'Gulfline Electrical',dept:'Electrical',s:{safety:7,license:9,labor:7,bribery:3,env:7,payment:7,complaints:6},f:['bribe']},
  {id:'CTR-1246',name:'Red Sea Mechanical',dept:'Mechanical',s:{safety:3,license:5,labor:4,bribery:5,env:3,payment:4,complaints:3},f:[]},
  {id:'CTR-1245',name:'Hijaz Facility Care',dept:'Maintenance',s:{safety:8,license:7,labor:6,bribery:8,env:7,payment:7,complaints:7},f:[]},
  {id:'CTR-1244',name:'Coastal Steel Works',dept:'Construction',s:{safety:5,license:6,labor:6,bribery:6,env:5,payment:5,complaints:6},f:[]},
  {id:'CTR-1243',name:'Najd Power Systems',dept:'Electrical',s:{safety:8,license:4,labor:7,bribery:7,env:8,payment:6,complaints:7},f:['forged']}
];
const KEY='ethicsCheck.v1';
let data=load(); let sel=data[0]?.id;

function load(){try{const v=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(v)&&v.length)return v;}catch(e){}return JSON.parse(JSON.stringify(SAMPLE));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}}
function score(c){return Math.round(CRITERIA.reduce((a,x)=>a+(c.s[x.k]||0)*x.w,0)*10);}
function verdict(c){const sc=score(c);if(c.f.length||sc<50)return'bad';return sc>=75?'good':'warn';}
const VTXT={good:'Ethical',warn:'Needs review',bad:'Not ethical'};
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

let bar,donut,radar;
function colors(){return{good:css('--good'),warn:css('--warn'),bad:css('--bad'),ink:css('--ink-2'),ink3:css('--ink-3'),line:css('--line'),accent:css('--accent'),surface:css('--surface')};}

// threshold lines plugin
const thresholds={id:'thr',afterDatasetsDraw(ch){const c=colors(),{ctx,chartArea:a,scales:{y}}=ch;if(!y)return;ctx.save();ctx.setLineDash([5,4]);ctx.lineWidth=1;[[75,c.good],[50,c.warn]].forEach(([v,col])=>{const py=y.getPixelForValue(v);ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(a.left,py);ctx.lineTo(a.right,py);ctx.stroke();});ctx.restore();}};

function drawCharts(){
  const c=colors();Chart.defaults.font.family='"IBM Plex Sans",system-ui,sans-serif';Chart.defaults.color=c.ink;
  const sorted=[...data].sort((a,b)=>score(b)-score(a));
  const bd={labels:sorted.map(x=>x.name),datasets:[{data:sorted.map(score),backgroundColor:sorted.map(x=>c[verdict(x)]),borderRadius:4,maxBarThickness:34}]};
  if(bar){bar.data=bd;bar.update();}else bar=new Chart(barChart,{type:'bar',data:bd,plugins:[thresholds],options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:i=>` Score ${i.raw} · ${VTXT[verdict(bar.$sorted[i.dataIndex])]}`}}},scales:{y:{min:0,max:100,ticks:{stepSize:25,color:c.ink3},grid:{color:c.line}},x:{ticks:{color:c.ink,autoSkip:false,maxRotation:40,minRotation:0,font:{size:11}},grid:{display:false}}},onClick:(e,els)=>{if(els[0]){sel=bar.$sorted[els[0].index].id;render();}}}});
  bar.$sorted=sorted;
  const cnt={good:0,warn:0,bad:0};data.forEach(x=>cnt[verdict(x)]++);
  const dd={labels:['Ethical','Needs review','Not ethical'],datasets:[{data:[cnt.good,cnt.warn,cnt.bad],backgroundColor:[c.good,c.warn,c.bad],borderColor:c.surface,borderWidth:3}]};
  if(donut){donut.data=dd;donut.update();}else donut=new Chart(donutChart,{type:'doughnut',data:dd,options:{responsive:true,maintainAspectRatio:false,cutout:'64%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:16,color:c.ink}},tooltip:{callbacks:{label:i=>` ${i.label}: ${i.raw} (${data.length?Math.round(i.raw/data.length*100):0}%)`}}}}});
  donutHint.textContent=data.length?`${Math.round(cnt.good/data.length*100)}% pass`:'';
  const cur=data.find(x=>x.id===sel);
  const rc=cur?c[verdict(cur)]:c.accent;
  const rd={labels:CRITERIA.map(x=>x.n.replace(' & ',' &\n').split('\n')),datasets:[{data:cur?CRITERIA.map(x=>cur.s[x.k]):[],backgroundColor:rc+'33',borderColor:rc,pointBackgroundColor:rc,borderWidth:2}]};
  if(radar){radar.data=rd;radar.update();}else radar=new Chart(radarChart,{type:'radar',data:rd,options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:10,ticks:{stepSize:2,display:false},grid:{color:c.line},angleLines:{color:c.line},pointLabels:{color:c.ink,font:{size:11}}}}}});
}

function render(){
  data.sort((a,b)=>b.id.localeCompare(a.id));
  if(!data.find(x=>x.id===sel))sel=data[0]?.id;
  const cnt={good:0,warn:0,bad:0};data.forEach(x=>cnt[verdict(x)]++);
  kTotal.textContent=data.length;kGood.textContent=cnt.good;kWarn.textContent=cnt.warn;kBad.textContent=cnt.bad;
  const c=colors();
  tbody.innerHTML=data.map(x=>{const sc=score(x),v=verdict(x);return`<tr class="row${x.id===sel?' sel':''}" data-id="${x.id}" tabindex="0">
    <td class="mono">${x.id}</td><td><b style="font-weight:600">${esc(x.name)}</b></td><td>${esc(x.dept)}</td>
    <td><span class="bar"><i style="width:${sc}%;background:${c[v]}"></i></span>${sc}</td>
    <td><span class="pill p-${v}">${VTXT[v]}</span></td>
    <td>${x.f.length?x.f.map(k=>`<span class="pill p-bad" style="margin:1px">${FLAGS[k]}</span>`).join(' '):'<span class="hint">None</span>'}</td>
    <td><button class="del" data-del="${x.id}" aria-label="Remove ${esc(x.name)}" title="Remove">×</button></td></tr>`}).join('')||'<tr><td colspan="7" class="hint">No contractors yet. Use “Analyze contractor”.</td></tr>';
  const cur=data.find(x=>x.id===sel);
  if(cur){const v=verdict(cur),sc=score(cur);
    dTitle.textContent=cur.name;dPill.innerHTML=`<span class="pill p-${v}">${VTXT[v]} · ${sc}/100</span>`;
    critList.innerHTML=CRITERIA.map(k=>{const val=cur.s[k.k],col=val>=7.5?c.good:val>=5?c.warn:c.bad;return`<div class="crit"><span>${k.n} <span class="hint">· ${k.w*100}%</span></span><span class="mono">${val}/10</span><span class="bar"><i style="width:${val*10}%;background:${col}"></i></span></div>`}).join('');
    const notes=[];
    cur.f.forEach(k=>notes.push(`<li style="background:var(--bad-soft);color:var(--bad)"><b>Red flag:</b> ${FLAGS[k]} — automatic “Not ethical”.</li>`));
    const weak=CRITERIA.filter(k=>cur.s[k.k]<5).map(k=>k.n);
    if(weak.length)notes.push(`<li style="background:var(--warn-soft);color:var(--warn)"><b>Weak areas:</b> ${weak.join(', ')}.</li>`);
    if(!notes.length)notes.push(`<li style="background:var(--good-soft);color:var(--good)">No red flags and no area below 5/10.</li>`);
    flagList.innerHTML=notes.join('');
  }else{dTitle.textContent='Contractor profile';dPill.innerHTML='';critList.innerHTML='';flagList.innerHTML='';}
  drawCharts();
}

tbody.addEventListener('click',e=>{const d=e.target.closest('[data-del]');if(d){data=data.filter(x=>x.id!==d.dataset.del);save();render();return;}const r=e.target.closest('tr.row');if(r){sel=r.dataset.id;render();}});
tbody.addEventListener('keydown',e=>{const r=e.target.closest('tr.row');if(r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();sel=r.dataset.id;render();}});

// form
sliders.innerHTML=CRITERIA.map(k=>`<div class="slider"><div class="lbl"><label for="s_${k.k}" style="display:inline">${k.n}</label><em>${k.h}</em></div><input type="range" id="s_${k.k}" min="0" max="10" step="1" value="7"><output id="o_${k.k}">7</output></div>`).join('');
CRITERIA.forEach(k=>{const i=document.getElementById('s_'+k.k);i.addEventListener('input',()=>document.getElementById('o_'+k.k).textContent=i.value);});
flagChecks.innerHTML=Object.entries(FLAGS).map(([k,n])=>`<label class="chk" for="f_${k}"><input type="checkbox" id="f_${k}" value="${k}"> ${n}</label>`).join('');
addBtn.onclick=()=>{frm.reset();CRITERIA.forEach(k=>document.getElementById('o_'+k.k).textContent='7');dlg.showModal();fName.focus();};
cancelBtn.onclick=()=>dlg.close();
frm.addEventListener('submit',e=>{e.preventDefault();const name=fName.value.trim();if(!name)return;
  const max=data.reduce((m,x)=>Math.max(m,parseInt(x.id.split('-')[1])||0),1250);
  const s={};CRITERIA.forEach(k=>s[k.k]=+document.getElementById('s_'+k.k).value);
  const f=Object.keys(FLAGS).filter(k=>document.getElementById('f_'+k).checked);
  const id='CTR-'+(max+1);data.push({id,name,dept:fDept.value,s,f});sel=id;save();dlg.close();render();});
resetBtn.onclick=()=>{data=JSON.parse(JSON.stringify(SAMPLE));sel=data[0].id;save();render();};

// re-theme charts when theme changes
function retheme(){[bar,donut,radar].forEach(ch=>ch&&ch.destroy());bar=donut=radar=null;render();}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',retheme);
new MutationObserver(retheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

render();
