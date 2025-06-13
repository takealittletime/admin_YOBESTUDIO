"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === process.env.NEXT_PUBLIC_PASSCODE) {
      // 3시간(10800초) 동안 쿠키 유지
      document.cookie = `admin_logged_in=true; path=/; max-age=10800;`;
      router.replace("/");
    } else {
      setError("패스코드가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-16 bg-black p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-4xl font-bold">Admin Page for YOBESTUDIO</h1>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
      >
        <p className="text-xl text-white">
          Please input your PASSCODE to access the admin page.
        </p>
        <input
          type="password"
          placeholder="Enter your PASSCODE"
          className="w-full max-w-xs rounded-md border border-gray-300 p-2 text-lg text-black focus:border-gray-300 focus:outline-none focus:ring-0"
          required
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        {error && <span className="text-red-500">{error}</span>}
        <button
          type="submit"
          className="w-full max-w-xs rounded-md bg-blue-600 px-4 py-2 text-lg text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <p className="text-lg text-gray-600">
        This is a admin page for YOBESTUDIO...
      </p>
    </div>
  );
}
