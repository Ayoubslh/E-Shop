const { v2: cloudinary } = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'djmvglw9e', 
    api_key: '913778382443568', 
    api_secret: 'BBJZMZ60gkXxN40K5nN8r3eT01Q' 
});
    
const uploadImage = async (fileBuffer, options = {}) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: options.folder || 'uploads',
                    overwrite: true,
                    ...options
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Image uploaded successfully to:', result.secure_url);
                        // Return the full result object which contains secure_url, public_id, etc.
                        resolve(result);
                    }
                }
            ).end(fileBuffer);
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
    }
};

module.exports = { uploadImage };
