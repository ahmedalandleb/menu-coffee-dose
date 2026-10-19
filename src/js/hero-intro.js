/* Coffee Dose hero intro: mobile-only, resilient click handling. */
(() => {
  const mq = window.matchMedia('(max-width: 760px)');
  const init = () => {
    const hero = document.querySelector('.hero');
    const logo = hero?.querySelector('.hero-logo');
    if (!hero || !logo) return;

    let opened = false;
    const reveal = (event) => {
      if (!mq.matches || opened) return;
      opened = true;
      hero.classList.add('hero-revealed', 'dose-intro-open');
      document.documentElement.classList.remove('dose-intro-locked');
      document.body.classList.remove('dose-intro-locked');
      logo.style.pointerEvents = 'auto';
      if (event) { event.preventDefault(); event.stopPropagation(); }
    };

    const setup = () => {
      if (mq.matches) {
        hero.classList.add('mobile-dose-intro');
        if (!opened) {
          hero.classList.remove('hero-revealed', 'dose-intro-open');
          logo.style.pointerEvents = 'auto';
          logo.setAttribute('role', 'button');
          logo.setAttribute('tabindex', '0');
          logo.setAttribute('aria-label', 'اضغط لفتح الصفحة الرئيسية');
          document.documentElement.classList.add('dose-intro-locked');
          document.body.classList.add('dose-intro-locked');
        }
      } else {
        hero.classList.remove('mobile-dose-intro');
        hero.classList.add('hero-revealed');
        document.documentElement.classList.remove('dose-intro-locked');
        document.body.classList.remove('dose-intro-locked');
        logo.removeAttribute('role'); logo.removeAttribute('tabindex'); logo.removeAttribute('aria-label');
      }
    };
    logo.addEventListener('click', reveal, true);
    logo.addEventListener('pointerup', reveal, true);
    logo.addEventListener('touchend', reveal, {capture:true, passive:false});
    logo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') reveal(e); });
    // Any click on the actual logo image should open the intro too.
    logo.querySelector('img')?.addEventListener('click', reveal, true);
    mq.addEventListener?.('change', setup);
    setup();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
