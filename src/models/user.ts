import mongoose,{Document, Model, Schema} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    salt: string;
    id: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true
    }
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;