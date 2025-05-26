import React from "react";

const LastStep = (props) => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md text-center">
  <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 Congratulations!</h2>
  <p className="text-green-700 text-base leading-relaxed mb-4">
    You’ve successfully completed all the forms and set up your business with <span className="font-semibold">PRO MEDIA</span>.
    A <span className="font-bold">6-digit code</span> has been sent to both your <span className="underline">company</span> and <span className="underline">personal email</span>.
    Please check your inbox, spam, and other folders.
  </p>
  <p className="text-green-700 mb-6">Enter the code below to continue:</p>

  <div className="flex justify-center">
    <input
      type="text"
      name="OTPCode"
      maxLength="6"
      placeholder="Enter 6-digit code"
      className="text-center tracking-widest text-lg w-60 px-4 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      onChange={props.handleChange("OTPCode")}
    />
  </div>
</div>

  );
};
export default LastStep;
