/**
 * Simple kill switch using environment variable
 * Set DISABLE_APP=true in Vercel to disable the application
 */

export function checkKillSwitch() {
  if (process.env.DISABLE_APP === 'true') {
    return {
      disabled: true,
      message: process.env.DISABLE_MESSAGE || 'Application is currently disabled. Please contact support.',
    };
  }
  
  return { disabled: false };
}

export function requireAppEnabled() {
  const status = checkKillSwitch();
  
  if (status.disabled) {
    throw new Error(status.message);
  }
}
