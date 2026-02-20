import { Save, Bell, Shield, Database, Globe } from 'lucide-react';
import { Card } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import { Switch } from '../../shared/ui/switch';
import { Separator } from '../../shared/ui/separator';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2" style={{ color: '#263238' }}>Settings</h1>
        <p className="text-gray-600">Configure system preferences and options</p>
      </div>

      {/* System Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5" style={{ color: '#2E7D32' }} />
          <h2 className="text-xl">System Configuration</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input id="systemName" defaultValue="Govi Guru" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input id="adminEmail" type="email" defaultValue="admin@goviguru.lk" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input id="apiEndpoint" defaultValue="https://api.goviguru.lk/v1" />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" style={{ color: '#2E7D32' }} />
          <h2 className="text-xl">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email alerts for urgent issues</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New User Registrations</p>
              <p className="text-sm text-gray-600">Get notified when new users join</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pest Alert Notifications</p>
              <p className="text-sm text-gray-600">Alerts for high pest activity in regions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Health Alerts</p>
              <p className="text-sm text-gray-600">Server and database status notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5" style={{ color: '#2E7D32' }} />
          <h2 className="text-xl">Language & Region</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sinhala Language Support</p>
              <p className="text-sm text-gray-600">Enable Sinhala interface and content</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tamil Language Support</p>
              <p className="text-sm text-gray-600">Enable Tamil interface and content</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">English Language Support</p>
              <p className="text-sm text-gray-600">Enable English interface and content</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" style={{ color: '#2E7D32' }} />
          <h2 className="text-xl">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-gray-600">Auto logout after 30 minutes of inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="passwordChange">Change Password</Label>
            <div className="flex gap-2">
              <Input id="passwordChange" type="password" placeholder="New password" />
              <Button variant="outline">Update</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 px-8" style={{ backgroundColor: '#2E7D32' }}>
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
