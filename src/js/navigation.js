/* One navigation controller for the whole site. The global navbar is the source of truth
   for visual section order, anchor positioning, and the active navigation item. */
(() => {
  const globalNav = document.querySelector('.site-nav-wrap');
  const nav = document.querySelector('.site-nav');
  const content = document.getElementById('site-content');
  const menuRoot = document.getElementById('menu-section');
  const menuNav = menuRoot?.querySelector(':scope > .nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!globalNav || !nav || !content) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];

  // Collect first, then append in one pass. Appending while discovering targets rotates
  // the nodes and was the source of the previous section-order mismatch.
  const primaryTargets = links.map(link => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    return target && target.parentElement === content ? { id, target, link } : null;
  }).filter(Boolean);
  primaryTargets.forEach(({ target }) => content.appendChild(target));

  const getTargetOffset = target => {
    let offset = globalNav.getBoundingClientRect().height + 8;
    if (target.closest('#sections')) {
      offset += menuNav?.getBoundingClientRect().height || 0;
    }
    return offset;
  };

  const setActive = id => {
    links.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const navigate = (target, { updateUrl = true, hashId = target?.id } = {}) => {
    if (!target) return;
    const y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getTargetOffset(target));
    if (updateUrl) {
      try { history.replaceState(null, '', `${location.pathname}${location.search}#${hashId || target.id}`); } catch (_) {}
    }
    target.classList.remove('navigation-arrival');
    void target.offsetWidth;
    target.classList.add('navigation-arrival');
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    let id = link.getAttribute('href').slice(1);
    // Old menu CTAs pointed at the internal category bar. Normalize them to the menu start.
    if (id === 'menu') id = 'menu-section';
    let target = document.getElementById(id);
    const hashId = id;
    // The tour link lands at the first photo, not at the explanatory heading above it.
    if (id === 'gallery') target = document.querySelector('.tour-stage') || target;
    if (!target) return;
    event.preventDefault();
    navigate(target, { hashId });
  });

  let scheduled = false;
  const updateCurrentSection = () => {
    scheduled = false;
    const line = globalNav.getBoundingClientRect().height + 26;
    let current = null;
    for (const item of primaryTargets) {
      if (item.target.getBoundingClientRect().top <= line) current = item.id;
    }
    if (current) setActive(current);
    else links.forEach(link => link.removeAttribute('aria-current'));
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('load', scheduleUpdate, { once: true });
  updateCurrentSection();
})();
