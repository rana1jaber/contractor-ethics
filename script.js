// Ajeer Permit Check - matching logic, file import, export, charts, theme & language
/* =========================================================
   Ajeer API connection (optional)
   Ajeer has no public API. If your organization gets official
   integration access, fill these in and set enabled: true.
   The endpoint should return a JSON list of permits for an ID.
   ========================================================= */
const AJEER_API={
  enabled:false,
  baseUrl:'',            // e.g. 'https://your-gateway.example.com/ajeer'
  path:'/permits',       // GET {baseUrl}{path}?iqama=2XXXXXXXXX
  token:''               // Authorization: Bearer <token>
};

/* ---------- Translations ---------- */
const T={
en:{brand:'Contractor Authorization',tagline:'Ajeer permit verification',themeLabel:'Theme',light:'Light',dark:'Dark',
 title:'Ajeer Permit Check',subtitle:"Enter your contractors' workers, load the Ajeer permits, and see who is authorized to work and who is not.",
 importWorkers:'Import workers (Excel)',add:'+ Add worker',
 srcLabel:'Ajeer permit data',srcSample:'Sample data',srcFile:'Uploaded file',srcApi:'Ajeer API',
 srcInfoSample:'{n} fictional permits for testing. Upload your Ajeer permits file to check your real workers.',
 srcInfoFile:'{file} · {n} permits · uploaded {date}',srcInfoApi:'Last checked {date}',
 upload:'Upload Ajeer permits file',apiCheck:'Check via Ajeer API',summary:'Summary',
 kTotal:'Workers checked',kAuth:'Authorized',kReview:'Needs review',kNo:'Not authorized',
 donutTitle:'Authorization result',passHint:'{n}% authorized',barTitle:'Results by contractor company',barHint:'Number of workers',
 tableTitle:'Worker results',asOf:'Checked against {date}',filter:'Filter',all:'All',searchPh:'Search name, ID or company',
 thWorker:'Worker',thCompany:'Company',thPeriod:'Work period',thPermit:'Ajeer permit',thResult:'Result',thReason:'Reason',
 today:'Today',noPermit:'—',ends:'ends {d}',remove:'Remove',empty:'No workers match. Add a worker or import a file.',
 reset:'Restore sample data',clear:'Clear all workers',
 v:{auth:'Authorized',review:'Needs review',no:'Not authorized'},
 r:{ok:'Active permit until {end}.',expiring:'Permit expires in {n} days ({end}).',expired:'Permit expired on {end}.',cancelled:'Permit is cancelled.',none:'No Ajeer permit found for this ID.',
    occ:'Occupation differs — permit says “{a}”.',prov:'Company differs — permit issued by “{a}”.',partial:'Permit ends {end}, before the work ends ({to}).',notStarted:'Permit starts {start}, after the work begins ({from}).'},
 howTitle:'How the check works',rulesTitle:'Rules',
 r1:'Each worker is matched to Ajeer permits by Iqama / ID number.',
 r2:'Authorized: an active permit covers the whole work period and the occupation and company match.',
 r3:"Needs review: a permit exists but the occupation, company or dates don't fully match.",
 r4:'Not authorized: no permit, the permit expired, or it was cancelled.',
 r5:'Permits ending within 14 days are flagged as expiring soon.',
 r6:'Iqama / ID numbers are checked with their check digit to catch typos.',
 expTitle:'Permits expiring within 30 days',expHint:'Renew these before the workers have to stop',expNone:'No permits expire in the next 30 days.',daysLeft:'days',dayToday:'today',
 copy:'Copy table',download:'Download Excel',greg:'Gregorian',hijri:'Hijri',calLabel:'Calendar',showIds:'Show full Iqama numbers',edit:'Edit',
 editTitle:'Edit worker',saveEdit:'Save changes',tSaved:'Changes to {name} saved.',tCopied:'Copied {n} rows. Paste them into Excel.',tCopyFail:'Copy is blocked here. Select the table and copy it manually.',tXlsx:'Downloaded {n} rows.',
 badId:'Check digit is wrong — this Iqama / ID number may have a typo.',badIdShort:'Invalid ID',errIqamaBad:'This Iqama / ID number is not valid (check digit does not match). Check it for typos.',
 xCols:['Worker','Iqama / ID','Company','Occupation','Work from','Work to','Permit No','Permit ends','Result','Reason'],
 colsTitle:'Columns the permits file should have',required:'(required)',
 colsNote:'Excel (.xlsx) or CSV. Gregorian or Hijri dates. The same columns work for importing workers, plus Name, From and To.',
 disclaimer:'Ajeer does not offer a public API, so results are only as current as the permits file you upload. Confirm final decisions on the official Ajeer platform. Sample workers and permits are fictional. Everything you enter is saved in this browser only.',
 formTitle:'Add a worker',fName:'Worker name',fIqama:'Iqama / ID number',fCompany:'Contractor company',fOcc:'Occupation',fFrom:'Work starts',fTo:'Work ends',optional:'(optional)',
 periodHint:'Leave the dates empty to check for today only.',cancel:'Cancel',save:'Add and check',
 errName:'Enter the worker name.',errIqama:'Iqama / ID must be 10 digits.',errDup:'A worker with this ID is already in the list.',errDates:'The end date is before the start date.',
 tAdded:'{name} added and checked.',tPermits:'Loaded {n} permits from {file}.',tWorkers:'Imported {n} workers from {file}.',
 tNoId:'Could not find an Iqama / ID column. Columns found: {cols}',tReadErr:'Could not read this file. Use .xlsx or .csv.',tEmpty:'The file has no rows.',
 tCleared:'All workers cleared.',tReset:'Sample data restored.',tApiErr:'Ajeer API request failed: {e}',tApiOk:'Checked {n} workers via the Ajeer API.',tNoLib:'The Excel reader did not load. Check your internet connection.'
},
ar:{brand:'اعتماد المقاولين',tagline:'التحقق من تصاريح أجير',themeLabel:'المظهر',light:'فاتح',dark:'داكن',
 title:'فحص تصاريح أجير',subtitle:'أدخل عمال المقاولين، وحمّل تصاريح أجير، واعرف مين مصرح له بالعمل ومين لا.',
 importWorkers:'استيراد العمال (Excel)',add:'+ إضافة عامل',
 srcLabel:'بيانات تصاريح أجير',srcSample:'بيانات تجريبية',srcFile:'ملف مرفوع',srcApi:'API أجير',
 srcInfoSample:'{n} تصاريح وهمية للتجربة. ارفع ملف تصاريح أجير لفحص عمالك الحقيقيين.',
 srcInfoFile:'{file} · {n} تصريح · رُفع {date}',srcInfoApi:'آخر فحص {date}',
 upload:'رفع ملف تصاريح أجير',apiCheck:'فحص عبر API أجير',summary:'الملخص',
 kTotal:'العمال المفحوصون',kAuth:'مصرح',kReview:'يحتاج مراجعة',kNo:'غير مصرح',
 donutTitle:'نتيجة التصريح',passHint:'نسبة المصرح لهم {n}%',barTitle:'النتائج حسب شركة المقاول',barHint:'عدد العمال',
 tableTitle:'نتائج العمال',asOf:'الفحص بتاريخ {date}',filter:'تصفية',all:'الكل',searchPh:'ابحث بالاسم أو رقم الإقامة أو الشركة',
 thWorker:'العامل',thCompany:'الشركة',thPeriod:'فترة العمل',thPermit:'تصريح أجير',thResult:'النتيجة',thReason:'السبب',
 today:'اليوم',noPermit:'—',ends:'ينتهي {d}',remove:'حذف',empty:'لا يوجد عمال مطابقون. أضف عاملًا أو استورد ملفًا.',
 reset:'استعادة البيانات التجريبية',clear:'حذف جميع العمال',
 v:{auth:'مصرح',review:'يحتاج مراجعة',no:'غير مصرح'},
 r:{ok:'تصريح ساري حتى {end}.',expiring:'التصريح ينتهي خلال {n} يوم ({end}).',expired:'التصريح انتهى في {end}.',cancelled:'التصريح ملغى.',none:'لا يوجد تصريح أجير لرقم الإقامة هذا.',
    occ:'المهنة مختلفة — التصريح مكتوب فيه «{a}».',prov:'الشركة مختلفة — التصريح صادر من «{a}».',partial:'التصريح ينتهي {end} قبل نهاية العمل ({to}).',notStarted:'التصريح يبدأ {start} بعد بداية العمل ({from}).'},
 howTitle:'كيف يتم الفحص',rulesTitle:'القواعد',
 r1:'يُطابَق كل عامل مع تصاريح أجير عن طريق رقم الإقامة / الهوية.',
 r2:'مصرح: يوجد تصريح ساري يغطي كامل فترة العمل، والمهنة والشركة مطابقتان.',
 r3:'يحتاج مراجعة: يوجد تصريح لكن المهنة أو الشركة أو التواريخ غير مطابقة بالكامل.',
 r4:'غير مصرح: لا يوجد تصريح، أو التصريح منتهي، أو ملغى.',
 r5:'التصاريح التي تنتهي خلال 14 يومًا تظهر بتنبيه «ينتهي قريبًا».',
 r6:'يتم التحقق من صحة رقم الإقامة / الهوية برقم التحقق لاكتشاف الأخطاء الكتابية.',
 expTitle:'تصاريح تنتهي خلال 30 يومًا',expHint:'جدّدها قبل ما يضطر العمال للتوقف',expNone:'لا توجد تصاريح تنتهي خلال 30 يومًا.',daysLeft:'يوم',dayToday:'اليوم',
 copy:'نسخ الجدول',download:'تحميل Excel',greg:'ميلادي',hijri:'هجري',calLabel:'التقويم',showIds:'إظهار أرقام الإقامة كاملة',edit:'تعديل',
 editTitle:'تعديل بيانات العامل',saveEdit:'حفظ التعديلات',tSaved:'تم حفظ تعديلات {name}.',tCopied:'تم نسخ {n} صف. الصقه في Excel.',tCopyFail:'النسخ غير مسموح هنا. حدّد الجدول وانسخه يدويًا.',tXlsx:'تم تحميل {n} صف.',
 badId:'رقم التحقق غير صحيح — قد يكون في رقم الإقامة / الهوية خطأ كتابي.',badIdShort:'رقم غير صحيح',errIqamaBad:'رقم الإقامة / الهوية غير صحيح (رقم التحقق لا يطابق). تأكد من الرقم.',
 xCols:['العامل','رقم الإقامة / الهوية','الشركة','المهنة','بداية العمل','نهاية العمل','رقم التصريح','نهاية التصريح','النتيجة','السبب'],
 colsTitle:'الأعمدة المطلوبة في ملف التصاريح',required:'(إلزامي)',
 colsNote:'ملف Excel ‏(.xlsx) أو CSV، والتواريخ ميلادية أو هجرية. نفس الأعمدة تصلح لاستيراد العمال، مع الاسم وتاريخ البداية والنهاية.',
 disclaimer:'أجير لا يوفر API عامًا، لذلك النتائج محدّثة بقدر ملف التصاريح الذي ترفعه. تأكد من القرار النهائي في منصة أجير الرسمية. العمال والتصاريح التجريبية وهمية. كل ما تدخله يُحفظ في هذا المتصفح فقط.',
 formTitle:'إضافة عامل',fName:'اسم العامل',fIqama:'رقم الإقامة / الهوية',fCompany:'شركة المقاول',fOcc:'المهنة',fFrom:'بداية العمل',fTo:'نهاية العمل',optional:'(اختياري)',
 periodHint:'اترك التواريخ فارغة للفحص على تاريخ اليوم فقط.',cancel:'إلغاء',save:'إضافة وفحص',
 errName:'اكتب اسم العامل.',errIqama:'رقم الإقامة / الهوية لازم يكون 10 أرقام.',errDup:'يوجد عامل بنفس رقم الإقامة في القائمة.',errDates:'تاريخ النهاية قبل تاريخ البداية.',
 tAdded:'تمت إضافة {name} وفحصه.',tPermits:'تم تحميل {n} تصريح من {file}.',tWorkers:'تم استيراد {n} عامل من {file}.',
 tNoId:'لم أجد عمود رقم الإقامة / الهوية. الأعمدة الموجودة: {cols}',tReadErr:'تعذّرت قراءة الملف. استخدم ‎.xlsx‎ أو ‎.csv‎.',tEmpty:'الملف لا يحتوي على صفوف.',
 tCleared:'تم حذف جميع العمال.',tReset:'تمت استعادة البيانات التجريبية.',tApiErr:'فشل طلب API أجير: {e}',tApiOk:'تم فحص {n} عامل عبر API أجير.',tNoLib:'لم يتم تحميل قارئ Excel. تأكد من اتصال الإنترنت.'
}};

