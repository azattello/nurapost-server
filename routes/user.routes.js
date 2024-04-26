const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Роут для получения всех пользователей с пагинацией и сортировкой по дате создания
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const users = await User.find()
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .skip(startIndex);

    const totalCount = await User.countDocuments();

    const response = {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      users
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
