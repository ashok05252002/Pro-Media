import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, MessageSquare, Repeat, BarChart as BarChartIconLucide, Calendar, MoreHorizontal, Eye, ChevronDown, Package, Send } from 'lucide-react'; // Renamed BarChart to BarChartIconLucide
import CommentItem from '../components/CommentItem';

// Updated Mock Data with replies
const mockPostsData = [ 
    { 
      id: 'post1', 
      title: 'Summer Collection Launch', 
      content: 'Introducing our new summer collection! 🌞 Fresh styles, vibrant colors, and breathable fabrics perfect for the season. Shop now and get 20% off with code SUMMER23.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Instagram',
      date: '2023-07-10T14:00:00',
      metrics: { likes: 1243, comments: 78, shares: 32, views: 8456 },
      color: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40',
      productAssociated: 'pro'
    },
    { 
      id: 'post2', 
      title: 'Weekly Tips & Tricks', 
      content: 'This week\'s productivity tips: 1️⃣ Use the two-minute rule: If it takes less than 2 minutes, do it now 2️⃣ Try the Pomodoro technique 3️⃣ Plan tomorrow\'s tasks today',
      image: null,
      platform: 'Twitter',
      date: '2023-07-08T09:00:00',
      metrics: { likes: 538, comments: 42, shares: 127, views: 3254 },
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
      productAssociated: 'pro_max'
    },
    { 
      id: 'post3', 
      title: 'Customer Testimonial Video', 
      content: 'Hear what our customers are saying about their experiences! We\'re grateful for the fantastic feedback and honored to be part of your journey.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'Facebook',
      date: '2023-07-05T16:30:00',
      metrics: { likes: 865, comments: 108, shares: 64, views: 5812 },
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40',
      productAssociated: 'standard'
    },
    { 
      id: 'post4', 
      title: 'Company Milestone', 
      content: 'We\'re thrilled to announce that we\'ve reached 100,000 customers worldwide! 🎉 Thank you for your continued support and trust in our products and services.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'LinkedIn',
      date: '2023-07-03T11:15:00',
      metrics: { likes: 1432, comments: 215, shares: 178, views: 7689 },
      color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40',
      productAssociated: 'lite'
    },
     { 
      id: 'post5', 
      title: 'New YouTube Channel Trailer', 
      content: 'Exciting news! We\'ve launched our official YouTube channel. Check out our trailer and subscribe for amazing content!',
      image: 'https://images.unsplash.com/photo-1543286386-71314a496c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      platform: 'YouTube',
      date: '2023-07-12T10:00:00',
      metrics: { likes: 2500, comments: 312, shares: 150, views: 15200 },
      color: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40',
      productAssociated: 'pro'
    },
];

const mockAllComments = [
    { 
      id: 1, 
      postId: 'post1', 
      user: 'Sarah Johnson', 
      userAvatar: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/women/12.jpg',
      text: 'Love the new collection! Can\'t wait to get my hands on that blue dress.',
      date: '2023-07-10T14:23:00',
      likes: 12,
      isReplied: true,
      replies: [
        { id: 101, user: 'Shop Admin', userAvatar: 'https://ui-avatars.com/api/?name=Admin&background=random', text: 'Thanks Sarah! We\'re glad you love it. More styles coming soon!', date: '2023-07-10T14:30:00' },
        { id: 102, user: 'Another User', userAvatar: 'https://ui-avatars.com/api/?name=Another+User&background=random', text: 'I agree, the blue dress is stunning!', date: '2023-07-10T15:00:00' }
      ]
    },
    { 
      id: 2, 
      postId: 'post1', 
      user: 'Michael Chen', 
      userAvatar: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/men/22.jpg',
      text: 'The colors are amazing this season! Will you be restocking the sold out items?',
      date: '2023-07-10T15:42:00',
      likes: 5,
      isReplied: false,
      replies: []
    },
    { 
      id: 3, 
      postId: 'post2', 
      user: 'Emily Rodriguez', 
      userAvatar: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/women/32.jpg',
      text: 'These tips are super helpful! I\'ve been implementing them in my routine and seeing results already.',
      date: '2023-07-08T09:15:00',
      likes: 18,
      isReplied: true,
      replies: [
        { id: 103, user: 'Content Creator', userAvatar: 'https://ui-avatars.com/api/?name=Creator&background=random', text: 'Glad you found them useful, Emily!', date: '2023-07-08T10:00:00' }
      ]
    },
    { 
      id: 4, 
      postId: 'post5', 
      user: 'Video Fan 1', 
      userAvatar: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/men/92.jpg',
      text: 'Awesome trailer! Subscribed!',
      date: '2023-07-12T12:00:00',
      likes: 55,
      isReplied: true,
      replies: []
    },
];


