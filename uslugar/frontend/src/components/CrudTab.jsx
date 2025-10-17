import { useEffect } from 'react';

export default function CrudTab({ active = false }) {
  useEffect(() => {
    if (!active) return;

    const ensureCrudApp = async () => {
      // ako skripta još nije učitana – injektiraj je dinamički
      if (!window.CrudApp) {
        // >>> GLOBALNA KONFIGURACIJA ZA public/assets/js/crud.js <<<
        // npr. VITE_API_URL= https://uslugar.api.oriph.io
        // Dodaj /api prefix jer crud.js očekuje full URL
        const baseUrl = (import.meta.env?.VITE_API_URL || '').replace(/\/+$/, '');
        window.API_ORIGIN = baseUrl ? `${baseUrl}/api` : '';
        window.API_PREFIX = '/admin'; // ADMIN API (bez /api jer je već u API_ORIGIN)

        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          // dodaj ?v=3 da izbjegnemo cache stare skripte
          s.src = '/assets/js/crud.js?v=3';   // served from public/
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

    ensureCrudApp().catch(err => console.error(err));
  }, [active]);

  return (
    <section
      id="crud"
      className="tab-section"
      style={{ display: active ? 'block' : 'none' }}
    >
      <div id="crud-app" />
    </section>
  );
}
