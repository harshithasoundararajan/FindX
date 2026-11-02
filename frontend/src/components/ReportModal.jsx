import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createItem } from '../api/itemService';
import { uploadImage } from '../api/uploadService';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function ReportModal({ open, onClose, initialType = 'lost', categories, locations, onCreated }) {
  const [reportType, setReportType] = useState(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    setPhotoError('');
  };

  useEffect(() => {
    if (open) {
      setReportType(initialType);
      setSuccess(null);
      setServerError('');
      clearPhoto();
      reset();
    }
  }, [open, initialType, reset]);

  useEffect(() => {
    // Release the object URL created for the preview
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  if (!open) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file (JPG or PNG).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Photo is larger than 5MB.');
      e.target.value = '';
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError('');
    try {
      let imageUrl;
      if (photo) {
        try {
          const uploaded = await uploadImage(photo);
          imageUrl = uploaded.data;
        } catch (uploadErr) {
          setServerError(
            (uploadErr?.response?.data?.message || 'Photo upload failed.') +
            ' Remove the photo to post without one, or try again.'
          );
          return;
        }
      }
      const payload = {
        title: data.title,
        description: data.description,
        categoryId: Number(data.categoryId),
        locationId: Number(data.locationId),
        status: reportType.toUpperCase(),
        date: data.date,
        imageUrl
      };
      const res = await createItem(payload);
      setSuccess(res.data);
      onCreated && onCreated(res.data);
      setTimeout(onClose, 1600);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/55 z-[100] flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-cream-50 rounded-[3px] max-w-[520px] w-full max-h-[88vh] overflow-y-auto border-[1.5px] border-ink-900 shadow-2xl">
        <div className="flex justify-between items-center px-6 py-5 border-b-[1.5px] border-dashed border-ink-300 sticky top-0 bg-cream-50">
          <h3 className="font-display text-[19px] m-0">{reportType === 'lost' ? 'Report a lost item' : 'Report a found item'}</h3>
          <button onClick={onClose} className="bg-none border-none text-[22px] text-ink-500 leading-none" aria-label="Close">×</button>
        </div>

        <div className="px-6 pt-[22px] pb-[26px]">
          <div className="flex bg-cream-100 rounded-sm p-[3px] mb-5">
            <button type="button" onClick={() => setReportType('lost')} className={`flex-1 py-2.5 font-semibold text-[13.5px] rounded-sm ${reportType === 'lost' ? 'bg-lost text-white' : 'text-ink-500'}`}>Lost it</button>
            <button type="button" onClick={() => setReportType('found')} className={`flex-1 py-2.5 font-semibold text-[13.5px] rounded-sm ${reportType === 'found' ? 'bg-found text-white' : 'text-ink-500'}`}>Found it</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Item name</label>
              <input
                {...register('title', { required: 'Item name is required' })}
                placeholder="e.g. Black Wildcraft backpack"
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] bg-white"
              />
              {errors.title && <p className="text-lost text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Category</label>
                <select {...register('categoryId', { required: true })} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] bg-white">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Location</label>
                <select {...register('locationId', { required: true })} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] bg-white">
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Date</label>
              <input type="date" {...register('date', { required: 'Date is required' })} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] bg-white" />
              {errors.date && <p className="text-lost text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="Colour, brand, any identifying marks…"
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] bg-white min-h-[70px]"
              />
              {errors.description && <p className="text-lost text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Photo (optional)</label>
              {photoPreview ? (
                <div className="flex items-center gap-3 border-[1.5px] border-cream-200 rounded-sm p-2.5 bg-white">
                  <img src={photoPreview} alt="Selected item" className="w-16 h-16 object-cover rounded-sm" />
                  <div className="flex-1 text-[12.5px] text-ink-700 truncate">{photo?.name}</div>
                  <button type="button" onClick={clearPhoto} className="text-[12.5px] text-maroon-700 font-semibold">Remove</button>
                </div>
              ) : (
                <label className="block border-[1.5px] border-dashed border-ink-300 rounded-sm p-[22px] text-center text-[12.5px] text-ink-500 cursor-pointer hover:bg-cream-100">
                  Click to choose a photo — JPG/PNG up to 5MB
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
              {photoError && <p className="text-lost text-xs mt-1">{photoError}</p>}
            </div>

            {serverError && <p className="text-lost text-sm mb-3">{serverError}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-maroon-700 text-white border-none py-[13px] font-semibold text-[14.5px] rounded-sm hover:bg-maroon-600 disabled:opacity-60 transition-colors">
              {submitting ? 'Posting…' : reportType === 'lost' ? 'Post to the board' : 'Post as found'}
            </button>

            {success && (
              <div className="bg-found-bg text-found px-3.5 py-3 rounded-sm text-[13px] mt-3.5">
                Listing posted — claim code <strong>#{success.id}</strong>. Keep it for reference at the desk.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
