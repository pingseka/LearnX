import { Earnings } from '../../src/models/earnings.model';
import { earningsService } from '../../src/services/earnings.service';

jest.mock('../../src/models/earnings.model');

describe('earningsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return earnings stats', async () => {
      (Earnings.sum as jest.Mock)
        .mockResolvedValueOnce(1000)  // total
        .mockResolvedValueOnce(100)   // weekly
        .mockResolvedValueOnce(500)   // monthly
        .mockResolvedValueOnce(1000); // yearly

      const result = await earningsService.getStats('1');

      expect(Earnings.sum).toHaveBeenCalledTimes(4);
      expect(result).toEqual({
        total: 1000,
        weekly: 100,
        monthly: 500,
        yearly: 1000
      });
    });

    it('should return zero when no earnings', async () => {
      (Earnings.sum as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const result = await earningsService.getStats('1');

      expect(result).toEqual({
        total: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
      });
    });
  });

  describe('getDetails', () => {
    it('should return earnings details with pagination', async () => {
      (Earnings.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 5,
        rows: [{ id: 1, amount: 100 }, { id: 2, amount: 200 }]
      });

      const result = await earningsService.getDetails('1', 1, 2);

      expect(Earnings.findAndCountAll).toHaveBeenCalled();
      expect(result.earnings).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
    });
  });
});