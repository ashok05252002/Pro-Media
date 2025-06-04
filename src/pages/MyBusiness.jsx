import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectChannelModal from '../components/ConnectChannelModal';
import {
  Facebook,
  Twitter,
  Youtube as YoutubeIcon,
  Instagram as InstagramIcon,
  Linkedin,
  Package,
  Briefcase
} from 'lucide-react';
import { extCompanyProductData, extCompanyProductDataSource } from '../API/api';

// Helper functions for platform icons, colors, and names
const getPlatformIcon = (dataSourceId) => {
  const platformIcons = {
    7066: <Facebook />,
    8487: <Twitter />,
    7378: <InstagramIcon />,
    7668: <Linkedin />,
    8984: <YoutubeIcon />
  };
  return platformIcons[dataSourceId] || <Package />;
};

const getPlatformColor = (dataSourceId) => {
  const platformColors = {
    7066: 'text-blue-600',
    8487: 'text-black dark:text-white',
    7378: 'text-pink-600',
    7668: 'text-blue-700',
    8984: 'text-red-600'
  };
  return platformColors[dataSourceId] || 'text-gray-400';
};

const getPlatformType = (dataSourceId) => {
  const platformTypes = {
    7066: 'Facebook',
    8487: 'Twitter',
    7378: 'Instagram',
    7668: 'LinkedIn',
    8984: 'YouTube'
  };
  return platformTypes[dataSourceId] || 'Unknown';
};

const SocialMediaCard = ({ platform, icon, connected, details, color, onLink }) => (
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

const MyBusiness = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [business, setBusiness] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [prdctDataSourcePlatform, setPrdctDatasourcePlatform] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
  const selectedId = e.target.value;
  setSelectedBusinessId(selectedId);
  setLoading(true);
  setError(null);

  extCompanyProductDataSource(selectedId)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        if (!Array.isArray(response.data) || response.data.length === 0) {
          setPrdctDatasourcePlatform([]);
        } else {
          const transformedData = response.data.map((item) => ({
            ...item,
            icon: getPlatformIcon(item.data_source_id),
            color: getPlatformColor(item.data_source_id),
            platformType: getPlatformType(item.data_source_id),
            connected: true,
            details: { pageName: item.account_name }
          }));
          setPrdctDatasourcePlatform(transformedData);
        }
      } else {
        setError(`Unexpected status code: ${response.status}`);
      }
    })
    .catch((error) => {
      // If a network error, just clear platforms (don’t show error message)
      setPrdctDatasourcePlatform([]);
      // Comment out or remove the below line so no error text is shown:
      // setError(error.message || 'Failed to fetch product data');
    })
    .finally(() => {
      setLoading(false);
    });
};

  useEffect(() => {
    setLoading(true);
    setError(null);
    extCompanyProductData()
      .then((prodRes) => {
        if (prodRes.status === 200 || prodRes.status === 201) {
          setBusiness(prodRes.data);
        } else {
          setBusiness([]);
        }
      })
      .catch(() => {
        setError('Failed to fetch businesses');
        setBusiness([]);
      })
      .finally(() => {
        setLoading(false);
      });
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
          onClick={() => navigate('/add-business')}
        >
          <Briefcase className="w-4 h-4" />
          Manage Business
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="businessSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Viewing Channels For:
        </label>
        <select
          id="businessSelect"
          value={selectedBusinessId}
          onChange={handleChange}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
        >
          <option value="">Select a business</option>
          {business?.map((biz) => (
            <option key={biz?.id} value={biz?.id}>
              {biz?.product_name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div>
        <h2 className="text-xl font-medium mb-4">Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prdctDataSourcePlatform.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400">
              No platforms linked for this business.
            </div>
          )}
          {prdctDataSourcePlatform.map((platform) => (
            <SocialMediaCard
              key={platform.data_source_id}
              platform={platform.platformType}
              icon={platform.icon}
              connected={platform.connected}
              details={platform.details}
              color={platform.color}
              onLink={() => setShowConnectModal(true)}
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
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            We're working hard to bring you seamless connections with your favorite e-commerce platforms.
          </p>
        </div>
      </div>

      {showConnectModal && <ConnectChannelModal onClose={() => setShowConnectModal(false)} />}
    </div>
  );
};

export default MyBusiness;