/* Display names for sample values */
const LABELS={
 'Al Noor Contracting':'مؤسسة النور للمقاولات','Desert Peak Builders':'قمة الصحراء للبناء','Gulfline Electrical':'خط الخليج للكهرباء','Red Sea Mechanical':'البحر الأحمر للميكانيكا',
 'Electrician':'كهربائي','Plumber':'سبّاك','Welder':'لحّام','Technician':'فني','Mason':'بنّاء','HVAC Technician':'فني تكييف','Carpenter':'نجّار'
};

/* ---------- Date helpers ---------- */
const DAY=864e5;
function isoOf(d){const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10);}
const TODAY=isoOf(new Date());
function addDays(iso,n){const d=new Date(iso+'T00:00:00');d.setDate(d.getDate()+n);return isoOf(d);}
function daysBetween(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/DAY);}
const d=n=>addDays(TODAY,n);

/* ---------- Sample data (fictional) ---------- */
function samples(){
 const W=[
  ['Mohammed Rahim','محمد رحيم','2381046578','Al Noor Contracting','Electrician','',''],
  ['Arjun Nair','أرجون ناير','2419837261','Al Noor Contracting','Plumber','',''],
  ['Nabil Saeed','نبيل سعيد','2290374814','Al Noor Contracting','Electrician',d(0),d(45)],
  ['Samir Haddad','سمير حداد','2456120936','Desert Peak Builders','Welder','',''],
  ['Jose Santos','خوسيه سانتوس','2503918472','Desert Peak Builders','Technician','',''],
  ['Rafiq Ahmed','رفيق أحمد','2337561902','Desert Peak Builders','Welder',d(0),d(60)],
  ['Imran Qureshi','عمران قريشي','2478209634','Gulfline Electrical','Electrician','',''],
  ['Ali Hassan','علي حسن','2365097142','Gulfline Electrical','Mason','',''],
  ['Kamal Uddin','كمال الدين','2410685321','Red Sea Mechanical','HVAC Technician','',''],
  ['Yusuf Omar','يوسف عمر','2394752014','Red Sea Mechanical','Carpenter',d(0),d(90)]
 ].map((r,i)=>({id:'W'+(i+1),name:{en:r[0],ar:r[1]},iqama:r[2],company:r[3],occupation:r[4],from:r[5],to:r[6]}));
 const P=[
  ['AJ-7710231','2381046578','Al Noor Contracting','Electrician',d(-60),d(120),'Active'],
  ['AJ-7710244','2419837261','Al Noor Contracting','Plumber',d(-30),d(9),'Active'],
  ['AJ-7710259','2290374814','Hijaz Facility Care','Electrician',d(-15),d(75),'Active'],
  ['AJ-7609812','2456120936','Desert Peak Builders','Welder',d(-200),d(-20),'Expired'],
  ['AJ-7710302','2337561902','Desert Peak Builders','Welder',d(-5),d(170),'Active'],
  ['AJ-7710318','2478209634','Gulfline Electrical','Plumber',d(-40),d(140),'Active'],
  ['AJ-7710327','2365097142','Gulfline Electrical','Mason',d(-90),d(95),'Active'],
  ['AJ-7710335','2410685321','Red Sea Mechanical','HVAC Technician',d(-20),d(160),'Cancelled'],
  ['AJ-7710349','2394752014','Red Sea Mechanical','Carpenter',d(-10),d(30),'Active']
 ].map(r=>({permitNo:r[0],iqama:r[1],company:r[2],occupation:r[3],start:r[4],end:r[5],status:r[6]}));
 return{W,P};
}

