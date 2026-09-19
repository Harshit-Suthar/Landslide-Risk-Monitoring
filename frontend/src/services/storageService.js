import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET_NAME = 'incident-media';

// Allowed types and limits (50MB)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const storageService = {
  bucketName: BUCKET_NAME,

  /**
   * Upload an incident photo or video to Supabase Storage 'incident-media' bucket
   * @param {File} file - The image or video file
   * @param {string} folder - Sub-directory within bucket (e.g. 'reports', 'field-logs')
   * @returns {Promise<{path: string, publicUrl: string, mediaType: 'image'|'video'}>}
   */
  async uploadMedia(file, folder = 'reports') {
    if (!file) {
      throw new Error('Please select a file to upload');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('File size exceeds the 50MB limit');
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      throw new Error('Unsupported format. Please upload JPG, PNG, WEBP, MP4, or WEBM');
    }

    const mediaType = isVideo ? 'video' : 'image';

    // 1. Live Supabase Storage Upload
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}-${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: publicData.publicUrl,
        mediaType,
      };
    }

    // 2. Demo fallback preview
    const localUrl = URL.createObjectURL(file);
    return {
      path: `demo/${folder}/${file.name}`,
      publicUrl: localUrl,
      mediaType,
    };
  },

  /**
   * Get the public URL of a file in 'incident-media'
   * @param {string} path - Storage path within bucket
   * @returns {string}
   */
  getPublicUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
      return path;
    }

    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);
      return data?.publicUrl || '';
    }

    return path;
  },

  /**
   * Delete a file from 'incident-media'
   * @param {string} path - Storage path within bucket
   */
  async deleteMedia(path) {
    if (isSupabaseConfigured && supabase && path && !path.startsWith('blob:')) {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);
      if (error) {
        console.warn('Delete media failed:', error.message);
        throw error;
      }
      return true;
    }
    return true;
  },
};

export default storageService;
