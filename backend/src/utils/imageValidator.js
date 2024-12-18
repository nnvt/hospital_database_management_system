const fs = require("fs");

const TYPE_IMAGE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
};

const MAX_SIZE_PICTURE_GALLERY = 5 * 1024 * 1024; // 5MB
const MAX_SIZE_PICTURE_PROFILE = 5 * 1024 * 1024; // 5MB
const MIN_SIZE_PICTURE = 0;

const deleteImage = (path) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path);
    }
};


const fileFilter = (req, file, cb) => {
    if (!TYPE_IMAGE.hasOwnProperty(file.mimetype)) {
        cb("Invalid file type, only jpeg, jpg or png are allowed!");
    } else {
        cb(null, true);
    }
};

const fileSizeFilter = (profile, gallery) => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof profile !== 'undefined') {
                if (profile[0].size > MAX_SIZE_PICTURE_PROFILE) {
                    reject(new Error(`The image specified for profile <${profile[0].originalname}> is too large!`));
                } else if (profile[0].size < MIN_SIZE_PICTURE) {
                    reject(new Error(`The image specified for profile <${profile[0].originalname}> is too small!`));
                }
            }
            if (typeof gallery !== 'undefined') {
                gallery.forEach(file => {
                    if (file.size > MAX_SIZE_PICTURE_GALLERY) {
                        reject(new Error(`The image specified for gallery <${file.originalname}> is too large!`));
                    } else if (file.size < MIN_SIZE_PICTURE) {
                        reject(new Error(`The image specified for gallery <${file.originalname}> is too small!`));
                    }
                });
            }
            resolve();
        } catch (e) {
            reject(new Error("An error occurred while validating picture sizes. Please try again later!"));
        }
    });
};

module.exports = {
    fileFilter,
    fileSizeFilter,
    deleteImage
};
