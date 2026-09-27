(() => {
  const header = document.querySelector('#site-header');
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  if (!header || !button || !nav) return;
  const mobile = matchMedia('(max-width: 1000px)');
  const label = button.querySelector('.menu-label');
  let open = false;
  function setOpen(value, returnFocus = false) {
    open = mobile.matches && value;
    header.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    label.textContent = open ? 'Close' : 'Menu';
    nav.inert = mobile.matches && !open;
    if (mobile.matches && !open) nav.setAttribute('aria-hidden', 'true');
    else nav.removeAttribute('aria-hidden');
    if (returnFocus) button.focus();
  }
  button.addEventListener('click', () => setOpen(!open));
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    setOpen(false);
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.slice(1));
      if (section) {
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
        section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
      }
    } else button.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) setOpen(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (open && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (open && !header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
  header.classList.add('menu-ready');
  setOpen(false);
})();
