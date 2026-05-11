const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const backendRoot = path.resolve(__dirname, '..');
const databasePath = path.join(backendRoot, 'database.sqlite');
const sampleDir = path.join(backendRoot, 'sample-materials');
const uploadDir = path.join(backendRoot, 'uploads');

const now = () => {
  const date = new Date();
  const pad = (value, size = 2) => String(value).padStart(size, '0');
  return [
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`,
    '+00:00',
  ].join(' ');
};

const freeMaterials = [
  {
    filename: 'free-politics-basic-checklist.pdf',
    title: '考研政治入门复习清单',
    description: '适合刚开始准备考研政治的同学，整理基础阶段每周要做的任务。',
    category: 'politics',
    tags: ['政治', '免费资料', '入门'],
  },
  {
    filename: 'free-english-reading-starter.pdf',
    title: '考研英语阅读长难句入门',
    description: '用简单例句说明考研英语长难句的拆解方法，适合免费预览和新手练习。',
    category: 'english',
    tags: ['英语', '阅读', '免费资料'],
  },
  {
    filename: 'free-math-formula-card.pdf',
    title: '高等数学常用公式卡片',
    description: '整理高数基础阶段最常用的公式，适合作为免费资料吸引用户进入平台。',
    category: 'math',
    tags: ['数学', '公式', '免费资料'],
  },
  {
    filename: 'free-major-course-planning-template.docx',
    title: '专业课复习计划模板',
    description: '可编辑的专业课复习计划 DOCX 模板，适合作为免费资料下载使用。',
    category: 'professional',
    tags: ['专业课', '计划', '免费资料'],
  },
];

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

async function ensureSeedAuthor(db) {
  const existing = await get(db, 'SELECT id FROM users WHERE email = ?', [
    'free@learnx.local',
  ]);
  if (existing) {
    return existing.id;
  }

  const timestamp = now();
  const password = bcrypt.hashSync('123456', 10);
  const result = await run(
    db,
    'INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [
      'free@learnx.local',
      password,
      'LearnX 免费资料库',
      'admin',
      timestamp,
      timestamp,
    ]
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

async function seedMaterial(db, item, authorId) {
  const source = path.join(sampleDir, item.filename);
  const target = path.join(uploadDir, item.filename);

  if (!fs.existsSync(source)) {
    throw new Error(`缺少样例文件：${source}`);
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  fs.copyFileSync(source, target);

  const timestamp = now();
  const fileUrl = `/uploads/${item.filename}`;
  const existing = await get(db, 'SELECT id FROM materials WHERE fileUrl = ?', [
    fileUrl,
  ]);

  let materialId;
  if (existing) {
    materialId = existing.id;
    await run(
      db,
      'UPDATE materials SET title = ?, description = ?, category = ?, price = ?, authorId = ?, status = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
      [
        item.title,
        item.description,
        item.category,
        0,
        authorId,
        'approved',
        timestamp,
        timestamp,
        materialId,
      ]
    );
  } else {
    const result = await run(
      db,
      'INSERT INTO materials (title, description, fileUrl, thumbnailUrl, category, price, authorId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        item.title,
        item.description,
        fileUrl,
        null,
        item.category,
        0,
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
      'INSERT OR IGNORE INTO material_tags (materialId, tagId) VALUES (?, ?)',
      [materialId, tagId]
    );
  }
}

async function main() {
  const db = new sqlite3.Database(databasePath);
  try {
    const authorId = await ensureSeedAuthor(db);
    for (const item of freeMaterials) {
      await seedMaterial(db, item, authorId);
    }
    console.log(`已导入 ${freeMaterials.length} 份免费真实资料`);
  } finally {
    db.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
