import { Material } from '../models/material.model';
import { Tag } from '../models/tag.model';
import { User } from '../models/user.model';

export const authorsService = {
  getPublicProfile: async (id: string) => {
    const authorId = Number(id);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      throw new Error('作者编号无效');
    }

    const author = await User.findByPk(authorId, {
      attributes: ['id', 'name', 'role', 'createdAt']
    });

    if (!author) {
      throw new Error('作者不存在');
    }

    const materials = await Material.findAll({
      where: {
        authorId,
        status: 'approved'
      },
      include: [
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      author,
      materials,
      materialCount: materials.length
    };
  }
};
