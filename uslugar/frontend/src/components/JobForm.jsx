import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Konfiguracija vrsta projekata po kategorijama
const PROJECT_TYPES_BY_CATEGORY = {
  'Arhitekti': [
    'Novogradnja',
    'Adaptacija ili rekonstrukcija',
    'Nadogradnja',
    'Unutarnji dizajn (dizajn interijera)',
    'Legalizacija objekta'
  ],
  'Električar': [
    'Nova instalacija',
    'Popravak',
    'Servis',
    'Prekabeliranje',
    'Održavanje'
  ],
  'Vodoinstalater': [
    'Nova instalacija',
    'Popravak',
    'Servis',
    'Zamjena instalacije',
    'Održavanje'
  ],
  'Građevina': [
    'Novogradnja',
    'Renovacija',
    'Adaptacija',
    'Sanacija',
    'Dogradnja'
  ],
  'Soboslikarstvo': [
    'Farbanje',
    'Tapaciranje',
    'Dekorativna boja',
    'Glazura',
    'Premazivanje'
  ],
  'Keramičar': [
    'Položba pločica',
    'Popravak',
    'Fugiranje',
    'Dekorativna ugradnja',
    'Renovacija'
  ],
  'Krovopokrivač': [
    'Novi krov',
    'Popravak krova',
    'Zamjena pokrivača',
    'Hidroizolacija',
    'Održavanje'
  ],
  'Stolar': [
    'Namještaj',
    'Parket',
    'Laminat',
    'Vrata i prozori',
    'Kućno namještajstvo'
  ],
  'Čišćenje': [
    'Stanovanje',
    'Poslovni prostor',
    'Nakon gradnje',
    'Kancelarija',
    'Deep clean'
  ],
  'Dostava': [
    'Paketi',
    'Hrana',
    'Namirnice',
    'Povratna pošiljka',
    'Dokumenti'
  ]
};

// Opći projekti za kategorije koje nemaju specifične
const DEFAULT_PROJECT_TYPES = [
  'Renovacija',
  'Gradnja',
  'Popravak',
  'Ugradnja',
  'Servis',
  'Održavanje',
  'Dizajn',
  'Planiranje',
  'Čišćenje',
  'Dostava',
  'Ostalo'
];

