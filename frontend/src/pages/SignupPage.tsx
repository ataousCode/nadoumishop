import { Link } from "react-router-dom";
import { SignupForm } from "../features/auth/SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const SignupPage = () => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-normal">Create account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SignupForm />

        <div className="mt-4 text-xs text-gray-600">
          By creating an account, you agree to NadoumiShop's{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Conditions of Use
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Notice
          </Link>
          .
        </div>

        <Separator className="my-4" />

        <div className="text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in &rsaquo;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupPage;
