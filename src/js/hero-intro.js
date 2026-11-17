/* Coffee Dose mobile intro: one click path, accessible and lightweight. */
(() => {
  const mq = window.matchMedia('(max-width: 760px)');

  function init() {
    const hero = document.querySelector('.hero');
    const logo = hero?.querySelector('.hero-logo');
    if (!hero || !logo) return;

    let hint = hero.querySelector('.mobile-intro-hint');
    if (!hint) {
      hint = document.createElement('button');
      hint.type = 'button';
      hint.className = 'mobile-intro-hint';
      hint.setAttribute('aria-label', 'اضغط هنا لاستكشاف عالمنا');
      hint.innerHTML = 'اضغط هنا لاستكشاف عالمنا <span aria-hidden="true">↓</span>';
      logo.insertAdjacentElement('afterend', hint);
    }

    let opened = hero.classList.contains('hero-revealed') || hero.dataset.introComplete === 'true';

    const reveal = (event) => {
      if (!mq.matches || opened) return;
      opened = true;
      hero.classList.add('hero-revealed', 'dose-intro-open');
      hero.dataset.introComplete = 'true';
      document.documentElement.classList.remove('dose-intro-locked');
      document.body.classList.remove('dose-intro-locked');
      hint.hidden = true;
      logo.setAttribute('aria-expanded', 'true');
      if (event) event.preventDefault();
    };

    const setup = () => {
      if (mq.matches) {
        hero.classList.add('mobile-dose-intro');
        if (!opened) {
          hero.classList.remove('hero-revealed', 'dose-intro-open');
          hint.hidden = false;
          logo.setAttribute('role', 'button');
          logo.setAttribute('tabindex', '0');
          logo.setAttribute('aria-label', 'اضغط لفتح الصفحة الرئيسية');
          logo.setAttribute('aria-expanded', 'false');
          document.documentElement.classList.add('dose-intro-locked');
          document.body.classList.add('dose-intro-locked');
        } else {
          hero.classList.add('hero-revealed', 'dose-intro-open');
          hint.hidden = true;
          document.documentElement.classList.remove('dose-intro-locked');
          document.body.classList.remove('dose-intro-locked');
        }
      } else {
        hero.classList.remove('mobile-dose-intro');
        hero.classList.add('hero-revealed');
        hint.hidden = true;
        document.documentElement.classList.remove('dose-intro-locked');
        document.body.classList.remove('dose-intro-locked');
        logo.removeAttribute('role');
        logo.removeAttribute('tabindex');
        logo.removeAttribute('aria-label');
        logo.removeAttribute('aria-expanded');
      }
    };

    // Native click covers touch, mouse and assistive technologies without duplicate events.
    logo.addEventListener('click', reveal);
    logo.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') reveal(event);
    });
    hint.addEventListener('click', reveal);
    mq.addEventListener?.('change', setup);
    setup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
