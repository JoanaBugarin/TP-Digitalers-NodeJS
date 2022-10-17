const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema(
    {
        nickname: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    },
    { versionKey: false }
)

module.exports = mongoose.model("User", userSchema)