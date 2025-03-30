import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/providers/ToastProvider';
import { Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { optimizeAvatar } from '@/lib/image-optimizer';

interface AvatarUploaderProps {
  userId: string;
  currentAvatarUrl?: string;
}

export function AvatarUploader({ userId, currentAvatarUrl }: AvatarUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl);
  const supabase = createClient();
  const toast = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast('Invalid file type', { title: 'Error', description: 'Please upload an image file (JPEG, PNG, GIF)', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('File too large', { title: 'Error', description: 'Please upload an image smaller than 5MB', variant: 'destructive' });
      return;
    }

    try {
      // Convert File to Buffer
      const buffer = await file.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      // Optimize the image
      const optimizedImage = await optimizeAvatar(imageBuffer);

      // Convert back to File for Supabase
      const blob = new Blob([optimizedImage], { type: file.type });
      const newFile = new File([blob], file.name, { type: file.type });

      // Create a preview URL
      const previewBlob = new Blob([optimizedImage], { type: file.type });
      const previewUrl = URL.createObjectURL(previewBlob);
      setPreviewUrl(previewUrl);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`public/${userId}`, newFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: data.path,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast('Avatar updated', { title: 'Success', description: 'Your profile picture has been updated.' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast('Upload failed', { title: 'Error', description: 'Failed to upload avatar. Please try again.', variant: 'destructive' });
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsLoading(true);

      // Remove the avatar from Supabase storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([`public/${userId}`]);

      if (storageError) throw storageError;

      // Update the profile to remove the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setPreviewUrl(undefined);
      toast('Avatar removed', { title: 'Success', description: 'Your profile picture has been removed.' });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast('Removal failed', { title: 'Error', description: 'Failed to remove avatar. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-48 mx-auto">
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="Profile picture"
                fill
                className="object-cover rounded-lg"
                priority
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={handleRemoveAvatar}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="avatarFile">Upload a new profile picture</Label>
          <Input
            id="avatarFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Supported formats: JPG, PNG, GIF</p>
          <p>Maximum file size: 5MB</p>
        </div>
      </CardContent>
    </Card>
  );
}
