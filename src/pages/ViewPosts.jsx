import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { extCompanyProductData, extCompanyPrdctFBlistVideos, extCompanyPrdctTWTlistVideos, extCompanyMstrDataSource, extCompanyProductAndDS, 
  extCompanyPrdctIGlistVideos,extCompanyPrdctLIlistVideos,extCompanyPrdctYTlistVideos
} from '../API/api';
import { Search, Filter, Heart, MessageSquare, Repeat, BarChart, Calendar, MoreHorizontal, Eye, ChevronDown } from 'lucide-react';

const ViewPosts = () => {
  
  const [dateFilterType, setDateFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataRes, setDataRes]= useState([])
  const [dataResVideos, setDataResVideos]= useState([])
  const [dataResComments, setDataResComments]= useState([])
  const [prdctAndDS, setPrdctAndDS] = useState([]);
  const [selectedValue, setSelectedValue] = useState("")
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dateFilterRef = useRef(null);
  let productId = localStorage.getItem("product_id")
  let { platform_name, product_id, ext_prdct_data_source_id } = location.state || {}; // Destructure the same keys
  console.log("localStorageID",productId)
  
  // Sample data for published posts
  const posts = [
    { 
      id: 1, 
      title: 'Summer Collection Launch', 
      content: 'Introducing our new summer collection! 🌞 Fresh styles, vibrant colors, and breathable fabrics perfect for the season. Shop now and get 20% off with code SUMMER23.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Instagram',
      date: '2023-07-10T14:00:00',
      metrics: {
        likes: 1243,
        comments: 78,
        shares: 32,
        views: 8456
      },
      color: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40'
    },
    { 
      id: 2, 
      title: 'Weekly Tips & Tricks', 
      content: 'This week\'s productivity tips: 1️⃣ Use the two-minute rule: If it takes less than 2 minutes, do it now 2️⃣ Try the Pomodoro technique 3️⃣ Plan tomorrow\'s tasks today',
      image: null,
      platform: 'Twitter',
      date: '2023-07-08T09:00:00',
      metrics: {
        likes: 538,
        comments: 42,
        shares: 127,
        views: 3254
      },
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40'
    },
    { 
      id: 3, 
      title: 'Customer Testimonial Video', 
      content: 'Hear what our customers are saying about their experiences! We\'re grateful for the fantastic feedback and honored to be part of your journey.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Facebook',
      date: '2023-07-05T16:30:00',
      metrics: {
        likes: 865,
        comments: 108,
        shares: 64,
        views: 5812
      },
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40'
    },
    { 
      id: 4, 
      title: 'Company Milestone', 
      content: 'We\'re thrilled to announce that we\'ve reached 100,000 customers worldwide! 🎉 Thank you for your continued support and trust in our products and services.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'LinkedIn',
      date: '2023-07-03T11:15:00',
      metrics: {
        likes: 1432,
        comments: 215,
        shares: 178,
        views: 7689
      },
      color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40'
    },
    { 
      id: 5, 
      title: 'Product Feature Announcement', 
      content: 'New feature alert! 🚀 You can now schedule posts across all platforms with our intelligent timing optimizer. Get the best engagement for every post!',
      image: null,
      platform: 'Twitter',
      date: '2023-07-02T13:45:00',
      metrics: {
        likes: 723,
        comments: 56,
        shares: 98,
        views: 4321
      },
      color: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40'
    },
    { 
      id: 6, 
      title: 'Behind the Scenes', 
      content: 'Take a peek behind the curtain! 👀 Here\'s what goes into creating our premium products. From concept to creation, we ensure quality at every step.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Instagram',
      date: '2023-06-28T10:30:00',
      metrics: {
        likes: 957,
        comments: 64,
        shares: 27,
        views: 6245
      },
      color: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40'
    },
    { 
      id: 7, 
      title: 'May Content Recap', 
      content: 'Looking back at our top performing content from May. Thanks to all our followers for your amazing engagement! Check out these highlights.',
      image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Facebook',
      date: '2023-05-31T08:15:00',
      metrics: {
        likes: 843,
        comments: 92,
        shares: 45,
        views: 5320
      },
      color: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40'
    },
    { 
      id: 8, 
      title: 'April Product Update', 
      content: 'Check out the new features we\'ve added in April! Improved analytics, faster performance, and enhanced user experience.',
      image: null,
      platform: 'LinkedIn',
      date: '2023-04-15T14:30:00',
      metrics: {
        likes: 1156,
        comments: 128,
        shares: 83,
        views: 6840
      },
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40'
    },
  ];

  
  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
 useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
        setShowDateFilter(false);
      }
    };

    if (showDateFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateFilter]);
  // Get all unique years from posts
  const getAvailableYears = () => {
    const years = new Set();
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  const availableYears = getAvailableYears();

  // Filter posts based on selected platform, date filter, and search query
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Facebook':
        return <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">f</div>;
      case 'Instagram':
        return <div className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">IG</div>;
      case 'Twitter':
        return <div className="bg-blue-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">X</div>;
      case 'LinkedIn':
        return <div className="bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">in</div>;
      default:
        return null;
    }
  };

  const handleDateFilterChange = (type) => {
    setDateFilterType(type);
    // Reset values when changing filter type
    if (type !== 'date') setSelectedDate('');
    if (type !== 'month') {
      setSelectedMonth('');
    }
    if (type !== 'custom') {
      setCustomDateFrom('');
      setCustomDateTo('');
    }
  };

  // Clear all date filters
  const clearDateFilters = () => {
    setDateFilterType('all');
    setSelectedDate('');
    setSelectedMonth('');
    setCustomDateFrom('');
    setCustomDateTo('');
  };

   const fetchVideos = async (platformId, extDSId) => {
    // const videosData = {}
    let response;
    try {


      switch (platformId) {
      case 8984:
        response = await extCompanyPrdctYTlistVideos(extDSId);
        // if (response){
        //   videosData = response.data;
        // }
        break;
      case 7066:
        response = await extCompanyPrdctFBlistVideos(extDSId);
        // if (response){
        //   videosData = response.data;
        // }
        break;
      case 7378:
        response = await extCompanyPrdctIGlistVideos(extDSId);
        // if (response){
        //   videosData = response.data;
        // }
        break;
      case 7668:
        response = await extCompanyPrdctLIlistVideos(extDSId);
        // if (response){
        //   videosData = response.data;
        // }
        break;
      case 8487:
        console.log("twitterlistVideos: ", extDSId)  
        response = await extCompanyPrdctTWTlistVideos(extDSId);
        // if (response){
        //   videosData = response.data;
        // }
        break;
      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
   
    const videosData = response?.data;  
    
    if (videosData) {
      return Array.isArray(videosData) 
        ? videosData.map(video => ({ 
            ...video, 
            platform: getPlatformNameById(platformId) // Convert ID to name
          }))
        : [];
    }
    console.log(`No videos found for platform ID: ${platformId}`);
    return [];


    } catch (error) {
      console.error(`Error fetching ${platformId} videos:`, error);
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      return [];
    }
  };

  const getPlatformNameById = (platformId) => {
  const platformNames = {
    8984: "YouTube",
    7066: "Facebook",
    7378: "Instagram",
    7668: "LinkedIn",
    8487  : "Twitter"
  };
  return platformNames[platformId] || "Unknown";
};


  useEffect (() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      let authTokens = localStorage.getItem("authToken")
        ? (localStorage.getItem("authToken"))
        : null;
      console.log("Debugging",authTokens)
      
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id)
      
      extCompanyProductAndDS()  // testing must use user_id
          .then(response => {
              console.log("debugging1",response)
              if (response.status === 200 || response.status === 201) {
                    const allProducts = response.data; // Array of products
                    console.log("All Products:", allProducts);

                    // Fetch videos for ALL products and ALL their data_sources
                    const fetchAllVideos = async () => {
                      let combinedVideos = [];

                      // Loop through each product
                      for (const product of allProducts) {
                        if (!product.data_sources) continue;

                        // Loop through each data_source in the product
                        for (const source of product.data_sources) {
                          try {
                              if(source){
                                const videos = await fetchVideos(
                                source?.data_source_id,
                                source?.id
                            
                                );
                                if (videos){
                                combinedVideos = [...combinedVideos, ...videos];
                                }else{
                                  console.log(`there is no records for ${source.data_source_id}`)
                                }
                              }
                          } catch (error) {
                            console.error(
                              `Failed for product ${product.id}, platform ${source.data_source_id}:`,
                              error
                            );
                          }
                        }
                      }

                      setDataResVideos(combinedVideos);
                    };

                    fetchAllVideos();
                }
            })
            .catch(error => {
              console.error("Error fetching data:", error);
            });

      var temp_passing_id = ""
      if (ext_prdct_data_source_id)
      {
        temp_passing_id -ext_prdct_data_source_id

      } else if(product_id){
        temp_passing_id = product_id
      }
      else if(productId){
        temp_passing_id = productId
      }
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id, productId)
      ext_prdct_data_source_id = ext_prdct_data_source_id ?? 7;
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id, productId)
      // axios({
      //   method: "GET",
      //   url:"http://127.0.0.1:5000/facebook/fblistposts/" + ext_prdct_data_source_id,
      //   headers: { Authorization: `Bearer ${authTokens}` },
      // })
      // platform_name = platform_name ?? "facebook";
      // if(platform_name === "facebook")
      // {
      //     extCompanyPrdctFBlistVideos(ext_prdct_data_source_id)
      //     .then((response) => {
      //       console.log("Debugging, FBPOST", response)
      //       const resFBVideos = response.data
            
      //       console.log("FBVIDEOS",resFBVideos)
      //       if(resFBVideos)
      //       {  

      //          // Add platform:"Twitter" to each item if response exists
      //         const videosWithPlatform = Array.isArray(resFBVideos) ? 
      //               resFBVideos.map(video => ({...video, platform: "Facebook"})): [];
      //         setDataResVideos(videosWithPlatform)
      //       }
      //       else{
      //         console.log("There is no record")
      //       }
           
            
      //     }).catch((error) => {
      //       if (error.response) {
      //         console.log(error.response)
      //         console.log(error.response.status)
      //         console.log(error.response.headers)
      //         }
      //     })
      //   }
        // if(platform_name === "twitter")
        // {
        //   extCompanyPrdctTWTlistVideos(ext_prdct_data_source_id)
        //   .then((response) => {
        //     console.log("Debugging, TWITTERPOST", response)
        //     const resTWTVideos = response.data
            
        //     console.log(resTWTVideos)
        //     if(resTWTVideos)
        //     {  

        //        // Add platform:"Twitter" to each item if response exists
        //       const videosWithPlatform = Array.isArray(resTWTVideos) ? 
        //             resTWTVideos.map(video => ({...video, platform: "Twitter"})): [];
        //       setDataResVideos(videosWithPlatform)
        //     }
        //     else{
        //       console.log("There is no record")
        //     }
        //     // console.log(dataResVideos)
            
        //   }).catch((error) => {
        //     console.error(`Error fetching  videos:`, error);
        //     if (error.response) {
        //       console.log(error.response)
        //       console.log(error.response.status)
        //       console.log(error.response.headers)
        //       }
        //   })
        // }

      }, []);  


    const filteredPosts = dataResVideos?.filter(post => {
    // Platform filter
    if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
      return false;
    }
    
    // Search query filter
    if (searchQuery && !post.video_title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Date filter
    const postDate = new Date(post.video_publish_date);
    
    if (dateFilterType === 'date' && selectedDate) {
      const selectedDateTime = new Date(selectedDate);
      return (
        postDate.getFullYear() === selectedDateTime.getFullYear() &&
        postDate.getMonth() === selectedDateTime.getMonth() &&
        postDate.getDate() === selectedDateTime.getDate()
      );
    }
    
    if (dateFilterType === 'month' && selectedMonth && selectedYear) {
      const month = parseInt(selectedMonth);
      return (
        postDate.getFullYear() === parseInt(selectedYear) &&
        postDate.getMonth() === month
      );
    }
    
    if (dateFilterType === 'custom' && customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom);
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      return postDate >= fromDate && postDate <= toDate;
    }
    
    return true;
  });


      // Filter posts based on selected platform and search query
  // const filteredPosts = dataResVideos?.filter(post => 
  //   (selectedPlatform === 'all' || "Facebook" === selectedPlatform) &&
  //   (post.video_title.toLowerCase().includes(searchQuery.toLowerCase()))
  // );
  

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Published Posts</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
            >
              <option value="all">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
            <div className="relative">
  
  <select
    className="appearance-none px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
  >
    <option value="1">Product A</option>
    <option value="2">Product B</option>
    <option value="3">Product C</option>
  </select>
