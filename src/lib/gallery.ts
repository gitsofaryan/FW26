import { supabase } from './supabase';
import type { MasonryItem } from '../components/MasonryGallery';

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
    title: String(row.title ?? ''),
  }));
}

/**
 * Insert a new gallery item into the `memories` table.
 */
export async function addGalleryItem(
  title: string,
  imageUrl: string,
  height: number = 350
): Promise<MasonryItem | null> {
  const { data, error } = await supabase
    .from('memories')
    .insert([{ title, image_url: imageUrl, height }])
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
    title: String(data.title),
  };
}

/**
 * Upload an image file to the `gallery-images` Supabase Storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(filePath, file, {
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