// Konfiguracija specifičnih polja ovisno o kategoriji i vrsti projekta
const FIELD_CONFIGURATIONS = {
  'Arhitekti': {
    'Novogradnja': [
      { key: 'surface', label: 'Broj kvadratnih metara', type: 'number', required: false },
      { key: 'floors', label: 'Broj katova', type: 'number', required: false },
      { key: 'plotSize', label: 'Površina parcele (m²)', type: 'number', required: false }
    ],
    'Adaptacija ili rekonstrukcija': [
      { key: 'surface', label: 'Broj kvadratnih metara', type: 'number', required: false },
      { key: 'currentState', label: 'Trenutno stanje objekta', type: 'select', options: ['Dobar', 'Potreban remont', 'Ruševina'], required: false },
      { key: 'buildingYear', label: 'Godina izgradnje', type: 'number', required: false }
    ],
    'Nadogradnja': [
      { key: 'currentFloors', label: 'Trenutni broj katova', type: 'number', required: false },
      { key: 'newFloors', label: 'Broj novih katova', type: 'number', required: false },
      { key: 'surface', label: 'Broj kvadratnih metara', type: 'number', required: false }
    ]
  },
  'Električar': {
    'Nova instalacija': [
      { key: 'propertyType', label: 'Vrsta objekta', type: 'select', options: ['Stan', 'Kuća', 'Poslovni prostor'], required: false },
      { key: 'surface', label: 'Broj kvadratnih metara', type: 'number', required: false },
      { key: 'meterLocation', label: 'Lokacija elektromjernog mjesta', type: 'text', required: false }
    ],
    'Popravak': [
      { key: 'problemDescription', label: 'Opis problema', type: 'textarea', required: false },
      { key: 'urgency', label: 'Hitnost', type: 'select', options: ['Niski', 'Srednji', 'Visok', 'Hitan'], required: false }
    ]
  },
  'Vodoinstalater': {
    'Nova instalacija': [
      { key: 'bathrooms', label: 'Broj kupaonica', type: 'number', required: false },
      { key: 'kitchens', label: 'Broj kuhinja', type: 'number', required: false },
      { key: 'hotWater', label: 'Topla voda', type: 'select', options: ['Da', 'Ne'], required: false }
    ],
    'Popravak': [
      { key: 'problemType', label: 'Vrsta problema', type: 'select', options: ['Curenje', 'Zasiranje', 'Slab tlak', 'Drugi'], required: false },
      { key: 'location', label: 'Lokacija problema', type: 'text', required: false }
    ]
  },
  'Soboslikarstvo': {
    'Farbanje': [
      { key: 'rooms', label: 'Broj prostorija', type: 'number', required: false },
      { key: 'surface', label: 'Ukupna površina (m²)', type: 'number', required: false },
      { key: 'paintType', label: 'Tip boje', type: 'select', options: ['Dispersija', 'Lateks', 'Akril', 'Mineralna'], required: false }
    ],
    'Tapaciranje': [
      { key: 'walls', label: 'Broj zidova za tapaciranje', type: 'number', required: false },
      { key: 'wallpaperType', label: 'Tip tapeta', type: 'select', options: ['Vinilne', 'Tekstilne', 'Fototapete'], required: false }
    ]
  },
  'Keramičar': {
    'Položba pločica': [
      { key: 'rooms', label: 'Broj prostorija', type: 'number', required: false },
      { key: 'surface', label: 'Ukupna površina (m²)', type: 'number', required: false },
      { key: 'tileSize', label: 'Veličina pločica', type: 'text', placeholder: 'npr. 30x30', required: false }
    ],
    'Fugiranje': [
      { key: 'surface', label: 'Površina za fugiranje (m²)', type: 'number', required: false },
      { key: 'jointWidth', label: 'Širina fuge (mm)', type: 'number', required: false }
    ]
  },
  'Krovopokrivač': {
    'Popravak krova': [
      { key: 'roofType', label: 'Vrsta krova', type: 'select', options: ['Lamela', 'Crijep', 'Lim', 'Betonski'], required: false },
      { key: 'problemDescription', label: 'Opis problema', type: 'textarea', required: false },
      { key: 'surface', label: 'Površina krova (m²)', type: 'number', required: false }
    ]
  },
  'Stolar': {
    'Namještaj': [
      { key: 'roomType', label: 'Prostorija', type: 'select', options: ['Kuhinja', 'Dnevni boravak', 'Spavaća soba', 'Ured', 'Ostalo'], required: false },
      { key: 'furnitureType', label: 'Vrsta namještaja', type: 'select', options: ['Kuhinjske jedinice', 'Orman', 'Police', 'Stolovi', 'Klupice'], required: false }
    ],
    'Parket': [
      { key: 'surface', label: 'Površina (m²)', type: 'number', required: false },
      { key: 'roomType', label: 'Prostorija', type: 'text', required: false },
      { key: 'woodType', label: 'Vrsta drva', type: 'select', options: ['Hrast', 'Bukva', 'Jasen', 'Kruška'], required: false }
    ]
  },
  'Čišćenje': {
    'Stanovanje': [
      { key: 'rooms', label: 'Broj prostorija', type: 'number', required: false },
      { key: 'surface', label: 'Površina (m²)', type: 'number', required: false },
      { key: 'cleaningType', label: 'Vrsta čišćenja', type: 'select', options: ['Standardno', 'Temeljito', 'Nakon gradnje'], required: false }
    ],
    'Poslovni prostor': [
      { key: 'surface', label: 'Površina (m²)', type: 'number', required: false },
      { key: 'employees', label: 'Broj zaposlenih', type: 'number', required: false },
      { key: 'frequency', label: 'Učestalost', type: 'select', options: ['Jednom', 'Tjedno', 'Mjesečno'], required: false }
    ]
  },
  'Dostava': {
    'Paketi': [
      { key: 'weight', label: 'Težina (kg)', type: 'number', required: false },
      { key: 'dimensions', label: 'Dimenzije (cm)', type: 'text', placeholder: 'npr. 40x30x20', required: false },
      { key: 'fragile', label: 'Lomljivo', type: 'select', options: ['Da', 'Ne'], required: false }
    ],
    'Hrana': [
      { key: 'restaurant', label: 'Restoran/Prehrambeni objekt', type: 'text', required: false },
      { key: 'address', label: 'Adresa dostave', type: 'text', required: false },
      { key: 'readyTime', label: 'Vrijeme pripreme', type: 'time', required: false }
    ]
  }
};

