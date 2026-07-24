const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const hashPass = async (password) => {
    return bcrypt.hash(password, 10);
};

const BaseUserSchema = mongoose.Schema({

 username: {
        type: String,
        lowercase: true
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [false, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },

    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    storageUsed:{
        type: String,
        required: false
    },
    
    lastLogin: {
        type: Date,
        default: Date.now,
        required: false
    },
    

    resetPasswordToken: {
        type: String
    },


    resetPasswordExpires: {
        type: Date
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})




const SecuritySchema = new mongoose.Schema({
  resetToken: String,
  resetTokenExpiry: Date,
  emailVerificationToken: String,
  emailVerified: { type: Boolean, default: false }
});

const UserSchema = mongoose.Schema({
   base: BaseUserSchema,
   security: SecuritySchema
  
});

UserSchema.pre('save', async function (next) {
    try {
        if ((this.base.password).isModified || this.isNew) {
            const ifAlreadyHashed = /^\$2[ayb]\$.{56}$/.test(this.base.password);

            if (!ifAlreadyHashed) {
                this.base.password = await hashPass(this.base.password)
            }
            next();

        }
    } catch (err) {
        next(err)
    }

})


UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour activer l'utilisateur
UserSchema.methods.activate = async function () {
    this.enabled = true;
    return this.save();
};



const User = mongoose.model('User', UserSchema);

module.exports = User;
