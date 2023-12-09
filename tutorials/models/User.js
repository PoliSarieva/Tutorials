const {Schema, model}= require('mongoose');

//TODO add USer properties and validation to assignment
const userSchema = new Schema({
    username: {
        type: String,
        minlength: [5, 'Username must be at least 5 characters'],
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    }
});

userSchema.index({username: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User;