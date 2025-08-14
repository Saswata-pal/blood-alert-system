// app/donor/register/page.tsx
"use client";

import { useState } from "react";
// 🎯 Import the new, specific function
import { registerDonor } from "@/lib/api"; 
import { useRouter } from "next/navigation";

// Helper function to calculate age from date of birth
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function DonorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // 🎯 Fields renamed to match backend Pydantic model
    full_name: "",
    email: "",
    password: "", // We will add this to the backend in the next step
    phone: "",
    dob: "", // We'll keep this to calculate age
    blood_group: "",
    city: "",
    last_donation_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🎯 Prepare the payload for the backend
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password, // Sending password
        phone: formData.phone,
        blood_group: formData.blood_group,
        city: formData.city,
        age: calculateAge(formData.dob), // Calculate and send age
        last_donation_date: formData.last_donation_date || null,
      };

      // 🎯 Call the corrected API function
      const response = await registerDonor(payload);
      console.log("Donor Registered:", response);
      alert("Donor Registered Successfully! You can now log in.");
      router.push("/auth"); // Redirect to login page
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Donor Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🎯 Input 'name' attributes are updated to match the new state */}
        <input className="w-full p-2 border rounded" type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
        <input className="w-full p-2 border rounded" type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input className="w-full p-2 border rounded" type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input className="w-full p-2 border rounded" type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
        <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <input className="w-full p-2 border rounded" type="date" name="dob" required onChange={handleChange} />
        </div>
        <select className="w-full p-2 border rounded" name="blood_group" required onChange={handleChange}>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <input className="w-full p-2 border rounded" type="text" name="city" placeholder="City" required onChange={handleChange} />
        <div>
            <label className="text-sm text-gray-600">Last Donation Date (Optional)</label>
            <input className="w-full p-2 border rounded" type="date" name="last_donation_date" onChange={handleChange} />
        </div>
        <button className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}