import { AlertTriangle } from 'lucide-react';

export default function LicenseExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">
            License Expired
          </h1>
          
          <p className="text-white/70 mb-6">
            This application's license has expired or is invalid. 
            Please contact your service provider to renew your license.
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-sm text-white/60 mb-2">Contact Information:</p>
            <p className="text-white font-mono text-sm">
              Email: your-email@example.com
            </p>
            <p className="text-white font-mono text-sm">
              Phone: +43 XXX XXX XXXX
            </p>
          </div>
          
          <p className="text-xs text-white/50">
            License ID: {process.env.NEXT_PUBLIC_APP_ID || 'Not configured'}
          </p>
        </div>
      </div>
    </div>
  );
}
