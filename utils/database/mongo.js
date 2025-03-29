const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('[✅] MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('[❎] MongoDB bağlantı hatası:', error);
    }
};

module.exports = connectMongo; 