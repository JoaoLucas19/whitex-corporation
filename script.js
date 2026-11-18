(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');

  if (menuButton && navigation) {
    const closeMenu = ({ restoreFocus = false } = {}) => {
      if (!navigation.classList.contains('open')) return;
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    navigation.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => closeMenu())
    );

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu({ restoreFocus: true });
    });

    document.addEventListener('pointerdown', event => {
      if (!menuButton.contains(event.target) && !navigation.contains(event.target)) {
        closeMenu();
      }
    });

    // Evita estado ARIA inconsistente após mudar de mobile para desktop.
    const mobileBreakpoint = window.matchMedia('(max-width: 700px)');
    const resetOnDesktop = event => {
      if (!event.matches) closeMenu();
    };
    if (mobileBreakpoint.addEventListener) {
      mobileBreakpoint.addEventListener('change', resetOnDesktop);
    } else {
      mobileBreakpoint.addListener(resetOnDesktop);
    }
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
