import React from "react";

const SecondStep = (props) => {
  return (
    <div className="p-8 rounded-xl max-w-3xl mx-auto shadow-lg border border-theme-primary/30">
    <h2 className="text-theme-primary text-2xl font-bold mb-6 text-center">Company Address</h2>
  
    <div className="space-y-4">
      {/* Email */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Eden"
          onChange={props.handleChange("email")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Address Line 1 */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Address Line 1 <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          name="addressLine1"
          placeholder="Street/town"
          onChange={props.handleChange("addressLine1")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Address Line 2 */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Address Line 2 <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          name="addressLine2"
          placeholder="City"
          onChange={props.handleChange("addressLine2")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* State */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
        <input
          type="text"
          name="state"
          placeholder="eg. TamilNadu"
          onChange={props.handleChange("state")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Zipcode */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Zipcode</label>
        <input
          type="text"
          name="zipcode"
          placeholder="Zipcode in digits"
          onChange={props.handleChange("zipcode")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
  
      {/* Country */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          name="country"
          placeholder="eg. India"
          onChange={props.handleChange("country")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
        />
      </div>
    </div>
  </div>
  
  
  );
};
export default SecondStep;
