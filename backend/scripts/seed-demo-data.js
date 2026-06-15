const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const backendRoot = path.resolve(__dirname, '..');
const databasePath = path.resolve(
  backendRoot,
  process.env.DB_STORAGE || 'database.sqlite'
);
const sampleDir = path.join(backendRoot, 'sample-materials');
const uploadDir = path.resolve(backendRoot, process.env.UPLOAD_DIR || 'uploads');

const passwordHash = bcrypt.hashSync('123456', 10);

const users = [
  { email: '123@qq.com', name: '许正扬', role: 'admin' },
  { email: 'author@learnx.local', name: '陈思远', role: 'user' },
  { email: 'buyer@learnx.local', name: '李明轩', role: 'user' },
  { email: 'student@learnx.local', name: '王若宁', role: 'user' },
];

const materials = [
  {
    filename: 'free-politics-basic-checklist.pdf',
    title: '考研政治入门复习清单',
    description: '适合刚开始准备考研政治的同学，整理基础阶段每周要做的任务。',
    category: 'politics',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['政治', '免费资料', '入门'],
  },
  {
    filename: 'free-english-reading-starter.pdf',
    title: '考研英语阅读长难句入门',
    description: '用简单例句说明考研英语长难句的拆解方法，适合免费预览和新手练习。',
    category: 'english',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['英语', '阅读', '免费资料'],
  },
  {
    filename: 'free-math-formula-card.pdf',
    title: '高等数学常用公式卡片',
    description: '整理高数基础阶段最常用的公式，适合作为免费资料吸引用户进入平台。',
    category: 'math',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['数学', '公式', '免费资料'],
  },
  {
    filename: 'free-major-course-planning-template.docx',
    title: '专业课复习计划模板',
    description: '可编辑的专业课复习计划 DOCX 模板，适合作为免费资料下载使用。',
    category: 'professional',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['专业课', '计划', '免费资料'],
  },
  {
    filename: 'paid-english-reading-sprint.pdf',
    sourceFilename: 'free-english-reading-starter.pdf',
    title: '考研英语阅读冲刺讲义',
    description: '付费样例资料，用于验收购买、订单、下载权限和作者收益结算流程。',
    category: 'english',
    price: 9.9,
    authorEmail: 'author@learnx.local',
    tags: ['英语', '阅读', '付费资料'],
  },
  {
    filename: 'paid-math-formula-sprint.pdf',
    sourceFilename: 'free-math-formula-card.pdf',
    title: '高数公式速查与例题讲义',
    description: '付费样例资料，用于展示资料市场中的定价、购买、订单和作者收益流程。',
    category: 'math',
    price: 12.8,
    authorEmail: 'author@learnx.local',
    tags: ['数学', '公式', '付费资料'],
  },
];

const demoPurchases = [
  {
    buyerEmail: 'buyer@learnx.local',
    materialFile: '/uploads/paid-english-reading-sprint.pdf',
  },
  {
    buyerEmail: 'buyer@learnx.local',
    materialFile: '/uploads/paid-math-formula-sprint.pdf',
  },
  {
    buyerEmail: 'student@learnx.local',
    materialFile: '/uploads/paid-math-formula-sprint.pdf',
  },
];

