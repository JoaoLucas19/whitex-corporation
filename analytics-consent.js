/* WhiteX Analytics: GTM somente após consentimento explícito. */
(() => {
  'use strict';

  const STORAGE_KEY = 'whitex_analytics_consent_v1';
  const GTM_ID = 'GTM-K2P33XQZ';
  const banner = document.getElementById('cookie-banner');
  const panel = document.getElementById('cookie-preferences');
  const analyticsChoice = document.getElementById('cookie-analytics-choice');
  const status = document.getElementById('cookie-status');

  if (!banner || !panel || !analyticsChoice) return;

  let current = null;
  let tagManagerLoaded = false;
  let lastFocus = null;

  const readPreference = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch {
      return null;
    }
  };

  const writePreference = value => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Se o armazenamento for bloqueado, a preferência vale nesta página.
    }
  };

  const loadTagManager = () => {
    if (tagManagerLoaded) return;
    tagManagerLoaded = true;

    // O GTM não é carregado antes de haver autorização analítica.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(script);
  };

  const showBanner = () => {
    banner.hidden = false;
    panel.hidden = true;
  };

  const hideBanner = () => {
    banner.hidden = true;
    panel.hidden = true;
  };

  const setPreference = value => {
    const wasAccepted = current === 'accepted';
    current = value;
    writePreference(value);
    hideBanner();
    if (value === 'accepted') {
      loadTagManager();
    } else if (wasAccepted && tagManagerLoaded) {
      // Uma tag já executada não pode ser descarregada com segurança.
      // Recarregar interrompe novas coletas nesta sessão de página.
      window.location.reload();
    }
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    if (status) status.textContent = value === 'accepted'
      ? 'Cookies analíticos autorizados.'
      : 'Cookies analíticos desativados.';
  };

  const openPreferences = event => {
    lastFocus = event?.currentTarget || document.activeElement;
    banner.hidden = false;
    panel.hidden = false;
    analyticsChoice.checked = current === 'accepted';
    analyticsChoice.focus();
  };

  document.getElementById('cookie-accept')?.addEventListener('click', () => setPreference('accepted'));
  document.getElementById('cookie-reject')?.addEventListener('click', () => setPreference('rejected'));
  document.getElementById('cookie-manage')?.addEventListener('click', openPreferences);
  document.getElementById('cookie-open-settings')?.addEventListener('click', openPreferences);
  document.getElementById('cookie-save')?.addEventListener('click', () =>
    setPreference(analyticsChoice.checked ? 'accepted' : 'rejected')
  );
  document.getElementById('cookie-cancel')?.addEventListener('click', () => {
    if (current === null) {
      showBanner();
    } else {
      hideBanner();
    }
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  });

  current = readPreference();
  if (current === 'accepted') {
    hideBanner();
    loadTagManager();
  } else if (current === 'rejected') {
    hideBanner();
  } else {
    showBanner();
  }
})();
