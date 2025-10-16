// CrudTab.jsx
  useEffect(() => {
    if (!active) return;

    const ensureCrudApp = async () => {
      // ako skripta još nije učitana – injektiraj je dinamički
      if (!window.CrudApp) {
       // >>> GLOBALNA KONFIGURACIJA ZA public/assets/js/crud.js <<<
       // npr. VITE_API_URL= https://uslugar.api.oriph.io
       window.API_ORIGIN = (import.meta.env?.VITE_API_URL || '').replace(/\/+$/, '');
       window.API_PREFIX = '/api/admin'; // ADMIN API!

        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
         // dodaj ?v=2 da izbjegnemo cache stare skripte
         s.src = '/assets/js/crud.js?v=2';   // served from public/
          s.async = true;
          s.onload = resolve;
          s.onerror = () => reject(new Error('Ne mogu učitati /assets/js/crud.js'));
          document.body.appendChild(s);
        });
      }
      // lazy init
      if (window.CrudApp && !window.CrudApp.inited) {
        window.CrudApp.init();
      }
    };
