/**
 * License verification system
 * Checks if the application has a valid license
 */

const LICENSE_CHECK_URL = process.env.LICENSE_SERVER_URL || 'https://your-license-server.com/api/verify';
const LICENSE_KEY = process.env.LICENSE_KEY;
const APP_ID = process.env.APP_ID || 'bonus-galaxy-kjk100';

interface LicenseStatus {
  valid: boolean;
  expiresAt?: string;
  message?: string;
}

let lastCheck: Date | null = null;
let cachedStatus: LicenseStatus | null = null;
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export async function verifyLicense(): Promise<LicenseStatus> {
  // Skip in development
  if (process.env.NODE_ENV === 'development') {
    return { valid: true, message: 'Development mode' };
  }

  // Use cached result if recent
  if (lastCheck && cachedStatus && (Date.now() - lastCheck.getTime() < CHECK_INTERVAL)) {
    return cachedStatus;
  }

  try {
    if (!LICENSE_KEY) {
      return { valid: false, message: 'No license key configured' };
    }

    const response = await fetch(LICENSE_CHECK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenseKey: LICENSE_KEY,
        appId: APP_ID,
        domain: process.env.NEXT_PUBLIC_APP_URL,
      }),
    });

    if (!response.ok) {
      return { valid: false, message: 'License verification failed' };
    }

    const data = await response.json();
    
    lastCheck = new Date();
    cachedStatus = data;
    
    return data;
  } catch (error) {
    console.error('License check error:', error);
    // Allow operation if check fails (network issues)
    return cachedStatus || { valid: true, message: 'Check failed, using cached status' };
  }
}

export async function requireValidLicense() {
  const status = await verifyLicense();
  
  if (!status.valid) {
    throw new Error(`License invalid: ${status.message}`);
  }
  
  return status;
}
