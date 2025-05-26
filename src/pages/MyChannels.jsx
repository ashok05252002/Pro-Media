import React, { useState, useEffect } from 'react';
import ConnectChannelModal from '../components/ConnectChannelModal';
import YoutubeTable from "../components/table";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { extCompanyMstrDataSource, extCompanyProductData, extCompanyProductDataSource } from '../API/api';

const SocialMediaCard = ({ media, icon, connected, color }) => {
  
  return (
    <div className="bg-green dark:bg-blue-100 p-6 rounded-lg shadow" style={{backgroundColor:"lightblue"}}>
      <div className="flex items-center gap-8 mb-4">
        <span className={`text-2xl ${color}`}>{icon}</span>
        <h3 className="text-lg font-medium">{media}</h3>
      </div>
      <div className={`text-sm ${connected ? 'text-green-500' : 'text-red-500'} mb-4`}>
        {connected ? 'Connected' : 'Not Connected'}
      </div>
      {/* <div className="text-xs text-gray-500 dark:text-gray-400">
        Since 15th March
      </div> */}
    </div>
  );
};

const MyChannels = () => {
  const navigate = useNavigate();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [prdctDataSourcePlatform, setPrdctDatasourcePlatform] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [socialmediaDatas, setSocialMediaDatas] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [prdctDataSourceLen , setPrdctDataSourceLen] = useState(0)

  
  const socialMediaPlatforms = [
    { platform: 'Facebook', icon: '📘', connected: true, color: 'text-blue-600' },
    { platform: 'LinkedIn', icon: '📘', connected: false, color: 'text-blue-600' },
    { platform: 'X', icon: '✖️', connected: true, color: 'text-black dark:text-white' },
    { platform: 'Youtube', icon: '📺', connected: true, color: 'text-red-600' },
    { platform: 'Instagram', icon: '📸', connected: true, color: 'text-pink-600' },
  ];
  
  const eCommercePlatforms = [
    { platform: 'Amazon', icon: '📦', connected: true, color: 'text-orange-500' },
    { platform: 'Flipkart', icon: '🛒', connected: true, color: 'text-yellow-500' },
    { platform: 'Myntra', icon: '👕', connected: true, color: 'text-pink-500' },
  ];

  const renderTable = () => {
    switch (selectedPlatform) {
      case "Facebook":
        return <div>Facebook Table Content</div>;
      case "Twitter":
        return <div>Twitter Table Content</div>;
      case "Instagram":
        return <div>Instagram Table Content</div>;
      case "LinkedIn":
        return <div>LinkedIn Table Content</div>;
      case "Youtube":
        return <YoutubeTable/>;
      default:
        return <div>Please select a platform</div>;
    }
  };
 
  const handleCardClick = (platformName, productId, extPrdctDataSourceId) => {
    console.log("platformName: ", platformName, productId, extPrdctDataSourceId)
    localStorage.setItem("product_id",productId);
    // navigate(`/platform/${platformName}`, { 
    navigate(`/ViewPost`, { 
      state: { 
        platform_name:platformName, 
        product_id:productId, 
        ext_prdct_data_source_id:extPrdctDataSourceId
      }, 
      replace: true });
  };

  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);


  };

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = options.find(option => option.id.toString() === selectedId);
    setSelectedItem(selectedObj);
    console.log("Selected ID:", selectedObj?.id);
    console.log("Selected Name:", selectedObj?.product_name);
    extCompanyProductDataSource(selectedId)  // testing must use user_id
      .then(response => {
        console.log("debugging1",response)
        if (response.status === ( 200 || 201))
        { 
          console.log("debugging2",response.data.length)
          setPrdctDataSourceLen(response.data.length)
          if (response.data.length === 0)
            {console.log("please Register your product in any media")}

          else{
            setPrdctDatasourcePlatform(response.data);
          }
        }
        else {
          console.log(response)
        }
        })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    
  };

  useEffect(() => {
    // Fetch from your backend API
    let authTokens = localStorage.getItem("authToken")
    ? (localStorage.getItem("authToken"))
    : null;

    const user_id = localStorage.getItem("userId")
    ? (localStorage.getItem("userId"))
    : null;

    // axios({
    //   method: "GET",
    //   url:"http://127.0.0.1:5000/company/mstr_data_source",
    //   headers: { Authorization: `Bearer ${authTokens}`, },
    // })
    extCompanyMstrDataSource()
    .then(response => {
      if (response.status === (200 || 201))
      {
        console.log("debugging Mstr_data_source", response) 
        setSocialMediaDatas(response.data);

      }
      else{
        console.log(response)
      }
      
    })
    .catch(error => {
      console.error("Error fetching data:", error.message);
    });


    

    // axios({
    //     method: "GET",
    //     url:"http://127.0.0.1:5000/company/ext_product",
    //     headers: { Authorization: `Bearer ${authTokens}`, userId:{user_id} },
    //   })
    extCompanyProductData()  // testing must use user_id
      .then(response => {
        console.log("debugging1",response)
        if (response.status === ( 200 || 201))
        { 
          console.log("debugging2",response)
          setOptions(response.data);
        }
        else {
          console.log(response)
        }
        })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
      
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-t  to-theme-light-accent/60 dark:from-theme-dark-accent/20 dark:to-theme-dark-accent/20 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-2">Connect All Your Social Media in One Place</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Seamlessly integrate, manage, and grow your social presence across all platforms with ease
        </p>
        <button 
          className="bg-theme-primary text-white font-medium py-2 px-6 rounded-md transition-colors"
          onClick={() => setShowConnectModal(true)}
        >
          Connect
        </button>
        
        <div className="relative mt-4">
          {/* Social Media Icons */}
          <div className="absolute top-[-80px] right-[-20px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/2a24/b449/84b56ff07b56668620f15573e764d067?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=d4LU~nmR0kPwxmfOJLTMj2-R6CYzM2MTiJbOXedjLLIIgbzh2oKG6wMtWin~vunusnHZkWKzpxRKlW-NnmpfjEzvuw4rl6PYzDEXppgI9y7qwzhgBdLjRYxsG8oMsa-T6xCRWe0sOoE~sPqX~vw3W4jrzTNSSv2M87qphVQvreislgx308iYLvFz9NhzM4vNcopE39P6-WeJ~5Md-slOmvlfolhpssogU4~vi61qtlZFnQQkrSYjFjAitk6rLi0MYLD8KpSikWS7aAjeXpnI0dmuQXq90nxUQoZwUzEXbbCqLBd6wg3LQxuoS2DKSivf-X6LiDUN2gN54Jwe5TOZZA__" 
              alt="Facebook" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute top-[-40px] right-[60px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c0e2/933e/fdb99117f541ad547913c1e534b80558?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hxdfPfRWgVLmSZbdR~Fln~pQLnVezGKu~Uyi6eF3leyQEGkUcRcBdh9ONfY0FgNP3qr74f65wKJUn3rUMbdnO4O30NfXtvZ9cegBkYL9oZeXIPzPNF0p1jl~z9DcG9CUPj2oLJDUwfyvAEI7c5mMrHS3IwNr~VdkW0HJ2Bhk0lAojau7jsmdDM83F4c0rey9TaATVs29AlCeEOXukGjsFeZogtNjjruPqmZ2okAUCNbXn8WHdgNHJnS5RAdy5-NPeWIauoqDFrqTSJ~VOB4s8O7xWpeR4iI~2c4mpaHGbcIHMSTgae9XlwryUOQz2xQygZok79y5koUxyAeVQ7rWMA__" 
              alt="YouTube" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute top-[10px] right-[140px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/b07f/e3e7/a2b9a3337e1ae0a7a8e1a6adfaf064d1?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uKsaZGrJtyOv7YOn1vIVxTm8jskO49sg435s55nzFQEr-IF3xcczVBN~1wGFhYXi8~oCCGTNqwc9aVEDchXXM9EDQxG9dcYxXSpmvXuEz3pqNjIvYOpZCfMhYY8XR8WsYA3WtwORMjnYy~6As2EgRh24SUX9~0P34K2XLvJau2n~9GgXw01vFo~Sno6HQhHh8VPBpBP8ZggCLPvTROLzfSqaIvy3q2zvMdoh4zWv7y4hQGXSzRdMr5yiTS4cqcqwZDu~NMuzEVaNRAUsemztuqV4wwoMrLX-N0oHqpwjJNh6F5lNA4N8OXtELq2lf~o13A5XJzKyZXppIDAAnnevKA__" 
              alt="Amazon" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute top-[-20px] right-[220px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/19e4/0fbd/c222f0e3a99098c46e9d51b2c4c453a9?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Ncr7dm2TqLQyaXmJTvEZIOYxi8typD1jNMmt~pVvI6kNQ6ZLwPrLrGzbxmStVqbsYV~sLs85lNdCFCim2Q-pWbrxJwjvGKzzjucDGBZg42YhLjJI6zRQsKkEhb6yvzBOGFBXVW3CgG3~i-SL4Tj7fM-6shcEcvumARjUzgMLInU~Btak2aylmeW~F8G8De4LG7wgfLcDf7f-IAqSUzXWqW0CeIPnr9FajtNrp~0aDWkS7p~OEpY1xPdQqWlCJ18mA8S0s4D1leV5aQr29ZP6gL5v~QIkehjUPuIFGtt8BobiDtD3e-UuE--jpakPkpZv4TmItEbp21wdlTMWuSHHSA__" 
              alt="X" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute top-[20px] right-[300px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/739b/c72e/00ccdfac86c98f764c0d40b9082c0948?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eVvY0kExVSk8VGAneULrqM2Pco4VJ7Mw6QwHRH9C2kFQJJ21zDnKl4S6a-WCgoEwGvLvtgLX3E1oXtEKZCtwV~QCZ3pJGZrULGwb-lFt50Vkz9GUkNWsO62AW-QJVvlMuyxEI83ze4I4AxRWtbP1KXpAoRanxyPfp1mIw6nW6HL~KYSVpIxOvBfCtsXhUdoYEuX23P2~2Is6e90aFNdD9hR5Nca-sXWaMFSqWRYx~SKcthrPBsV8l49eeiht-7BTEVIgpxNd2hJ75qJpaam6s7tRn9ADVHi7Fm5v1nvee-p9VJagdp-3DKc1-ADYXQm085srbBYWhiUY6mMb2HGYRg__" 
              alt="Instagram" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="absolute top-[-10px] right-[380px]">
            <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c92d/10f4/2ad03d70cc812fe4ffac771569f57dc2?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=fzCT0F~1Xnvh6EnVw8iq9ED8EHO9aeWv~mZlvtGg5UXxNoThAjJloqFdGMXaUNtybJC61YwqfHEGM95iq6J6EwGjmdg6Pf8iUBaGAyzktWUV0HWa~tDMJErddYhNFr9wuy5mDQQhyzxshS7XKE3wxAAeLmkwNR-o-eGo75zjAwwiJH1ttTy-NvgYjEvaXemnSccWrHrZHDzLzp5UKquRPA54dm1A47yU9zBm0erfwsPam-Zom77Nsn-GibEo0ZPmMv2YmuooW0H4R~OE6qTTSXAFAKWckMfwZRiqbFekoBmImtf3Uj1TIejZYp707SuTzcB3ax~Bsy3G1ood2ONQXw__" 
              alt="LinkedIn" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
            <label>Register Product Name: </label>

            <select style={{marginLeft:'30px', width:"20%"}} defaultValue="" onChange={handleChange}>
                <option value="">-- Select --</option>
                {options?.map(option => (
                  <option key={option?.id} value={option?.id}>
                    {option?.product_name}
                  </option>
                ))}
            </select>
            {selectedItem && (
              <div style={{ marginTop: '10px' }}>
                {/* <strong>Selected ID:</strong> {selectedItem.id}<br /> */}
                <strong>Selected Product_Name:</strong> {selectedItem.product_name}

                
              </div>
          )}
          </div>
     
      <div>
        <h2 className="text-xl font-medium mb-4">Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {socialmediaDatas?.map((socialMediaData, index) => (
            // <div 
            //     key={socialMediaData.id} 
            //     onClick=
            //     {
            //       () => handleCardClick(socialMediaData.type, selectedItem.id, prdctDataSourcePlatform.id)
            //     }
            // >
            <div 
              key={socialMediaData.id} 
              onClick={() => {
                const matchingDataSource = prdctDataSourcePlatform?.find(
                  p => socialMediaData.status === 'A' && p.data_source_id === socialMediaData.id
                );
                handleCardClick(socialMediaData.type, selectedItem.id, matchingDataSource?.id);
              }}
            >
            <SocialMediaCard 
              // key={socialMediaData.id}
              media ={socialMediaData.type}
              icon={socialMediaPlatforms.find(
                  (platform) => platform.platform.toLowerCase() === socialMediaData.type.toLowerCase()
                  )?.icon || '🌐'}
              color={socialMediaPlatforms.find(
                    (platform) => platform.platform.toLowerCase() === socialMediaData.type.toLowerCase()
                  )?.color || 'text-gray-500'}
              connected={prdctDataSourcePlatform?.some(
                (prdctDataSourcePlatfrm) => 
                (socialMediaData.status === 'A') && 
                (prdctDataSourcePlatfrm.data_source_id === socialMediaData.id)?true:false)}
              // color={platform.color}
              onClick={() => setSelectedPlatform(socialMediaData.type)}

            />
          </div>
             
)
          )}
        </div>
        
      </div>
      
      {/* <div>
        <h2 className="text-xl font-medium mb-4">E-commerce</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eCommercePlatforms.map((platform, index) => (
            <SocialMediaCard 
              key={index}
              platform={platform.platform}
              icon={platform.icon}
              connected={platform.connected}
              color={platform.color}
            />
          ))}
        </div>
      </div> */}

      {showConnectModal && <ConnectChannelModal onClose={() => setShowConnectModal(false)} />}
    </div>
  );
};

export default MyChannels;
