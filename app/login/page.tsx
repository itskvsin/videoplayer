"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await signIn("credentials", {email, password, redirect:false})

    if (response?.error) {
        console.log("error");
    } else {
        router.push("/")
    }

  };

  return <div>
    <form onSubmit={handleSubmit}>
        <input
          className="outline-none"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="outline-none"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
    </form>
    <div>
        <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500">

                Register
            </Link>
        </p>
    </div>
  </div>;
};

export default page;
