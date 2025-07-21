import React, { useState, useEffect } from "react";
import "./CompanyForm.css";

export const CompanyForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    description: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        shortName: initialData.shortName || "",
        description: initialData.description || "",
        phoneNumber: initialData.phoneNumber || "",
      });
    } else {
      setFormData({
        name: "",
        shortName: "",
        description: "",
        phoneNumber: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg"
      onClick={onCancel}
    >
      <div
        className="text-lg font-semibold mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit company" : "Create company"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short Name
            </label>
            <input
              type="text"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 button-form">
            <div>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