const JobForm = ({ onSubmit, categories = [], initialData = null }) => {
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [customFields, setCustomFields] = useState({}); // State za custom polja
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      projectType: '',
      budgetMin: '',
      budgetMax: '',
      city: '',
      urgency: 'NORMAL',
      jobSize: '',
      deadline: ''
    }
  });

  // Watch selected category and project type
  const selectedCategoryId = watch('categoryId');
  const selectedProjectType = watch('projectType');
  
  // Get project types for selected category
  const getProjectTypes = () => {
    if (!selectedCategoryId) return DEFAULT_PROJECT_TYPES;
    
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) return DEFAULT_PROJECT_TYPES;
    
    return PROJECT_TYPES_BY_CATEGORY[selectedCategory.name] || DEFAULT_PROJECT_TYPES;
  };

  // Get custom fields for selected category and project type
  const getCustomFields = () => {
    if (!selectedCategoryId || !selectedProjectType) return [];
    
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) return [];
    
    const categoryConfig = FIELD_CONFIGURATIONS[selectedCategory.name];
    if (!categoryConfig) return [];
    
    return categoryConfig[selectedProjectType] || [];
  };

  // Reset project type, subcategory and custom fields when category changes
  useEffect(() => {
    setValue('projectType', '');
    setValue('subcategoryId', '');
    setCustomFields({});
  }, [selectedCategoryId, setValue]);

  // Reset custom fields when project type changes
  useEffect(() => {
    setCustomFields({});
  }, [selectedProjectType]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = [...images, ...data.files.map(file => file.url)];
        setImages(newImages);
        setValue('images', newImages);
      } else {
        alert('Greška pri upload-u slika');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Greška pri upload-u slika');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      images,
      customFields, // Add custom fields
      budgetMin: data.budgetMin ? parseInt(data.budgetMin) : null,
      budgetMax: data.budgetMax ? parseInt(data.budgetMax) : null,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Naslov posla *
        </label>
        <input
          {...register('title', { required: 'Naslov je obavezan' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Npr. Trebam soboslikara za adaptaciju"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opis posla *
        </label>
        <textarea
          {...register('description', { required: 'Opis je obavezan' })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Detaljno opišite što trebate..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategorija *
        </label>
        <select
          {...register('categoryId', { required: 'Kategorija je obavezna' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Odaberite kategoriju</option>
          {categories.filter(cat => !cat.parentId).map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Subcategory selection - only for categories with children */}
      {selectedCategoryId && (() => {
        const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
        const subcategories = selectedCategory ? categories.filter(cat => cat.parentId === selectedCategoryId) : [];
        
        if (subcategories.length > 0) {
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Podkategorija *
              </label>
              <select
                {...register('subcategoryId', { required: 'Podkategorija je obavezna' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Odaberite podkategoriju</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategoryId.message}</p>
              )}
            </div>
          );
        }
        return null;
      })()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vrsta projekta {selectedCategoryId && <span className="text-blue-600 text-xs">(mijenja se s kategorijom)</span>}
        </label>
        <select
          {...register('projectType')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!selectedCategoryId}
        >
          <option value="">{selectedCategoryId ? 'Odaberite vrstu projekta' : 'Najprije odaberite kategoriju'}</option>
          {getProjectTypes().map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic fields based on category and project type */}
      {selectedCategoryId && selectedProjectType && getCustomFields().length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Dodatni detalji projekta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getCustomFields().map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    value={customFields[field.key] || ''}
                    onChange={(e) => setCustomFields({ ...customFields, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Odaberite</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={customFields[field.key] || ''}
                    onChange={(e) => setCustomFields({ ...customFields, [field.key]: e.target.value })}
                    rows={3}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : field.type === 'time' ? (
                  <input
                    type="time"
                    value={customFields[field.key] || ''}
                    onChange={(e) => setCustomFields({ ...customFields, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={customFields[field.key] || ''}
                    onChange={(e) => setCustomFields({ ...customFields, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grad
        </label>
        <input
          {...register('city')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Zagreb"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimalni budžet (HRK)
          </label>
          <input
            {...register('budgetMin')}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maksimalni budžet (HRK)
          </label>
          <input
            {...register('budgetMax')}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hitnost
          </label>
          <select
            {...register('urgency')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LOW">Niska</option>
            <option value="NORMAL">Normalna</option>
            <option value="HIGH">Visoka</option>
            <option value="URGENT">Hitno</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Veličina posla
          </label>
          <select
            {...register('jobSize')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Odaberite veličinu</option>
            <option value="SMALL">Mali</option>
            <option value="MEDIUM">Srednji</option>
            <option value="LARGE">Veliki</option>
            <option value="EXTRA_LARGE">Vrlo veliki</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rok izvršenja
          </label>
          <input
            {...register('deadline')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slike posla
        </label>
        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {uploading && (
            <p className="text-sm text-blue-600">Upload u tijeku...</p>
          )}
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Slika ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Odustani
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {initialData ? 'Ažuriraj posao' : 'Objavi posao'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
