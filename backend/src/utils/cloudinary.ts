import { v2 as cloudinary } from 'cloudinary';
import { config } from '@/config';

let isConfigured = false;

const configureCloudinary = () => {
  if (isConfigured) return;

  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.warn('Cloudinary is not fully configured. Uploads will not work until credentials are provided.');
    return;
  }

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  isConfigured = true;
};

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
}

export const uploadImage = async (filePath: string, options: Record<string, any> = {}): Promise<UploadResult> => {
  configureCloudinary();

  if (!isConfigured) {
    throw new Error('Cloudinary credentials are missing');
  }

  const uploadOptions = {
    folder: config.cloudinary.folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...options,
  };

  const result = await cloudinary.uploader.upload(filePath, uploadOptions);

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};
