import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    empId: "emp112",
    dob: "09/4/2024",
    gender: "Male",
    department: "IT",
    maritalStatus: "Single",
  });

  // Load initial user values into form
  useEffect(() => {
    setFormData((prev) => ({ ...prev, name: user?.name || "" }));
  }, [user]);

const handleSave = () => {
  const updatedUser = { ...user, ...formData };

  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));

  setFormData(updatedUser);
  setIsEditing(false);

  alert("Profile Updated Successfully!");
};

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#004D40] mb-6">My Profile</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 flex items-center gap-10">

        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="profile"
          className="w-48 h-48 rounded-full border-4 border-[#009688] object-cover"
        />

        <div className="space-y-2 text-lg">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-3">

              <input
                className="border p-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <input
                className="border p-2 rounded"
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
              />

              <div className="flex gap-4 mt-3 col-span-2">
                <button
                   onClick={() => setIsEditing(false)}
                  className="bg-[#004D40] text-white px-5 py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={handleSave}
                  className="bg-gray-400 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Employee ID:</strong> {formData.empId}</p>
              <p><strong>Date of Birth:</strong> {formData.dob}</p>
              <p><strong>Gender:</strong> {formData.gender}</p>
              <p><strong>Department:</strong> {formData.department}</p>
              <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#009688] text-white px-5 py-2 rounded mt-3"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
