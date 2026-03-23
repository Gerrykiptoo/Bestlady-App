const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let where = { is_active: true };

    if (category) {
      where.category_id = category;
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // Tier-aware pricing filter could be added here if needed

    const products = await Product.findAndCountAll({
      where,
      include: [Category],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort ? [[sort.split(':')[0], sort.split(':')[1]]] : [['createdAt', 'DESC']]
    });

    res.json({
      products: products.rows,
      total: products.count,
      pages: Math.ceil(products.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
