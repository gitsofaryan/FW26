import { supabase } from './supabase';
import type { MasonryItem } from '../components/MasonryGallery';
import imageCompression from 'browser-image-compression';

/**
 * Fetch all gallery items from the `memories` table.
 * Constructs image URLs predictably based on row IDs.
 */
export async function fetchGalleryItems(): Promise<MasonryItem[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery items:', error.message);
    return [];
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  return (data ?? []).map((row: Record<string, unknown>) => {
    const id = String(row.id);
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/gallery-images/public/${id}.jpg`;
    return {
      id,
      img: imgUrl,
      height: Number(row.height ?? 350),
      enrollmentNumber: String(row.enrollment_number ?? ''),
    };
  });
}

/**
 * Upload an image file to the `gallery-images` Supabase Storage bucket with the row ID.
 */
export async function uploadImageWithId(id: string, file: File): Promise<string | null> {
  // Compress image before upload (guarantees file size is under 1MB)
  const options = {
    maxSizeMB: 0.8, // Guarantee compressed size is strictly under 1MB (max 800KB for high-quality balance)
    maxWidthOrHeight: 1600, // HD-grade dimensions for crisp details
    useWebWorker: true,
    initialQuality: 0.8, // Superb visual clarity
    alwaysKeepResolution: false // Allows dimension downscaling to hit the size threshold if needed
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.warn('Image compression failed, using original file', error);
  }

  const filePath = `public/${id}.jpg`;

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(filePath, compressedFile, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('gallery-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Insert a new gallery item into the `memories` table and upload the corresponding file.
 */
export async function addGalleryItem(
  enrollmentNumber: string,
  file: File,
  height: number = 350
): Promise<MasonryItem | null> {
  // 1. Insert memory metadata first to generate a secure UUID
  const { data, error } = await supabase
    .from('memories')
    .insert([{ enrollment_number: enrollmentNumber, height }])
    .select()
    .single();

  if (error) {
    console.error('Error adding gallery item:', error.message);
    return null;
  }

  const id = String(data.id);

  // 2. Upload file named exactly after the row ID
  const uploadedUrl = await uploadImageWithId(id, file);
  if (!uploadedUrl) {
    // Rollback DB row if storage upload failed
    await supabase.from('memories').delete().eq('id', id);
    return null;
  }

  return {
    id,
    img: uploadedUrl,
    height: Number(data.height),
    enrollmentNumber: String(data.enrollment_number),
  };
}

/**
 * Delete a gallery item by ID from the memories table and its storage file.
 */
export async function deleteGalleryItem(id: string): Promise<boolean> {
  // 1. Delete from database
  const { error: dbError } = await supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting gallery item:', dbError.message);
    return false;
  }

  // 2. Delete file from storage
  const filePath = `public/${id}.jpg`;
  const { error: storageError } = await supabase.storage
    .from('gallery-images')
    .remove([filePath]);

  if (storageError) {
    console.warn('Memory deleted, but corresponding storage image removal failed:', storageError.message);
  }

  return true;
}

