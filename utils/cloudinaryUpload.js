import { v2 as cloudinary } from 'cloudinary';



   
    cloudinary.config({ 
        cloud_name: 'djmvglw9e', 
        api_key: '913778382443568', 
        api_secret: 'BBJZMZ60gkXxN40K5nN8r3eT01Q' 
      });
    
 export const uploadImage = async (imagePath,id) => {
    try {
     const uploadResult = await cloudinary.uploader
       .upload(imagePath,{
              
                 public_id: id,
                    overwrite: true,}
       )
    
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
    }
}
