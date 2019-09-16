const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const DB_URL = 'mongodb://localhost:27017/chat';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {
        type: String,
        default: "default.png"
    },
    isOnline: { type: Boolean, default: false },
    friends: {
        type: [{ name: String, image: String, id: String }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
    sendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
});

const userModel = mongoose.model('user', userSchema);

// register by email and password and username
exports.register = (req) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, { useNewUrlParser: true }).then(() => {
            return userModel.findOne({ email: req.body.email })
        }).then((user) => {
            if (user) {
                reject('E-Mail Already Used');
                mongoose.disconnect();
            }
            else {
                return bcrypt.hash(req.body.password, 10)
            }
        }).then((pass) => {
            var user = new userModel({ username: req.body.username, email: req.body.email, password: pass });
            return user.save();
        }).then((user) => {
            resolve(user);
            mongoose.disconnect();

        }).catch(err => {
            reject(err)
            mongoose.disconnect();
        });
    });
}

// login by email and password
exports.loging = (req) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, { useNewUrlParser: true }).then(() => {
            return userModel.findOne({ email: req.body.email })
        }).then((user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(same => {
                    if (!same) {
                        reject('Password Not Correct');
                        mongoose.disconnect();
                    }
                    else {
                        resolve({
                            user: user
                        });
                        mongoose.disconnect();
                    }
                }).catch((err) => {
                    reject('Password Not Correct');
                    mongoose.disconnect();
                })
            }
            else {
                reject('No User Matches this email');
                mongoose.disconnect();
            }
        }).catch((err) => {
            reject('Email or password not correct');
            mongoose.disconnect();
        })
    });
}


exports.getUser = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, { useNewUrlParser: true }).then(() => {
            return userModel.findOne({ _id: id })
        }).then((user) => {
            resolve(user);
            mongoose.disconnect();
        }).catch((err) => {
            reject(err);
            mongoose.disconnect();
        });
    });
}


exports.sendFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
        await userModel.updateOne({ _id: data.friendId }, {
            $push: {
                friendRequests: { name: data.myName, id: data.myId }
            }
        })
        await userModel.updateOne({ _id: data.myId }, {
            $push: {
                sendRequests: { name: data.friendName, id: data.friendId }
            }
        })
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}
exports.cancelFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
        await userModel.updateOne({ _id: data.friendId }, {
            $pull: {
                friendRequests: { id: data.myId }
            }
        })
        await userModel.updateOne({ _id: data.myId }, {
            $pull: {
                sendRequests: { id: data.friendId }
            }
        })
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}
exports.rejectFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
        await userModel.updateOne({ _id: data.friendId }, {
            $pull: {
                sendRequests: { id: data.myId }
            }
        })
        await userModel.updateOne({ _id: data.myId }, {
            $pull: {
                friendRequests: { id: data.friendId }
            }
        })
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}
exports.acceptFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
        await userModel.updateOne({ _id: data.friendId }, {
            $pull: {
                sendRequests: { id: data.myId }
            }
        })
        await userModel.updateOne({ _id: data.myId }, {
            $pull: {
                friendRequests: { id: data.friendId }
            }
        })

        await userModel.updateOne({ _id: data.myId }, {
            $push: {
                friends: { name: data.friendName, id: data.friendId, image: data.friendImage }
            }
        })
        await userModel.updateOne({ _id: data.friendId }, {
            $push: {
                friends: { name: data.myName, id: data.myId, image: data.myImage }
            }
        })
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}
exports.deleteFriend = async (data) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })

        await userModel.updateOne({ _id: data.myId }, {
            $pull: {
                friends: { id: data.friendId }
            }
        })
        await userModel.updateOne({ _id: data.friendId }, {
            $pull: {
                friends: { id: data.myId }
            }
        })
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}

exports.getFriendRequests = async (id) => {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true })
        let data = await userModel.findById(id, {friendRequests: true})
        mongoose.disconnect();
        return data;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }

}
