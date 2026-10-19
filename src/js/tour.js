(()=>{
 const stage=document.querySelector('.tour-stage'),img=document.getElementById('tourMainImage'),title=document.getElementById('tourTitle'),count=document.getElementById('tourCount'),progress=document.getElementById('tourProgress'),thumbs=[...document.querySelectorAll('.tour-thumb')];
 if(!stage||!img||!thumbs.length)return;
 const names=thumbs.map(t=>t.getAttribute('aria-label').replace(/^عرض صورة \d+:\s*/,''));let index=0,touchX=0;
 function show(next){index=(next+thumbs.length)%thumbs.length;stage.classList.add('changing');window.setTimeout(()=>{const t=thumbs[index],newImg=t.querySelector('img');img.src=newImg.src;img.alt=names[index]+' من Coffee Dose';stage.style.setProperty('--active-photo','url(\"'+newImg.src+'\")');title.textContent=names[index];count.textContent=String(index+1).padStart(2,'0')+' / '+String(thumbs.length).padStart(2,'0');progress.style.width=((index+1)/thumbs.length*100)+'%';thumbs.forEach((b,i)=>{b.classList.toggle('is-active',i===index);b.setAttribute('aria-pressed',i===index?'true':'false')});t.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});stage.classList.remove('changing')},160)}
 thumbs.forEach((t,i)=>t.addEventListener('click',()=>show(i)));
 stage.querySelector('.tour-prev').addEventListener('click',()=>show(index-1));stage.querySelector('.tour-next').addEventListener('click',()=>show(index+1));
 stage.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1))},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&document.activeElement.closest('.tour-experience'))show(index+1);if(e.key==='ArrowRight'&&document.activeElement.closest('.tour-experience'))show(index-1)});
 show(0);
})();
