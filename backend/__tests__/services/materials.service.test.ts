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
const { Tag, MaterialTag } = require('../../src/models/tag.model');

describe('materialsService', () => {
  const mockMaterial = {
    id: 1,
    title: 'Test Material',
    description: 'Test Description',
    fileUrl: 'http://example.com/file.pdf',
    category: 'books',
    price: 100,
    authorId: 1,
    update: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true)
  };

  const mockTag = { id: 1, name: 'tag1' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create material successfully', async () => {
      (Material.create as jest.Mock).mockResolvedValue(mockMaterial);
      (Tag.findOne as jest.Mock).mockResolvedValue(null);
      (Tag.create as jest.Mock).mockResolvedValue(mockTag);
      (MaterialTag.create as jest.Mock).mockResolvedValue({});
      (Material.findByPk as jest.Mock).mockResolvedValue({
        ...mockMaterial,
        author: { id: 1, name: 'Author', email: 'author@example.com' },
        tags: [mockTag]
      });

      const result = await materialsService.create({
        title: 'Test Material',
        description: 'Test Description',
        fileUrl: 'http://example.com/file.pdf',
        category: 'books',
        price: 100,
        author: '1',
        tags: ['tag1']
      });

      expect(Material.create).toHaveBeenCalled();
      expect(Tag.create).toHaveBeenCalledWith({ name: 'tag1' });
      expect(MaterialTag.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should use existing tag if it exists', async () => {
      (Material.create as jest.Mock).mockResolvedValue(mockMaterial);
      (Tag.findOne as jest.Mock).mockResolvedValue(mockTag);
      (MaterialTag.create as jest.Mock).mockResolvedValue({});
      (Material.findByPk as jest.Mock).mockResolvedValue({
        ...mockMaterial,
        author: { id: 1, name: 'Author', email: 'author@example.com' },
        tags: [mockTag]
      });

      await materialsService.create({
        title: 'Test Material',
        description: 'Test Description',
        fileUrl: 'http://example.com/file.pdf',
        category: 'books',
        price: 100,
        author: '1',
        tags: ['tag1']
      });

      expect(Tag.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return material by id', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue({
        ...mockMaterial,
        author: { id: 1, name: 'Author', email: 'author@example.com' },
        tags: [mockTag]
      });

      const result = await materialsService.getById('1');

      expect(Material.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(result).toBeDefined();
    });

    it('should throw error if material not found', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(materialsService.getById('999')).rejects.toThrow('素材不存在');
    });
  });

  describe('update', () => {
    it('should update material successfully', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);
      (MaterialTag.destroy as jest.Mock).mockResolvedValue(1);
      (Tag.findOne as jest.Mock).mockResolvedValue(null);
      (Tag.create as jest.Mock).mockResolvedValue(mockTag);
      (MaterialTag.create as jest.Mock).mockResolvedValue({});
      (Material.findByPk as jest.Mock).mockResolvedValue({
        ...mockMaterial,
        author: { id: 1, name: 'Author', email: 'author@example.com' },
        tags: [mockTag]
      });

      const result = await materialsService.update('1', { title: 'Updated Title' }, '1');

      expect(mockMaterial.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error if material not found', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(materialsService.update('999', { title: 'Updated' }, '1')).rejects.toThrow('素材不存在');
    });

    it('should throw error if user has no permission', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);

      await expect(materialsService.update('1', { title: 'Updated' }, '2')).rejects.toThrow('无权限修改此素材');
    });
  });

  describe('delete', () => {
    it('should delete material successfully', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);
      (MaterialTag.destroy as jest.Mock).mockResolvedValue(1);

      const result = await materialsService.delete('1', '1');

      expect(MaterialTag.destroy).toHaveBeenCalled();
      expect(mockMaterial.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: '素材删除成功' });
    });

    it('should throw error if material not found', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(materialsService.delete('999', '1')).rejects.toThrow('素材不存在');
    });

    it('should throw error if user has no permission', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);

      await expect(materialsService.delete('1', '2')).rejects.toThrow('无权限删除此素材');
    });
  });
});