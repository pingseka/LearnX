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
  {
    filename: 'politics-marxism-map.pdf',
    sourceFilename: 'free-politics-basic-checklist.pdf',
    title: '马克思主义原理框架图',
    description: '按章节梳理马原核心概念、易混点和选择题常见问法。',
    category: 'politics',
    price: 5.9,
    authorEmail: 'author@learnx.local',
    tags: ['政治', '马原', '框架'],
  },
  {
    filename: 'politics-mao-review-notes.pdf',
    sourceFilename: 'free-politics-basic-checklist.pdf',
    title: '毛中特高频考点速记',
    description: '整理毛中特高频表述、会议节点和材料分析题答题角度。',
    category: 'politics',
    price: 7.9,
    authorEmail: 'author@learnx.local',
    tags: ['政治', '毛中特', '考点'],
  },
  {
    filename: 'politics-current-affairs-free.pdf',
    sourceFilename: 'free-politics-basic-checklist.pdf',
    title: '政治时政月度梳理',
    description: '适合碎片时间浏览的时政关键词和热点主题清单。',
    category: 'politics',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['政治', '时政', '免费资料'],
  },
  {
    filename: 'politics-analysis-template.pdf',
    sourceFilename: 'free-politics-basic-checklist.pdf',
    title: '政治分析题万能模板',
    description: '按题型拆解分析题作答结构，帮助建立稳定答题格式。',
    category: 'politics',
    price: 9.9,
    authorEmail: 'author@learnx.local',
    tags: ['政治', '分析题', '模板'],
  },
  {
    filename: 'english-cloze-skills.pdf',
    sourceFilename: 'free-english-reading-starter.pdf',
    title: '英语完形填空技巧讲义',
    description: '覆盖词义辨析、逻辑关系、固定搭配和真题训练方法。',
    category: 'english',
    price: 6.9,
    authorEmail: 'author@learnx.local',
    tags: ['英语', '完形', '技巧'],
  },
  {
    filename: 'english-writing-template.pdf',
    sourceFilename: 'free-english-reading-starter.pdf',
    title: '考研英语作文模板合集',
    description: '包含大小作文常用句式、图表描述和高频主题表达。',
    category: 'english',
    price: 8.8,
    authorEmail: 'author@learnx.local',
    tags: ['英语', '作文', '模板'],
  },
  {
    filename: 'english-translation-free.pdf',
    sourceFilename: 'free-english-reading-starter.pdf',
    title: '翻译基础句法练习',
    description: '用短句训练定语从句、状语从句和非谓语结构的翻译顺序。',
    category: 'english',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['英语', '翻译', '免费资料'],
  },
  {
    filename: 'english-vocabulary-5500.pdf',
    sourceFilename: 'free-english-reading-starter.pdf',
    title: '核心词汇 5500 高频表',
    description: '按真题频次和词根词缀整理，适合背诵和复盘。',
    category: 'english',
    price: 4.9,
    authorEmail: 'author@learnx.local',
    tags: ['英语', '词汇', '付费资料'],
  },
  {
    filename: 'math-linear-algebra-map.pdf',
    sourceFilename: 'free-math-formula-card.pdf',
    title: '线性代数知识网络图',
    description: '串联矩阵、向量组、特征值和二次型的核心关系。',
    category: 'math',
    price: 6.6,
    authorEmail: 'author@learnx.local',
    tags: ['数学', '线代', '框架'],
  },
  {
    filename: 'math-probability-notes.pdf',
    sourceFilename: 'free-math-formula-card.pdf',
    title: '概率论常见题型笔记',
    description: '覆盖随机变量、分布函数、数字特征和大数定律题型。',
    category: 'math',
    price: 7.6,
    authorEmail: 'author@learnx.local',
    tags: ['数学', '概率论', '题型'],
  },
  {
    filename: 'math-calculus-free.pdf',
    sourceFilename: 'free-math-formula-card.pdf',
    title: '高数基础计算训练',
    description: '精选极限、导数、积分基础训练题，适合入门阶段自测。',
    category: 'math',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['数学', '高数', '免费资料'],
  },
  {
    filename: 'math-proof-sprint.pdf',
    sourceFilename: 'free-math-formula-card.pdf',
    title: '数学证明题冲刺清单',
    description: '整理常见证明思路、关键引理和真题迁移方向。',
    category: 'math',
    price: 11.8,
    authorEmail: 'author@learnx.local',
    tags: ['数学', '证明题', '冲刺'],
  },
  {
    filename: 'professional-408-os-notes.pdf',
    sourceFilename: 'free-major-course-planning-template.docx',
    title: '408 操作系统核心笔记',
    description: '覆盖进程管理、内存管理、文件系统和 I/O 高频考点。',
    category: 'professional',
    price: 13.9,
    authorEmail: 'author@learnx.local',
    tags: ['专业课', '408', '操作系统'],
  },
  {
    filename: 'professional-408-network-map.pdf',
    sourceFilename: 'free-major-course-planning-template.docx',
    title: '408 计算机网络分层速记',
    description: '按网络分层整理协议、设备、地址和典型计算题。',
    category: 'professional',
    price: 12.9,
    authorEmail: 'author@learnx.local',
    tags: ['专业课', '408', '计网'],
  },
  {
    filename: 'professional-data-structure-free.docx',
    sourceFilename: 'free-major-course-planning-template.docx',
    title: '数据结构复习计划表',
    description: '按周安排线性表、树、图、查找和排序的复习任务。',
    category: 'professional',
    price: 0,
    authorEmail: '123@qq.com',
    tags: ['专业课', '数据结构', '免费资料'],
  },
  {
    filename: 'professional-education-template.docx',
    sourceFilename: 'free-major-course-planning-template.docx',
    title: '教育学专业课背诵模板',
    description: '适合教育学、心理学等文科专业课的名词解释和简答题模板。',
    category: 'professional',
    price: 9.6,
    authorEmail: 'author@learnx.local',
    tags: ['专业课', '背诵', '模板'],
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
