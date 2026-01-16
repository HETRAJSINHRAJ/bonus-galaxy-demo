import bcrypt from 'bcryptjs';

/**
 * PIN Management Utilities
 * Handles secure PIN hashing, verification, and validation
 */

const SALT_ROUNDS = 10;
const MAX_PIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Hash a PIN for secure storage
 */
export async function hashPin(pin: string): Promise<string> {
  if (!isValidPin(pin)) {
    throw new Error('Invalid PIN format. Must be 4-6 digits.');
  }
  return bcrypt.hash(pin, SALT_ROUNDS);
}

/**
 * Verify a PIN against its hash
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}

/**
 * Validate PIN format (4-6 digits)
 */
export function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

/**
 * Generate a random 4-digit PIN
 */
export function generateRandomPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Check if employee is locked out due to failed attempts
 */
export function isEmployeeLocked(lockUntil: Date | null): boolean {
  if (!lockUntil) return false;
  return new Date() < lockUntil;
}

/**
 * Calculate lockout expiry time
 */
export function calculateLockoutExpiry(): Date {
  const now = new Date();
  return new Date(now.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
}

/**
 * Get remaining lockout time in minutes
 */
export function getRemainingLockoutTime(lockUntil: Date): number {
  const now = new Date();
  const diff = lockUntil.getTime() - now.getTime();
  return Math.ceil(diff / (60 * 1000));
}

export const PIN_CONFIG = {
  MAX_ATTEMPTS: MAX_PIN_ATTEMPTS,
  LOCKOUT_DURATION_MINUTES,
  MIN_LENGTH: 4,
  MAX_LENGTH: 6,
};
