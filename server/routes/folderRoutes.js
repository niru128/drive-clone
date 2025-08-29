import express from 'express';
import Folder from '../models/Folder.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

//create folder
router.post('/', auth, async (req, res) => {

    try{

        const { name, parentFolder } = req.body;

        if(!name){
            return res.status(400).json({message : 'Folder name is required'});
        }

        const ancestors = []

        if(parentFolder){
            const parent = await Folder.findOne({_id : parentFolder, user : req.user._id});
            if(!parent){
                return res.status(400).json({message : 'Parent folder not found'});
            }
            ancestors = [...(parent.ancestors || []), parent._id];
        }

        const folder = new Folder({
            name,
            user : req.user._id,
            parentFolder : parentFolder || null,
            ancestors
        })

        await folder.save();
        res.status(201).json(folder);


    }catch(error){
        console.error(error);
        res.status(500).json({message : 'Server error'});
    }

})


//Get root folders
router.get('/', auth, async (req, res) => {

    try{

        const parentFolder = req.query.parentFolder || null;
        const query = {user : req.user._id, parentFolder : parentFolder === 'null' ? null : parentFolder};
        const folders = await Folder.find(query).sort({createdAt : -1});
        res.status(200).json(folders);

    }catch(error){
        console.error(error);
        res.status(500).json({message : 'Server error'});
    }

})

//get full path of a folder

router.get('/tree/:id', auth, async (req, res) => {
    try{

        const all = await Folder.find({user : req.user._id}).lean();
        const map = {}
        all.forEach(f => {map[f._id] = {...f, children : []}});

        const root = [];
        all.forEach(f => {
            if(f.parentFolder){
                map[f.parentFolder]?.children.push(map[f._id]);
            }else{
                root.push(map[f._id]);
            }
        })

        res.status(200).json(root);

    }catch(error){
        console.error(error);
        res.status(500).json({message : 'Server error'});
    }
})

export default router;