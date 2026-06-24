const Setting = require('../models/Setting');
const upload = require('../middleware/uploadMiddleware');

const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    await Setting.findOneAndUpdate(
      { key: 'hero-image' },
      { key: 'hero-image', value: imageUrl },
      { upsert: true, new: true }
    );
    res.json({ value: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSetting, updateHeroImage };