import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';

const { v2: cloudinaryV2 } = cloudinary;

export default {
  init(config: any) {
    cloudinaryV2.config({
      cloud_name: config.providerOptions.cloud_name,
      api_key: config.providerOptions.api_key,
      api_secret: config.providerOptions.api_secret,
      secure: true,
    });

    return {
      upload(file: any) {
        return new Promise<void>(async (resolve, reject) => {
          try {
            // Upload to Cloudinary first
            const uploadToCloudinary =
              (): Promise<cloudinary.UploadApiResponse> => {
                return new Promise((uploadResolve, uploadReject) => {
                  const uploadStream = cloudinaryV2.uploader.upload_stream(
                    {
                      folder: 'strapi_uploads',
                      resource_type: 'auto',
                    },
                    (error, result) => {
                      if (error) return uploadReject(error);
                      if (!result)
                        return uploadReject(
                          new Error('No result from Cloudinary')
                        );
                      uploadResolve(result);
                    }
                  );

                  if (file.buffer) {
                    streamifier
                      .createReadStream(file.buffer)
                      .pipe(uploadStream);
                  } else if (file.stream) {
                    file.stream.pipe(uploadStream);
                  } else {
                    uploadReject(
                      new Error('No buffer or stream available on file.')
                    );
                  }
                });
              };

            const cloudinaryResult = await uploadToCloudinary();

            // Set main file properties
            file.url = cloudinaryResult.secure_url;
            file.provider_metadata = {
              public_id: cloudinaryResult.public_id,
              resource_type: cloudinaryResult.resource_type,
              version: cloudinaryResult.version,
              signature: cloudinaryResult.signature,
            };

            // Generate Cloudinary URLs for different formats
            const generateCloudinaryUrl = (
              publicId: string,
              width: number,
              height?: number
            ) => {
              const options: any = {
                width,
                crop: 'limit',
                quality: 'auto',
                format: 'webp',
              };

              if (height) {
                options.height = height;
              }

              return cloudinaryV2.url(publicId, options);
            };

            // Set formats using Cloudinary transformations
            file.formats = {
              thumbnail: {
                url: generateCloudinaryUrl(
                  cloudinaryResult.public_id,
                  245,
                  156
                ),
                name: file.name,
                hash: file.hash,
                ext: path.extname(file.name),
                mime: file.mime,
                size: file.size,
                width: 245,
                height: 156,
                path: null,
              },
              small: {
                url: generateCloudinaryUrl(
                  cloudinaryResult.public_id,
                  500,
                  300
                ),
                name: file.name,
                hash: file.hash,
                ext: path.extname(file.name),
                mime: file.mime,
                size: file.size,
                width: 500,
                height: 300,
                path: null,
              },
              medium: {
                url: generateCloudinaryUrl(cloudinaryResult.public_id, 750),
                name: file.name,
                hash: file.hash,
                ext: path.extname(file.name),
                mime: file.mime,
                size: file.size,
                width: 750,
                height: null,
                path: null,
              },
              large: {
                url: generateCloudinaryUrl(cloudinaryResult.public_id, 1000),
                name: file.name,
                hash: file.hash,
                ext: path.extname(file.name),
                mime: file.mime,
                size: file.size,
                width: 1000,
                height: null,
                path: null,
              },
            };

            // Also save a local copy for admin panel if needed
            try {
              const ext = path.extname(file.name) || '.png';
              const fileName = `${file.hash}${ext}`;
              const publicDir = (strapi.dirs as any).public as string;
              const uploadsDir = path.join(publicDir, 'uploads');

              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const localPath = path.join(uploadsDir, fileName);

              if (file.buffer) {
                fs.writeFileSync(localPath, file.buffer);
                // Optionally set local URL as fallback for thumbnail
                file.formats.thumbnail.url = `/uploads/${fileName}`;
              }
            } catch (localError) {
              console.warn(
                'Local file save failed, using Cloudinary URLs only:',
                localError
              );
              // Continue with Cloudinary URLs only
            }

            resolve();
          } catch (error) {
            console.error('Upload failed:', error);
            reject(error);
          }
        });
      },

      async delete(file: any) {
        try {
          // Delete from Cloudinary
          const publicId = file.provider_metadata?.public_id;
          if (publicId) {
            await cloudinaryV2.uploader.destroy(publicId, {
              resource_type: file.provider_metadata?.resource_type || 'image',
            });
          }

          // Delete local file if it exists
          const ext = path.extname(file.name) || '.png';
          const fileName = `${file.hash}${ext}`;
          const publicDir = (strapi.dirs as any).public as string;
          const localPath = path.join(publicDir, 'uploads', fileName);

          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        } catch (err) {
          console.warn('Error during file deletion:', err);
        }
      },
    };
  },
};
