import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday as dateFnsIsToday, addDays, subDays, parse } from 'date-fns';
import { ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Linkedin, Youtube, Briefcase, Tag, PlusCircle } from 'lucide-react';
import AddPostModalCalendar from '../components/calendar/AddPostModalCalendar';
import PlatformFilterCalendar from '../components/calendar/PlatformFilterCalendar';
import DayColumnWithTimes from '../components/calendar/DayColumnWithTimes';
import PostPreviewModalCalendar from '../components/calendar/PostPreviewModalCalendar';
import ConfirmationModal from '../components/ConfirmationModal';
import { useTheme } from '../contexts/ThemeContext';
import { extCompanyProductData, 
  extCompanyMstrDataSource, 
  extCompanyGetPostCreationByBusiness,
  extCompanyProductDataById,
  addPost,
  deletePostDraft,
} from '../API/api';
import { Await } from 'react-router-dom';

// const initialBusinesses = [
//   { id: 1, name: 'TechCorp Solutions' },
//   { id: 2, name: 'Innovate Hub' },
//   { id: 3, name: 'GreenLeaf Organics' },
// ];

const today = new Date();
const initialPosts = [
  // Week 1 (Current Week)
  { id: '1', title: 'Morning FB Post', date: format(today, 'yyyy-MM-dd'), time: '01:00', platform: 'Facebook', status: 'Scheduled', contentPreview: 'Big summer sale starts! Don\'t miss out on our exclusive deals. #SummerSale #Deals', image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/FFA07A/FFFFFF?text=Summer+Sale+Ad', businessId: 1 },
  { id: '2', title: 'LI Article: Future of Work', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '14:00', platform: 'LinkedIn', status: 'Posted', contentPreview: 'Exploring the evolving landscape of remote work and hybrid models. #FutureOfWork #LinkedInArticle', image: null, businessId: 1 },
  { id: '3', title: 'IG Story Teaser - New Product', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '11:00', platform: 'Instagram', status: 'Draft', contentPreview: 'Something exciting is launching soon! Keep an eye out. 👀 #NewProduct #Teaser', image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/BA55D3/FFFFFF?text=Product+Teaser', businessId: 2 },
  { id: '4', title: 'Twitter Q&A Session', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '16:00', platform: 'Twitter', status: 'Scheduled', contentPreview: 'Join us for a live Q&A session this Friday! Ask us anything. #AskUsAnything #TwitterChat', image: null, businessId: 2 },
  { id: '5', title: 'YouTube Premiere: Product Demo', date: format(addDays(today, 4), 'yyyy-MM-dd'), time: '18:00', platform: 'Youtube', status: 'Scheduled', contentPreview: 'Watch the premiere of our new product demo. Set your reminders! 🚀 #YouTubePremiere #ProductDemo', image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/FF0000/FFFFFF?text=YouTube+Video+Thumb', businessId: 3 },
  { id: '6', title: 'Evening IG Post - 10K Followers!', date: format(today, 'yyyy-MM-dd'), time: '20:00', platform: 'Instagram', status: 'Posted', contentPreview: 'Wow! We just hit 10,000 followers! Thank you all for your amazing support. ❤️ #Milestone #Community', image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/FFD700/000000?text=10K+Followers', businessId: 1 },
  { id: '7', title: 'TechCorp Blog Update', date: format(today, 'yyyy-MM-dd'), time: '10:00', platform: 'LinkedIn', status: 'Draft', contentPreview: 'Our latest blog post on AI trends is now live. Check it out!', businessId: 1 },
  { id: '8', title: 'Innovate Hub Webinar', date: format(addDays(today, 3), 'yyyy-MM-dd'), time: '15:00', platform: 'LinkedIn', status: 'Scheduled', contentPreview: 'Webinar on disruptive technologies.', businessId: 2 },
  { id: '9', title: 'GreenLeaf Product Highlight', date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '12:00', platform: 'Instagram', status: 'Scheduled', contentPreview: 'Spotlight on our new organic tea.', businessId: 3 },
  { id: '10', title: 'Facebook Ad Campaign Launch', date: format(today, 'yyyy-MM-dd'), time: '08:00', platform: 'Facebook', status: 'Posted', contentPreview: 'Our new ad campaign is live! Check it out and let us know what you think.', businessId: 2 },
  { id: '11', title: 'Twitter Poll: Next Feature', date: format(addDays(today, 3), 'yyyy-MM-dd'), time: '10:00', platform: 'Twitter', status: 'Draft', contentPreview: 'Help us decide our next big feature! Vote in our poll today.', businessId: 1 },
  { id: '12', title: 'YouTube Behind the Scenes', date: format(addDays(today, 5), 'yyyy-MM-dd'), time: '13:00', platform: 'Youtube', status: 'Scheduled', contentPreview: 'A sneak peek into how we create our magic. Full video coming soon!', businessId: 3 },
  { id: '13', title: 'Mid-day IG Reel', date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '13:00', platform: 'Instagram', status: 'Scheduled', contentPreview: 'Quick tips for your Monday motivation! #MondayMotivation #QuickTips', businessId: 2 },
  { id: '14', title: 'LinkedIn Thought Leadership', date: format(addDays(today, 4), 'yyyy-MM-dd'), time: '09:00', platform: 'LinkedIn', status: 'Draft', contentPreview: 'The importance of sustainable practices in modern business. #Sustainability #BusinessEthics', businessId: 1 },
  { id: '15', title: 'Weekend Special FB Offer', date: format(addDays(today, 5), 'yyyy-MM-dd'), time: '17:00', platform: 'Facebook', status: 'Scheduled', contentPreview: 'Exclusive weekend offer for our loyal followers. Don\'t miss out!', businessId: 3 },
    // Week 2 (Next Week)
  { id: '16', title: 'Weekly Newsletter Summary', date: format(addDays(today, 7), 'yyyy-MM-dd'), time: '10:00', platform: 'LinkedIn', status: 'Scheduled', contentPreview: 'Catch up on this week\'s highlights from our newsletter.', businessId: 1 },
  { id: '17', title: 'Instagram Live Q&A', date: format(addDays(today, 8), 'yyyy-MM-dd'), time: '19:00', platform: 'Instagram', status: 'Draft', contentPreview: 'Join our CEO for a live Q&A session. Get your questions ready!', businessId: 2 },
  { id: '18', title: 'New Tutorial Video (YT)', date: format(addDays(today, 10), 'yyyy-MM-dd'), time: '15:00', platform: 'Youtube', status: 'Scheduled', contentPreview: 'Step-by-step guide to using our latest feature.', businessId: 3 },

  // Week 0 (Previous Week for more data)
  { id: '19', title: 'Throwback Thursday Post', date: format(subDays(today, 3), 'yyyy-MM-dd'), time: '11:00', platform: 'Instagram', status: 'Posted', contentPreview: '#TBT to our company\'s first office!', businessId: 1 },
  { id: '20', title: 'Client Success Story (FB)', date: format(subDays(today, 2), 'yyyy-MM-dd'), time: '14:00', platform: 'Facebook', status: 'Posted', contentPreview: 'Read how we helped Client X achieve 200% growth.', businessId: 2 },
  { id: '21', title: 'Industry News Update (Twitter)', date: format(subDays(today, 1), 'yyyy-MM-dd'), time: '09:30', platform: 'Twitter', status: 'Posted', contentPreview: 'Latest updates from the tech industry this week.', businessId: 1 },
  { id: '22', title: 'Early Bird Discount Reminder', date: format(today, 'yyyy-MM-dd'), time: '11:30', platform: 'Facebook', status: 'Scheduled', contentPreview: 'Last chance for early bird discount on our new course!', businessId: 3 },
  { id: '23', title: 'Meet the Team Monday', date: format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd'), time: '10:00', platform: 'LinkedIn', status: 'Posted', contentPreview: 'This week, meet Sarah, our Head of Marketing!', businessId: 1 },
  { id: '24', title: 'Special Announcement', date: format(addDays(today, 0), 'yyyy-MM-dd'), time: '17:00', platform: 'Twitter', status: 'Draft', contentPreview: 'Big news coming tomorrow! Stay tuned!', businessId: 2 },
  { id: '25', title: 'Product Feedback Request', date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '16:00', platform: 'Facebook', status: 'Scheduled', contentPreview: 'We\'d love to hear your feedback on our latest update. #Feedback', businessId: 1 },
];

const platformDetails = {
  Facebook: { name: 'Facebook', icon: <Facebook className="w-4 h-4 text-white" />, colorValue: '#3b82f6', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-200' },
  Instagram: { name: 'Instagram', icon: <Instagram className="w-4 h-4 text-white" />, colorValue: '#ec4899', tagColor: 'bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-200' },
  Twitter: { name: 'Twitter', icon: <Twitter className="w-4 h-4 text-white" />, colorValue: '#0ea5e9', tagColor: 'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-200' },
  LinkedIn: { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4 text-white" />, colorValue: '#0e76a8', tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' },
  Youtube: { name: 'Youtube', icon: <Youtube className="w-4 h-4 text-white" />, colorValue: '#ff0000', tagColor: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200' },
  Default: { name: 'Platform', icon: <Tag className="w-4 h-4 text-white"/>, colorValue: '#64748b', tagColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}
};

const statusColors = {
  Draft: 'bg-white/20 text-white',
  Scheduled: 'bg-white/20 text-white',
  Posted: 'bg-white/20 text-white',
};

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const CalendarViewPage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  // const [posts, setPosts] = useState(initialPosts);
  const [posts, setPosts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDateTime, setModalDateTime] = useState({ date: null, time: null });
  const [activePlatformFilters, setActivePlatformFilters] = useState(Object.keys(platformDetails).filter(p => p !== 'Default'));
  const [selectedBusinessId, setSelectedBusinessId] = useState();
  const [initialBusinesses, setInitialBusinesses] = useState([]);
  const [platformObject, setPlatformObject] = useState({}); // Initialize with empty object

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [postForPreview, setPostForPreview] = useState(null);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
  const [postToDeletePlatform, setPostToDeletePlatform] = useState(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { themeColors, isDarkMode } = useTheme();
  const [productCreationPosts, setProductCreationPosts] = useState([]);

  const [socialMediaDatas, setSocialMediaDatas] = useState([]);
  const [productDatas, setProductDatas] = useState([]);

  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const movePost = useCallback((postId, newDate, newTime) => {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, date: newDate, time: newTime } : post
        )
      );
    }, []);

  const handleAddPostClick = async (date, time) => {
    if(!selectedBusinessId)
    { 
      //no businessId selected
      setIsAddModalOpen(false);
    }
   const loadFilterData = async () => {
    try {
      const extData = await fetchExternalData(selectedBusinessId);
      console.log("ExtData:", extData);
      
     
      if (!extData || !extData.length) {
        setIsAddModalOpen(false);
        return [];
      }

      // Create a map of data_source_id to extItem.id for quick lookup
      const extDataMap = new Map();
      extData.forEach(extItem => {
        extDataMap.set(extItem.data_source_id, extItem.id);
      });

      // Filter and include the extItem.id
      const filteredDataWithIds = socialMediaDatas
        ?.filter(socialItem => extDataMap.has(socialItem.id))
        .map(socialItem => ({
          ...socialItem,
          extDataId: extDataMap.get(socialItem.id) // Add the extItem.id
        })) || [];

      console.log("FilteredSocialData with extData IDs:", filteredDataWithIds);
      return filteredDataWithIds;



      // Use filteredData here or set state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function
    const filteredPlatforms = await loadFilterData();
    console.log("FilteredSocialData", filteredPlatforms, socialMediaDatas)
    const matchedDetailsOnly = filteredPlatforms
      ?.map(item => platformDetails[item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)])
      .filter(Boolean);

    console.log("matchedDetailsOnly", matchedDetailsOnly)
    const matchedDetailsObject = matchedDetailsOnly.reduce((acc, platform) => {
      if (platform && platform.name) {
        acc[platform.name] = platform;
      }
      return acc;
    }, {});

    console.log("matchedDetailsOnly", matchedDetailsObject)
    setPlatformObject(matchedDetailsObject)

    setModalDateTime({ date, time: time || '09:00' }); // Default to 09:00 if time is null (e.g. clicking day header +)
    setIsAddModalOpen(true);
  };

  const handleSavePost = async (newPostData) => {
    if(!selectedBusinessId)
    { 
      //no businessId selected
      setIsAddModalOpen(false);
    }
  const loadAndFilterData = async () => {
    try {
      const extData = await fetchExternalData(selectedBusinessId);
      console.log("ExtData:", extData);
      
      // if (!extData) {
      //   setIsAddModalOpen(false);
      //   return;
      // }

      // const filteredData = socialMediaDatas?.filter(socialItem => 
      //             extData.some(extItem => extItem.data_source_id === socialItem.id)
      // )
      // console.log("FilteredSocialData", filteredData, socialMediaDatas);
      // return filteredData;
      if (!extData || !extData.length) {
        setIsAddModalOpen(false);
        return [];
      }

      // Create a map of data_source_id to extItem.id for quick lookup
      const extDataMap = new Map();
      extData.forEach(extItem => {
        extDataMap.set(extItem.data_source_id, extItem.id);
      });

      // Filter and include the extItem.id
      const filteredDataWithIds = socialMediaDatas
        ?.filter(socialItem => extDataMap.has(socialItem.id))
        .map(socialItem => ({
          ...socialItem,
          extDataId: extDataMap.get(socialItem.id) // Add the extItem.id
        })) || [];

      console.log("FilteredSocialData with extData IDs:", filteredDataWithIds);
      return filteredDataWithIds;



      // Use filteredData here or set state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function
    const filteredPlatforms = await loadAndFilterData()
    console.log("FilteredSocialData", filteredPlatforms, socialMediaDatas)
    const matchedDetailsOnly = filteredPlatforms
      ?.map(item => platformDetails[item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)])
      .filter(Boolean);

    console.log("matchedDetailsOnly", matchedDetailsOnly)
    const matchedDetailsObject = matchedDetailsOnly.reduce((acc, platform) => {
      if (platform && platform.name) {
        acc[platform.name] = platform;
      }
      return acc;
    }, {});

    console.log("matchedDetailsOnly", matchedDetailsObject)
    setPlatformObject(matchedDetailsObject)

    const newPost = { 
      ...newPostData, 
      id: String(Date.now() + Math.random()),
      businessId: selectedBusinessId
    };
    // Get the matching platform's extDataId
    const getDataSourceId = () => {
      return filteredPlatforms?.find(
        p => p.type.toLowerCase() === newPost.platform.toLowerCase()
      )?.extDataId || null;
    };
    const scheduled_time = new Date(`${newPost?.date}T${newPost?.time}:00`).toISOString().replace('T', ' ').substring(0, 19)
    console.log("scheduled_time", scheduled_time)
    const newPostWithData = [
      {
        "platform":Number(filteredPlatforms?.find(
                      p => String(p?.type).toLowerCase() === String(newPost?.platform).toLowerCase()
                    )?.id),
        "mstr_id":Number(filteredPlatforms?.find(
                      p => String(p?.type).toLowerCase() === String(newPost?.platform).toLowerCase()
                    )?.id),      
        "post_title":newPost?.title,
        "description": newPost?.contentPreview,
        "media_url":"",
        "scheduled_time": scheduled_time,
        "status":newPost?.status,
        "repeat_interval": "none",
        "ext_product_data_source_id":  getDataSourceId()
      },
  
    ]
    console.log("NEW POST: ", newPostWithData)
    const response = await addPost(newPostWithData)
    if (response)
    {
      console.log("Post is added successfully: ", response)
    }
     console.log("Post is failure: ", response)
    setPosts(prevPosts => [...prevPosts, newPost]);
    setIsAddModalOpen(false);
  };

  const handlePostCardClick = (post) => {
    setPostForPreview(post);
    setIsPreviewModalOpen(true);
  };

  const openDeleteConfirmModal = (postId, postPlatform) => {
    console.log("PostToDelete ID: ", postId, "PostToDeletePlatform: ", postPlatform)
    setPostToDeleteId(postId);
    setPostToDeletePlatform(postPlatform)
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    console.log("PostToDelete ID: ", postToDeleteId, "PostToDeletePlatform: ", postToDeletePlatform)
    if (!postToDeleteId || !postToDeletePlatform) {
      setMessage('Please Select a post');
      return;
    }
    // const postToDelete = posts.find(post => post.id === postToDeleteId);
    try {
      const response = await deletePostDraft(postToDeletePlatform, postToDeleteId);
      console.log("Delete Response",response)
      setMessage({Success: response?.data?.message});
    } catch (error) {
      if (error.response) {
       // setMessage(Error: ${error.response.data.error});
      } else {
        //setMessage('Error: Unable to delete post');
      }
    }
  };
  const handleConfirmDeletePost = () => {
    console.log("PostToDelete ID: ", postToDeleteId, "PostToDeletePlatform: ", postToDeletePlatform)
    handleDelete();
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDeleteId));
    setIsDeleteConfirmOpen(false);
    setPostToDeleteId(null);
    setIsPreviewModalOpen(false); // Close preview modal if post is deleted from it
    setPostForPreview(null);
  };

  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }) });
  }, [currentWeekStart]);

  const fetchMasterDataSource = async () => {
      try {
        const response = await extCompanyMstrDataSource();
        setSocialMediaDatas(response?.data);

        return response.data;

      } catch (err) {
        console.error('Failed to fetch master data source:', err);
        return [];
      }
  };
  
    
  const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await extCompanyProductData(); // Your endpoint to get products
        setProductDatas(response.data)
        const transformedData = response.data.map(item => ({
          ...item,
          name: item.product_name  // Fallbacks product_name field added here as name
        }));
        setInitialBusinesses(transformedData)
         if (transformedData.length > 0) {
          setSelectedBusinessId(transformedData[0].id);
        }
        // if (response?.data?.length > 0) {
        //   setSelectedBusinessId(response?.data[0]?.id)
        // }
        // console.log("FetCHING PRODUCT DATAS",response.data)
        return response.data;
      } catch (err) {
        setError(err.message);
        setProductDatas([])
        return [];
      } finally {
        setLoading(false);
      }
  };

  const fetchExternalData = async (productId) => {
      try {
        const response = await extCompanyProductDataById(productId)
        return response.data;
      } catch (err) {
        console.error(`Failed to fetch external data for product ${productId}:`, err);
        return null;
      }
  };

  const fetchAllData = async () => {
        try {
          setLoading(true);
          
          console.log("SELECTBUSINESSID: ",selectedBusinessId)
          // 1. Fetch all base data in parallel
          const [localProductsResponse, masterDataResponse] = await Promise.all([
            fetchProducts().catch(() => []),
            fetchMasterDataSource().catch(() => [])
          ]);
  
          // 2. Validate and prepare data
          const localProducts = Array.isArray(localProductsResponse) ? localProductsResponse : [];
          const masterData = Array.isArray(masterDataResponse) ? masterDataResponse : [];
          
          
           // 3. Process each product with its external data and posts
          const productsWithAllData = await Promise.all(
            localProducts.map(async (product) => {
              try {
                const externalDataArray = await fetchExternalData(product?.id).catch(() => []);
                
                const enrichedExternalData = await Promise.all(
                  externalDataArray?.map(async (externalData) => {
                    try {
                      const platformInfo = masterData.find(
                        item => item.id === externalData.data_source_id
                      );
                     
                    const postsResponse = await extCompanyGetPostCreationByBusiness(platformInfo?.type, externalData?.id)
                      
                    // console.log("POSTS",postsResponse)  
                    // Add platformName to each post
                    // const posts = postsResponse?.data 
                    //   ? postsResponse.data.map(post => ({
                    //        ...post,
                    //       date: format(new Date(post?.scheduled_time),'yyyy-MM-dd'),//format(new Date(post?.scheduled_time),'yyyy-MM-dd'),
                    //       time: "09:00",//format(new Date(post?.scheduled_time),'HH:mm'),
                    //       contentReview:post?.description,
                    //       title: post?.description,
                    //       businessId:product.id,
                    //       extDsId:externalData.id,
                    //       platformId:platformInfo.id,
                    //       platform: platformInfo?.type ? (platformInfo.type.charAt(0).toUpperCase() + platformInfo.type.slice(1).toLowerCase()): 'Default' // Add platform name here
                          
                    //     }))
                    //   : [];

                    const posts = postsResponse?.data 
                      ? postsResponse.data.map(post => {
                          const scheduledTime = new Date(post?.scheduled_time);
                          const minutes = scheduledTime.getMinutes();
                          
                          if (minutes >= 30) {
                            scheduledTime.setHours(scheduledTime.getHours() + 1); // Round up
                          }
                          scheduledTime.setMinutes(0, 0, 0); // Reset minutes & seconds
                          
                          return {
                            ...post,
                            date: format(new Date(post?.scheduled_time), 'yyyy-MM-dd'),
                            time: format(scheduledTime, 'HH:mm'), // "10:00" (if original was 09:49)
                            contentReview: post?.description,
                            title: post?.description,
                            businessId: product.id,
                            extDsId: externalData.id,
                            platformId: platformInfo.id,
                            platform: platformInfo?.type 
                              ? (platformInfo.type.charAt(0).toUpperCase() + platformInfo.type.slice(1).toLowerCase())
                              : 'Default'
                          };
                        })
                      : [];
  
                    return {
                      ...externalData,
                      platformInfo,
                      posts,
                      postsError: postsResponse.error || null
                    };
                    } catch (error) {
                      return {
                        ...externalData,
                        posts: [],
                        postsError: error.message
                      };
                    }
                  })
                );
  
                return {
                  ...product,
                  externalData: enrichedExternalData
                };
              } catch (error) {
                return {
                  ...product,
                  externalData: [],
                  error: error.message
                };
              }
            })
          );
  
          // 4. Extract all posts and set state
          const allPosts = productsWithAllData.flatMap(product => 
            product.externalData.flatMap(data => data.posts)
          );
          console.log("ALL POSTS", allPosts)
          
          // setProductCreationPosts(allPosts); // Set the posts state
          setPosts(allPosts)
          // setPosts(initialPosts)
          setProductDatas(localProducts); // Set products data if needed
          return localProducts;
  
        } catch (error) {
          console.error('Error in fetchAllData:', error);
          setError('Failed to load product data');
          setProductCreationPosts([]); // Reset posts on error
          return [];
        } finally {
          setLoading(false);
        }
  };
    

  useEffect(() => {
    fetchAllData();
    console.log("INITIALBUSINESSES", initialBusinesses)
    if (selectedBusinessId == null || 
      !initialBusinesses.some(b => b.id === selectedBusinessId)) {
      setSelectedBusinessId(initialBusinesses[0]?.id);
    }
    // setPosts(initialPosts);
    console.log("SELECTEDBUSINESSID: ",selectedBusinessId)
  }, []);
  
  const filteredPosts = useMemo(() => {
    console.log("activePlatformFilters Length, activePlatformFilters,  Object.keys(platfrmsDtls).length, POSTS", selectedBusinessId, activePlatformFilters.length, activePlatformFilters, Object.keys(platformDetails).filter(p=>p !== 'Default').length, posts)
    return posts.filter(post =>
      (activePlatformFilters.length === 0 || activePlatformFilters.length === Object.keys(platformDetails).filter(p=>p !== 'Default').length || activePlatformFilters.includes(post.platform)) &&
      post.businessId === selectedBusinessId
    );
    
  }, [posts, activePlatformFilters, selectedBusinessId]);

  console.log("FILTERED POSTS:", filteredPosts)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full p-3 sm:p-4 bg-gray-100 dark:bg-gray-900">
        {/* Header: Navigation and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-300 dark:border-gray-600"><ChevronLeft size={20} className="text-gray-600 dark:text-gray-300"/></button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 w-auto text-center whitespace-nowrap px-2">
              {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), 'MMM d, yyyy')}
            </h2>
            <button onClick={handleNextWeek} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-300 dark:border-gray-600"><ChevronRight size={20} className="text-gray-600 dark:text-gray-300"/></button>
            <button 
              onClick={handleToday} 
              className="px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 shadow-sm"
              >
                {initialBusinesses.map(biz => (
                  <option key={biz.id} value={biz.id}>{biz.name}</option>
                ))}
              </select>
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <PlatformFilterCalendar 
              platforms={platformDetails} 
              activeFilters={activePlatformFilters} 
              setActiveFilters={setActivePlatformFilters} 
            />
          </div>
        </div>

        {/* Calendar Grid Area */}
        <div className="flex-grow flex overflow-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800">
          {/* Time Axis */}
          <div className={`w-16 sm:w-20 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} sticky left-0 z-20 rounded-l-xl`}>
            <div className={`h-12 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-tl-xl`}>
              Time
            </div>
            {TIME_SLOTS.map(time => (
              <div key={time} className="h-16 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {time.substring(0,2)}
              </div>
            ))}
          </div>

          {/* Day Columns Container */}
          <div className="flex flex-row flex-grow">
            {weekDays.map((day, index) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const postsForDay = filteredPosts.filter(post => post.date === dayKey);
              const isCurrentDay = dateFnsIsToday(day);

              return (
                <DayColumnWithTimes
                  key={dayKey}
                  date={day}
                  isToday={isCurrentDay}
                  postsForDay={postsForDay}
                  timeSlots={TIME_SLOTS}
                  onDropPost={movePost}
                  onAddPostClick={handleAddPostClick}
                  onPostCardClick={handlePostCardClick}
                  platformDetails={platformDetails}
                  statusColors={statusColors}
                  themeColors={themeColors}
                  isFirstColumn={index === 0}
                />
              );
            })}
          </div>
        </div>
        {isAddModalOpen && (
          <AddPostModalCalendar
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSavePost}
            selectedDate={modalDateTime.date}
            selectedTime={modalDateTime.time}
            platforms={platformObject}
            timeSlots={TIME_SLOTS}
          />
        )}
        {isPreviewModalOpen && postForPreview && (
          <PostPreviewModalCalendar
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            post={postForPreview}
            platformDetails={platformDetails}
            statusColors={statusColors}
            onDeleteClick={() => openDeleteConfirmModal(postForPreview.id, postForPreview.platform)}
            initialBusinesses={initialBusinesses}
          />
        )}
        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDeletePost}
          title="Delete Post"
          message="Are you sure you want to delete this scheduled post? This action cannot be undone."
          confirmText="Delete Post"
        />
      </div>
    </DndProvider>
  );
};

export default CalendarViewPage;
