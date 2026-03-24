import { Material, MaterialTag } from '../models/material.model';
import { Tag } from '../models/tag.model';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

interface CreateMaterialData {
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  category: string;
  price: number;
  author: string;
  tags?: string[];
}

interface UpdateMaterialData {
  title?: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  price?: number;
  tags?: string[];
}

export const materialsService = {
  create: async (data: CreateMaterialData) => {
    // 创建素材
    const material = await Material.create({
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      category: data.category,
      price: data.price,
      authorId: Number(data.author)
    });

    // 处理标签
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        // 查找或创建标签
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        // 关联标签
        await MaterialTag.create({
          materialId: material.id,
          tagId: tag.id
        });
      }
    }

    // 重新获取包含标签的素材
    const materialWithTags = await Material.findByPk(material.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    return materialWithTags;
  },

  getAll: async (page: number = 1, limit: number = 10, category?: string, search?: string) => {
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Material.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      materials: rows,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    };
  },

  getById: async (id: string) => {
    const material = await Material.findByPk(Number(id), {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    if (!material) {
      throw new Error('素材不存在');
    }

    return material;
  },

  getByAuthor: async (authorId: string, page: number = 1, limit: number = 10) => {
    const { count, rows } = await Material.findAndCountAll({
      where: { authorId: Number(authorId) },
      include: [
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      materials: rows,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    };
  },

  update: async (id: string, data: UpdateMaterialData, authorId: string) => {
    const material = await Material.findByPk(Number(id));
    if (!material) {
      throw new Error('素材不存在');
    }
    
    // 检查权限
    if (material.authorId !== Number(authorId)) {
      throw new Error('无权限修改此素材');
    }
    
    // 更新素材
    await material.update({
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      category: data.category,
      price: data.price
    });

    // 处理标签
    if (data.tags) {
      // 删除旧标签关联
      await MaterialTag.destroy({ where: { materialId: material.id } });
      
      // 添加新标签
      for (const tagName of data.tags) {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        await MaterialTag.create({
          materialId: material.id,
          tagId: tag.id
        });
      }
    }

    // 重新获取包含标签的素材
    const updatedMaterial = await Material.findByPk(material.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    return updatedMaterial;
  },

  delete: async (id: string, authorId: string) => {
    const material = await Material.findByPk(Number(id));
    if (!material) {
      throw new Error('素材不存在');
    }
    
    // 检查权限
    if (material.authorId !== Number(authorId)) {
      throw new Error('无权限删除此素材');
    }
    
    // 删除标签关联
    await MaterialTag.destroy({ where: { materialId: material.id } });
    
    // 删除素材
    await material.destroy();
    
    return { message: '素材删除成功' };
  }
};