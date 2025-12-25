// scripts/createAlbumAndAttach.js (node script)
const mongoose = require('mongoose');
const Song = require('../models/Song');
const Album = require('../models/Album');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const album = await Album.create({ title: 'Movie Name', coverUrl: 'https://...'} );
  // find songs by some criteria or specify IDs list
  const songs = await Song.find({ title: /some pattern/i }).limit(50);
  for (const s of songs) {
    s.album = album._id;
    await s.save();
    album.songs.push(s._id);
  }
  await album.save();
  console.log('Done', album._id);
  process.exit();
}
run().catch(console.error);