/* ---------- Storage (safe) ---------- */
const K={w:'ajeerCheck.workers',p:'ajeerCheck.permits',src:'ajeerCheck.source',prefs:'ajeerCheck.prefs'};
function getLS(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function setLS(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
let workers=getLS(K.w), permits=getLS(K.p), source=getLS(K.src);
if(!Array.isArray(workers)||!Array.isArray(permits)||!source){const s=samples();workers=Array.isArray(workers)?workers:s.W;permits=Array.isArray(permits)&&source?permits:s.P;source=source||{type:'sample'};}
if(source.type==='sample'){permits=samples().P;} // keep sample dates relative to today
// earlier versions used sample IDs without a valid check digit; update them
const OLD_IDS={'2381046572':0,'2419837265':1,'2290374815':2,'2456120938':3,'2503918476':4,'2337561904':5,'2478209635':6,'2365097142':7,'2410685329':8,'2394752016':9};
workers.forEach(w=>{const i=OLD_IDS[w.iqama];if(i!==undefined&&typeof w.name==='object')w.iqama=samples().W[i].iqama;});
const prefs=getLS(K.prefs)||{};
let lang=prefs.lang||((navigator.language||'').toLowerCase().startsWith('en')?'en':'ar');
let theme=prefs.theme||null;
let filter='all', query='', editingId=null;
let cal=prefs.cal||'gregory', showIds=!!prefs.showIds;
function saveAll(){setLS(K.w,workers);setLS(K.p,permits);setLS(K.src,source);}
function savePrefs(){setLS(K.prefs,{lang,theme,cal,showIds});}

/* ---------- Helpers ---------- */
const $=id=>document.getElementById(id);
const t=k=>T[lang][k];
const fmt=(s,o)=>s.replace(/\{(\w+)\}/g,(m,k)=>o[k]!==undefined?o[k]:m);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const lbl=v=>lang==='ar'&&LABELS[v]?LABELS[v]:(v||'');
const nm=w=>typeof w.name==='string'?w.name:(w.name[lang]||w.name.en);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function digits(s){return String(s==null?'':s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c));}
function normId(s){return digits(s).replace(/\D/g,'');}
function normTxt(s){return String(s||'').toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[ً-ْـ]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
const REV=Object.fromEntries(Object.entries(LABELS).map(([k,v])=>[v,k]));
function variants(v){return[v,LABELS[v],REV[v]].filter(Boolean).map(normTxt).filter(Boolean);}
function sameTxt(a,b){const A=variants(a),B=variants(b);if(!A.length||!B.length)return true;return A.some(x=>B.some(y=>x===y||x.includes(y)||y.includes(x)));}
function fmtDate(iso){if(!iso)return'';const dt=new Date(iso+'T00:00:00');if(isNaN(dt))return iso;
  const loc=lang==='ar'?`ar-SA-u-ca-${cal}-nu-latn`:`en-GB-u-ca-${cal}`;
  try{return dt.toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'});}catch(e){return iso;}}
/* Saudi ID / Iqama: 10 digits, starts with 1 (citizen) or 2 (resident), last digit is a Luhn check digit */
function validId(s){s=normId(s);if(!/^[12]\d{9}$/.test(s))return false;let sum=0;for(let i=0;i<10;i++){let d=+s[i];if(i%2===0){d*=2;if(d>9)d-=9;}sum+=d;}return sum%10===0;}
function showId(s){s=normId(s);return showIds||s.length<6?s:s.slice(0,2)+'•••••'+s.slice(-3);}
/* Hijri (Umm al-Qura) -> Gregorian ISO */
const HFMT=(()=>{try{return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{timeZone:'UTC',year:'numeric',month:'numeric',day:'numeric'});}catch(e){return null;}})();
function hijriToISO(y,m,d){
  if(!HFMT)return'';
  const approx=Date.UTC(2000,0,1)+((y-1420)*354.367+(m-1)*29.53+(d-1)-270)*DAY; // 1 Muharram 1420 ≈ 17 Apr 1999
  for(let k=-45;k<=45;k++){const dt=new Date(approx+k*DAY);const p={};HFMT.formatToParts(dt).forEach(x=>p[x.type]=x.value);
    if(+p.year===y&&+p.month===m&&+p.day===d)return dt.toISOString().slice(0,10);}
  return'';
}
function toast(msg,bad){const el=$('toast');el.textContent=msg;el.className='toast'+(bad?' bad':'');el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,bad?7000:3500);}

/* ---------- The check ---------- */
const CANCEL_RE=/cancel|revok|suspend|inactive|ملغ|موقوف|غير ساري|معلق/i;
const EXPIRED_RE=/expir|منته/i;
function evalPermit(p,w,from,to){
  if(CANCEL_RE.test(p.status||''))return{code:'cancelled',rank:4,p};
  if((p.end&&p.end<TODAY)||(p.end&&p.end<from)||(EXPIRED_RE.test(p.status||'')&&(!p.end||p.end<TODAY)))return{code:'expired',rank:3,p};
  const issues=[];
  if(p.start&&p.start>from)issues.push('notStarted');
  if(p.end&&p.end<to)issues.push('partial');
  if(!sameTxt(w.occupation,p.occupation))issues.push('occ');
  if(!sameTxt(w.company,p.company))issues.push('prov');
  if(issues.length)return{code:issues[0],issues,rank:2,p};
  const left=p.end?daysBetween(TODAY,p.end):999;
  return left<=14?{code:'expiring',rank:1,p,left}:{code:'ok',rank:0,p};
}
function check(w){
  const r=checkPermits(w);r.badId=!validId(w.iqama);return r;
}
function checkPermits(w){
  const id=normId(w.iqama);
  const ps=permits.filter(p=>normId(p.iqama)===id);
  if(!ps.length)return{v:'no',code:'none',issues:['none']};
  const from=w.from||TODAY, to=w.to||from;
  const res=ps.map(p=>evalPermit(p,w,from,to)).sort((a,b)=>a.rank-b.rank||String(b.p.end).localeCompare(String(a.p.end)))[0];
  res.v=res.rank<=1?'auth':res.rank===2?'review':'no';
  res.issues=res.issues||[res.code];
  return res;
}
function reasonLines(w,r){
  const R=t('r'),p=r.p||{},from=w.from||TODAY,to=w.to||from;
  const lines=r.issues.map(c=>fmt(R[c],{end:fmtDate(p.end),start:fmtDate(p.start),n:r.left,from:fmtDate(from),to:fmtDate(to),a:c==='occ'?lbl(p.occupation):lbl(p.company)}));
  if(r.badId)lines.push(t('badId'));
  return lines;
}
function reasonHTML(w,r){
  const lines=reasonLines(w,r);
  return lines.length>1?'<ul>'+lines.map(l=>`<li>${esc(l)}</li>`).join('')+'</ul>':esc(lines[0]);
}

/* ---------- Theme & language ---------- */
const mq=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){
  if(theme)document.documentElement.setAttribute('data-theme',theme);else document.documentElement.removeAttribute('data-theme');
  const eff=theme||(mq.matches?'dark':'light');
  $('themeLight').setAttribute('aria-pressed',eff==='light');$('themeDark').setAttribute('aria-pressed',eff==='dark');
}
function applyLang(){
  const root=document.documentElement;root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>el.placeholder=t(el.dataset.i18nPh));
  document.title=t('title');
  $('langEn').setAttribute('aria-pressed',lang==='en');$('langAr').setAttribute('aria-pressed',lang==='ar');
}
$('themeSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;theme=b.dataset.mode;savePrefs();applyTheme();rebuild();});
$('langSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.lang===lang)return;lang=b.dataset.lang;savePrefs();applyLang();rebuild();});
mq.addEventListener('change',()=>{if(!theme){applyTheme();rebuild();}});

/* ---------- Charts ---------- */
let donut,bar;
function drawCharts(results){
  if(typeof Chart==='undefined')return;
  const c={auth:css('--good'),review:css('--warn'),no:css('--bad'),ink:css('--ink-2'),ink3:css('--ink-3'),line:css('--line'),surface:css('--surface')},rtl=lang==='ar',V=t('v');
  Chart.defaults.font.family=getComputedStyle(document.body).fontFamily;Chart.defaults.color=c.ink;
  const cnt={auth:0,review:0,no:0};results.forEach(x=>cnt[x.r.v]++);
  const dd={labels:[V.auth,V.review,V.no],datasets:[{data:[cnt.auth,cnt.review,cnt.no],backgroundColor:[c.auth,c.review,c.no],borderColor:c.surface,borderWidth:3}]};
  if(donut){donut.data=dd;donut.update();}else donut=new Chart($('donutChart'),{type:'doughnut',data:dd,options:{responsive:true,maintainAspectRatio:false,cutout:'64%',
    plugins:{legend:{position:'bottom',rtl,labels:{usePointStyle:true,padding:16,color:c.ink}},tooltip:{rtl,callbacks:{label:i=>` ${i.label}: ${i.raw}`}}}}});
  const comps=[...new Set(results.map(x=>x.w.company||'—'))];
  const by=k=>comps.map(co=>results.filter(x=>(x.w.company||'—')===co&&x.r.v===k).length);
  const bd={labels:comps.map(lbl),datasets:['auth','review','no'].map(k=>({label:V[k],data:by(k),backgroundColor:c[k],borderRadius:3,maxBarThickness:26}))};
  if(bar){bar.data=bd;bar.update();}else bar=new Chart($('barChart'),{type:'bar',data:bd,options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{position:'bottom',rtl,labels:{usePointStyle:true,padding:14,color:c.ink}},tooltip:{rtl}},
    scales:{x:{stacked:true,reverse:rtl,beginAtZero:true,ticks:{precision:0,color:c.ink3},grid:{color:c.line}},y:{stacked:true,position:rtl?'right':'left',ticks:{color:c.ink},grid:{display:false}}}}});
}
function rebuild(){[donut,bar].forEach(ch=>ch&&ch.destroy());donut=bar=null;render();}

