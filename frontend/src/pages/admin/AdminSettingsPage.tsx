import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Shield, Database } from "lucide-react";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Admin Settings
        </h2>
        <p className="text-gray-500 mt-1">
          Configure site-wide parameters and security policies.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">General Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <Label className="text-base font-semibold">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-gray-500">
                  Put the store in maintenance mode. Only admins will have
                  access.
                </p>
              </div>
              <Button variant="outline" className="border-gray-200">
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <Label className="text-base font-semibold">
                  Self-Registration
                </Label>
                <p className="text-sm text-gray-500">
                  Allow new users to create accounts.
                </p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Active
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">System Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">
                  Clear System Cache
                </Label>
                <p className="text-sm text-gray-500">
                  Remove all temporary data and refresh catalogues.
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear Cache
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">
                  Backup Database
                </Label>
                <p className="text-sm text-gray-500">
                  Generate a point-in-time backup of the production database.
                </p>
              </div>
              <Button variant="outline">Schedule Backup</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
