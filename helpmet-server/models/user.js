const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [4, 'Minimum password length is 4 characters']
    },
    profilePicture: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/9-94702_user-outline-icon-clipart-png-download-profile-icon.png/593px-9-94702_user-outline-icon-clipart-png-download-profile-icon.png?20230806044655'
    }
});

// userSchema.post('save', function(doc, next) {
//     console.log('New user was created and saved', doc);
//     next();
// });

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
// module.exports = (connection) => connection.model('User', userSchema);