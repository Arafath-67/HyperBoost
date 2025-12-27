'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function VerifyAccount({ params }) {
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    // এখানে API কল হবে: /api/auth/verify/${params.token}
    // সিমুলেশন:
    setTimeout(() => setStatus('success'), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-4 bg-white/5 p-10 rounded-2xl border border-white/10">
        
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
            <h2 className="text-white text-xl font-bold">Verifying...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-white text-xl font-bold">Account Activated!</h2>
            <p className="text-gray-400">You can now access the dashboard.</p>
            <Link href="/auth/login" className="inline-block px-6 py-2 bg-cyan-600 text-white rounded-lg mt-4">
              Login Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-white text-xl font-bold">Verification Failed</h2>
            <p className="text-gray-400">Token invalid or expired.</p>
          </>
        )}

      </div>
    </div>
  );
}