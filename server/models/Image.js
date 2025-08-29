import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },

    mimetype: { type: String },
    size: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }
},{timestamps:true});

const Image = mongoose.model('Image', imageSchema);
export default Image;