import React, { useEffect, useState } from 'react';

const Contact = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  console.log('Contact component rendering...');

  useEffect(() => {
    let isMounted = true;
    
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script is already loading, wait for it
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          if (isMounted) {
            initializeMap();
          }
        }
      }, 100);
      
      return () => {
        isMounted = false;
        clearInterval(checkGoogle);
      };
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgxE4p4d4k&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Google Maps failed to load');
      if (isMounted) {
        setMapLoaded(true);
      }
    };
    
    window.initMap = () => {
      if (isMounted) {
        initializeMap();
      }
    };
    
    document.head.appendChild(script);

    function initializeMap() {
      try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          console.error('Map element not found');
          setMapLoaded(true);
          return;
        }

        const map = new window.google.maps.Map(mapElement, {
          zoom: 15,
          center: { lat: 45.8150, lng: 15.9819 },
          mapTypeId: 'roadmap'
        });

        const marker = new window.google.maps.Marker({
          position: { lat: 45.8150, lng: 15.9819 },
          map: map,
          title: 'Uslugar - Slavenskoga ulica 5, Zagreb'
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">🏢 Uslugar</h3>
              <p style="margin: 0; color: #374151;">
                Slavenskoga ulica 5<br>
                10000 Zagreb<br>
                Hrvatska
              </p>
              <p style="margin: 5px 0 0 0; color: #374151;">
                📞 <a href="tel:+385915618258" style="color: #3b82f6;">091 561 8258</a>
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapLoaded(true);
      }
    }

    return () => {
      isMounted = false;
      // Clean up Google Maps callback
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          📞 Kontakt
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Kontaktirajte nas za sve informacije o Uslugar platformi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📍 Kontakt podaci
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Adresa
                  </h3>
                  <p className="text-gray-700">
                    Slavenskoga ulica 5<br />
                    10000 Zagreb<br />
                    Hrvatska
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Telefon
                  </h3>
                  <p className="text-gray-700">
                    <a 
                      href="tel:+385915618258" 
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      091 561 8258
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-2xl">👤</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Kontakt osoba
                  </h3>
                  <p className="text-gray-700">
                    Tomislav Kranjec
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-2xl">🏢</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Pretežita djelatnost
                  </h3>
                  <p className="text-gray-700">
                    <strong>NKD kod:</strong> 62109<br />
                    <strong>Opis:</strong> Ostalo računalno programiranje<br />
                    <span className="text-sm text-gray-600">
                      (K - TELEKOMUNIKACIJE, RAČUNALNO PROGRAMIRANJE, SAVJETOVANJE, 
                      RAČUNALNA INFRASTRUKTURA I OSTALE INFORMACIJSKE USLUŽNE DJELATNOSTI)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💬 Pošaljite nam poruku
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ime i prezime
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vaše ime i prezime"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="vas@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="091 123 4567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Predmet
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Odaberite predmet</option>
                  <option value="general">Općenito pitanje</option>
                  <option value="technical">Tehnička podrška</option>
                  <option value="business">Poslovni upit</option>
                  <option value="partnership">Partnerstvo</option>
                  <option value="complaint">Žalba</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Poruka
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Opišite svoje pitanje ili zahtjev..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                📤 Pošalji poruku
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🗺️ Lokacija
          </h2>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Adresa:</strong> Slavenskoga ulica 5, 10000 Zagreb, Hrvatska
            </p>
            <p className="text-gray-700">
              <strong>Telefon:</strong> <a href="tel:+385915618258" className="text-blue-600 hover:underline">091 561 8258</a>
            </p>
          </div>

          <div className="relative">
            <div 
              id="map" 
              className="w-full h-96 rounded-lg border border-gray-300"
              style={{ minHeight: '400px' }}
            >
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Učitavanje karte...</p>
                  </div>
                </div>
              )}
              {mapLoaded && !window.google && (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-4">🗺️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Karta nije dostupna</h3>
                    <p className="text-gray-600 mb-4">
                      Google Maps trenutno nije dostupan.
                    </p>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-700">
                        <strong>📍 Adresa:</strong><br />
                        Slavenskoga ulica 5<br />
                        10000 Zagreb, Hrvatska
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>📞 Telefon:</strong> 
                        <a href="tel:+385915618258" className="text-blue-600 hover:underline ml-1">
                          091 561 8258
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              💡 <strong>Savjet:</strong> Kliknite na marker na karti za dodatne informacije.
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🕒 Radno vrijeme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📞 Telefonska podrška</h3>
            <p className="text-gray-700">
              Ponedjeljak - Petak: 09:00 - 17:00<br />
              Subota: 10:00 - 14:00<br />
              Nedjelja: Zatvoreno
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Online podrška</h3>
            <p className="text-gray-700">
              24/7 dostupna<br />
              Odgovor u roku od 24h<br />
              Email: support@uslugar.hr
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 Ured</h3>
            <p className="text-gray-700">
              Ponedjeljak - Petak: 08:00 - 16:00<br />
              Subota - Nedjelja: Zatvoreno<br />
              <em>Termin po dogovoru</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
