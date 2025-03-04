import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },

    last_name: {
        type: String
    },

    email: {
        type: String,
        index: true,
        unique: true
    },

    age: {
        type: Number
    },

    password: {
        type: String
    },

    cart: { 
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        ref: 'carts',
        required: true
    },
    
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
})


const UserModel = mongoose.model("users", userSchema);

export default UserModel;