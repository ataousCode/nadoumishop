import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { resetPassword, clearError } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Initialize validation error based on token presence
  const [validationError, setValidationError] = useState(
    !token ? "Invalid or missing reset token." : "",
  );

  const { isLoading, error, message } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError("Missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    const resultAction = await dispatch(resetPassword({ password, token }));
    if (resetPassword.fulfilled.match(resultAction)) {
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successfully. Please login." },
        });
      }, 3000);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-normal">Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {validationError && (
          <div className="p-3 text-sm text-destructive bg-red-50 rounded-md">
            {validationError}
          </div>
        )}

        {message && (
          <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md">
            <p>{message}</p>
            <div className="mt-2">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!validationError || !token}
              className="w-full bg-[#f0c14b] hover:bg-[#ddb347] text-black border border-[#a88734] rounded-sm shadow-sm"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