/* ---------- Render ---------- */
function render(){
  const results=workers.map(w=>({w,r:check(w)}));
  const cnt={auth:0,review:0,no:0};results.forEach(x=>cnt[x.r.v]++);
  $('kTotal').textContent=results.length;$('kAuth').textContent=cnt.auth;$('kReview').textContent=cnt.review;$('kNo').textContent=cnt.no;
  $('donutHint').textContent=results.length?fmt(t('passHint'),{n:Math.round(cnt.auth/results.length*100)}):'';
  $('asOf').textContent=fmt(t('asOf'),{date:fmtDate(TODAY)});
  // source
  const tag=$('srcTag');
  if(source.type==='file'){tag.textContent=t('srcFile');tag.className='tag live';$('srcInfo').textContent=fmt(t('srcInfoFile'),{file:source.file,n:permits.length,date:fmtDate(source.date)});}
  else if(source.type==='api'){tag.textContent=t('srcApi');tag.className='tag live';$('srcInfo').textContent=fmt(t('srcInfoApi'),{date:fmtDate(source.date)});}
  else{tag.textContent=t('srcSample');tag.className='tag';$('srcInfo').textContent=fmt(t('srcInfoSample'),{n:permits.length});}
  $('apiBtn').hidden=!AJEER_API.enabled;
  // chips
  const V=t('v');
  $('chips').innerHTML=[['all',t('all'),results.length],['auth',V.auth,cnt.auth],['review',V.review,cnt.review],['no',V.no,cnt.no]]
    .map(([k,l,n])=>`<button type="button" class="chip" data-f="${k}" aria-pressed="${filter===k}">${l}<span class="n">${n}</span></button>`).join('');
  // table
  const order={no:0,review:1,auth:2};
  const q=normTxt(query), qd=normId(query);
  const rows=results.filter(x=>filter==='all'||x.r.v===filter)
    .filter(x=>!q||normTxt(nm(x.w)+' '+x.w.company+' '+lbl(x.w.company)).includes(q)||(qd&&normId(x.w.iqama).includes(qd)))
    .sort((a,b)=>order[a.r.v]-order[b.r.v]||nm(a.w).localeCompare(nm(b.w)));
  const col={auth:'var(--good)',review:'var(--warn)',no:'var(--bad)'};
  $('tbody').innerHTML=rows.map(({w,r})=>{const p=r.p;
    const period=w.from||w.to?`${fmtDate(w.from||TODAY)} – ${fmtDate(w.to||w.from)}`:t('today');
    return`<tr>
    <td class="stripe" style="background:${col[r.v]}"></td>
    <td><b style="font-weight:600">${esc(nm(w))}</b><span class="sm mono">${esc(showId(w.iqama))}</span>${r.badId?`<span class="warnid">${t('badIdShort')}</span>`:''}</td>
    <td>${esc(lbl(w.company))}<span class="sm">${esc(lbl(w.occupation))}</span></td>
    <td>${esc(period)}</td>
    <td>${p?`<span class="mono">${esc(p.permitNo||'—')}</span><span class="sm">${esc(fmt(t('ends'),{d:fmtDate(p.end)}))}</span>`:t('noPermit')}</td>
    <td><span class="pill p-${r.v}">${V[r.v]}</span></td>
    <td class="reason">${reasonHTML(w,r)}</td>
    <td><div class="acts"><button class="del" type="button" data-edit="${esc(w.id)}" aria-label="${t('edit')} ${esc(nm(w))}" title="${t('edit')}">✎</button><button class="del" type="button" data-del="${esc(w.id)}" aria-label="${t('remove')} ${esc(nm(w))}" title="${t('remove')}">×</button></div></td></tr>`}).join('')
    ||`<tr><td colspan="8" class="empty">${t('empty')}</td></tr>`;
  // datalists
  $('companyList').innerHTML=[...new Set(workers.map(w=>w.company).concat(permits.map(p=>p.company)).filter(Boolean))].map(v=>`<option value="${esc(v)}">`).join('');
  $('occList').innerHTML=[...new Set(workers.map(w=>w.occupation).concat(permits.map(p=>p.occupation)).filter(Boolean))].map(v=>`<option value="${esc(v)}">`).join('');
  // expiring within 30 days
  const exp=results.filter(x=>x.r.p&&x.r.p.end&&x.r.v!=='no').map(x=>({...x,left:daysBetween(TODAY,x.r.p.end)})).filter(x=>x.left>=0&&x.left<=30).sort((a,b)=>a.left-b.left);
  $('expCount').textContent=exp.length;
  $('expList').innerHTML=exp.length?exp.map(x=>`<li>
    <div class="days ${x.left<=14?'d-urgent':'d-soon'}">${x.left===0?t('dayToday'):x.left+'<small>'+t('daysLeft')+'</small>'}</div>
    <div class="who"><b>${esc(nm(x.w))}</b><span>${esc(lbl(x.w.company))} · <span class="mono">${esc(showId(x.w.iqama))}</span></span></div>
    <div class="when"><span class="mono">${esc(x.r.p.permitNo||'')}</span><br>${esc(fmt(t('ends'),{d:fmtDate(x.r.p.end)}))}</div></li>`).join('')
    :`<li style="display:block"><p class="exp-empty">${t('expNone')}</p></li>`;
  // controls
  document.querySelectorAll('#calSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cal===cal));
  $('showIds').checked=showIds;
  lastRows=rows;
  drawCharts(results);
}
let lastRows=[];
$('chips').addEventListener('click',e=>{const b=e.target.closest('[data-f]');if(b){filter=b.dataset.f;render();}});
$('q').addEventListener('input',e=>{query=e.target.value;render();});
$('tbody').addEventListener('click',e=>{
  const ed=e.target.closest('[data-edit]');if(ed){openForm(workers.find(w=>w.id===ed.dataset.edit));return;}
  const b=e.target.closest('[data-del]');if(!b)return;workers=workers.filter(w=>w.id!==b.dataset.del);saveAll();render();});
$('calSeg').addEventListener('click',e=>{const b=e.target.closest('[data-cal]');if(!b)return;cal=b.dataset.cal;savePrefs();render();});
$('showIds').addEventListener('change',e=>{showIds=e.target.checked;savePrefs();render();});

/* ---------- Export ---------- */
function exportRows(){
  const V=t('v');
  return lastRows.map(({w,r})=>[nm(w),normId(w.iqama),lbl(w.company),lbl(w.occupation),fmtDate(w.from||TODAY),fmtDate(w.to||w.from||TODAY),r.p?r.p.permitNo||'':'',r.p?fmtDate(r.p.end):'',V[r.v],reasonLines(w,r).join(' ')]);
}
$('copyBtn').onclick=()=>{
  const rows=exportRows(),tsv=[t('xCols'),...rows].map(r=>r.map(c=>String(c).replace(/[\t\n]/g,' ')).join('\t')).join('\n');
  const ok=()=>toast(fmt(t('tCopied'),{n:rows.length}));
  const fallback=()=>{const ta=document.createElement('textarea');ta.value=tsv;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let done=false;try{done=document.execCommand('copy');}catch(e){}ta.remove();done?ok():toast(t('tCopyFail'),true);};
  try{navigator.clipboard.writeText(tsv).then(ok,fallback);}catch(e){fallback();}
};
// File downloads don't work inside an embedded preview, so the button only shows on the real site
let embedded=true;try{embedded=window.self!==window.top;}catch(e){}
$('xlsxBtn').hidden=embedded;
$('xlsxBtn').onclick=()=>{
  if(typeof XLSX==='undefined'){toast(t('tNoLib'),true);return;}
  const rows=exportRows(),ws=XLSX.utils.aoa_to_sheet([t('xCols'),...rows]);
  ws['!cols']=[22,14,24,16,14,14,14,14,14,50].map(w=>({wch:w}));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,lang==='ar'?'النتائج':'Results');
  if(lang==='ar')wb.Workbook={Views:[{RTL:true}]};
  XLSX.writeFile(wb,`ajeer-results-${TODAY}.xlsx`);toast(fmt(t('tXlsx'),{n:rows.length}));
};
$('resetBtn').onclick=()=>{const s=samples();workers=s.W;permits=s.P;source={type:'sample'};saveAll();filter='all';render();toast(t('tReset'));};
$('clearBtn').onclick=()=>{workers=[];saveAll();render();toast(t('tCleared'));};

