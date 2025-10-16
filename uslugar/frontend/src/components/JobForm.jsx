import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const JobForm = ({ onSubmit, categories = [], initialData = null }) => {
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      categoryId: '',
      budgetMin: '',
      budgetMax: '',
      city: '',
      urgency: 'NORMAL',
      jobSize: '',
      deadline: ''
    }
  });

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorija *
          </label>
          <select
            {...register('categoryId', { required: 'Kategorija je obavezna' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Odaberite kategoriju</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

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
