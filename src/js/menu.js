import { C } from '../data/menu-data.js';

const $=id=>document.getElementById(id), nav=$('nav'), sections=$('sections'), search=$('search'), modal=$('modal');
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function priceParts(x){return x[2].split('|').map(Number)}
function sizes(x){return (x[3]||'').split('|').filter(Boolean)}
function details(x){return (x[4]||'').split('|').filter(Boolean)}
function priceHTML(x){let p=priceParts(x),s=sizes(x);if(p.length===2){let labels=s.length===2?s:['L','M'];return `<div class="price-pair">${labels.map((l,i)=>`<div class="p"><span>${l}</span><small>${p[i]}</small></div>`).join('')}</div><span class="currency">جنيه</span>`}return `<div class="single">${p[0]}</div><span class="currency">جنيه</span>`}
function card(cat,x,i){let ds=details(x),s=sizes(x);return `<article class="card" data-cat="${cat[0]}" data-i="${i}" style="--card-index:${Math.min(i,10)}"><div class="card-main"><div><div class="name">${esc(x[0])}</div><div class="en">${esc(x[1])}</div>${(s.length||ds.length)?`<div class="tags">${[...s,...ds].map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}</div><div class="prices">${priceHTML(x)}</div></div></article>`}
function render(q=''){sections.innerHTML='';let count=0;C.forEach(cat=>{let items=cat[3].filter(x=>(cat[1]+' '+x.join(' ')).toLowerCase().includes(q.trim().toLowerCase()));if(!items.length)return;count+=items.length;let sec=document.createElement('section');sec.className='section';sec.id=cat[0];sec.innerHTML=`<div class="category-heading"><div class="category-heading-copy"><span class="category-en">${esc(cat[2])}</span><h2>${esc(cat[1])}</h2><p>اختار صنفك من المنيو</p></div><span class="category-count">${items.length} صنف</span><span class="category-star" aria-hidden="true">✦</span></div><div class="grid">${items.map((x,i)=>card(cat,x,i)).join('')}</div>`;sections.appendChild(sec)});$('empty').style.display=count?'none':'block';document.querySelectorAll('.card').forEach(c=>cardObs.observe(c));document.querySelectorAll('.head').forEach(h=>headObs.observe(h))}
const cardObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');cardObs.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -4% 0px'});
const headObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');headObs.unobserve(e.target)}}),{threshold:.4});

function openItem(cat,x){
  $('mn').textContent=x[0];$('me').textContent=x[1];
  let p=priceParts(x),s=sizes(x),d=details(x);
  $('mp').textContent=p.length===1?`${p[0]} جنيه`:'أسعار الأحجام';
  $('ms').textContent=cat[1];
  $('mpl').innerHTML=p.length===2?(s.length?s:['L','M']).map((l,i)=>`<span class="pill">${l} — ${p[i]} جنيه</span>`).join(''):`<span class="pill">${p[0]} جنيه</span>`;
  $('mdl').innerHTML=[...s,...d].map(t=>`<span class="pill light">${esc(t)}</span>`).join('');
  $('mprices').style.display=p.length===2?'block':'none';
  $('mdetails').style.display=(s.length||d.length)?'block':'none';
  modal.classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){const sheet=$('sheet');if(sheet)sheet.style.transform='';modal.classList.remove('open');document.body.style.overflow=''}

sections.addEventListener('click',e=>{let c=e.target.closest('.card');if(!c)return;let cat=C.find(z=>z[0]===c.dataset.cat);if(!cat)return;let q=search.value.trim().toLowerCase();let items=cat[3].filter(x=>(cat[1]+' '+x.join(' ')).toLowerCase().includes(q));openItem(cat,items[+c.dataset.i])});
$('close').onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};
document.onkeydown=e=>{if(e.key==='Escape')closeModal()};
search.oninput=()=>render(search.value);

nav.innerHTML=C.map(c=>`<a href="#${c[0]}">${c[1]}</a>`).join('');
const navLinks=[...nav.children];
const secObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-30% 0px -55% 0px'});
new MutationObserver(()=>document.querySelectorAll('.section').forEach(s=>secObs.observe(s))).observe(sections,{childList:true});

addEventListener('scroll',()=>{
  const menuSection=$('menu-section');
  const menuProgress=$('prog');
  if(menuSection && menuProgress){
    const rect=menuSection.getBoundingClientRect();
    const progressRange=menuSection.offsetHeight;
    const progressed=innerHeight-rect.top;
    const localProgress=progressRange>0?Math.min(1,Math.max(0,progressed/progressRange))*100:0;
    menuProgress.style.width=localProgress+'%';
  }
  $('top').classList.toggle('on',scrollY>500);
},{passive:true});
$('top').onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* Premium word-by-word hero entrance, RTL-safe for Arabic. */
(()=>{const h=$('h1'),t=h.textContent.trim(),rtl=/[\u0600-\u06FF]/.test(t);h.textContent='';const parts=rtl?t.split(/\s+/):[...t];parts.forEach((part,i)=>{const span=document.createElement('span');span.textContent=part;span.style.animationDelay=(.24+i*.12)+'s';h.appendChild(span);if(rtl&&i<parts.length-1)h.appendChild(document.createTextNode(' '))})})();

/* Swipe down to dismiss the mobile product-detail sheet. */
(()=>{
  let startY=0,deltaY=0,tracking=false;
  const sheet=$('sheet');
  if(!sheet)return;
  const start=event=>{
    if(!event.touches || event.touches.length!==1)return;
    startY=event.touches[0].clientY;
    deltaY=0;
    tracking=sheet.scrollTop<=0;
    sheet.style.transition='none';
  };
  const move=event=>{
    if(!tracking || !event.touches || event.touches.length!==1)return;
    deltaY=event.touches[0].clientY-startY;
    if(deltaY>0 && sheet.scrollTop<=0) sheet.style.transform=`translateY(${Math.min(deltaY,280)}px)`;
  };
  const end=()=>{
    sheet.style.transition='';
    if(tracking && deltaY>105) closeModal();
    else sheet.style.transform='';
    tracking=false;
    deltaY=0;
  };
  sheet.addEventListener('touchstart',start,{passive:true});
  sheet.addEventListener('touchmove',move,{passive:true});
  sheet.addEventListener('touchend',end,{passive:true});
  sheet.addEventListener('touchcancel',end,{passive:true});
})();

addEventListener('load',()=>setTimeout(()=>$('loader').classList.add('hide'),500));
render();

const bookingType=$('bookingForm')?.elements.namedItem('type');
const guestCount=$('bookingForm')?.elements.namedItem('guests');
bookingType?.addEventListener('change',()=>{
  const suggested=bookingType.selectedOptions[0]?.dataset.defaultGuests;
  if(suggested && guestCount){guestCount.value=suggested;guestCount.dispatchEvent(new Event('change',{bubbles:true}));}
});

$('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const message=[
    'أهلًا Coffee Dose، عايز أستفسر عن الحجز.',
    `الاسم: ${f.get('name')}`,
    `رقم الموبايل: ${f.get('phone')}`,
    `التاريخ: ${f.get('date')}`,
    `الوقت: ${f.get('time')}`,
    `نوع الحجز: ${f.get('type')}`,
    `عدد الأشخاص: ${f.get('guests')}`,
    f.get('notes') ? `ملاحظات: ${f.get('notes')}` : ''
  ].filter(Boolean).join('\n');
  window.open('https://wa.me/201041614422?text='+encodeURIComponent(message),'_blank','noopener');
});

