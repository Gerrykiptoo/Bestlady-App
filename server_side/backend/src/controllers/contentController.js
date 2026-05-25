const { Content, User } = require('../models');

// Slugify helper
const toSlug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/content/:type — public list (published only)
exports.listByType = async (req, res) => {
  try {
    const { type } = req.params;
    const where = { type, is_published: true };
    const items = await Content.findAll({
      where,
      include: [{ model: User, as: 'Author', attributes: ['username', 'business_name'] }],
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch content' });
  }
};

// GET /api/content/blog/:slug — public single blog post
exports.getBySlug = async (req, res) => {
  try {
    const item = await Content.findOne({
      where: { slug: req.params.slug, type: 'blog', is_published: true },
      include: [{ model: User, as: 'Author', attributes: ['username', 'business_name'] }]
    });
    if (!item) return res.status(404).json({ message: 'Post not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// GET /api/content/staff/:type — staff sees ALL (including drafts)
exports.listAllByType = async (req, res) => {
  try {
    const { type } = req.params;
    const items = await Content.findAll({
      where: { type },
      include: [{ model: User, as: 'Author', attributes: ['username', 'business_name'] }],
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch content' });
  }
};

// POST /api/content — staff create
exports.create = async (req, res) => {
  try {
    const { type, title, body, is_published, sort_order } = req.body;
    let slug = null;
    if (type === 'blog' && title) {
      const base = toSlug(title);
      slug = base;
      let count = 1;
      while (await Content.findOne({ where: { slug } })) {
        slug = `${base}-${count++}`;
      }
    }
    const item = await Content.create({
      type, title, slug, body,
      is_published: !!is_published,
      sort_order: sort_order || 0,
      author_id: req.user.id
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create content' });
  }
};

// PUT /api/content/:id — staff update
exports.update = async (req, res) => {
  try {
    const item = await Content.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    const { title, body, is_published, sort_order } = req.body;
    if (title !== undefined) {
      item.title = title;
      if (item.type === 'blog') {
        const base = toSlug(title);
        let slug = base;
        let count = 1;
        while (await Content.findOne({ where: { slug, id: { [require('sequelize').Op.ne]: item.id } } })) {
          slug = `${base}-${count++}`;
        }
        item.slug = slug;
      }
    }
    if (body !== undefined) item.body = body;
    if (is_published !== undefined) item.is_published = !!is_published;
    if (sort_order !== undefined) item.sort_order = sort_order;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update content' });
  }
};

// DELETE /api/content/:id — staff/admin delete
exports.remove = async (req, res) => {
  try {
    const item = await Content.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete content' });
  }
};