/* ---------- Add worker ---------- */
function openForm(w){
  editingId=w?w.id:null;$('frm').reset();$('fErr').hidden=true;
  $('formH').textContent=t(w?'editTitle':'formTitle');$('formSubmit').textContent=t(w?'saveEdit':'save');
  if(w){$('fName').value=nm(w);$('fIqama').value=normId(w.iqama);$('fCompany').value=w.company||'';$('fOcc').value=w.occupation||'';$('fFrom').value=w.from||'';$('fTo').value=w.to||'';}
  $('dlg').showModal();$('fName').focus();
}
$('addBtn').onclick=()=>openForm(null);
$('cancelBtn').onclick=()=>$('dlg').close();
$('frm').addEventListener('submit',e=>{e.preventDefault();
  const name=$('fName').value.trim(),iq=normId($('fIqama').value),from=$('fFrom').value,to=$('fTo').value;
  let err='';
  if(!name)err=t('errName');else if(iq.length!==10)err=t('errIqama');else if(!validId(iq))err=t('errIqamaBad');else if(workers.some(w=>normId(w.iqama)===iq&&w.id!==editingId))err=t('errDup');else if(from&&to&&to<from)err=t('errDates');
  if(err){$('fErr').textContent=err;$('fErr').hidden=false;return;}
  const data={name,iqama:iq,company:$('fCompany').value.trim(),occupation:$('fOcc').value.trim(),from,to:to||(from?from:'')};
  if(editingId){const i=workers.findIndex(w=>w.id===editingId);if(i>=0)workers[i]={...workers[i],...data};saveAll();$('dlg').close();render();toast(fmt(t('tSaved'),{name}));editingId=null;return;}
  workers.push({id:'W'+Date.now(),...data});
  saveAll();$('dlg').close();filter='all';render();toast(fmt(t('tAdded'),{name}));});

