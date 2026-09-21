import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slice/auth/authThunk';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData,setFormData]=useState({
    email:'',
    fullname:'',
    password:'',
  })

  const handleChange=(e)=>{
   setFormData({
    ...formData,
    [e.target.name]:e.target.value,
   })
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    
    if(!formData.email || !formData.fullname || !formData.password){
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const result = await dispatch(registerUser(formData));
      if (result.error) {
        console.log(result);
        toast.error(result.payload);
      } else {
        toast.success('Registration successful');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error During Registration');
      console.log(error);     
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-[var(--text-color)] pt-16">
      {/* Removed glass blurs */}

      <div className="glass-panel w-full max-w-md p-8 sm:p-12 animate-slide-up relative">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Go back"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Join JustShare to securely save your files</p>
        </div>
        
        <div className="space-y-5">
          <input
            className="w-full px-4 py-3.5 rounded-xl font-medium bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] placeholder-gray-500 text-gray-900 dark:text-gray-200 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            type="text"
            name="fullname"
            onChange={handleChange}
            value={formData.fullname}
            placeholder="Full Name"
          />
          <input
            className="w-full px-4 py-3.5 rounded-xl font-medium bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] placeholder-gray-500 text-gray-900 dark:text-gray-200 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email Address"
          />
          <input
            className="w-full px-4 py-3.5 rounded-xl font-medium bg-white dark:bg-[#1a1a1c] border border-gray-200 dark:border-[#2c2c2e] placeholder-gray-500 text-gray-900 dark:text-gray-200 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
          />
          <button
            className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-3 mt-6 text-sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                Sign Up
              </>
            )}
          </button>
          
          <p className="mt-8 text-sm text-gray-400 text-center font-medium">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
