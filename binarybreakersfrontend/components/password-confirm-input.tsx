"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PasswordConfirmInput() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const passwordField = document.querySelector("input[name='password']") as HTMLInputElement;
    if (passwordField && passwordField.value !== value) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={handlePasswordConfirmation}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
