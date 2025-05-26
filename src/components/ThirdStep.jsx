import React from "react";

const ThirdStep = (props) => {
  console.log("debugging ThirdStep" )
  return (
    <div className="p-8 rounded-xl max-w-3xl mx-auto shadow-lg border border-theme-primary/30 space-y-4">
    {/* UserName */}
    <div className="">
    <h2 className="text-theme-primary text-2xl font-bold mb-6 text-center">Personal Details</h2>
      <label className="block mb-1 text-sm font-medium text-gray-700">UserName</label>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={props.handleChange("username")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
      />
    </div>
  
    {/* First Name */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        First Name <span className="text-gray-400">(optional)</span>
      </label>
      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        onChange={props.handleChange("firstname")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
      />
    </div>
  
    {/* Last Name */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Last Name <span className="text-gray-400">(optional)</span>
      </label>
      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        onChange={props.handleChange("lastname")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
      />
    </div>
  
    {/* Email */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
      <input
        type="text"
        name="userEmail"
        placeholder="Your Email"
        onChange={props.handleChange("userEmail")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
      />
    </div>
  
    {/* Password */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        name="pwd"
        placeholder="********"
        onChange={props.handleChange("pwd")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
      />
    </div>
  
    {/* Optional Radio Buttons Section */}
    {/* <div className="flex space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          className="card-input-element"
          onChange={props.handleChange("checkboxValue")}
          value="Individual"
        />
        <div className="card-input">
          <PersonIcon />
          <h3 className="panel-heading">For myself</h3>
          <p className="panel-body">Write better things more clearly. Stay organized.</p>
        </div>
      </label>
  
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          className="card-input-element"
          onChange={props.handleChange("checkboxValue")}
          value="Company"
        />
        <div className="card-input">
          <GroupsIcon />
          <h3 className="panel-heading">With my team</h3>
          <p className="panel-body">Wikis, docs, tasks, and projects, all in one place.</p>
        </div>
      </label>
    </div> */}
  </div>
  
  
  );
};
export default ThirdStep;
