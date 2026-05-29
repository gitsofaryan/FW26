import { supabase } from './supabase';
import type { MasonryItem } from '../components/MasonryGallery';
import imageCompression from 'browser-image-compression';

/**
 * Fetch all gallery items from the `memories` table.
 * Falls back to empty array on error.
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

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    img: String(row.image_url ?? ''),
    height: Number(row.height ?? 350),
    enrollmentNumber: String(row.enrollment_number ?? ''),
  }));
}

/**
 * Insert a new gallery item into the `memories` table.
 */
export async function addGalleryItem(
  enrollmentNumber: string,
  imageUrl: string,
  height: number = 350
): Promise<MasonryItem | null> {
  const { data, error } = await supabase
    .from('memories')
    .insert([{ enrollment_number: enrollmentNumber, image_url: imageUrl, height }])
    .select()
    .single();

  if (error) {
    console.error('Error adding gallery item:', error.message);
    return null;
  }

  return {
    id: String(data.id),
    img: String(data.image_url),
    height: Number(data.height),
    enrollmentNumber: String(data.enrollment_number),
  };
}

/**
 * Upload an image file to the `gallery-images` Supabase Storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string | null> {
  // Compress image before upload
  const options = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.warn('Image compression failed, using original file', error);
  }

  const fileExt = compressedFile.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(filePath, compressedFile, {
      cacheControl: '3600',
      upsert: false,
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
 * Delete a gallery item by ID from the `memories` table.
 */
export async function deleteGalleryItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery item:', error.message);
    return false;
  }

  return true;
}