/* ---------- File import ---------- */
const HEAD={
  iqama:['iqama','iqama no','iqama number','id','id no','id number','national id','resident id','border','رقم الاقامه','رقم الاقامة','الاقامه','رقم الهويه','الهويه','السجل'],
  permitNo:['permit','permit no','permit number','permit id','رقم التصريح','التصريح'],
  name:['name','worker','worker name','employee','employee name','الاسم','اسم العامل','اسم الموظف','العامل'],
  company:['company','provider','contractor','establishment','provider establishment','المنشاه','المنشاه المقدمه','الشركه','المقاول','المنشاه المزوده'],
  occupation:['occupation','profession','job','job title','المهنه','الوظيفه'],
  start:['start','start date','from','from date','issue date','تاريخ البدايه','تاريخ البدء','من','تاريخ الاصدار'],
  end:['end','end date','to','to date','expiry','expiry date','expiration','تاريخ النهايه','تاريخ الانتهاء','الي','الى'],
  status:['status','state','الحاله']
};
function mapHeaders(headers){
  const m={};const H=headers.map(h=>normTxt(h));
  for(const [k,alts] of Object.entries(HEAD)){
    const A=alts.map(normTxt);
    let i=H.findIndex(h=>A.includes(h));
    if(i<0)i=H.findIndex(h=>A.some(a=>a.length>3&&h.includes(a)));
    if(i>=0&&!Object.values(m).includes(headers[i]))m[k]=headers[i];
  }
  return m;
}
function toISO(v){
  if(v==null||v==='')return'';
  if(v instanceof Date&&!isNaN(v))return isoOf(v);
  if(typeof v==='number'){if(v>20000&&v<80000&&typeof XLSX!=='undefined'){const o=XLSX.SSF.parse_date_code(v);return`${o.y}-${String(o.m).padStart(2,'0')}-${String(o.d).padStart(2,'0')}`;}return'';}
  const s=digits(String(v)).replace(/هـ|ه$|AH/gi,'').trim();let m,y,mo,da;
  if(m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)){y=+m[1];mo=+m[2];da=+m[3];}
  else if(m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/)){y=+m[3];mo=+m[2];da=+m[1];}
  if(y){if(y<1600)return hijriToISO(y,mo,da);return`${y}-${String(mo).padStart(2,'0')}-${String(da).padStart(2,'0')}`;}
  const dt=new Date(s);return isNaN(dt)?'':isoOf(dt);
}
async function readRows(file){
  if(typeof XLSX==='undefined')throw new Error('nolib');
  const buf=await file.arrayBuffer();
  const wb=XLSX.read(buf,{type:'array',raw:/\.csv$/i.test(file.name)});
  const ws=wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws,{defval:'',raw:true});
}
async function importFile(file,kind){
  let rows;
  try{rows=await readRows(file);}catch(e){toast(e.message==='nolib'?t('tNoLib'):t('tReadErr'),true);return;}
  if(!rows.length){toast(t('tEmpty'),true);return;}
  const headers=Object.keys(rows[0]);const m=mapHeaders(headers);
  if(!m.iqama){toast(fmt(t('tNoId'),{cols:headers.join('، ')}),true);return;}
  const g=(r,k)=>m[k]?r[m[k]]:'';
  if(kind==='permits'){
    permits=rows.map(r=>({permitNo:String(g(r,'permitNo')||'').trim(),iqama:normId(g(r,'iqama')),company:String(g(r,'company')||'').trim(),occupation:String(g(r,'occupation')||'').trim(),start:toISO(g(r,'start')),end:toISO(g(r,'end')),status:String(g(r,'status')||'').trim()})).filter(p=>p.iqama);
    source={type:'file',file:file.name,date:TODAY};saveAll();render();toast(fmt(t('tPermits'),{n:permits.length,file:file.name}));
  }else{
    const have=new Set(workers.map(w=>normId(w.iqama)));let n=0;
    rows.forEach((r,i)=>{const iq=normId(g(r,'iqama'));if(!iq||have.has(iq))return;have.add(iq);n++;
      workers.push({id:'W'+Date.now()+'-'+i,name:String(g(r,'name')||iq).trim(),iqama:iq,company:String(g(r,'company')||'').trim(),occupation:String(g(r,'occupation')||'').trim(),from:toISO(g(r,'start')),to:toISO(g(r,'end'))});});
    saveAll();filter='all';render();toast(fmt(t('tWorkers'),{n,file:file.name}));
  }
}
$('uploadBtn').onclick=()=>$('permitFile').click();
$('importWorkersBtn').onclick=()=>$('workerFile').click();
$('permitFile').addEventListener('change',e=>{const f=e.target.files[0];if(f)importFile(f,'permits');e.target.value='';});
$('workerFile').addEventListener('change',e=>{const f=e.target.files[0];if(f)importFile(f,'workers');e.target.value='';});

