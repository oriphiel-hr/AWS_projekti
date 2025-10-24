import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ProviderProfile({ onSuccess }) {
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  // Mapiranje kategorija na specifične ikone
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      // Gradnja i renoviranje
      'Gradnja': '🏗️',
      'Renoviranje': '🔨',
      'Keramika': '🧱',
      'Parket': '🪵',
      'Krov': '🏠',
      'Fasada': '🎨',
      'Vodovod': '🚰',
      'Elektrika': '⚡',
      'Grijanje': '🔥',
      'Klima': '❄️',
      'Izolacija': '🧊',
      'Stolarija': '🪟',
      'Vrata': '🚪',
      'Prozori': '🪟',
      'Balkon': '🏡',
      'Terasa': '🌿',
      'Bazen': '🏊',
      'Vrt': '🌱',
      'Ogradni zid': '🧱',
      'Asfalt': '🛣️',
      
      // IT i tehnologija
      'IT usluge': '💻',
      'Web dizajn': '🌐',
      'Programiranje': '👨‍💻',
      'Mreže': '🌐',
      'Sigurnost': '🔒',
      'Cloud': '☁️',
      'Mobilne aplikacije': '📱',
      'E-commerce': '🛒',
      'SEO': '🔍',
      'Digitalni marketing': '📈',
      
      // Obrazovanje
      'Obrazovanje': '📚',
      'Jezici': '🗣️',
      'Muzika': '🎵',
      'Sport': '⚽',
      'Ples': '💃',
      'Slikanje': '🎨',
      'Fotografija': '📸',
      'Kuhanje': '👨‍🍳',
      
      // Zdravlje i ljepota
      'Zdravlje': '🏥',
      'Fizioterapija': '💪',
      'Masage': '💆',
      'Kozmetika': '💄',
      'Nokti': '💅',
      'Kosa': '💇',
      'Tatuaže': '🎨',
      'Fitness': '💪',
      'Joga': '🧘',
      
      // Usluge
      'Čišćenje': '🧽',
      'Pranje': '👕',
      'Kuhanje': '👨‍🍳',
      'Dostava': '🚚',
      'Prevoz': '🚗',
      'Taxi': '🚕',
      'Dostava hrane': '🍕',
      'Dostava paketa': '📦',
      'Selidba': '📦',
      'Skladištenje': '🏪',
      
      // Automobili
      'Automobili': '🚗',
      'Servis': '🔧',
      'Dijagnostika': '🔍',
      'Gume': '🛞',
      'Akumulator': '🔋',
      'Auto perionica': '🚿',
      'Auto škola': '🚗',
      'Prevoz': '🚐',
      
      // Ostalo
      'Pravne usluge': '⚖️',
      'Računovodstvo': '📊',
      'Marketing': '📢',
      'Dizajn': '🎨',
      'Fotografija': '📸',
      'Video': '🎬',
      'Organizacija događaja': '🎉',
      'Konzultacije': '💼',
      'Prijenos': '📡',
      'Sigurnost': '🛡️',
      
      // Dodatne specifične kategorije
      'Instalacije': '🔧',
      'Popravci': '🔨',
      'Montaža': '⚙️',
      'Dostava': '🚚',
      'Prevoz': '🚗',
      'Taxi': '🚕',
      'Dostava hrane': '🍕',
      'Dostava paketa': '📦',
      'Selidba': '📦',
      'Skladištenje': '🏪',
      'Čišćenje': '🧽',
      'Pranje': '👕',
      'Kuhanje': '👨‍🍳',
      'Automobili': '🚗',
      'Servis': '🔧',
      'Dijagnostika': '🔍',
      'Gume': '🛞',
      'Akumulator': '🔋',
      'Auto perionica': '🚿',
      'Auto škola': '🚗',
      'Prevoz': '🚐',
      'IT usluge': '💻',
      'Web dizajn': '🌐',
      'Programiranje': '👨‍💻',
      'Mreže': '🌐',
      'Sigurnost': '🔒',
      'Cloud': '☁️',
      'Mobilne aplikacije': '📱',
      'E-commerce': '🛒',
      'SEO': '🔍',
      'Digitalni marketing': '📈',
      'Obrazovanje': '📚',
      'Jezici': '🗣️',
      'Muzika': '🎵',
      'Sport': '⚽',
      'Ples': '💃',
      'Slikanje': '🎨',
      'Fotografija': '📸',
      'Kuhanje': '👨‍🍳',
      'Zdravlje': '🏥',
      'Fizioterapija': '💪',
      'Masage': '💆',
      'Kozmetika': '💄',
      'Nokti': '💅',
      'Kosa': '💇',
      'Tatuaže': '🎨',
      'Fitness': '💪',
      'Joga': '🧘',
      
      // Dodatne kategorije koje se često koriste
      'Instalacije': '🔧',
      'Popravci': '🔨',
      'Montaža': '⚙️',
      'Dostava': '🚚',
      'Prevoz': '🚗',
      'Taxi': '🚕',
      'Dostava hrane': '🍕',
      'Dostava paketa': '📦',
      'Selidba': '📦',
      'Skladištenje': '🏪',
      'Čišćenje': '🧽',
      'Pranje': '👕',
      'Kuhanje': '👨‍🍳',
      'Automobili': '🚗',
      'Servis': '🔧',
      'Dijagnostika': '🔍',
      'Gume': '🛞',
      'Akumulator': '🔋',
      'Auto perionica': '🚿',
      'Auto škola': '🚗',
      'Prevoz': '🚐',
      'IT usluge': '💻',
      'Web dizajn': '🌐',
      'Programiranje': '👨‍💻',
      'Mreže': '🌐',
      'Sigurnost': '🔒',
      'Cloud': '☁️',
      'Mobilne aplikacije': '📱',
      'E-commerce': '🛒',
      'SEO': '🔍',
      'Digitalni marketing': '📈',
      'Obrazovanje': '📚',
      'Jezici': '🗣️',
      'Muzika': '🎵',
      'Sport': '⚽',
      'Ples': '💃',
      'Slikanje': '🎨',
      'Fotografija': '📸',
      'Kuhanje': '👨‍🍳',
      'Zdravlje': '🏥',
      'Fizioterapija': '💪',
      'Masage': '💆',
      'Kozmetika': '💄',
      'Nokti': '💅',
      'Kosa': '💇',
      'Tatuaže': '🎨',
      'Fitness': '💪',
      'Joga': '🧘',
      
      // Još dodatnih kategorija
      'Financije': '💰',
      'Osiguranje': '🛡️',
      'Nekretnine': '🏠',
      'Prodaja': '🛒',
      'Kupnja': '🛍️',
      'Najam': '🏠',
      'Turizam': '✈️',
      'Putovanja': '🧳',
      'Hoteli': '🏨',
      'Restorani': '🍽️',
      'Kafići': '☕',
      'Bars': '🍻',
      'Zabava': '🎭',
      'Kazalište': '🎭',
      'Kino': '🎬',
      'Koncerti': '🎵',
      'Festivali': '🎪',
      'Sport': '⚽',
      'Fitness': '💪',
      'Teretana': '🏋️',
      'Bazen': '🏊',
      'Tenis': '🎾',
      'Fudbal': '⚽',
      'Košarka': '🏀',
      'Rukomet': '🤾',
      'Vaterpolo': '🤽',
      'Plivanje': '🏊',
      'Trčanje': '🏃',
      'Biciklizam': '🚴',
      'Planinarenje': '🥾',
      'Skijanje': '🎿',
      'Surfing': '🏄',
      'Ribolov': '🎣',
      'Lov': '🏹',
      'Kampiranje': '⛺',
      'Alpinizam': '🧗',
      'Paragliding': '🪂',
      'Padobranstvo': '🪂',
      'Avijacija': '✈️',
      'Helikopter': '🚁',
      'Brod': '⛵',
      'Jahta': '⛵',
      'Motocikl': '🏍️',
      'Skuter': '🛵',
      'Bicikl': '🚲',
      'Električni bicikl': '🚲',
      'Skateboard': '🛹',
      'Rolice': '🛼',
      'Sanke': '🛷',
      'Ski': '🎿',
      'Snowboard': '🏂',
      'Kajak': '🛶',
      'Kanua': '🛶',
      'Rafting': '🛶',
      'Diving': '🤿',
      'Snorkeling': '🤿',
      'Speleologija': '🕳️',
      'Geocaching': '🗺️',
      'Astronomija': '🔭',
      'Fotografija': '📸',
      'Video': '🎬',
      'Dron': '🚁',
      '3D print': '🖨️',
      'Laserski graviranje': '⚡',
      'CNC obrada': '⚙️',
      'Struganje': '🔧',
      'Brušenje': '🔧',
      'Varjenje': '🔥',
      'Limanje': '🔧',
      'Bojanje': '🎨',
      'Tapetiranje': '🎨',
      'Keramika': '🧱',
      'Staklo': '🪟',
      'Metal': '⚙️',
      'Drvo': '🪵',
      'Plastika': '🧱',
      'Tekstil': '🧵',
      'Koža': '👜',
      'Papir': '📄',
      'Karton': '📦',
      'Guma': '🛞',
      'Silikon': '🧱',
      'Epoksid': '🧱',
      'Akril': '🎨',
      'Ulje': '🖼️',
      'Tempera': '🎨',
      'Akvarel': '🎨',
      'Pastel': '🎨',
      'Ugljen': '🖤',
      'Kreda': '🖍️',
      'Marker': '🖊️',
      'Olovka': '✏️',
      'Kemijska olovka': '✏️',
      'Kist': '🖌️',
      'Špachtla': '🔧',
      'Valjak': '🔧',
      'Šmirgl': '🔧',
      'Brusilica': '🔧',
      'Bušilica': '🔧',
      'Odvijač': '🔧',
      'Ključ': '🔧',
      'Čekić': '🔨',
      'Kliješta': '🔧',
      'Pila': '🔧',
      'Motorna pila': '🔧',
      'Kompresor': '🔧',
      'Generator': '⚡',
      'Inverter': '⚡',
      'UPS': '⚡',
      'Baterija': '🔋',
      'Solarni panel': '☀️',
      'Vjetroelektrana': '💨',
      'Geotermalna': '🌋',
      'Hidroelektrana': '💧',
      'Nuklearna': '☢️',
      'Ugljen': '⚫',
      'Nafta': '🛢️',
      'Plin': '🔥',
      'Biomasa': '🌱',
      'Biogas': '💨',
      'Vodik': '💨',
      'Etanol': '🍷',
      'Biodizel': '🛢️',
      'Električna energija': '⚡',
      'Toplinska energija': '🔥',
      'Mehanička energija': '⚙️',
      'Kemijska energija': '🧪',
      'Nuklearna energija': '☢️',
      'Gravitacijska energija': '🌍',
      'Elastična energija': '🔗',
      'Magnetna energija': '🧲',
      'Elektromagnetna energija': '📡',
      'Svjetlosna energija': '💡',
      'Zvučna energija': '🔊',
      'Tlačna energija': '💨',
      'Kinetička energija': '🏃',
      'Potencijalna energija': '⛰️',
      'Termalna energija': '🌡️',
      'Radiantna energija': '☀️',
      'Kemijska energija': '🧪',
      'Nuklearna energija': '☢️',
      'Gravitacijska energija': '🌍',
      'Elastična energija': '🔗',
      'Magnetna energija': '🧲',
      'Elektromagnetna energija': '📡',
      'Svjetlosna energija': '💡',
      'Zvučna energija': '🔊',
      'Tlačna energija': '💨',
      'Kinetička energija': '🏃',
      'Potencijalna energija': '⛰️',
      'Termalna energija': '🌡️',
      'Radiantna energija': '☀️',
      
      // Kategorije iz baze podataka
      'Autoelektričar': '🔧',
      'Autolimarija i farbanje': '🎨',
      'Automehaničar': '🔧',
      'Bazenski radovi': '🏊',
      'Bravarski radovi': '🔨',
      'Čišćenje fasada': '🧽',
      'Dezinsekcija i deratizacija': '🐛',
      'Dimnjačar': '🏠',
      'Dizalice i platforme': '🏗️',
      'Električar': '⚡',
      'Električne instalacije': '🔌',
      'Električni paneli': '⚡',
      'LED rasvjeta': '💡',
      'Event usluge': '🎉',
      'Fasader': '🎨',
      'Fotografski servisi': '📸',
      'Frizerske usluge': '💇',
      'Gips-karton': '🧱',
      'Kamenarske usluge': '🗿',
      'Keramičar': '🧱',
      'Fugiranje': '🔧',
      'Kamene ploče': '🗿',
      'Mosaik i dekorativne pločice': '🎨',
      'Klima uređaji': '❄️',
      'Centralna klima': '❄️',
      'Mobilni klima uređaji': '❄️',
      'Servis klima uređaja': '🔧',
      'Kozmetičke usluge': '💄',
      'Krovopokrivač': '🏠',
      'Limarski radovi': '🔧',
      'Masažne usluge': '💆',
      'Moler-Slikar': '🎨',
      'Bojanje zidova': '🎨',
      'Dekorativne tehnike': '🎨',
      'Gletovanje': '🔧',
      'Ograđivanje': '🧱',
      'Parketar': '🪚',
      'Plinoinstalatér': '🔥',
      'Podne obloge': '🪚',
      'Popravak kućanskih aparata': '🔧',
      'Prevodilački servisi': '🗣️',
      'Računalni servisi': '💻',
      'Računovodstvene usluge': '📊',
      'Selidbe': '📦',
      'Šetanje pasa': '🐕',
      'Sigurnosni sustavi': '🔒',
      'Soboslikarski radovi': '🎨',
      'Staklarski radovi': '🪟',
      'Stolar': '🪚',
      'Izrada namještaja': '🪑',
      'Parket i laminat': '🪵',
      'Ugradnja kuhinja': '🍳',
      'Terase i pergole': '🌿',
      'Transport robe': '🚚',
      'Tutorstvo': '📚',
      'Ugradnja rolled': '🪟',
      'Ventilacija': '💨',
      'Veterinarske usluge': '🐕',
      'Video produkcija': '🎬',
      'Vodoinstalater': '🚰',
      'Grijanje vode': '🔥',
      'Kanalizacija': '🚽',
      'Popravak sanitarija': '🚽',
      'Vrtlar': '🌱',
      'Vulkanizer': '🛞',
      'Zidar': '🧱'
    };
    
    // Debug: logiraj kategorije koje nemaju ikonu
    if (!iconMap[categoryName]) {
      console.log('🔍 Kategorija bez ikone:', categoryName);
    }
    
    return iconMap[categoryName] || '🛠️';
  };
  
  const [formData, setFormData] = useState({
    bio: '',
    specialties: '',
    experience: '',
    website: '',
    serviceArea: '',
    isAvailable: true,
    categoryIds: []
  });

  useEffect(() => {
    loadProfile();
    loadCategories();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Provjeri da li postoji token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Morate biti prijavljeni da biste pristupili ovom profilu.');
        setLoading(false);
        return;
      }
      
      // Pokušaj učitati profil preko /me endpoint-a
      let response;
      try {
        response = await api.get('/providers/me');
      } catch (meError) {
        // Ako /me ne radi, pokušaj preko /fix-profile endpoint-a
        console.log('🔄 /me endpoint ne radi, pokušavam preko /fix-profile...');
        console.log('Token za test:', token);
        console.log('Token duljina:', token?.length);
        
        // Testiraj token direktno
        try {
          const testResponse = await fetch('https://uslugar.api.oriph.io/api/providers/fix-profile', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          });
          console.log('Direct test status:', testResponse.status);
          const testData = await testResponse.text();
          console.log('Direct test response:', testData);
          
          if (testResponse.status === 200) {
            const profileData = JSON.parse(testData);
            console.log('✅ Profil učitavan direktno:', profileData);
            response = { data: profileData };
          } else {
            throw new Error(`Direct test failed: ${testResponse.status}`);
          }
        } catch (directError) {
          console.error('Direct test error:', directError);
          // Fallback na api.post
          response = await api.post('/providers/fix-profile');
        }
      }
      
      const profileData = response.data;
      
      // Ako je odgovor iz /fix-profile endpoint-a, ekstraktiraj profil
      const actualProfile = profileData.profile || profileData;
      
      console.log('📊 Actual profile data:', JSON.stringify(actualProfile, null, 2));
      
      setProfile(actualProfile);
      
      const formDataToSet = {
        bio: actualProfile.bio || '',
        specialties: actualProfile.specialties ? actualProfile.specialties.join(', ') : '',
        experience: actualProfile.experience || '',
        website: actualProfile.website || '',
        serviceArea: actualProfile.serviceArea || '',
        isAvailable: actualProfile.isAvailable !== false,
        categoryIds: actualProfile.categories ? actualProfile.categories.map(c => c.id) : []
      };
      
      console.log('📝 Form data set:', JSON.stringify(formDataToSet, null, 2));
      
      setFormData(formDataToSet);
      
      // Debug: Provjeri da li se state ažurira
      setTimeout(() => {
        console.log('🔍 Form data after setState:', formData);
      }, 100);
      
      // Poruka dobrodošlice
      const userName = actualProfile.user?.fullName || actualProfile.user?.name || 'Provider';
      setWelcomeMessage(`Dobrodošli, ${userName}! 🎉`);
    } catch (err) {
      console.error('Error loading profile:', err);
      if (err.response?.status === 401) {
        setError('Vaš login je istekao. Molimo prijavite se ponovno.');
      } else if (err.response?.status === 404) {
        setError('Provider profil nije pronađen. Backend možda nije ažuriran. Molimo kontaktirajte podršku.');
      } else {
        setError(`Greška pri učitavanju profila (${err.response?.status || 'unknown'}): ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validacija kategorija
      if (formData.categoryIds.length === 0) {
        setError('Morate odabrati minimalno 1 kategoriju usluga kojima se bavite.');
        setSaving(false);
        return;
      }

      const updateData = {
        bio: formData.bio,
        specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
        experience: formData.experience ? parseInt(formData.experience) : null,
        website: formData.website,
        serviceArea: formData.serviceArea,
        isAvailable: formData.isAvailable,
        categoryIds: formData.categoryIds
      };

      await api.put('/providers/me', updateData);
      
      setSuccess('Profil je uspješno ažuriran!');
      setEditMode(false);
      loadProfile(); // Refresh profile data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = err.response?.data?.error || 'Greška pri ažuriranju profila';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-yellow-500 text-4xl mb-4">🔧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider profil nije kreiran</h3>
          <p className="text-gray-600 mb-6">
            Vaš Provider profil još nije kreiran. Možete ga kreirati klikom na gumb ispod.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 mb-2">Greška:</h4>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Što možete učiniti:</h4>
            <ul className="text-left text-blue-800 space-y-1">
              <li>• Kliknite "Kreiraj Provider profil" da kreirate profil</li>
              <li>• Osvježite stranicu nakon kreiranja</li>
              <li>• Odjavite se i ponovno prijavite ako se problem nastavi</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  setSuccess('');
                  
                  console.log('🔄 Pokušavam kreirati ProviderProfile...');
                  
                  const token = localStorage.getItem('token');
                  const user = localStorage.getItem('user');
                  
                  console.log('Token postoji:', !!token);
                  console.log('Token duljina:', token?.length);
                  console.log('User podaci:', user);
                  
                  // Dekodiraj JWT token
                  if (token) {
                    try {
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      console.log('Token payload:', payload);
                      console.log('Token expires:', new Date(payload.exp * 1000));
                      console.log('Current time:', new Date());
                      console.log('Token expired:', new Date() > new Date(payload.exp * 1000));
                    } catch (e) {
                      console.error('Invalid token format:', e);
                    }
                  }
                  
                  const response = await api.post('/providers/fix-profile');
                  console.log('✅ ProviderProfile kreiran:', response.data);
                  setSuccess('Provider profil je uspješno kreiran! Osvježite stranicu.');
                  
                  // Automatski osvježi nakon 2 sekunde
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                  
                } catch (err) {
                  console.error('Error creating profile:', err);
                  console.error('Error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                  });
                  
                  if (err.response?.status === 401) {
                    setError('Vaš login je istekao ili JWT token nije valjan. Molimo prijavite se ponovno.');
                    
                  // Testiraj backend endpoint direktno
                  console.log('🔄 Testiram backend endpoint direktno...');
                  try {
                    // Test 1: Bez autentifikacije
                    const test1 = await fetch('https://uslugar.api.oriph.io/api/providers/fix-profile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' }
                    });
                    console.log('Test 1 (bez auth) status:', test1.status);
                    const test1Data = await test1.text();
                    console.log('Test 1 response:', test1Data);
                    
                    // Test 2: S valjanim tokenom
                    const test2 = await fetch('https://uslugar.api.oriph.io/api/providers/fix-profile', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                      }
                    });
                    console.log('Test 2 (s auth) status:', test2.status);
                    const test2Data = await test2.text();
                    console.log('Test 2 response:', test2Data);
                    
                    // Test 3: Provjeri da li endpoint postoji
                    const test3 = await fetch('https://uslugar.api.oriph.io/api/providers/me', {
                      method: 'GET',
                      headers: { 
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                      }
                    });
                    console.log('Test 3 (/me) status:', test3.status);
                    const test3Data = await test3.text();
                    console.log('Test 3 response:', test3Data);
                    
                  } catch (testErr) {
                    console.error('Test error:', testErr);
                  }
                    
                  } else if (err.response?.status === 404) {
                    setError('Backend endpoint nije pronađen. Backend možda nije ažuriran.');
                  } else {
                    setError(`Greška pri kreiranju profila (${err.response?.status || 'unknown'}): ${err.response?.data?.error || err.message}`);
                  }
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? '⏳ Kreiranje...' : '🔧 Kreiraj Provider profil'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Osvježi stranicu
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '#login';
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🚪 Odjavi se i prijavi ponovno
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log formData prije render-a
  console.log('🎨 Rendering with formData:', formData);
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Moj profil</h2>
            <p className="text-gray-600 mt-2">Upravljajte svojim profilom i kategorijama usluga</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              editMode 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editMode ? 'Odustani' : 'Uredi profil'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {welcomeMessage && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-700 font-medium">{welcomeMessage}</p>
          <p className="text-xs text-blue-600 mt-1">Ovdje možete upravljati svojim profilom i kategorijama usluga.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Osnovni podaci */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Osnovni podaci</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ime i prezime
            </label>
            <input
              type="text"
              value={profile.user?.fullName || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Ime se ne može mijenjati</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email se ne može mijenjati</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O meni / Biografija
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!editMode}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                editMode ? 'border-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
              }`}
              placeholder="Opišite svoje iskustvo i usluge koje nudite..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specijalizacije
            </label>
            <input
              type="text"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                editMode ? 'border-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
              }`}
              placeholder="Popravak cijevi, Instalacija bojlera, Održavanje"
            />
            <p className="text-xs text-gray-500 mt-1">Odvojeno zarezom</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Godine iskustva
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={!editMode}
                min={0}
                max={50}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  editMode ? 'border-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
                }`}
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  editMode ? 'border-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
                }`}
                placeholder="https://vasa-web.hr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Područje rada
            </label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                editMode ? 'border-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'
              }`}
              placeholder="Zagreb i okolica"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              disabled={!editMode}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                !editMode ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <label className="ml-2 block text-sm text-gray-700">
              Dostupan za nove poslove
            </label>
          </div>
        </div>

        {/* Kategorije usluga */}
        <div className="space-y-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            Kategorije usluga (obavezno)
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Odaberite kategorije</strong> usluga kojima se bavite. Klijenti će vas moći pronaći prema ovim kategorijama.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories
                .filter(category => !category.parentId) // Samo glavne kategorije
                .map(category => {
                  const subcategories = categories.filter(cat => cat.parentId === category.id);
                  return (
                    <div key={category.id} className={`border rounded-lg p-3 transition-all duration-200 ${
                      formData.categoryIds.includes(category.id) 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <label className={`flex items-start space-x-3 ${editMode ? 'cursor-pointer' : 'cursor-default'}`}>
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          disabled={!editMode}
                          className={`mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 rounded transition-all duration-200 ${
                            formData.categoryIds.includes(category.id)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          } ${
                            !editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {(() => {
                                const icon = category.icon || getCategoryIcon(category.name);
                                console.log(`🎨 Kategorija: ${category.name}, Baza ikona: ${category.icon}, Finalna ikona: ${icon}`);
                                return icon;
                              })()}
                            </span>
                            <span className={`font-medium transition-colors duration-200 ${
                              formData.categoryIds.includes(category.id)
                                ? 'text-blue-800 font-semibold'
                                : 'text-gray-900'
                            }`}>
                              {category.name}
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                          )}
                          {subcategories.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Podkategorije:</p>
                              <div className="space-y-1">
                                {subcategories.slice(0, 3).map(subcategory => (
                                  <label key={subcategory.id} className={`flex items-center space-x-2 ${editMode ? 'cursor-pointer' : 'cursor-default'}`}>
                                    <input
                                      type="checkbox"
                                      checked={formData.categoryIds.includes(subcategory.id)}
                                      onChange={() => handleCategoryChange(subcategory.id)}
                                      disabled={!editMode}
                                      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-2 rounded transition-all duration-200 ${
                                        formData.categoryIds.includes(subcategory.id)
                                          ? 'border-blue-600 bg-blue-600'
                                          : 'border-gray-300'
                                      } ${
                                        !editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                      }`}
                                    />
                                    <span className={`text-xs transition-colors duration-200 ${
                                      formData.categoryIds.includes(subcategory.id)
                                        ? 'text-blue-700 font-semibold'
                                        : 'text-gray-700'
                                    }`}>
                                      <span className="mr-1">{subcategory.icon || getCategoryIcon(subcategory.name)}</span>
                                      {subcategory.name}
                                    </span>
                                  </label>
                                ))}
                                {subcategories.length > 3 && (
                                  <p className="text-xs text-gray-500">+{subcategories.length - 3} više</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })}
            </div>
            
            {formData.categoryIds.length === 0 && editMode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  ⚠️ <strong>Morate odabrati minimalno 1 kategoriju</strong> usluga kojima se bavite.
                </p>
              </div>
            )}
            
            {formData.categoryIds.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ✅ Odabrano <strong>{formData.categoryIds.length}</strong> kategorija
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Statistike */}
        <div className="space-y-4 bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Statistike</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.ratingAvg?.toFixed(1) || '0.0'}</div>
              <div className="text-sm text-gray-600">Prosječna ocjena</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.ratingCount || 0}</div>
              <div className="text-sm text-gray-600">Broj recenzija</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formData.categoryIds.length}</div>
              <div className="text-sm text-gray-600">Kategorije</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formData.experience || 0}</div>
              <div className="text-sm text-gray-600">Godine iskustva</div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setError('');
                setSuccess('');
                loadProfile(); // Reset form data
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Spremanje...' : 'Spremi promjene'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
