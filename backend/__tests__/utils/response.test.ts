import { success, error } from '../../src/utils/response';

describe('response utilities', () => {
  describe('success', () => {
    it('should return success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = success(data);

      expect(result).toEqual({
        code: 0,
        data,
        msg: 'success'
      });
    });

    it('should return success response with custom message', () => {
      const data = { id: 1, name: 'Test' };
      const result = success(data, 'Custom message');

      expect(result).toEqual({
        code: 0,
        data,
        msg: 'Custom message'
      });
    });

    it('should return success response with null data', () => {
      const result = success(null);

      expect(result).toEqual({
        code: 0,
        data: null,
        msg: 'success'
      });
    });
  });

  describe('error', () => {
    it('should return error response with message', () => {
      const result = error('Error message');

      expect(result).toEqual({
        code: 1,
        data: null,
        msg: 'Error message'
      });
    });

    it('should return error response with empty message', () => {
      const result = error('');

      expect(result).toEqual({
        code: 1,
        data: null,
        msg: ''
      });
    });
  });
});