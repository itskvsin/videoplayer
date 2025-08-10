"use client"

import { useRouter } from 'next/navigation'
import React, {useState} from 'react'

const page = () => {

  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[confirmPassword, setConfirmPassword] = useState("")

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password Does not match");
      return;
    }
    try {
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration Failed")
      }
      console.log(data);
      router.push("/login")
      
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input className='outline-none' type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type='submit'>Register</button>
      </form>

    </div>
  )
}

export default page
