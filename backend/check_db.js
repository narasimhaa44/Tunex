const mongoose = require('mongoose');
require('dotenv').config();
const Album = require('./models/Album');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/tunexauth';

mongoose.connect(MONGO)
  .then(async () => {
    console.log('Connected to DB');
    const count = await Album.countDocuments();
    const albums = await Album.find({}, 'title');
    console.log(`Album count: ${count}`);
    console.log('Albums:', albums);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
