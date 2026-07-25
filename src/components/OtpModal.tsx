import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { HOTLINE_NUMBER, ADMIN_MOBILE_NUMBERS } from '../data/mockData';
import { Phone, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, X, Lock, KeyRound } from 'lucide-react';

export const OtpModal: React.FC = () => {
  const { isOtpModalOpen, setIsOtpModalOpen, otpModalTargetRole, loginUser, setActiveTab } = useShop();

  const [phone, setPhone] = useState<string>(
    otpModalTargetRole === 'admin' ? HOTLINE_NUMBER : ''
  );
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [demoOtp, setDemoOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAdminDetected, setIsAdminDetected] = useState<boolean>(false);

  if (!isOtpModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setDemoOtp(data.demoOtp);
        setIsAdminDetected(data.isAdmin);
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter complete 4-digit OTP code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        loginUser(phone, data.user.name, data.user.role);
        if (data.user.role === 'admin') {
          setActiveTab('Admin');
        } else {
          setActiveTab('CustomerDashboard');
        }
        // Reset modal state
        setStep('phone');
        setOtp('');
      } else {
        setError(data.error || 'Incorrect OTP code');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error during verification.');
    }
  };

  const fillDemoOtp = () => {
    if (demoOtp) setOtp(demoOtp);
    else setOtp('4579');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="bg-zinc-900 text-white p-6 relative">
          <button 
            onClick={() => setIsOtpModalOpen(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-zinc-950 rounded-xl flex items-center justify-center font-bold text-lg">
              {otpModalTargetRole === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                {otpModalTargetRole === 'admin' ? 'Admin Portal Authentication' : 'Customer OTP Login'}
              </h3>
              <p className="text-xs text-zinc-400">
                {otpModalTargetRole === 'admin' 
                  ? 'Authorized Admin Mobile verification' 
                  : 'Instant login without password'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Enter 10-Digit Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="e.g. 9507457956"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-mono text-zinc-900"
                    autoFocus
                  />
                </div>
              </div>

              {otpModalTargetRole === 'admin' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Authorized Admin Numbers:</span>
                  </div>
                  <div className="font-mono text-amber-800">
                    {ADMIN_MOBILE_NUMBERS.join(' • ')}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex p-2 bg-amber-50 text-amber-700 rounded-full mb-1">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Enter OTP Sent To</h4>
                <p className="text-xs font-mono font-bold text-amber-700">+91 {phone}</p>
                {isAdminDetected && (
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                    Admin Privilege Recognized
                  </span>
                )}
              </div>

              {/* Demo OTP Banner for immediate ease */}
              {demoOtp && (
                <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-2.5 text-center">
                  <div className="text-[11px] text-zinc-600 font-medium">Demo Verification OTP:</div>
                  <div className="text-lg font-mono font-black text-amber-600 tracking-widest my-0.5">
                    {demoOtp}
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoOtp}
                    className="text-[11px] text-amber-700 underline font-semibold hover:text-amber-800"
                  >
                    Auto-Fill Code ({demoOtp})
                  </button>
                </div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[1em] text-2xl font-mono py-3 border border-zinc-300 rounded-xl focus:outline-hidden focus:border-amber-600 text-zinc-900"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 bg-zinc-100 text-zinc-700 font-semibold py-3 px-3 rounded-xl text-xs hover:bg-zinc-200"
                >
                  Change No.
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="w-2/3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
