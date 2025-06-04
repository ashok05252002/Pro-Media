import React from 'react';

const ComingSoonCard = () => {
  return (
    <div className="max-w-2xl mx-auto p-10 bg-gradient-to-br from-white via-yellow-50 to-white shadow-2xl rounded-3xl border border-yellow-300 hover:shadow-yellow-400 transition-all duration-500 text-center">
      <h1 className="text-4xl font-extrabold text-yellow-600 mb-4 animate-bounce">Coming Soon 🚧</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        We're cooking up something amazing for you! This section will be live shortly with brand new features and updates. 
        Stay tuned and thank you for your patience.
      </p>
      <div className="flex justify-center">
        <div className="h-4 w-3/4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 animate-pulse rounded-full"
            style={{ width: '40%' }}
          ></div>
        </div>
      </div>
      <p className="text-sm mt-3 text-yellow-600 font-medium">Launching Soon...</p>
      <div className="mt-6 text-xs text-gray-400 italic">
        "The future is almost here."
      </div>
    </div>
  );
};

export default ComingSoonCard;