/* ---------- Ajeer API (used only when AJEER_API.enabled) ---------- */
async function fetchAjeerPermits(iqama){
  const url=`${AJEER_API.baseUrl}${AJEER_API.path}?iqama=${encodeURIComponent(iqama)}`;
  const res=await fetch(url,{headers:{'Accept':'application/json',...(AJEER_API.token?{'Authorization':'Bearer '+AJEER_API.token}:{})}});
  if(!res.ok)throw new Error('HTTP '+res.status);
  const body=await res.json();
  const list=Array.isArray(body)?body:(body.permits||body.data||[]);
  // Map the API's field names to ours. Adjust these to match the real response.
  return list.map(x=>({permitNo:x.permitNumber||x.permitNo||x.id||'',iqama:normId(x.iqama||x.idNumber||iqama),company:x.providerName||x.company||'',occupation:x.occupation||x.profession||'',start:toISO(x.startDate||x.start),end:toISO(x.endDate||x.end),status:x.status||''}));
}
$('apiBtn').onclick=async()=>{
  const btn=$('apiBtn');btn.disabled=true;
  try{
    const all=[];for(const w of workers){all.push(...await fetchAjeerPermits(normId(w.iqama)));}
    permits=all;source={type:'api',date:TODAY};saveAll();render();toast(fmt(t('tApiOk'),{n:workers.length}));
  }catch(e){toast(fmt(t('tApiErr'),{e:e.message}),true);}
  finally{btn.disabled=false;}
};

/* ---------- Start ---------- */
applyTheme();applyLang();render();
