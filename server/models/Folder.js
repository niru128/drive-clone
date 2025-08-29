import mongoose from "mongoose";

const folderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null,
    },
    ancestors: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
        },
    ],
}, { timestamps: true }); 

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