function now() {
  const date = new Date();
  const pad = (value, size = 2) => String(value).padStart(size, '0');
  return [
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`,
    '+00:00',
  ].join(' ');
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

async function ensureUser(db, user) {
  const timestamp = now();
  const existing = await get(db, 'SELECT id FROM users WHERE email = ?', [
    user.email,
  ]);

  if (existing) {
    await run(
      db,
      'UPDATE users SET name = ?, role = ?, loginAttempts = 0, lockoutTime = NULL, updatedAt = ? WHERE id = ?',
      [user.name, user.role, timestamp, existing.id]
    );
    return existing.id;
  }

  const result = await run(
    db,
    'INSERT INTO users (email, password, name, role, loginAttempts, lockoutTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, 0, NULL, ?, ?)',
    [user.email, passwordHash, user.name, user.role, timestamp, timestamp]
  );
  return result.lastID;
}

async function ensureTag(db, name) {
  const existing = await get(db, 'SELECT id FROM tags WHERE name = ?', [name]);
  if (existing) {
    return existing.id;
  }

  const timestamp = now();
  const result = await run(
    db,
    'INSERT INTO tags (name, createdAt, updatedAt) VALUES (?, ?, ?)',
    [name, timestamp, timestamp]
  );
  return result.lastID;
}

async function seedMaterial(db, item, userIdsByEmail) {
  const source = path.join(sampleDir, item.sourceFilename || item.filename);
  const target = path.join(uploadDir, item.filename);

  if (!fs.existsSync(source)) {
    throw new Error(`缺少样例文件：${source}`);
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  fs.copyFileSync(source, target);

  const timestamp = now();
  const fileUrl = `/uploads/${item.filename}`;
  const authorId = userIdsByEmail.get(item.authorEmail);
  const existing = await get(db, 'SELECT id FROM materials WHERE fileUrl = ?', [
    fileUrl,
  ]);

  let materialId;
  if (existing) {
    materialId = existing.id;
    await run(
      db,
      'UPDATE materials SET title = ?, description = ?, category = ?, price = ?, authorId = ?, status = ?, updatedAt = ? WHERE id = ?',
      [
        item.title,
        item.description,
        item.category,
        item.price,
        authorId,
        'approved',
        timestamp,
        materialId,
      ]
    );
  } else {
    const result = await run(
      db,
      'INSERT INTO materials (title, description, fileUrl, thumbnailUrl, category, price, authorId, status, createdAt, updatedAt) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)',
      [
        item.title,
        item.description,
        fileUrl,
        item.category,
        item.price,
        authorId,
        'approved',
        timestamp,
        timestamp,
      ]
    );
    materialId = result.lastID;
  }

  await run(db, 'DELETE FROM material_tags WHERE materialId = ?', [materialId]);
  for (const tagName of item.tags) {
    const tagId = await ensureTag(db, tagName);
    await run(
      db,
      'INSERT INTO material_tags (materialId, tagId) VALUES (?, ?)',
      [materialId, tagId]
    );
  }

  return materialId;
}

async function ensureDemoOrder(db, buyerId, materialFile) {
  const material = await get(
    db,
    'SELECT id, price, authorId FROM materials WHERE fileUrl = ?',
    [materialFile]
  );
  if (!material) {
    throw new Error(`缺少付费演示资料，无法创建演示订单：${materialFile}`);
  }

  const existing = await get(
    db,
    `SELECT orders.id
     FROM orders
     JOIN order_items ON order_items.orderId = orders.id
     WHERE orders.buyerId = ? AND order_items.materialId = ? AND orders.status = 'completed'
     LIMIT 1`,
    [buyerId, material.id]
  );
  if (existing) {
    return existing.id;
  }

  const timestamp = now();
  const price = Number(material.price);
  const orderResult = await run(
    db,
    'INSERT INTO orders (buyerId, totalAmount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    [buyerId, price, 'completed', timestamp, timestamp]
  );

  await run(
    db,
    'INSERT INTO order_items (orderId, materialId, quantity, price, createdAt, updatedAt) VALUES (?, ?, 1, ?, ?, ?)',
    [orderResult.lastID, material.id, price, timestamp, timestamp]
  );

  await run(
    db,
    'INSERT INTO earnings (userId, amount, source, orderId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [
      material.authorId,
      Number((price * 0.9).toFixed(2)),
      'sale',
      orderResult.lastID,
      timestamp,
      timestamp,
    ]
  );

  return orderResult.lastID;
}

async function main() {
  const db = new sqlite3.Database(databasePath);
  try {
    const userIdsByEmail = new Map();
    for (const user of users) {
      userIdsByEmail.set(user.email, await ensureUser(db, user));
    }

    for (const item of materials) {
      await seedMaterial(db, item, userIdsByEmail);
    }

    const orderIds = [];
    for (const purchase of demoPurchases) {
      orderIds.push(
        await ensureDemoOrder(
          db,
          userIdsByEmail.get(purchase.buyerEmail),
          purchase.materialFile
        )
      );
    }

    console.log(
      `已导入 ${users.length} 个账号、${materials.length} 份资料、${orderIds.length} 笔演示订单，订单 ID：${orderIds.join(', ')}`
    );
  } finally {
    db.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