</div>
            {/* Date Filter Button */}
            <div className="relative" ref={dateFilterRef}>
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowDateFilter(!showDateFilter)}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {dateFilterType === 'all' ? 'All Time' : 
                   dateFilterType === 'date' ? 'By Date' :
                   dateFilterType === 'month' ? 'By Month' : 'Custom Range'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div>
                

              </div>
              {/* Date Filter Dropdown */}
              {showDateFilter && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20 min-w-[260px]">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Filter by Date</h3>
                      <button 
                        className="text-sm text-red-500 hover:text-red-700"
                        onClick={clearDateFilters}
                      >
                        Clear
                      </button>
                    </div>
                    
                    <div className="flex items-center  mb-2">
                      <input 
                        type="radio" 
                        id="all-time" 
                        name="date-filter" 
                        checked={dateFilterType === 'all'} 
                        onChange={() => handleDateFilterChange('all')}
                        className="text-theme-primary focus:ring-theme-primary w-10"
                      />
                      <label htmlFor="all-time">All Time</label>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="radio" 
                        id="by-date" 
                        name="date-filter" 
                        checked={dateFilterType === 'date'} 
                        onChange={() => handleDateFilterChange('date')}
                        className="text-theme-primary focus:ring-theme-primary w-10"
                      />
                      <label htmlFor="by-date">Specific Date</label>
                    </div>
                    
                    {dateFilterType === 'date' && (
                      <div className="pl-6 mb-2">
                        <input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="radio" 
                        id="by-month" 
                        name="date-filter" 
                        checked={dateFilterType === 'month'} 
                        onChange={() => handleDateFilterChange('month')}
                        className="text-theme-primary focus:ring-theme-primary w-10"
                      />
                      <label htmlFor="by-month">By Month</label>
                    </div>
                    
                    {dateFilterType === 'month' && (
                      <div className="pl-6 mb-2 space-y-2">
                        <select 
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                        >
                          <option value="">Select Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                          ))}
                        </select>
                        
                        <select 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                        >
                          {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="radio" 
                        id="custom-range" 
                        name="date-filter" 
                        checked={dateFilterType === 'custom'} 
                        onChange={() => handleDateFilterChange('custom')}
                        className="text-theme-primary focus:ring-theme-primary w-10"
                      />
                      <label htmlFor="custom-range">Custom Range</label>
                    </div>
                    
                    {dateFilterType === 'custom' && (
                      <div className="pl-6 space-y-2">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">From</label>
                          <input 
                            type="date" 
                            value={customDateFrom}
                            onChange={(e) => setCustomDateFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">To</label>
                          <input 
                            type="date" 
                            value={customDateTo}
                            onChange={(e) => setCustomDateTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    )}
                    
                    <button 
                      className="mt-2 bg-theme-primary hover:bg-opacity-90 text-white py-2 px-4 rounded-md"
                      onClick={() => setShowDateFilter(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(dateFilterType !== 'all' || selectedPlatform !== 'all' || searchQuery) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {dateFilterType === 'date' && selectedDate && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <span>Date: {new Date(selectedDate).toLocaleDateString()}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setDateFilterType('all');
                    setSelectedDate('');
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            
            {dateFilterType === 'month' && selectedMonth && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <span>Month: {months[parseInt(selectedMonth)]} {selectedYear}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setDateFilterType('all');
                    setSelectedMonth('');
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            
            {dateFilterType === 'custom' && customDateFrom && customDateTo && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <span>Range: {new Date(customDateFrom).toLocaleDateString()} - {new Date(customDateTo).toLocaleDateString()}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setDateFilterType('all');
                    setCustomDateFrom('');
                    setCustomDateTo('');
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            
            {selectedPlatform !== 'all' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <span>Platform: {selectedPlatform}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedPlatform('all')}
                >
                  &times;
                </button>
              </div>
            )}
            
            {searchQuery && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                <span>Search: {searchQuery}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              </div>
            )}
            
            <button 
              className="text-xs text-theme-primary hover:underline"
              onClick={() => {
                setDateFilterType('all');
                setSelectedDate('');
                setSelectedMonth('');
                setCustomDateFrom('');
                setCustomDateTo('');
                setSelectedPlatform('all');
                setSearchQuery('');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div 
              key={post.id} 
              className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${post.color}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {getPlatformIcon(post.platform)}
                    <span className="ml-2 font-medium">{post.platform}</span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">{post.video_title}</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={post.video_url} 
                      alt={post.video_title} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(post.video_publish_date)}</span>
                  </div>
                  <span>{getTimeAgo(post.video_publish_date)}</span>
                </div>
                
                <div className="mt-4 flex justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.likes_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-sm">10</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Repeat className="w-4 h-4 mr-1" />
                    <span className="text-sm">12</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.views_count.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="text-sm text-theme-primary hover:underline">View Post Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <BarChart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium mb-1">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPosts;
