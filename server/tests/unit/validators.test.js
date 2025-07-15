const { validateBugInput, validateUserInput } = require('../../src/utils/validators');

describe('Validators Unit Tests', () => {
  describe('validateBugInput', () => {
    it('should validate correct bug input', () => {
      const input = {
        title: 'Valid Bug Title',
        description: 'This is a valid description for the bug',
      };
      const result = validateBugInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject missing title', () => {
      const input = {
        description: 'This is a valid description',
      };
      const result = validateBugInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be at least 3 characters long');
    });

    it('should reject short description', () => {
      const input = {
        title: 'Valid Title',
        description: 'Short',
      };
      const result = validateBugInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be at least 10 characters long');
    });

    it('should reject overly long title', () => {
      const input = {
        title: 'A'.repeat(101),
        description: 'Valid description here',
      };
      const result = validateBugInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title cannot exceed 100 characters');
    });
  });

  describe('validateUserInput', () => {
    it('should validate correct user input', () => {
      const input = {
        username: 'testuser',
        password: 'password123',
      };
      const result = validateUserInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject short username', () => {
      const input = {
        username: 'te',
        password: 'password123',
      };
      const result = validateUserInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Username must be at least 3 characters long');
    });

    it('should reject short password', () => {
      const input = {
        username: 'testuser',
        password: 'pass',
      };
      const result = validateUserInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });
  });
});
