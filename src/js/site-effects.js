(()=>{
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Give the gallery a soft, blurred ambient version of the active vertical image.
  const stage = document.querySelector('.tour-stage');
  const mainImage = document.getElementById('tourMainImage');
  if (stage && mainImage && mainImage.src) stage.style.setProperty('--active-photo', 'url("' + mainImage.src + '")');

  // Controlled reveal of sections/cards. Does not hide content when motion is reduced.
  const revealItems = document.querySelectorAll('.story-section,.services-section,.offers-section,#reviews,.gallery-section,.visit-section,.booking-section,.service-card,.offer-card,.review-card,.visit-card,.category-heading');
  if (!reduced && 'IntersectionObserver' in window) {
    revealItems.forEach(el => el.classList.add('reveal-on-scroll'));
    const revealObs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObs.unobserve(entry.target); }
    }), {threshold:.08,rootMargin:'0px 0px -5% 0px'});
    revealItems.forEach(el => revealObs.observe(el));
  }

  // Gentle 3D parallax on the poster and category imagery; disabled on touch/reduced motion.
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.story-poster-frame').forEach(frame => {
      frame.addEventListener('pointermove', event => {
        const box = frame.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        frame.style.transform = `rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 4.5).toFixed(2)}deg)`;
      });
      frame.addEventListener('pointerleave', () => { frame.style.transform = ''; });
    });
  }
})();

(() => {
  const hero = document.querySelector('.hero');
  const bg = document.querySelector('.hero-bg');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && bg && !reduce && finePointer) {
    hero.addEventListener('pointermove', (event) => {
      const r = hero.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      bg.style.setProperty('--pointer-x', `${(x * -10).toFixed(2)}px`);
      bg.style.setProperty('--pointer-y', `${(y * -8).toFixed(2)}px`);
      bg.style.transform = `scale(1.08) translate3d(${(x * -10).toFixed(2)}px,${(y * -8).toFixed(2)}px,0)`;
    });
    hero.addEventListener('pointerleave', () => { bg.style.transform = ''; });
  }
  // Keep anchor navigation feeling deliberate even when the user returns from a modal.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.classList.add('navigation-arrival');
    });
  });
})();


// Global top-of-page progress indicator; requestAnimationFrame keeps scroll handling light.
(() => {
  const bar=document.getElementById('pageProgressBar');
  let scheduled=false;
  const update=()=>{
    if(!bar){scheduled=false;return;}
    const scrollable=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=scrollable>0?Math.min(1,Math.max(0,window.scrollY/scrollable)):0;
    bar.style.width=`${ratio*100}%`;
    scheduled=false;
  };
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
  window.addEventListener('resize',update,{passive:true});
  update();
})();
