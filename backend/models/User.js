const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Har user ka email alag hoga
    },
    password: {
        type: String,
        required: true,
    },
    // Hum baad mein yahan role aur teamId bhi jodenge
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    }
}, {
    timestamps: true, // CreatedAt aur UpdatedAt time apne aap jud jaayega
});

// User ke save hone se PEHLE password ko hash karein
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;