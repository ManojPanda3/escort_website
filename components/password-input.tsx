import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Plus, X } from "lucide-react";
export function PasswordInput(
  { password, setPassword, showPassword, setShowPassword },
) {
  return (
    <div className="relative">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-2 flex items-center top-1/3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword
          ? <EyeOff className="h-5 w-5" />
          : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
