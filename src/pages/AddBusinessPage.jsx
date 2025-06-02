import React, { useState, useEffect, use } from 'react';
import { Building, PlusCircle, Link as LinkIcon, Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronDown, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import LinkPlatformModal from '../components/LinkPlatformModal';
import { loginWithSocial } from '../services/SocialAuth';
import { extCompanyProductData, extCompanyRegorAddPrdct } from '../API/api';

import { toast } from 'react-toastify';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5 text-blue-600" /> },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5 text-pink-600" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5 text-blue-400" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-blue-700" /> },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5 text-red-600" /> },
];

const mockExistingBusinesses = [
  {
    id: 'comp1', name: 'TechCorp Solutions', linkedPlatforms: {
      facebook: { pageName: 'TechCorp Official', productPageUrl: 'https://facebook.com/TechCorpOfficial', displayLink: 'https://facebook.com/TechCorpOfficial' },
      instagram: null,
      twitter: { pageName: '@TechCorp', productPageUrl: 'https://twitter.com/TechCorp', displayLink: 'https://twitter.com/TechCorp' },
      youtube: { pageName: 'TechCorp TV', productPageUrl: 'https://youtube.com/TechCorpTV', displayLink: 'https://youtube.com/TechCorpTV' }
    }
  },
  {
    id: 'comp2', name: 'Innovate Hub', linkedPlatforms: {
      instagram: { pageName: 'InnovateHubIG', productPageUrl: 'https://instagram.com/InnovateHubIG', displayLink: 'https://instagram.com/InnovateHubIG' },
    }
  },
  { id: 'comp3', name: 'GreenLeaf Organics', linkedPlatforms: {} },
];

