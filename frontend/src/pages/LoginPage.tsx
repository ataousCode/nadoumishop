import { Link, useLocation } from "react-router-dom";
import { LoginForm } from "../features/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-normal">Sign in</CardTitle>
        <CardDescription>
          Enter your email to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message && (
          <div
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <LoginForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              New to NadoumiShop?
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/signup" className="w-full">
          <Button
            variant="outline"
            className="w-full bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700 shadow-sm"
          >
            Create your NadoumiShop account
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
