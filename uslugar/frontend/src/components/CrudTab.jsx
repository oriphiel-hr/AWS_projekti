import { useEffect } from 'react';

export default function CrudTab({ active = false }) {
  useEffect(() => {
    if (!active) return;

    const ensureCrudApp = async () => {
      // ako skripta još nije učitana – injektiraj je dinamički
      if (!window.CrudApp) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = '/assets/js/crud.js';   // served from public/
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
