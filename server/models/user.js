const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['email', '_id']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'1234asdfsecret').toString();

    user.tokens = user.tokens.concat([{
        access: access,
        token: token
    }]);
    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.removeToken = function() {
    var user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function() {
    User = this;
    var decoded;

    try {
        decoded = jws.verify(token, '1234asdfsecret')
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }
};

UserSchema.statics.findByCredentials = function(email, password) {
    User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((reslove, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            brypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema);
module.exports = {User};