const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const cloudinary = require('../config/cloudinary.config');

// Multer stores the uploaded file temporarily in memory
const upload = multer({
    storage: multer.memoryStorage()
});


// ===============================
// Upload File
// ===============================

router.post('/upload-file', upload.single('file'), async (req, res) => {

    try {

        // Check if file was selected
        if (!req.file) {
            return res.status(400).send('Please select a file');
        }


        // ===============================
        // Create safe file name
        // ===============================

        const parsedName = path.parse(req.file.originalname);

        const safeName = parsedName.name
            .replace(/[^a-zA-Z0-9_-]/g, '-');

        // Do NOT add .pdf / .jpg etc. here
        const publicId = `${safeName || 'file'}-${Date.now()}`;


        // ===============================
        // Decide Cloudinary resource type
        // ===============================

        let resourceType = 'raw';

        // Images → image
        if (req.file.mimetype.startsWith('image/')) {
            resourceType = 'image';
        }


        console.log('Original file:', req.file.originalname);
        console.log('MIME type:', req.file.mimetype);
        console.log('Resource type:', resourceType);


        // ===============================
        // Upload to Cloudinary
        // ===============================

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'google-drive-clone',
                    public_id: publicId
                },

                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );


            // Send file buffer to Cloudinary
            stream.end(req.file.buffer);

        });


        // ===============================
        // Upload successful
        // ===============================

        console.log('File uploaded to Cloudinary');
        console.log('Cloudinary URL:', result.secure_url);
        console.log('Public ID:', result.public_id);


        // ===============================
        // Response
        // ===============================

        res.json({
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            url: result.secure_url,
            uploadedAt: new Date().toISOString()
        });


    } catch (error) {

        // ===============================
        // Error handling
        // ===============================

        console.error('Cloudinary upload error:', error);

        res.status(500).json({
            message: 'File upload failed',
            error: error.message
        });

    }

});


module.exports = router;