import { hashPassword, comparePassword } from '../../src/utils/password';

describe('password utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'test123456';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(10);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'test123456';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'test123456';
      const hashed = await hashPassword(password);
      
      const result = await comparePassword(password, hashed);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'test123456';
      const wrongPassword = 'wrongpassword';
      const hashed = await hashPassword(password);
      
      const result = await comparePassword(wrongPassword, hashed);
      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'test123456';
      const hashed = await hashPassword(password);
      
      const result = await comparePassword('', hashed);
      expect(result).toBe(false);
    });
  });
});