const ViewPosts = () => {
  const [activeTab, setActiveTab] = useState('posts');
  
  const [selectedPlatformPosts, setSelectedPlatformPosts] = useState('all');
  const [searchQueryPosts, setSearchQueryPosts] = useState('');
  const [dateFilterTypePosts, setDateFilterTypePosts] = useState('all');
  const [selectedDatePosts, setSelectedDatePosts] = useState('');
  const [selectedMonthPosts, setSelectedMonthPosts] = useState('');
  const [selectedYearPosts, setSelectedYearPosts] = useState(new Date().getFullYear());
  const [customDateFromPosts, setCustomDateFromPosts] = useState('');
  const [customDateToPosts, setCustomDateToPosts] = useState('');
  const [showDateFilterPosts, setShowDateFilterPosts] = useState(false);
  const [selectedProductPosts, setSelectedProductPosts] = useState('all');
  const dateFilterRefPosts = useRef(null);

  const [selectedPostFilterComments, setSelectedPostFilterComments] = useState('all');
  const [searchQueryComments, setSearchQueryComments] = useState('');
  const [dateFilterTypeComments, setDateFilterTypeComments] = useState('all');
  const [selectedDateComments, setSelectedDateComments] = useState('');
  const [selectedMonthComments, setSelectedMonthComments] = useState('');
  const [selectedYearComments, setSelectedYearComments] = useState(new Date().getFullYear());
  const [customDateFromComments, setCustomDateFromComments] = useState('');
  const [customDateToComments, setCustomDateToComments] = useState('');
  const [showDateFilterComments, setShowDateFilterComments] = useState(false);
  const dateFilterRefComments = useRef(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [currentReplyText, setCurrentReplyText] = useState('');
  
  const navigate = useNavigate();

  const productOptions = [
    { id: 'all', name: 'All Products' }, { id: 'pro', name: 'Pro' },
    { id: 'pro_max', name: 'Pro Max' }, { id: 'standard', name: 'Standard Edition' },
    { id: 'lite', name: 'Lite Version' }
  ];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateFilterRefPosts.current && !dateFilterRefPosts.current.contains(event.target)) {
        setShowDateFilterPosts(false);
      }
      if (dateFilterRefComments.current && !dateFilterRefComments.current.contains(event.target)) {
        setShowDateFilterComments(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvailableYears = (dataSource) => {
    const years = new Set();
    dataSource.forEach(item => years.add(new Date(item.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  };
  const availableYearsPosts = getAvailableYears(mockPostsData);
  const availableYearsComments = getAvailableYears(mockAllComments);

  const filteredPosts = mockPostsData.filter(post => {
    if (selectedPlatformPosts !== 'all' && post.platform !== selectedPlatformPosts) return false;
    if (selectedProductPosts !== 'all' && post.productAssociated !== selectedProductPosts) return false;
    if (searchQueryPosts && !post.title.toLowerCase().includes(searchQueryPosts.toLowerCase()) && !post.content.toLowerCase().includes(searchQueryPosts.toLowerCase())) return false;
    
    const postDate = new Date(post.date);
    if (dateFilterTypePosts === 'date' && selectedDatePosts) {
      const selected = new Date(selectedDatePosts);
      return postDate.getFullYear() === selected.getFullYear() && postDate.getMonth() === selected.getMonth() && postDate.getDate() === selected.getDate();
    }
    if (dateFilterTypePosts === 'month' && selectedMonthPosts && selectedYearPosts) {
      return postDate.getFullYear() === parseInt(selectedYearPosts) && postDate.getMonth() === parseInt(selectedMonthPosts);
    }
    if (dateFilterTypePosts === 'custom' && customDateFromPosts && customDateToPosts) {
      const from = new Date(customDateFromPosts);
      const to = new Date(customDateToPosts); to.setHours(23, 59, 59, 999);
      return postDate >= from && postDate <= to;
    }
    return true;
  });

  const filteredComments = mockAllComments.filter(comment => {
    if (activeTab === 'comments' && selectedPostFilterComments !== 'all' && comment.postId !== selectedPostFilterComments) {
        return false;
    }
    if (searchQueryComments && !comment.text.toLowerCase().includes(searchQueryComments.toLowerCase()) && !comment.user.toLowerCase().includes(searchQueryComments.toLowerCase())) return false;

    const commentDate = new Date(comment.date);
    if (dateFilterTypeComments === 'date' && selectedDateComments) {
      const selected = new Date(selectedDateComments);
      return commentDate.getFullYear() === selected.getFullYear() && commentDate.getMonth() === selected.getMonth() && commentDate.getDate() === selected.getDate();
    }
    if (dateFilterTypeComments === 'month' && selectedMonthComments && selectedYearComments) {
      return commentDate.getFullYear() === parseInt(selectedYearComments) && commentDate.getMonth() === parseInt(selectedMonthComments);
    }
    if (dateFilterTypeComments === 'custom' && customDateFromComments && customDateToComments) {
      const from = new Date(customDateFromComments);
      const to = new Date(customDateToComments); to.setHours(23, 59, 59, 999);
      return commentDate >= from && commentDate <= to;
    }
    return true;
  });

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString); const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; return `${Math.floor(diff / 86400)}d ago`;
  };

  const platformIconMap = {
    Facebook: <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">f</div>,
    Instagram: <div className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">IG</div>,
    Twitter: <div className="bg-blue-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">X</div>,
    LinkedIn: <div className="bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">in</div>,
    YouTube: <div className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">YT</div>,
  };

  const handleDateFilterChangePosts = (type) => { setDateFilterTypePosts(type); if (type !== 'date') setSelectedDatePosts(''); if (type !== 'month') setSelectedMonthPosts(''); if (type !== 'custom') { setCustomDateFromPosts(''); setCustomDateToPosts(''); }};
  const clearDateFiltersPosts = () => { setDateFilterTypePosts('all'); setSelectedDatePosts(''); setSelectedMonthPosts(''); setCustomDateFromPosts(''); setCustomDateToPosts(''); };
  const clearAllFiltersPosts = () => { clearDateFiltersPosts(); setSelectedPlatformPosts('all'); setSearchQueryPosts(''); setSelectedProductPosts('all'); };

  const handleDateFilterChangeComments = (type) => { setDateFilterTypeComments(type); if (type !== 'date') setSelectedDateComments(''); if (type !== 'month') setSelectedMonthComments(''); if (type !== 'custom') { setCustomDateFromComments(''); setCustomDateToComments(''); }};
  const clearDateFiltersComments = () => { setDateFilterTypeComments('all'); setSelectedDateComments(''); setSelectedMonthComments(''); setCustomDateFromComments(''); setCustomDateToComments(''); };
  const clearAllFiltersComments = () => { clearDateFiltersComments(); setSelectedPostFilterComments('all'); setSearchQueryComments(''); };

  const handleReplyClickComments = (commentId) => { setReplyingToCommentId(commentId === replyingToCommentId ? null : commentId); setCurrentReplyText(''); };
  const handleSendReplyComments = () => {
    if (!currentReplyText.trim()) return;
    console.log(`Replying to comment ID: ${replyingToCommentId} with: "${currentReplyText}" from ViewPosts Comments Tab`);
    alert(`Reply to comment ${replyingToCommentId} sent: "${currentReplyText}" (Check console)`);
    setReplyingToCommentId(null); setCurrentReplyText('');
  };
  
  const handleViewPostComments = (postId) => {
    navigate(`/post/${postId}/details-and-comments`);
  };

  const renderDateFilterDropdown = (type, stateSetters, availableYearsList, showStateSetter) => (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20 min-w-[280px] max-w-xs">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-2 mb-2"><h3 className="font-medium">Filter by Date</h3><button className="text-sm text-red-500 hover:text-red-700" onClick={type === 'posts' ? clearDateFiltersPosts : clearDateFiltersComments}>Clear</button></div>
        {['all', 'date', 'month', 'custom'].map(filterType => (
          <div key={filterType} className="flex items-center gap-2">
            <input type="radio" id={`date-filter-${filterType}-${type}`} name={`date-filter-${type}`} checked={stateSetters.dateFilterType === filterType} onChange={() => type === 'posts' ? handleDateFilterChangePosts(filterType) : handleDateFilterChangeComments(filterType)} className="text-theme-primary w-10 focus:ring-theme-primary"/>
            <label htmlFor={`date-filter-${filterType}-${type}`} className="text-sm">{filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}</label>
          </div>
        ))}
        {stateSetters.dateFilterType === 'date' && (<div className="pl-6"><input type="date" value={stateSetters.selectedDate} onChange={(e) => stateSetters.setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"/></div>)}
        {stateSetters.dateFilterType === 'month' && (<div className="pl-6 space-y-2"><select value={stateSetters.selectedMonth} onChange={(e) => stateSetters.setSelectedMonth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"><option value="">Select Month</option>{months.map((m, i) => (<option key={m} value={i}>{m}</option>))}</select><select value={stateSetters.selectedYear} onChange={(e) => stateSetters.setSelectedYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm">{availableYearsList.map(y => (<option key={y} value={y}>{y}</option>))}</select></div>)}
        {stateSetters.dateFilterType === 'custom' && (<div className="pl-6 space-y-2"><div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">From</label><input type="date" value={stateSetters.customDateFrom} onChange={(e) => stateSetters.setCustomDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"/></div><div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-0.5">To</label><input type="date" value={stateSetters.customDateTo} onChange={(e) => stateSetters.setCustomDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"/></div></div>)}
        <button className="mt-2 bg-theme-primary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm" onClick={() => showStateSetter(false)}>Apply</button>
      </div>
    </div>
  );

  const renderActiveFilters = (type, stateGetters, clearAllFn) => {
    const hasActiveFilters = stateGetters.dateFilterType !== 'all' || 
                             (type === 'posts' && (stateGetters.selectedPlatform !== 'all' || stateGetters.selectedProduct !== 'all')) ||
                             (type === 'comments' && stateGetters.selectedPostFilter !== 'all') ||
                             stateGetters.searchQuery;
    if (!hasActiveFilters) return null;
    
    return (
       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Active Filters:</span>
        {stateGetters.dateFilterType === 'date' && stateGetters.selectedDate && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Date: {new Date(stateGetters.selectedDate).toLocaleDateString()}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={type === 'posts' ? clearDateFiltersPosts : clearDateFiltersComments}>&times;</button></div>)}
        {stateGetters.dateFilterType === 'month' && stateGetters.selectedMonth && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Month: {months[parseInt(stateGetters.selectedMonth)]} {stateGetters.selectedYear}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={type === 'posts' ? clearDateFiltersPosts : clearDateFiltersComments}>&times;</button></div>)}
        {stateGetters.dateFilterType === 'custom' && stateGetters.customDateFrom && stateGetters.customDateTo && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Range: {new Date(stateGetters.customDateFrom).toLocaleDateString()} - {new Date(stateGetters.customDateTo).toLocaleDateString()}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={type === 'posts' ? clearDateFiltersPosts : clearDateFiltersComments}>&times;</button></div>)}
        {type === 'posts' && stateGetters.selectedPlatform !== 'all' && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Platform: {stateGetters.selectedPlatform}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSelectedPlatformPosts('all')}>&times;</button></div>)}
        {type === 'posts' && stateGetters.selectedProduct !== 'all' && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Product: {productOptions.find(p => p.id === stateGetters.selectedProduct)?.name}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSelectedProductPosts('all')}>&times;</button></div>)}
        {type === 'comments' && stateGetters.selectedPostFilter !== 'all' && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Post: {mockPostsData.find(p => p.id === stateGetters.selectedPostFilter)?.title}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setSelectedPostFilterComments('all')}>&times;</button></div>)}
        {stateGetters.searchQuery && (<div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"><span>Search: {stateGetters.searchQuery}</span><button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => type === 'posts' ? setSearchQueryPosts('') : setSearchQueryComments('')}>&times;</button></div>)}
        <button className="text-xs text-theme-primary hover:underline" onClick={clearAllFn}>Clear all filters</button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">View Content</h1>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('posts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-theme-primary text-theme-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}`}
          >
            Posts ({filteredPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-theme-primary text-theme-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'}`}
          >
            Comments ({filteredComments.length})
          </button>
        </nav>
      </div>

      {activeTab === 'posts' && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <select value={selectedPlatformPosts} onChange={(e) => setSelectedPlatformPosts(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"><option value="all">All Platforms</option><option value="Facebook">Facebook</option><option value="Instagram">Instagram</option><option value="Twitter">Twitter</option><option value="LinkedIn">LinkedIn</option><option value="YouTube">YouTube</option></select>
                  <div className="relative"><select value={selectedProductPosts} onChange={(e) => setSelectedProductPosts(e.target.value)} className="appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 pr-8 text-sm">{productOptions.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select><Package className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                  <div className="relative" ref={dateFilterRefPosts}><button onClick={() => setShowDateFilterPosts(!showDateFilterPosts)} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md transition-colors text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{dateFilterTypePosts === 'all' ? 'All Time' : dateFilterTypePosts === 'date' ? 'By Date' : dateFilterTypePosts === 'month' ? 'By Month' : 'Custom Range'}</span><ChevronDown className="w-4 h-4" /></button>{showDateFilterPosts && renderDateFilterDropdown('posts', {dateFilterType: dateFilterTypePosts, setSelectedDate: setSelectedDatePosts, selectedDate: selectedDatePosts, selectedMonth: selectedMonthPosts, setSelectedMonth: setSelectedMonthPosts, selectedYear: selectedYearPosts, setSelectedYear: setSelectedYearPosts, customDateFrom: customDateFromPosts, setCustomDateFrom: setCustomDateFromPosts, customDateTo: customDateToPosts, setCustomDateTo: setCustomDateToPosts }, availableYearsPosts, setShowDateFilterPosts)}</div>
                </div>
                <div className="relative w-full lg:w-auto mt-4 lg:mt-0"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm pl-10 w-full lg:w-64" placeholder="Search posts..." value={searchQueryPosts} onChange={(e) => setSearchQueryPosts(e.target.value)}/></div>
              </div>
              {renderActiveFilters('posts', {dateFilterType: dateFilterTypePosts, selectedDate: selectedDatePosts, selectedMonth: selectedMonthPosts, selectedYear: selectedYearPosts, customDateFrom: customDateFromPosts, customDateTo: customDateToPosts, selectedPlatform: selectedPlatformPosts, selectedProduct: selectedProductPosts, searchQuery: searchQueryPosts}, clearAllFiltersPosts)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${post.color}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3"><div className="flex items-center">{platformIconMap[post.platform]}<span className="ml-2 font-medium">{post.platform}</span></div><button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><MoreHorizontal className="w-5 h-5" /></button></div>
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">{post.content}</p>
                    {post.image && (<div className="mb-4"><img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg"/></div>)}
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400"><div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /><span>{formatDate(post.date)}</span></div><span>{getTimeAgo(post.date)}</span></div>
                    <div className="mt-4 flex justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-gray-600 dark:text-gray-400"><Heart className="w-4 h-4 mr-1" /><span className="text-sm">{post.metrics.likes.toLocaleString()}</span></div>
                      <button onClick={() => handleViewPostComments(post.id)} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-theme-primary dark:hover:text-theme-primary" title="View Comments"><MessageSquare className="w-4 h-4 mr-1" /><span className="text-sm">{post.metrics.comments.toLocaleString()}</span></button>
                      <div className="flex items-center text-gray-600 dark:text-gray-400"><Repeat className="w-4 h-4 mr-1" /><span className="text-sm">{post.metrics.shares.toLocaleString()}</span></div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400"><Eye className="w-4 h-4 mr-1" /><span className="text-sm">{post.metrics.views.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (<div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"><BarChartIconLucide className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" /><h3 className="text-lg font-medium mb-1">No posts found</h3><p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search criteria</p></div>)}
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <select value={selectedPostFilterComments} onChange={(e) => setSelectedPostFilterComments(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"><option value="all">All Posts (for comments)</option>{mockPostsData.map(post => (<option key={post.id} value={post.id}>{post.title}</option>))}</select>
                  <div className="relative" ref={dateFilterRefComments}><button onClick={() => setShowDateFilterComments(!showDateFilterComments)} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md transition-colors text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{dateFilterTypeComments === 'all' ? 'All Time' : dateFilterTypeComments === 'date' ? 'By Date' : dateFilterTypeComments === 'month' ? 'By Month' : 'Custom Range'}</span><ChevronDown className="w-4 h-4" /></button>{showDateFilterComments && renderDateFilterDropdown('comments', {dateFilterType: dateFilterTypeComments, setSelectedDate: setSelectedDateComments, selectedDate: selectedDateComments, selectedMonth: selectedMonthComments, setSelectedMonth: setSelectedMonthComments, selectedYear: selectedYearComments, setSelectedYear: setSelectedYearComments, customDateFrom: customDateFromComments, setCustomDateFrom: setCustomDateFromComments, customDateTo: customDateToComments, setCustomDateTo: setCustomDateToComments }, availableYearsComments, setShowDateFilterComments)}</div>
                </div>
                <div className="relative w-full lg:w-auto mt-4 lg:mt-0"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm pl-10 w-full lg:w-64" placeholder="Search comments..." value={searchQueryComments} onChange={(e) => setSearchQueryComments(e.target.value)}/></div>
              </div>
              {renderActiveFilters('comments', {dateFilterType: dateFilterTypeComments, selectedDate: selectedDateComments, selectedMonth: selectedMonthComments, selectedYear: selectedYearComments, customDateFrom: customDateFromComments, customDateTo: customDateToComments, selectedPostFilter: selectedPostFilterComments, searchQuery: searchQueryComments}, clearAllFiltersComments)}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedPostFilterComments !== 'all' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-theme-primary" />
                    <span className="font-medium">
                      Viewing comments for: {mockPostsData.find(post => post.id === selectedPostFilterComments)?.title || 'Selected Post'}
                    </span>
                  </div>
                </div>
              )}
              {filteredComments.length > 0 ? (
                filteredComments.map(comment => {
                  const post = mockPostsData.find(p => p.id === comment.postId);
                  return (
                    <div key={comment.id}>
                      <CommentItem comment={comment} postTitle={selectedPostFilterComments === 'all' ? post?.title : undefined} platform={post?.platform} onReplyClick={handleReplyClickComments}/>
                      {replyingToCommentId === comment.id && (
                        <div className="p-4 ml-14 bg-gray-50 dark:bg-gray-700/30 rounded-b-md">
                          <textarea value={currentReplyText} onChange={(e) => setCurrentReplyText(e.target.value)} placeholder={`Replying to ${comment.user}...`} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm" rows="2"/>
                          <div className="mt-2 flex justify-end gap-2"><button onClick={() => setReplyingToCommentId(null)} className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">Cancel</button><button onClick={handleSendReplyComments} className="px-3 py-1 text-xs bg-theme-primary hover:bg-opacity-90 text-white rounded-md flex items-center gap-1"><Send size={12} /> Send Reply</button></div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (<div className="p-8 text-center"><MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" /><h3 className="text-lg font-medium mb-1">No comments found</h3><p className="text-gray-500 dark:text-gray-400">{searchQueryComments || dateFilterTypeComments !== 'all' || selectedPostFilterComments !== 'all' ? 'Try adjusting your filters or search term' : 'There are no comments available.'}</p></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPosts;
