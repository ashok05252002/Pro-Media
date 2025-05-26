import React from 'react';

const UserProfile = () => {
  const userName = localStorage.getItem('username');
  
  return (
    <div className="border-t border-[#FFC9CA]/20 p-4 flex items-center">
      <img 
        src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/d565/9814/410c0e68cc5a1fddaf59dbaa4c8f4c01?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NJuUfBNqkkRBKsQRXkDw1otRahyF1W1KZOWcV1UdeBMVjDhBiES3oKt0AZSYa2AAwpyIudBUZ-c9x2S5ZLPjcgNxaWxaxFQZTMZ6f2kBSWdlwnWPTWHAYMQKpMU4PBXC75uy7rHrEOm3CfB2xTBTkTi8eIlDdFppLHHuh2rkR14CWS~2IRSOqCajDIYjKVKbJFCVDqFxG2YNFWgDQ84Mf8kE5ZffEUfC4GzeKHLJA~gn1mhopFAZ0jERz-HgmhkFZfZzbV-fiV1-AWtGL2l81G-w3TrFgxMe-Nof5KI6nECLT3F8RjxudsTLj3BHXBUVXS4C87iUdVzHTZha8kmsOA__" 
        alt={userName} 
        className="w-10 h-10 rounded-full mr-3"
      />
      <span className="font-medium">{userName}</span>
    </div>
  );
};

export default UserProfile;
