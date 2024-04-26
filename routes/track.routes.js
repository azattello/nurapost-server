const express = require('express');
const router = express.Router();
const Track = require('../models/Track');
const { updateTrack, excelTrack } = require('../middleware/track.middleware');

router.post('/addTrack', updateTrack );

router.post('/addExcelTrack', excelTrack );

// Роут для получения всех трек-кодов с пагинацией и сортировкой
router.get('/tracks', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
  
    try {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const tracks = await Track.find()
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .skip(startIndex);
  
      const totalCount = await Track.countDocuments();
  
      const response = {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        tracks
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

module.exports = router;
