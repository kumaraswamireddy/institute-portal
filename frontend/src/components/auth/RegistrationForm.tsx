'use client';

import React, { useState } from 'react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { User, School } from 'lucide-react';
import { Oval } from 'react-loader-spinner';

// Interface for managing form validation errors
interface FormErrors {
  fullName?: string;
  mobileNo?: string;
  instituteName?: string;
}

export function RegistrationForm() {
  const { newUserData, registerAndLogin, error: apiError, isLoading } = useGoogleAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'institute' | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState(newUserData?.name || '');
  const [mobileNo, setMobileNo] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!mobileNo.trim()) {
      errors.mobileNo = 'Mobile number is required.';
    } else if (!/^\+?[1-9]\d{9,14}$/.test(mobileNo)) {
      errors.mobileNo = 'Please enter a valid mobile number.';
    }

    if (selectedRole === 'institute' && !instituteName.trim()) {
      errors.instituteName = 'Institute name is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    // Only proceed if client-side validation passes
    const isValid = validateForm();
    if (isValid) {
      await registerAndLogin({
        role: selectedRole,
        fullName,
        mobileNo,
        instituteName: selectedRole === 'institute' ? instituteName : undefined,
      });
    }
  };

  if (!newUserData) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900">Complete Your Registration</h2>
      <p className="mt-2 text-sm text-center text-gray-600">
        Welcome, {newUserData.name}! Just a few more details.
      </p>

      {/* Step 1: Role Selection */}
      {!selectedRole && (
        <div className="mt-6">
          <p className="text-center font-medium text-gray-700">I am a...</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button onClick={() => setSelectedRole('student')} className="flex flex-col items-center justify-center p-4 border-2 border-transparent rounded-lg bg-indigo-50 hover:border-indigo-400 transition-all">
              <User className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="font-semibold text-indigo-800">Student</span>
            </button>
            <button onClick={() => setSelectedRole('institute')} className="flex flex-col items-center justify-center p-4 border-2 border-transparent rounded-lg bg-teal-50 hover:border-teal-400 transition-all">
              <School className="w-8 h-8 text-teal-600 mb-2" />
              <span className="font-semibold text-teal-800">Institute</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details Form */}
      {selectedRole && (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {formErrors.fullName && <p className="mt-1 text-xs text-red-600">{formErrors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="mobileNo"
              type="tel"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            {formErrors.mobileNo && <p className="mt-1 text-xs text-red-600">{formErrors.mobileNo}</p>}
          </div>

          {selectedRole === 'institute' && (
            <div>
              <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700">
                Institute Name <span className="text-red-500">*</span>
              </label>
              <input
                id="instituteName"
                type="text"
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
              />
              {formErrors.instituteName && <p className="mt-1 text-xs text-red-600">{formErrors.instituteName}</p>}
            </div>
          )}
          
          {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => { setSelectedRole(null); setFormErrors({}); }} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center min-w-[180px]"
            >
              {isLoading ? (
                  <Oval height={20} width={20} color="#fff" secondaryColor="#c7d2fe" strokeWidth={5} />
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

