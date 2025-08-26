import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectChannelModal from '../components/ConnectChannelModal';
import LinkPlatformModal from '../components/LinkPlatformModal';

import {
  Facebook, Twitter, Youtube as YoutubeIcon, Instagram as InstagramIcon,
  Linkedin, Package, Briefcase, Link2, Edit2, ExternalLink, CheckCircle, XCircle, PlusCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyProductData, extCompanyProductDataSource } from '../API/api';

// Platform configuration
const baseSocialPlatforms = [
  { id: '7066', name: 'Facebook', IconComponent: Facebook, color: '#4267B2' },
  { id: '8487', name: 'Twitter', IconComponent: Twitter, color: '#1DA1F2' },
  { id: '7378', name: 'Instagram', IconComponent: InstagramIcon, color: '#E1306C' },
  { id: '7668', name: 'LinkedIn', IconComponent: Linkedin, color: '#0077B5' },
  { id: '8984', name: 'YouTube', IconComponent: YoutubeIcon, color: '#FF0000' },
];

const PlatformCard = ({ platform, connectionStatus, onConnect, onEdit }) => {
  const { isDarkMode } = useTheme();
  const isConnected = connectionStatus?.isConnected;
  const Icon = platform.IconComponent;

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[180px] transform hover:-translate-y-1`}
      style={{ borderTop: `3px solid ${platform.color}` }}
    >
      <div>
        <div className="flex items-center mb-2.5">
          <div className="p-2 rounded-full mr-2.5" style={{ backgroundColor: `${platform.color}1A` }}>
            <Icon className="w-5 h-5" style={{ color: platform.color }} />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">{platform.name}</h3>
        </div>

        {isConnected ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span>Connected</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 truncate" title={connectionStatus.pageName}>
              Page: <span className="font-semibold">{connectionStatus.pageName}</span>
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <a
                href={connectionStatus.displayLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
              >
                <ExternalLink size={11} /> View
              </a>
              <button
                onClick={onEdit}
                className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline font-medium"
              >
                <Edit2 size={11} /> Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
              <XCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span>Not Connected</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px]">Link this platform to manage its content.</p>
          </div>
        )}
      </div>

      {!isConnected && (
        <button
          onClick={onConnect}
          className="mt-3 w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-white transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
          style={{ backgroundColor: platform.color, filter: 'brightness(0.95)' }}
          onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
        >
          <Link2 className="w-3 h-3" /> Connect {platform.name}
        </button>
      )}
    </div>
  );
};

const MyBusiness = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [platformToConnect, setPlatformToConnect] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [currentBusinessChannels, setCurrentBusinessChannels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [platformToLink, setPlatformToLink] = useState(null);

  // Fetch businesses on component mount
  useEffect(() => {
    setLoading(true);
    extCompanyProductData()
      .then((prodRes) => {
        if (prodRes.status === 200 || prodRes.status === 201) {
          setBusinesses(prodRes.data);
          if (prodRes.data.length > 0) {
            setSelectedBusinessId(prodRes.data[0].id);
          }
        } else {
          setBusinesses([]);
        }
      })
      .catch(() => {
        setError('Failed to fetch businesses');
        setBusinesses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch channels when selected business changes
  useEffect(() => {
    if (selectedBusinessId) {
      setLoading(true);
      extCompanyProductDataSource(selectedBusinessId)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            const channelsStatus = {};

            // Initialize all platforms as not connected
            baseSocialPlatforms.forEach(platform => {
              channelsStatus[platform.id] = {
                isConnected: false,
                pageName: '',
                displayLink: ''
              };
            });

            // Update connected platforms
            if (Array.isArray(response.data) && response.data.length > 0) {
              response.data.forEach(item => {
                if (channelsStatus[item.data_source_id]) {
                  channelsStatus[item.data_source_id] = {
                    isConnected: true,
                    pageName: item.account_name,
                    displayLink: '' // You might want to add this field in your API response
                  };
                }
              });
            }

            setCurrentBusinessChannels(channelsStatus);
          } else {
            setError(`Unexpected status code: ${response.status}`);
          }
        })
        .catch(() => {
          // If error occurs, set all platforms as not connected
          const initialStatus = {};
          baseSocialPlatforms.forEach(platform => {
            initialStatus[platform.id] = { isConnected: false, pageName: '', displayLink: '' };
          });
          setCurrentBusinessChannels(initialStatus);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // If no business selected, set all platforms as not connected
      const initialStatus = {};
      baseSocialPlatforms.forEach(platform => {
        initialStatus[platform.id] = { isConnected: false, pageName: '', displayLink: '' };
      });
      setCurrentBusinessChannels(initialStatus);
      setLoading(false);
    }
  }, [selectedBusinessId]);

  const handleConnectClick = (platformId) => {
    navigate('/add-business', {
      state: {
        businessId: selectedBusinessId,
        platformToEdit: platformId
      }
    });
  };

  const handleEditClick = (platformId) => {
    setPlatformToLink(platformId);
    setShowLinkModal(true);
  };

  const handleSavePlatformLink = (platformId, data) => {
    setCurrentBusinessChannels(prev => ({
      ...prev,
      [platformId]: {
        isConnected: true,
        pageName: data.pageName,
        displayLink: data.productPageUrl || `https://${platformId}.com/${data.pageName}`,
      }
    }));
    setShowLinkModal(false);
    setPlatformToLink(null);
  };



  const selectedBusinessName = businesses.find(b => b.id === Number(selectedBusinessId))?.product_name || "No Business Selected";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold mb-3 md:mb-0 text-gray-800 dark:text-gray-100">My Business Profiles</h1>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-theme-primary hover:bg-opacity-90 text-white rounded-lg shadow-lg transition-colors text-sm font-semibold"
          onClick={() => navigate('/add-business')}
        >
          <Briefcase className="w-5 h-5" />
          <span>Manage Businesses</span>
        </button>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <label htmlFor="businessSelect" className="block text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Viewing Channels For: <span className="text-theme-primary">{selectedBusinessName}</span>
        </label>
        <select
          id="businessSelect"
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          className="w-full max-w-lg px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 shadow-sm text-gray-800 dark:text-gray-100"
          disabled={loading}
        >
          {loading ? (
            <option>Loading businesses...</option>
          ) : businesses.length > 0 ? (
            businesses.map(biz => (
              <option key={biz.id} value={biz.id}>{biz.product_name}</option>
            ))
          ) : (
            <option disabled>No businesses found. Add one first!</option>
          )}
        </select>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-5 text-gray-700 dark:text-gray-200">Social Media Channels</h2>
        {loading ? (
          <div className="text-center">Loading channels...</div>
        ) : businesses.length === 0 || !selectedBusinessId ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-200 dark:border-gray-700">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Business Selected</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please add or select a business to view its channels.</p>
            <button
              onClick={() => navigate('/add-business')}
              className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-lg shadow-md transition-colors text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Business
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {baseSocialPlatforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                connectionStatus={currentBusinessChannels[platform.id]}
                onConnect={() => handleConnectClick(platform.id)}
                onEdit={() => handleEditClick(platform.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-5 text-gray-700 dark:text-gray-200">E-commerce Platforms</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[180px]">
          <Package className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">E-commerce Integrations</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">Coming Soon!</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 max-w-md mx-auto">We're actively developing integrations for your e-commerce platforms.</p>
        </div>
      </div>

      {showLinkModal && platformToLink && (
        <LinkPlatformModal
          platformName={baseSocialPlatforms.find(p => p.id === platformToLink)?.name || ''}
          platformIcon={React.createElement(baseSocialPlatforms.find(p => p.id === platformToLink)?.IconComponent || (() => null), {
            className: "w-5 h-5"
          })}
          initialPageName={currentBusinessChannels[platformToLink]?.pageName || ''}
          initialProductPageUrl={currentBusinessChannels[platformToLink]?.displayLink || ''}
          onSubmit={(data) => handleSavePlatformLink(platformToLink, data)}
          onClose={() => {
            setShowLinkModal(false);
            setPlatformToLink(null);
          }}
        />
      )}

      {/* {showConnectModal && 
        <ConnectChannelModal 
          onClose={() => setShowConnectModal(false)}
          businessId={selectedBusinessId}
          platformId={platformToConnect}
        />
      } */}
    </div>
  );
};

export default MyBusiness;