const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: {
        type: String,
        required: true,
        unique: true // Her sunucu için yalnızca bir kayıt olmasını sağlamak için
    },
    Channel: {
        type: String,
        required: true // Kanal alanı için gereklilik
    },
    UserLimit: {
        type: Number,
        default: 5,
        min: [1, 'Kullanıcı limiti en az 1 olmalıdır.'], // Minimum değer kontrolü
        max: [50, 'Kullanıcı limiti en fazla 50 olmalıdır.'] // Maksimum değer kontrolü
    },
    CreatedAt: {
        type: Date,
        default: Date.now // Oluşturulma tarihi
    },
    UpdatedAt: {
        type: Date,
        default: Date.now // Güncellenme tarihi
    }
});

// Güncellenme tarihini otomatik ayarlamak için bir ön kaydetme işlemi
Schema.pre('save', function(next) {
    this.UpdatedAt = Date.now(); // Her kaydedildiğinde güncellenme tarihini ayarlayın
    next();
});

module.exports = mongoose.model("JoinToCreate", Schema);