const AddBusinessPage = () => {
  const [businessType, setBusinessType] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [businessNameConfirmed, setBusinessNameConfirmed] = useState(false);
  const [productDetail, setProductDetail] = useState({})

  const initialPlatformState = socialPlatforms.reduce((acc, platform) => {
    acc[platform.id] = { pageName: '', productPageUrl: '', isLinked: false, displayLink: '' };
    return acc;
  }, {});
  const [platformDetails, setPlatformDetails] = useState(initialPlatformState);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [platformToLink, setPlatformToLink] = useState(null);
  const [productList, setProductList] = useState([]); 

  const getProductList = async()=>{
    try {
      const result  =await extCompanyProductData();
       console.log(result.data);
       if(result.status == 200){
        setProductList(result.data ?? []);
       }
    } catch (error) {
       console.log(error);
    }
  }
  useEffect(()=>{
    console.log("getProductList api triggered");
    getProductList();
  },[]);

  useEffect(() => {
    if (businessType === 'existing' && selectedCompanyId) {
      const company = mockExistingBusinesses.find(c => c.id === selectedCompanyId);
      if (company) {
        const newDetails = { ...initialPlatformState };
        socialPlatforms.forEach(platform => {
          const linkedInfo = company.linkedPlatforms[platform.id];
          if (linkedInfo) {
            newDetails[platform.id] = {
              pageName: linkedInfo.pageName || '',
              productPageUrl: linkedInfo.productPageUrl || '',
              isLinked: true,
              displayLink: linkedInfo.displayLink || linkedInfo.productPageUrl || (linkedInfo.pageName ? `https://${platform.name.toLowerCase()}.com/${linkedInfo.pageName}` : '')
            };
          } else {
            newDetails[platform.id] = { pageName: '', productPageUrl: '', isLinked: false, displayLink: '' };
          }
        });
        setPlatformDetails(newDetails);
      }
    } else if (businessType === 'new') {
      setPlatformDetails(initialPlatformState);
      setBusinessNameConfirmed(false);
    } else {
      setBusinessNameConfirmed(false);
      setNewBusinessName('');
      setSelectedCompanyId('');
      setPlatformDetails(initialPlatformState);
      setProductDetail({})
    }
  }, [selectedCompanyId, businessType]);

  const handleLinkPlatform = (platformId) => {
    setPlatformToLink(platformId);
    setShowLinkModal(true);
  };

  const handleSavePlatformLink = async (platformId, data) => {
    const platformName = socialPlatforms.find(p => p.id === platformId)?.name.toLowerCase() || platformId;
    const defaultDisplayLink = data.productPageUrl || (data.pageName ? `https://${platformName}.com/${data.pageName}` : '');

    console.log(data);
    console.log(platformId);
    console.log(platformName);
    console.log(defaultDisplayLink);

    const { code } = await loginWithSocial(platformName, {
      pagename: data.pageName,
      producturl: data.productPageUrl,
      productid: selectedCompanyId

    });
    console.log(`loginresponse -->> ${code}`);
    if (code != null) {
      setPlatformDetails(prev => ({
        ...prev,
        [platformId]: {
          ...data,
          isLinked: true,
          displayLink: data.productPageUrl || defaultDisplayLink
        }
      }));
      setShowLinkModal(false);
      setPlatformToLink(null);
    }


    // console.log(platformDetails);

  };

  const handleSubmitBusiness = () => {
    let submissionData = {
      businessType,
      platforms: platformDetails
    };
    if (businessType === 'existing') {
      submissionData.companyId = selectedCompanyId;
      submissionData.companyName = mockExistingBusinesses.find(c => c.id === selectedCompanyId)?.name;
    } else {
      submissionData.businessName = newBusinessName;
    }
    console.log("Submitting Business Data:", submissionData);
    alert('Business details submitted! (Check console for data)');
    setBusinessType(null);
  };

  const handleConfirmBusinessName = async () => {
    console.log("handleConfirmBusinessName");
    if (newBusinessName.trim() === '') {
      alert('Please enter a business name.');
      return;
    }

    try {
      const result = await extCompanyRegorAddPrdct(newBusinessName); // make sure 'params' is defined
      console.log("Business added successfully", result);
      if (result.status === 201) {
        setProductDetail(result.data ?? {});
        setSelectedCompanyId(result?.data?.product_id)
        toast.success('Business added successfully!');
        setBusinessNameConfirmed(true);
      }
    } catch (error) {
      console.error("Add business error:", error);
    }
  };

  const renderPlatformList = () => {
    const sortedPlatforms = [...socialPlatforms].sort((a, b) => {
      const isALinked = platformDetails[a.id]?.isLinked;
      const isBLinked = platformDetails[b.id]?.isLinked;
      if (isALinked && !isBLinked) return -1;
      if (!isALinked && isBLinked) return 1;
      return 0;
    });

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Link Social Media Platforms:</h3>
        {sortedPlatforms.map(platform => {
          const details = platformDetails[platform.id];
          const isLinked = details?.isLinked;

          if (isLinked) {
            return (
              <div
                key={platform.id}
                className="p-4 border border-green-500 dark:border-green-600 rounded-lg flex items-center justify-between bg-green-50 dark:bg-green-900/30 shadow-md"
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {platform.icon}
                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-semibold text-gray-800 dark:text-gray-100 truncate"
                      title={details.pageName}
                    >
                      {details.pageName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{platform.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  {details.displayLink && (
                    <a
                      href={details.displayLink.startsWith('http') ? details.displayLink : `//${details.displayLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={`Visit ${details.pageName} on ${platform.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleLinkPlatform(platform.id)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={platform.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {platform.icon}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{platform.name}</span>
                </div>
                <button
                  onClick={() => handleLinkPlatform(platform.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary rounded-md"
                >
                  <LinkIcon className="w-4 h-4" />
                  Link
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Add a Business</h1>

      {!businessType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setBusinessType('existing')}
            className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <Building className="w-12 h-12 mx-auto mb-4 text-theme-primary" />
            <h2 className="text-xl font-semibold">Existing Business</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect an existing business profile.</p>
          </button>
          <button
            onClick={() => setBusinessType('new')}
            className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <PlusCircle className="w-12 h-12 mx-auto mb-4 text-theme-primary" />
            <h2 className="text-xl font-semibold">New Business</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set up a new business profile from scratch.</p>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
          <button
            onClick={() => setBusinessType(null)}
            className="text-sm text-theme-primary hover:underline mb-6"
          >
            &larr; Back to options
          </button>

          {businessType === 'existing' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Connect Existing Business</h2>
              <div className="mb-6">
                <label htmlFor="companySelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Company
                </label>
                <div className="relative">
                  <select
                    id="companySelect"
                    value={selectedCompanyId}
                    onChange={(e) => {
                      console.log(e.target.value);
                      
                      setSelectedCompanyId(e.target.value)
                    }}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-theme-primary focus:border-theme-primary sm:text-sm rounded-md dark:bg-gray-700"
                  >
                    <option value="">-- Select a Company --</option>
                    {productList.map(company => (
                      <option key={company?.id} value={company?.id}>{company?.product_name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {selectedCompanyId && renderPlatformList()}
            </div>
          )}

          {businessType === 'new' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Add New Business</h2>
              {!businessNameConfirmed ? (
                <>
                  <div className="mb-6">
                    <label htmlFor="newBusinessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="newBusinessName"
                      value={newBusinessName}
                      onChange={(e) => setNewBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                      placeholder="Enter your business name"
                    />
                  </div>
                  <button
                    onClick={handleConfirmBusinessName}
                    disabled={!newBusinessName.trim()}
                    className="w-full py-2.5 px-4 bg-theme-secondary hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Confirm Name & Proceed <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name:</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{newBusinessName}</p>
                  </div>
                  {renderPlatformList()}
                </>
              )}
            </div>
          )}

          {((businessType === 'new' && businessNameConfirmed) || (businessType === 'existing' && selectedCompanyId)) ? (
            <button
              onClick={handleSubmitBusiness}
              className="w-full mt-8 py-3 px-4 bg-theme-primary hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Submit Business Details
            </button>
          ) : null}
        </div>
      )}

      {showLinkModal && platformToLink && (
        <LinkPlatformModal
          platformName={socialPlatforms.find(p => p.id === platformToLink)?.name || ''}
          platformIcon={socialPlatforms.find(p => p.id === platformToLink)?.icon}
          initialPageName={platformDetails[platformToLink]?.pageName || ''}
          initialProductPageUrl={platformDetails[platformToLink]?.productPageUrl || ''}
          onSubmit={(data) => handleSavePlatformLink(platformToLink, data)}
          onClose={() => {
            setShowLinkModal(false);
            setPlatformToLink(null);
          }}
        />
      )}
    </div>
  );
};

export default AddBusinessPage;
