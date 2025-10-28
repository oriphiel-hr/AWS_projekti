import React, { useState, useEffect } from 'react';
import api from '../api';
import KYCVerification from '../components/KYCVerification';

export default function ProviderProfile({ onSuccess }) {
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('active'); // 'active', 'inactive', 'all'
  const [searchTerm, setSearchTerm] = useState('');
  
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
      'Parketar': '🔨',
      'Plinoinstalatér': '🔥',
      'Podne obloge': '🔨',
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
      'Vulkanizer': '🚗',
      'Zidar': '🧱'
    };
    
    
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
  
  // Mapiranje kategorija koje zahtijevaju više dokumenata
  const [categoryDocuments, setCategoryDocuments] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState({}); // {categoryId: true/false}
  
  // Kategorije koje zahtijevaju više dokumenata
  const getRequiredDocumentsForCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.requiresLicense) return [];
    
    const docsMap = {
      // Električar - više vrsta dozvola
      'Električar': [
        { name: 'Elektrotehnička dozvola', required: true },
        { name: 'Certifikat električara', required: true },
        { name: 'Obrazovanje (diploma)', required: false }
      ],
      // Arhitekti - više dokumenata
      'Arhitekti': [
        { name: 'Licenca arhitekta', required: true },
        { name: 'Diploma', required: true },
        { name: 'Članstvo u komori', required: false }
      ],
      // Građevina - različite dozvole
      'Projektiranje građevina': [
        { name: 'Građevinska dozvola', required: true },
        { name: 'Certifikat', required: true }
      ],
      // Fizioterapija
      'Fizioterapija': [
        { name: 'Licenca fizioterapeuta', required: true },
        { name: 'Diploma', required: true }
      ],
      // Nutrisionizam
      'Nutricionizam': [
        { name: 'Licenca nutricionista', required: true },
        { name: 'Diploma', required: true }
      ],
      // Mentalno zdravlje
      'Mentalno zdravlje': [
        { name: 'Licenca psihologa', required: true },
        { name: 'Diploma', required: true }
      ]
    };
    
    return docsMap[category.name] || [{ name: category.licenseType || 'Licenca', required: true }];
  };

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
      
      // Učitaj profil preko /fix-profile endpoint-a (radi sigurno)
      let response;
      try {
        response = await api.post('/providers/fix-profile', {
          bio: '',
          specialties: [],
          experience: 0,
          website: '',
          serviceArea: 'Zagreb',
          isAvailable: true,
          categoryIds: []
        });
        console.log('✅ /fix-profile endpoint radi ispravno');
      } catch (fixError) {
        console.log('❌ /fix-profile endpoint ne radi:', fixError);
        setError('Greška pri učitavanju profila. Pokušajte ponovno.');
        setLoading(false);
        return;
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

  const handleDocumentUpload = async (categoryId, docIndex, file) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    setUploadingDoc(prev => ({ ...prev, [`${categoryId}_${docIndex}`]: true }));
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('categoryId', categoryId);
      formData.append('docType', docIndex);
      
      // Upload file to backend
      const response = await api.post('/providers/upload-license', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update category documents state
      setCategoryDocuments(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [docIndex]: response.data.url
        }
      }));
      
      setSuccess(`✅ Dokument "${file.name}" je uspješno učit動n!`);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(`Greška pri učitavanju dokumenta: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploadingDoc(prev => ({ ...prev, [`${categoryId}_${docIndex}`]: false }));
    }
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

          {/* Pravni status i licence */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pravni status (OIB) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="taxId"
                value={profile.user?.taxId || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="12345678901"
              />
              <p className="text-xs text-gray-500 mt-1">OIB se ne može mijenjati</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naziv firme/obrta
              </label>
              <input
                type="text"
                name="companyName"
                value={profile.user?.companyName || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Prikazuje se ako postoji</p>
            </div>
          </div>

          {/* KYC-lite Verifikacija za Freelancere */}
          {profile?.user?.legalStatus?.code === 'FREELANCER' || profile?.user?.legalStatus?.code === 'SOLE_TRADER' ? (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                🔒 KYC-lite Verifikacija
              </h4>
              <KYCVerification 
                providerProfile={profile}
                onUpdate={loadProfile}
              />
            </div>
          ) : null}

          {/* Identity Badge Verifikacija */}
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              🆔 Identity Badge (Anti-impersonation)
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Verificirajte svoj identitet kako biste dobili Identity badge.
            </p>
            
            <div className="space-y-3">
              {profile.identityEmailVerified && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-green-900">
                    ✓ Email verificiran
                  </span>
                </div>
              )}
              {profile.identityPhoneVerified && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-green-900">
                    ✓ Telefon verificiran
                  </span>
                </div>
              )}
              {profile.identityDnsVerified && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-green-900">
                    ✓ DNS verificiran
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Safety Badge */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              🛡️ Safety Badge (Opcijski)
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Uploadajte policu osiguranja radi dodatne sigurnosti.
            </p>
            
            {profile.safetyInsuranceUrl ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <span className="text-sm font-medium text-green-900">
                  ✓ Polica osiguranja uploadana
                </span>
                <a 
                  href={profile.safetyInsuranceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  Pogledaj policu
                </a>
              </div>
            ) : (
              <form encType="multipart/form-data" className="space-y-3">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2"
                />
                <button
                  type="button"
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
                >
                  Uploadaj policu osiguranja
                </button>
              </form>
            )}
          </div>

          {/* Licence i ovlaštenja */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              📜 Licence i ovlaštenja
            </h4>
            <p className="text-xs text-yellow-800 mb-3">
              Neke kategorije usluga zahtijevaju licence ili specijalna ovlaštenja (npr. Električar, Arhitekti, Građevina).
            </p>
            <div className="space-y-2">
              {formData.categoryIds.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                if (!category?.requiresLicense) return null;
                return (
                  <div key={categoryId} className="bg-white border border-yellow-300 rounded p-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">
                          {category.icon} {category.name}
                        </p>
                        {category.licenseType && (
                          <p className="text-xs text-yellow-700 mt-1">
                            Zahtijeva: <strong>{category.licenseType}</strong>
                          </p>
                        )}
                        {category.licenseAuthority && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Izdaje: {category.licenseAuthority}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {formData.categoryIds.filter(catId => {
                const cat = categories.find(c => c.id === catId);
                return cat?.requiresLicense;
              }).length === 0 && (
                <p className="text-sm text-yellow-700">
                  ✓ Odabrane kategorije ne zahtijevaju licence
                </p>
              )}
            </div>
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
          
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCategoryFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                ✅ Aktivne ({categories.filter(c => c.isActive && !c.parentId).length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'inactive'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                ⏸️ Neaktivne ({categories.filter(c => !c.isActive && !c.parentId).length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                📋 Sve
              </button>
            </div>
            
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Pretraži kategorije..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories
                .filter(category => !category.parentId) // Samo glavne kategorije
                .filter(category => {
                  // Filter by active status
                  if (categoryFilter === 'active' && !category.isActive) return false;
                  if (categoryFilter === 'inactive' && category.isActive) return false;
                  
                  // Filter by search term
                  if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    return category.name.toLowerCase().includes(searchLower) ||
                           (category.description && category.description.toLowerCase().includes(searchLower));
                  }
                  return true;
                })
                .map(category => {
                  const subcategories = categories.filter(cat => cat.parentId === category.id);
                  const isSelected = formData.categoryIds.includes(category.id);
                  const isInactive = !category.isActive;
                  
                  return (
                    <div key={category.id} className={`border-2 rounded-lg p-3 transition-all duration-200 relative ${
                      isInactive ? 'opacity-75 bg-gray-50' : ''
                    } ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : isInactive
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      {/* Inactive badge */}
                      {isInactive && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                            ⏸️ Neaktivna
                          </span>
                        </div>
                      )}
                      
                      {/* License required badge */}
                      {category.requiresLicense && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                            📜 Licenca
                          </span>
                        </div>
                      )}
                      
                      <label className={`flex items-start space-x-3 ${editMode ? 'cursor-pointer' : 'cursor-default'} mt-6`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCategoryChange(category.id)}
                          disabled={!editMode}
                          className={`mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 rounded transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          } ${
                            !editMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon || getCategoryIcon(category.name)}</span>
                            <span className={`font-medium transition-colors duration-200 ${
                              isSelected
                                ? 'text-blue-800 font-semibold'
                                : isInactive
                                ? 'text-gray-600'
                                : 'text-gray-900'
                            }`}>
                              {category.name}
                            </span>
                          </div>
                          {category.description && (
                            <p className={`text-xs mt-1 ${isInactive ? 'text-gray-500' : 'text-gray-600'}`}>
                              {category.description}
                            </p>
                          )}
                          {category.licenseType && (
                            <p className="text-xs text-yellow-700 mt-1">
                              ⚠️ {category.licenseType}
                            </p>
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
            
            {/* No results message */}
            {categories.filter(category => !category.parentId).filter(category => {
              if (categoryFilter === 'active' && !category.isActive) return false;
              if (categoryFilter === 'inactive' && category.isActive) return false;
              if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return category.name.toLowerCase().includes(searchLower) ||
                       (category.description && category.description.toLowerCase().includes(searchLower));
              }
              return true;
            }).length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800 font-medium">🔍 Nema kategorija koje odgovaraju vašem pretraživanju</p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchTerm('');
                  }}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Očisti filtere
                </button>
              </div>
            )}
            
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

          {/* Document Upload Section - Only for selected categories that require licenses */}
          {editMode && formData.categoryIds.length > 0 && formData.categoryIds.some(catId => {
            const cat = categories.find(c => c.id === catId);
            return cat && cat.requiresLicense;
          }) && (
            <div className="space-y-4 bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-yellow-900 flex items-center">
                📄 Obavezni dokumenti za odabrane kategorije
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                Neke odabrane kategorije zahtijevaju licence ili certifikate. Molimo učitajte potrebne dokumente.
              </p>
              
              {formData.categoryIds.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                if (!category || !category.requiresLicense) return null;
                
                const requiredDocs = getRequiredDocumentsForCategory(categoryId);
                
                return (
                  <div key={categoryId} className="bg-white border border-yellow-300 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </h4>
                    
                    <div className="space-y-3">
                      {requiredDocs.map((doc, docIndex) => (
                        <div key={docIndex} className="border border-gray-300 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              {doc.name}
                              {doc.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {categoryDocuments[categoryId]?.[docIndex] && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✅ Učitano
                              </span>
                            )}
                          </div>
                          
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDocumentUpload(categoryId, docIndex, file);
                              }
                            }}
                            disabled={uploadingDoc[`${categoryId}_${docIndex}`]}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          
                          {uploadingDoc[`${categoryId}_${docIndex}`] && (
                            <p className="text-xs text-blue-600 mt-1">⏳ Učitavanje...</p>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-1">
                            Prihvaćeni formati: PDF, JPG, PNG, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Display uploaded licenses */}
        {profile.licenses && profile.licenses.length > 0 && (
          <div className="space-y-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vaše učitane licence
            </h3>
            
            <div className="space-y-3">
              {profile.licenses.map((license) => (
                <div
                  key={license.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    license.isVerified
                      ? 'border-green-300 bg-green-50'
                      : 'border-yellow-300 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{license.licenseType}</h4>
                        {license.isVerified ? (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded flex items-center">
                            ✅ Verificirana
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded flex items-center">
                            ⏳ Čeka verifikaciju
                          </span>
                        )}
                      </div>
                      
                      {license.issuingAuthority && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Izdaje:</strong> {license.issuingAuthority}
                        </p>
                      )}
                      
                      {license.licenseNumber && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Broj licence:</strong> {license.licenseNumber}
                        </p>
                      )}
                      
                      {license.issuedAt && (
                        <p className="text-xs text-gray-500">
                          Izdata: {new Date(license.issuedAt).toLocaleDateString('hr-HR')}
                        </p>
                      )}
                      
                      {license.verifiedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Verificirana: {new Date(license.verifiedAt).toLocaleDateString('hr-HR')}
                        </p>
                      )}
                      
                      {license.documentUrl && (
                        <div className="mt-3">
                          <a
                            href={license.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                          >
                            📄 Pregledaj dokument
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!license.isVerified && (
                    <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded p-3">
                      <p className="text-sm text-yellow-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <strong>⚠️ Upozorenje:</strong> Vaša licenca čeka verifikaciju od administratora. Nakon verifikacije će biti prikazana kao verificirana.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {profile.licenses.some(l => !l.isVerified) && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Napomena:</strong> Neverificirane licence mogu utjecati na vašu vidljivost i povjerenje klijenata. Molimo pričekajte verifikaciju od administratora.
                </p>
              </div>
            )}
          </div>
        )}

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
