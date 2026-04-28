import { materialsService } from '../../src/services/materials.service';

jest.mock('../../src/models/material.model', () => ({
  Material: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn()
  }
}));

jest.mock('../../src/models/tag.model', () => ({
  Tag: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  MaterialTag: {
    create: jest.fn(),
    destroy: jest.fn()
  }
}));

const { Material } = require('../../src/models/material.model');

describe('materialsService getAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all materials with pagination', async () => {
    const mockMaterials = [
      { id: 1, title: 'Material 1', author: {}, tags: [] },
      { id: 2, title: 'Material 2', author: {}, tags: [] }
    ];

    (Material.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 10,
      rows: mockMaterials
    });

    const result = await materialsService.getAll(1, 2);

    expect(Material.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      include: expect.any(Array),
      limit: 2,
      offset: 0,
      order: [['createdAt', 'DESC']]
    });
    expect(result.materials).toHaveLength(2);
    expect(result.total).toBe(10);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.pages).toBe(5);
  });

  it('should filter materials by category', async () => {
    (Material.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 2,
      rows: [{ id: 1, title: 'Book', category: 'books' }]
    });

    await materialsService.getAll(1, 10, 'books');

    expect(Material.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: 'books' })
      })
    );
  });

  it('should search materials by title or description', async () => {
    (Material.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 1,
      rows: [{ id: 1, title: 'Search Result' }]
    });

    const result = await materialsService.getAll(1, 10, undefined, 'search term');

    expect(result.total).toBe(1);
    expect(Material.findAndCountAll).toHaveBeenCalled();
  });

  it('should return materials by author', async () => {
    (Material.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 3,
      rows: [{ id: 1, title: 'Author Material' }]
    });

    const result = await materialsService.getByAuthor('1', 1, 10);

    expect(Material.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { authorId: 1 }
      })
    );
    expect(result.total).toBe(3);
  });
});