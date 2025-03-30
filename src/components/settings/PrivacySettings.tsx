import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/providers/ToastProvider';

interface PrivacySettingsProps {
  userId: string;
  initialSettings: {
    profile_visibility: 'public' | 'private';
    show_email: boolean;
    show_location: boolean;
    show_social_links: boolean;
    contact_preferences: {
      allow_messages: boolean;
      allow_connection_requests: boolean;
      notification_email: boolean;
      notification_push: boolean;
    };
  };
}

export function PrivacySettings({ userId, initialSettings }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const supabase = createClient();
  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings, value: boolean | 'public' | 'private' | { allow_messages: boolean; allow_connection_requests: boolean; notification_email: boolean; notification_push: boolean }) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: {
            privacy: {
              profile_visibility: settings.profile_visibility,
              show_email: settings.show_email,
              show_location: settings.show_location,
              show_social_links: settings.show_social_links,
              contact_preferences: settings.contact_preferences,
            },
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      toast('Settings saved', { title: 'Success', description: 'Your privacy settings have been updated.' });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast('Update failed', { title: 'Error', description: 'Failed to update privacy settings. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div>
          <h3 className="text-lg font-medium mb-2">Profile Visibility</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="profileVisibility"
                checked={settings.profile_visibility === 'public'}
                onCheckedChange={(checked) => handleSettingChange(
                  'profile_visibility' as keyof typeof settings,
                  checked ? 'public' : 'private'
                )}
              />
              <Label htmlFor="profileVisibility">
                Make my profile publicly visible
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, your profile will be visible to everyone. When disabled, only
              people you connect with can see your profile.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium mb-2">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showEmail"
                checked={settings.show_email}
                onCheckedChange={(checked) => handleSettingChange('show_email', checked)}
              />
              <Label htmlFor="showEmail">Show my email address</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showLocation"
                checked={settings.show_location}
                onCheckedChange={(checked) => handleSettingChange('show_location', checked)}
              />
              <Label htmlFor="showLocation">Show my location</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showSocialLinks"
                checked={settings.show_social_links}
                onCheckedChange={(checked) => handleSettingChange('show_social_links', checked)}
              />
              <Label htmlFor="showSocialLinks">Show my social links</Label>
            </div>
          </div>
        </div>

        {/* Contact Preferences */}
        <div>
          <h3 className="text-lg font-medium mb-2">Contact Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="allowMessages"
                checked={settings.contact_preferences.allow_messages}
                onCheckedChange={(checked) => handleSettingChange('contact_preferences', {
                  ...settings.contact_preferences,
                  allow_messages: checked,
                })}
              />
              <Label htmlFor="allowMessages">Allow direct messages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowConnectionRequests"
                checked={settings.contact_preferences.allow_connection_requests}
                onCheckedChange={(checked) => handleSettingChange('contact_preferences', {
                  ...settings.contact_preferences,
                  allow_connection_requests: checked,
                })}
              />
              <Label htmlFor="allowConnectionRequests">Allow connection requests</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notificationEmail"
                checked={settings.contact_preferences.notification_email}
                onCheckedChange={(checked) => handleSettingChange('contact_preferences', {
                  ...settings.contact_preferences,
                  notification_email: checked,
                })}
              />
              <Label htmlFor="notificationEmail">Receive email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notificationPush"
                checked={settings.contact_preferences.notification_push}
                onCheckedChange={(checked) => handleSettingChange('contact_preferences', {
                  ...settings.contact_preferences,
                  notification_push: checked,
                })}
              />
              <Label htmlFor="notificationPush">Receive push notifications</Label>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
