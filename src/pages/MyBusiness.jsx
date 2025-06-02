import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ConnectChannelModal from '../components/ConnectChannelModal';
import { Facebook, Twitter, Youtube as YoutubeIcon, Instagram as InstagramIcon, Linkedin, Package, Briefcase, ShoppingCart, LinkedinIcon } from 'lucide-react'; // Added Briefcase
import { extCompanyProductData, extCompanyMstrDataSource, extCompanyProductDataSource } from '../API/api';
import { Instagram } from '@mui/icons-material';

// Mock data for businesses and their linked platforms (similar to AddBusinessPage)
const mockExistingBusinesses = [
  { 
    id: 'comp1', 
    name: 'TechCorp Solutions', 
    linkedPlatforms: {
      facebook: { pageName: 'TechCorp Official', productPageUrl: 'https://facebook.com/TechCorpOfficial', displayLink: 'https://facebook.com/TechCorpOfficial' },
      twitter: { pageName: '@TechCorp', productPageUrl: 'https://twitter.com/TechCorp', displayLink: 'https://twitter.com/TechCorp' },
      youtube: { pageName: 'TechCorp TV', productPageUrl: 'https://youtube.com/TechCorpTV', displayLink: 'https://youtube.com/TechCorpTV'}
      // Instagram and LinkedIn not linked for TechCorp
    } 
  },
  { 
    id: 'comp2', 
    name: 'Innovate Hub', 
    linkedPlatforms: {
      instagram: { pageName: 'InnovateHubIG', productPageUrl: 'https://instagram.com/InnovateHubIG', displayLink: 'https://instagram.com/InnovateHubIG' },
      linkedin: { pageName: 'Innovate Hub Company', productPageUrl: 'https://linkedin.com/company/innovate-hub', displayLink: 'https://linkedin.com/company/innovate-hub'}
      // Facebook, Twitter, YouTube not linked for Innovate Hub
    }
  },
  { 
    id: 'comp3', 
    name: 'GreenLeaf Organics', 
    linkedPlatforms: {} // No platforms linked for GreenLeaf Organics
  },
];

const getPlatformIcon = (dataSourceId) => {
  const platformIcons = {
    7066: <Facebook />,
    8487: <Twitter/>,
    7378: <Instagram />,
    7668: <LinkedinIcon/>,
    8984: <Youtube/>,
    // Add more mappings as needed
  };
  return platformIcons[dataSourceId] || 'default-icon';
};

const getPlatformColor = (dataSourceId) => {
  const platformColors = {
    7066: 'text-blue-600',
    8487: 'text-black dark:text-white' ,
    7378: 'text-pink-600',
    7668: 'text-blue-700',
    8984: 'text-red-600',
    // Add more mappings as needed
  };
  return platformColors[dataSourceId] || '#cccccc';
};

const getPlatformType = (dataSourceId) => {
  const platformTypes = {
    7066: 'facebook',
    8487: 'twitter',
    7378: 'nstagram',
    7668: 'linkedin',
    8984: 'youtube',
    // Add more mappings as needed
  };
  return platformTypes[dataSourceId] || 'Unknown';
};

// Base definitions for social platforms
const baseSocialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: <Facebook />, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: <InstagramIcon />, color: 'text-pink-600' },
  { id: 'twitter', name: 'X (Twitter)', icon: <Twitter />, color: 'text-black dark:text-white' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin />, color: 'text-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: <YoutubeIcon />, color: 'text-red-600' },
];

