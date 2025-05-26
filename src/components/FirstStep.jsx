import React from "react";

const FirstStep = (props) => {
  return (
    <div className="p-8 rounded-xl max-w-3xl mx-auto shadow-lg border border-theme-primary/30">
    <h2 className="text-theme-primary text-2xl font-bold mb-6 text-center">Company Details</h2>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Company Name */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Company Name</label>
        <input
          type="text"
          name="companyName"
          placeholder="e.g. Google"
          onChange={props.handleChange("companyName")}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Company Type */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Company Type</label>
        <input
          type="text"
          name="companyType"
          placeholder="e.g. IT and Services"
          onChange={props.handleChange("companyType")}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Website */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Website</label>
        <input
          type="text"
          name="website"
          placeholder="e.g. www.google.com"
          onChange={props.handleChange("website")}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Phone 1 */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Phone 1</label>
        <input
          type="text"
          name="phone_1"
          placeholder="e.g. +1234567890"
          onChange={props.handleChange("phone_1")}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Phone 2 */}
      <div className="md:col-span-2">
        <label className="block mb-2 font-medium text-gray-700">Phone 2</label>
        <input
          type="text"
          name="phone_2"
          placeholder="e.g. +0987654321"
          onChange={props.handleChange("phone_2")}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
    </div>
  </div>
  

  
  );
};
export default FirstStep;
