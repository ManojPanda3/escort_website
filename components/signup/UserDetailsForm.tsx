import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/password-input";
import { supabase } from "../../lib/supabase.ts";

interface UserDetailsFormProps {
  formData: {
    email: string;
    password: string;
    username: string;
    userType: string;
    gender: string;
    interest: string;
    locationId: string;
    age: string;
  };
  updateFormData: (data: Partial<UserDetailsFormProps["formData"]>) => void;
  onNext: () => void;

  setError: () => void;
}

export default function UserDetailsForm(
  { formData, updateFormData, onNext, setError, setIsLoading, setIsVerified }:
    UserDetailsFormProps,
) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);

    e.preventDefault();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { username: formData.username, type: formData.userType },
      },
    });

    if (signUpError) {
      console.error("Signup Error:", signUpError);
      setError(signUpError);
      return { error: signUpError };
    }
    updateFormData({ userId: authData.id });
    setIsLoading(false);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          required
        />
      </div>
      <PasswordInput
        password={formData.password}
        setPassword={(password) => updateFormData({ password })}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => updateFormData({ username: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="userType">User Type</Label>
        <Select
          value={formData.userType}
          onValueChange={(value) => updateFormData({ userType: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="escort">Escort</SelectItem>
            <SelectItem value="bdsm">BDSM</SelectItem>
            <SelectItem value="couple">Couple</SelectItem>
            <SelectItem value="content creator">Content Creator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => updateFormData({ gender: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="18"
          max="200"
          value={formData.age}
          onChange={(e) => updateFormData({ age: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
