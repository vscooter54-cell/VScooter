import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, uploadAPI, BACKEND_URL } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: { en: '', de: '' },
    description: { en: '', de: '' },
    category: 'scooter',
    subcategory: '',
    pricing: {
      usd: '',
      eur: '',
      originalPrice: { usd: '', eur: '' },
      discount: 0,
    },
    specifications: {
      range: '',
      maxSpeed: '',
      weight: '',
      chargeTime: '',
      motorPower: '',
      batteryCapacity: '',
      maxLoad: '',
    },
    features: { en: [''], de: [''] },
    inventory: {
      stock: '',
      lowStockThreshold: 5,
      sku: '',
    },
    isPremium: false,
    isFeatured: false,
    isActive: true,
    tags: [],
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const product = response.data.data;

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        pricing: {
          usd: product.pricing.usd,
          eur: product.pricing.eur,
          originalPrice: product.pricing.originalPrice || { usd: '', eur: '' },
          discount: product.pricing.discount || 0,
        },
        specifications: product.specifications || {
          range: '',
          maxSpeed: '',
          weight: '',
          chargeTime: '',
          motorPower: '',
          batteryCapacity: '',
          maxLoad: '',
        },
        features: product.features || { en: [''], de: [''] },
        inventory: product.inventory,
        isPremium: product.isPremium,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        tags: product.tags || [],
      });

      // Load existing images
      if (product.images && product.images.length > 0) {
        setImages(product.images);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    } else if (keys.length === 2) {
      setFormData({
        ...formData,
        [keys[0]]: { ...formData[keys[0]], [keys[1]]: value },
      });
    } else if (keys.length === 3) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...formData[keys[0]],
          [keys[1]]: { ...formData[keys[0]][keys[1]], [keys[2]]: value },
        },
      });
    }
  };

  const handleFeatureChange = (lang, index, value) => {
    const newFeatures = { ...formData.features };
    newFeatures[lang][index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = (lang) => {
    const newFeatures = { ...formData.features };
    newFeatures[lang].push('');
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (lang, index) => {
    const newFeatures = { ...formData.features };
    newFeatures[lang].splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  // Image handling functions
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const response = await uploadAPI.uploadImage(file);
        if (response.data.success) {
          const newImage = {
            url: response.data.data.url,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
            isPrimary: images.length === 0, // First image is primary by default
          };
          setImages(prev => [...prev, newImage]);
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];

    // If it's a newly uploaded image (starts with /uploads), try to delete from server
    if (imageToRemove.url.startsWith('/uploads')) {
      const filename = imageToRemove.url.split('/').pop();
      try {
        await uploadAPI.deleteImage(filename);
      } catch (err) {
        console.error('Error deleting image from server:', err);
        // Continue with removing from state even if server delete fails
      }
    }

    const newImages = images.filter((_, i) => i !== index);

    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
  };

  const handleSetPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  const handleImageAltChange = (index, alt) => {
    const newImages = [...images];
    newImages[index].alt = alt;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up data
      const submitData = {
        ...formData,
        pricing: {
          usd: Number(formData.pricing.usd),
          eur: Number(formData.pricing.eur),
          originalPrice: formData.pricing.originalPrice.usd
            ? {
                usd: Number(formData.pricing.originalPrice.usd),
                eur: Number(formData.pricing.originalPrice.eur),
              }
            : undefined,
          discount: Number(formData.pricing.discount),
        },
        inventory: {
          stock: Number(formData.inventory.stock),
          lowStockThreshold: Number(formData.inventory.lowStockThreshold),
          sku: formData.inventory.sku,
        },
        features: {
          en: formData.features.en.filter((f) => f.trim()),
          de: formData.features.de.filter((f) => f.trim()),
        },
      };

      // Only include specifications for scooters
      if (formData.category !== 'scooter') {
        delete submitData.specifications;
      }

      // Include images
      submitData.images = images;

      if (isEdit) {
        await productAPI.update(id, submitData);
        alert('Product updated successfully');
      } else {
        await productAPI.create(submitData);
        alert('Product created successfully');
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const subcategoryOptions = {
    scooter: ['model-x', 'model-y', 'model-z'],
    accessory: ['helmet', 'lock', 'charger', 'bag', 'other'],
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEdit ? 'Update product information' : 'Create a new product in your inventory'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (English) *
                </label>
                <input
                  type="text"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (German) *
                </label>
                <input
                  type="text"
                  name="name.de"
                  value={formData.name.de}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (English) *
                </label>
                <textarea
                  name="description.en"
                  value={formData.description.en}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (German) *
                </label>
                <textarea
                  name="description.de"
                  value={formData.description.de}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="scooter">Scooter</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select subcategory</option>
                  {subcategoryOptions[formData.category].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price USD *
                </label>
                <input
                  type="number"
                  name="pricing.usd"
                  value={formData.pricing.usd}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price EUR *
                </label>
                <input
                  type="number"
                  name="pricing.eur"
                  value={formData.pricing.eur}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price USD (optional)
                </label>
                <input
                  type="number"
                  name="pricing.originalPrice.usd"
                  value={formData.pricing.originalPrice.usd}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price EUR (optional)
                </label>
                <input
                  type="number"
                  name="pricing.originalPrice.eur"
                  value={formData.pricing.originalPrice.eur}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Specifications (only for scooters) */}
          {formData.category === 'scooter' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Specifications
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Range *
                  </label>
                  <input
                    type="text"
                    name="specifications.range"
                    value={formData.specifications.range}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 35 miles (56 km)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Speed *
                  </label>
                  <input
                    type="text"
                    name="specifications.maxSpeed"
                    value={formData.specifications.maxSpeed}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 25 mph (40 km/h)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight *
                  </label>
                  <input
                    type="text"
                    name="specifications.weight"
                    value={formData.specifications.weight}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 26 lbs (12 kg)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Charge Time *
                  </label>
                  <input
                    type="text"
                    name="specifications.chargeTime"
                    value={formData.specifications.chargeTime}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 4 hours"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motor Power
                  </label>
                  <input
                    type="text"
                    name="specifications.motorPower"
                    value={formData.specifications.motorPower}
                    onChange={handleChange}
                    placeholder="e.g., 350W Brushless"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Battery Capacity
                  </label>
                  <input
                    type="text"
                    name="specifications.batteryCapacity"
                    value={formData.specifications.batteryCapacity}
                    onChange={handleChange}
                    placeholder="e.g., 36V 10Ah"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Load
                  </label>
                  <input
                    type="text"
                    name="specifications.maxLoad"
                    value={formData.specifications.maxLoad}
                    onChange={handleChange}
                    placeholder="e.g., 220 lbs (100 kg)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features (English)
                </label>
                {formData.features.en.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange('en', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature('en', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature('en')}
                  className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Feature
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features (German)
                </label>
                {formData.features.de.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange('de', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature('de', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature('de')}
                  className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Feature
                </button>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Images</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Upload product images. The first image will be set as primary by default. Click the star icon to change the primary image.
            </p>

            {/* Upload Button */}
            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="material-symbols-outlined text-gray-500">
                  {uploading ? 'hourglass_empty' : 'cloud_upload'}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.
              </p>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group border-2 rounded-lg overflow-hidden ${
                      image.isPrimary ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={image.url.startsWith('/uploads') ? `${BACKEND_URL}${image.url}` : image.url}
                      alt={image.alt || `Product image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />

                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* Set as Primary */}
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                          title="Set as primary"
                        >
                          <span className="material-symbols-outlined text-sm">star</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition-colors"
                        title="Remove image"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    {/* Alt Text Input */}
                    <div className="p-2 bg-gray-50 dark:bg-gray-700">
                      <input
                        type="text"
                        value={image.alt || ''}
                        onChange={(e) => handleImageAltChange(index, e.target.value)}
                        placeholder="Alt text"
                        className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Images Message */}
            {images.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
                <p className="text-gray-500 dark:text-gray-400 mt-2">No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Inventory</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="inventory.sku"
                  value={formData.inventory.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="inventory.stock"
                  value={formData.inventory.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="inventory.lowStockThreshold"
                  value={formData.inventory.lowStockThreshold}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Options</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-gray-300">Premium Product</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Featured (show on homepage)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-gray-300">Active (visible to customers)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
