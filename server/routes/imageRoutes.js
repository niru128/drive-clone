import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../middleware/authMiddleware.js';
import Image from '../models/Image.js';
import Folder from '../models/Folder.js';
import fs from 'fs';

const router = express.Router();


const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir, { recursive: true });

    }
}

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        let dest;
        if (req.body.folder) {
           
            dest = path.resolve(_dirname, '..', 'uploads', String(req.user._id), req.body.folder);
        } else {
          
            dest = path.resolve(_dirname, '..', 'uploads', String(req.user._id));
        }

        ensureDirExists(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false);
    cb(null, true);
}


const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

//upload image
// upload image to a folder
router.post('/:folderId', auth, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const { folderId } = req.params;

    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    if (!name) return res.status(400).json({ message: 'Image name is required' });

    let folderRef = null;
    if (folderId !== 'null') {
      const f = await Folder.findOne({ _id: folderId, user: req.user._id });
      if (!f) return res.status(400).json({ message: 'Invalid folder' });
      folderRef = f._id;
    }

    const img = new Image({
      name,
      fileName: req.file.filename,
      path: path.relative(path.resolve(_dirname, '..', 'uploads'), req.file.path),
      mimetype: req.file.mimetype,
      size: req.file.size,
      user: req.user._id,
      folder: folderRef
    });

    await img.save();

    if (folderRef) {
      await Folder.findByIdAndUpdate(folderRef, { $push: { images: img._id } });
    }

    res.status(201).json(img);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


//list images
router.get('/', auth, async (req, res) => {

    try {

        const folder = req.query.folder || null;
        const query = { user: req.user._id };

        if (folder === null) query.folder = null;
        else if (folder) query.folder = folder;

        const images = await Image.find(query).sort({ createdAt: -1 });
        res.json(images);

    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }

})

//search 

router.get('/search', auth, async (req, res) => {
    try {

        const q = req.query.q || '';
        const regex = new RegExp(q, 'i');
        const images = await Image.find({ user: req.user._id, name: { $regex: regex } }).sort({ createdAt: -1 });
        res.json(images);

    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
})

export default router;