const SocialMediaCard = ({ platform, icon, connected, details, color, onLink }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
          <h3 className="text-lg font-medium">{platform}</h3>
        </div>
        {!connected && (
           <button 
             onClick={onLink}
             className="text-xs bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary py-1 px-2 rounded-md"
           >
             Link
           </button>
        )}
      </div>
      {connected ? (
        <>
          <div className="text-sm text-green-500 mb-1">Connected</div>
          {details?.pageName && (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={details.pageName}>
              {details.pageName}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="text-sm text-red-500 mb-2">Not Connected</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click 'Link' to connect this platform.
          </p>
        </>
      )}
    </div>
  );
};

const MyBusiness = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [businesses, setBusinesses] = useState(mockExistingBusinesses);
  const [business, setBusiness] =useState([])
  const [socialMediaDatas, setSocialMediaDatas] = useState(null)
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [prdctDataSourcePlatform, setPrdctDatasourcePlatform] = useState(null);
  const [currentBusinessChannels, setCurrentBusinessChannels] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [prdctDataSourceLen , setPrdctDataSourceLen] = useState(0)

   const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = business.find(option => option.id.toString() === selectedId);
    setSelectedItem(selectedObj);
    setSelectedBusinessId(e.target.value)
    console.log("Selected ID:", selectedObj?.id);
    console.log("Selected Name:", selectedObj?.product_name);
    setLoading(true);
    setError(null);

    extCompanyProductDataSource(selectedId)
      .then(response => {
        console.log("debugging1", response);
        
        // Fixed status check (200 or 201)
        if (response.status === 200 || response.status === 201) {
          console.log("debugging2", response.data.length);
          setPrdctDataSourceLen(response.data.length);
          
          if (response.data.length === 0) {
            console.log("Please register your product in any media");
            setPrdctDatasourcePlatform([]); // Clear previous data if empty
          } else {
            // Transform data by adding icon, color, and platformType fields
            const transformedData = response.data.map(item => {
              // Only add extra fields if data_source_id exists
              if (item.data_source_id && selectedId === item.product_id) {
                return {
                  ...item,
                  icon: getPlatformIcon(item.data_source_id), // Implement this function
                  color: getPlatformColor(item.data_source_id), // Implement this function
                  platformType: getPlatformType(item.data_source_id) // Implement this function
                };
              }
              return item;
            });
            console.log(transformedData)
            setPrdctDatasourcePlatform(transformedData);
          }
        } else {
          const errorMsg = `Unexpected status code: ${response.status}`;
          console.log(response);
          setError(errorMsg);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch product data");
      })
      .finally(() => {
        setLoading(false);
      });

    
  };

  useEffect(() => {
    const fetchProducts = async () => {
          try {
            const authTokens = localStorage.getItem("authToken")

            extCompanyMstrDataSource()
            .then(response => {
              // Successful response (status 200 or 201)
              if (response.status === 200 || response.status === 201) {
                console.log("debugging Mstr_data_source", response);
                setSocialMediaDatas(response.data);
              } else {
                // Handle other status codes
                const errorMessage = `Unexpected status code: ${response.status}`;
                console.log(response);
                setError(errorMessage);
                setSocialMediaDatas(null);
              }
            })
            .catch(error => {
              // Handle network errors or request failures
              console.error("Error fetching data:", error.message);
              setError(error.message || "Failed to fetch data");
              setSocialMediaDatas(null);
            })
            .finally(() => {
              // Set loading to false when the request is complete (success or failure)
              setLoading(false);
            });
            
            extCompanyProductData()  // testing must use user_id
              .then(response => {
                
                if (response.status === ( 200 || 201))
                { 
                  setBusiness(response?.data);
                  setLoading(false);
                  console.log("debugging1",response)
                }
              }
            )
            .catch(err => {
              console.log(err);
              setBusiness([])
              // setLoading(false);  
            });
            
          } catch (err) {
            setError(err.message);
            setLoading(false);
            setBusiness([])
          }
        };
    
        fetchProducts();
    // if (selectedBusinessId) {
    //   const selectedBiz = businesses.find(biz => biz.id === selectedBusinessId);
    //   if (selectedBiz) {
    //     const channelsStatus = {};
    //     baseSocialPlatforms.forEach(platform => {
    //       const linkedInfo = selectedBiz.linkedPlatforms[platform.id];
    //       channelsStatus[platform.id] = {
    //         connected: !!linkedInfo,
    //         details: linkedInfo || null
    //       };
    //     });
    //     setCurrentBusinessChannels(channelsStatus);
    //   }
    // } else {
    //   // Reset if no business is selected
    //   const initialStatus = {};
    //   baseSocialPlatforms.forEach(platform => {
    //       initialStatus[platform.id] = { connected: false, details: null };
    //   });
    //   setCurrentBusinessChannels(initialStatus);
    // }
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-[#FDE5E3] dark:bg-[#FDE5E3]/10 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-2">Connect All Your Social Media in One Place</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Seamlessly integrate, manage, and grow your social presence across all platforms with ease.
        </p>
        <button 
          className="bg-[#EC5347] hover:bg-[#D9382B] text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center gap-2"
          onClick={() => navigate('/add-business')} // Navigate to add-business page
        >
          <Briefcase className="w-4 h-4" />
          Manage Business
        </button>
        
        <div className="relative mt-4">
          {/* Decorative Social Media Icons */}
          <div className="absolute top-[-80px] right-[-20px] opacity-50 md:opacity-100">
            <img src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/2a24/b449/84b56ff07b56668620f15573e764d067?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=d4LU~nmR0kPwxmfOJLTMj2-R6CYzM2MTiJbOXedjLLIIgbzh2oKG6wMtWin~vunusnHZkWKzpxRKlW-NnmpfjEzvuw4rl6PYzDEXppgI9y7qwzhgBdLjRYxsG8oMsa-T6xCRWe0sOoE~sPqX~vw3W4jrzTNSSv2M87qphVQvreislgx308iYLvFz9NhzM4vNcopE39P6-WeJ~5Md-slOmvlfolhpssogU4~vi61qtlZFnQQkrSYjFjAitk6rLi0MYLD8KpSikWS7aAjeXpnI0dmuQXq90nxUQoZwUzEXbbCqLBd6wg3LQxuoS2DKSivf-X6LiDUN2gN54Jwe5TOZZA__" 
              alt="Facebook" className="w-12 h-12 md:w-16 md:h-16 object-contain"/>
          </div>
          <div className="absolute top-[-40px] right-[60px] opacity-50 md:opacity-100">
            <img src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/c0e2/933e/fdb99117f541ad547913c1e534b80558?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hxdfPfRWgVLmSZbdR~Fln~pQLnVezGKu~Uyi6eF3leyQEGkUcRcBdh9ONfY0FgNP3qr74f65wKJUn3rUMbdnO4O30NfXtvZ9cegBkYL9oZeXIPzPNF0p1jl~z9DcG9CUPj2oLJDUwfyvAEI7c5mMrHS3IwNr~VdkW0HJ2Bhk0lAojau7jsmdDM83F4c0rey9TaATVs29AlCeEOXukGjsFeZogtNjjruPqmZ2okAUCNbXn8WHdgNHJnS5RAdy5-NPeWIauoqDFrqTSJ~VOB4s8O7xWpeR4iI~2c4mpaHGbcIHMSTgae9XlwryUOQz2xQygZok79y5koUxyAeVQ7rWMA__" 
              alt="YouTube Icon" className="w-12 h-12 md:w-16 md:h-16 object-contain"/>
          </div>
          <div className="absolute top-[10px] right-[140px] opacity-0 md:opacity-100">
            <img src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/b07f/e3e7/a2b9a3337e1ae0a7a8e1a6adfaf064d1?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uKsaZGrJtyOv7YOn1vIVxTm8jskO49sg435s55nzFQEr-IF3xcczVBN~1wGFhYXi8~oCCGTNqwc9aVEDchXXM9EDQxG9dcYxXSpmvXuEz3pqNjIvYOpZCfMhYY8XR8WsYA3WtwORMjnYy~6As2EgRh24SUX9~0P34K2XLvJau2n~9GgXw01vFo~Sno6HQhHh8VPBpBP8ZggCLPvTROLzfSqaIvy3q2zvMdoh4zWv7y4hQGXSzRdMr5yiTS4cqcqwZDu~NMuzEVaNRAUsemztuqV4wwoMrLX-N0oHqpwjJNh6F5lNA4N8OXtELq2lf~o13A5XJzKyZXppIDAAnnevKA__" 
              alt="Amazon" className="w-12 h-12 md:w-16 md:h-16 object-contain"/>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="businessSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Viewing Channels For:
        </label>

        {/* <select defaultValue="" onChange={handleChange}></select> */}
        <select
          id="businessSelect"
          // value={selectedBusinessId}
          // onChange={(e) => setSelectedBusinessId(e.target.value)}
          defaultValue=""
          onChange={handleChange}
          // onChange={(e)=>handleChange}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
        >
          {business?.map(biz => (
            
            <option key={biz?.id} value={biz?.id}>{biz?.product_name}</option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* {baseSocialPlatforms.map((platform) => (
            <SocialMediaCard 
              key={platform.id}
              platform={platform.type}
              icon={platform.icon}
              connected={currentBusinessChannels[platform.id]?.connected || false}
              details={currentBusinessChannels[platform.id]?.details}
              color={platform.color}
              onLink={() => setShowConnectModal(true)} // Opens generic modal
            />
          ))} */}
          {prdctDataSourcePlatform?.map((platform) => (
            <SocialMediaCard 
              key={platform.data_source_id}
              platform={platform.platformType}
              icon={platform.icon}
              connected={platform.data_source_id?.connected || false}
              details={platform?.details}
              color={platform.color}
              onLink={() => setShowConnectModal(true)} // Opens generic modal
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">E-commerce</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">E-commerce Integrations</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Coming Soon!</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">We're working hard to bring you seamless connections with your favorite e-commerce platforms.</p>
        </div>
      </div>

      {showConnectModal && <ConnectChannelModal onClose={() => setShowConnectModal(false)} />}
    </div>
  );
};

export default MyBusiness;