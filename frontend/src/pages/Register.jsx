import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="wrap max-w-[440px]">
        <div className="bg-white border-[1.5px] border-ink-900 rounded-[3px] shadow-card p-8">
          <h2 className="font-display text-2xl text-ink-900 mb-1.5">Create your account</h2>
          <p className="text-[13.5px] text-ink-500 mb-6">Only @kct.ac.in email addresses are accepted.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Full name</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]" />
              {errors.name && <p className="text-lost text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">College email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@kct\.ac\.in$/i, message: 'Only @kct.ac.in email addresses are allowed' }
                })}
                placeholder="you@kct.ac.in"
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]"
              />
              {errors.email && <p className="text-lost text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Phone (optional)</label>
              <input {...register('phone')} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]" />
            </div>
            <div className="mb-5">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]"
              />
              {errors.password && <p className="text-lost text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-lost text-sm mb-4">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-maroon-700 text-white border-none py-3 font-semibold text-sm rounded-sm hover:bg-maroon-600 disabled:opacity-60 transition-colors">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-[13px] text-ink-500 mt-5 text-center">
            Already have an account? <Link to="/login" className="text-maroon-700 font-semibold no-underline hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
