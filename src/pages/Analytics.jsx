import React, { useState, useEffect, useMemo } from 'react';
import { Download, ArrowUp, ArrowDown, TrendingUp, Users, Eye, MessageSquare, Share2, ThumbsUp, Activity, BarChart2, Facebook, Instagram, Twitter, Linkedin, Youtube as YoutubeIcon, Smile, Meh, Frown, Image as ImageIcon, Video as VideoIconLucide, FileText as FileTextIcon, Link as LinkIconLucide, Briefcase } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, Sector } from 'recharts';
import { faker } from '@faker-js/faker';
import DateRangePicker from '../components/DateRangePicker';
import { useTheme } from '../contexts/ThemeContext';

// Mock data for businesses and their linked platforms
const mockBusinessData = [
  { 
    id: 'biz1', 
    name: 'TechCorp Solutions', 
    linkedPlatforms: {
      facebook: { pageName: 'TechCorp Official' },
      twitter: { pageName: '@TechCorp' },
      youtube: { pageName: 'TechCorp TV'}
    } 
  },
  { 
    id: 'biz2', 
    name: 'Innovate Hub', 
    linkedPlatforms: {
      instagram: { pageName: 'InnovateHubIG' },
      linkedin: { pageName: 'Innovate Hub Company'}
    }
  },
  { 
    id: 'biz3', 
    name: 'GreenLeaf Organics', 
    linkedPlatforms: {
        facebook: { pageName: 'GreenLeaf FB' },
        instagram: { pageName: 'GreenLeaf IG' },
        twitter: { pageName: 'GreenLeaf Twitter' },
        linkedin: { pageName: 'GreenLeaf LinkedIn' },
        youtube: { pageName: 'GreenLeaf YouTube' },
    }
  },
];

const platformDetails = {
  facebook: { name: 'Facebook', color: '#4267B2', icon: <Facebook size={16} /> },
  instagram: { name: 'Instagram', color: '#E1306C', icon: <Instagram size={16} /> },
  twitter: { name: 'Twitter', color: '#1DA1F2', icon: <Twitter size={16} /> },
  linkedin: { name: 'LinkedIn', color: '#0077B5', icon: <Linkedin size={16} /> },
  youtube: { name: 'YouTube', color: '#FF0000', icon: <YoutubeIcon size={16} /> },
};
const platforms = Object.keys(platformDetails);
const contentTypes = ['Image', 'Video', 'Text Post', 'Link Share'];

const generateMockData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const finalEndDate = new Date(endDate);

  while (currentDate <= finalEndDate) {
    platforms.forEach(platform => {
      const likes = faker.number.int({ min: 10, max: 5000 });
      const comments = faker.number.int({ min: 1, max: 1000 });
      const shares = faker.number.int({ min: 0, max: 500 });
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        platform: platform,
        businessId: faker.helpers.arrayElement(mockBusinessData).id, // Assign a business ID
        followers: faker.number.int({ min: 500, max: 50000 }),
        newFollowers: faker.number.int({ min: -50, max: 200 }),
        engagementRate: parseFloat(faker.number.float({ min: 0.5, max: 10 }).toFixed(1)),
        posts: faker.number.int({ min: 0, max: 5 }),
        reach: faker.number.int({ min: 100, max: 100000 }),
        impressions: faker.number.int({ min: 200, max: 200000 }),
        likes: likes,
        comments: comments,
        shares: shares,
        views: platform === 'youtube' ? faker.number.int({min: 100, max: 50000}) : faker.number.int({min: 50, max: 10000}),
        sentimentPositive: faker.number.int({ min: 0, max: Math.floor((likes + comments + shares) * 0.7) }),
        sentimentNeutral: faker.number.int({ min: 0, max: Math.floor((likes + comments + shares) * 0.2) }),
        sentimentNegative: faker.number.int({ min: 0, max: Math.floor((likes + comments + shares) * 0.1) }),
        contentType: faker.helpers.arrayElement(contentTypes),
      });
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const initialEndDate = new Date();
const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 29); 

const ALL_MOCK_DATA = generateMockData(
  new Date(initialEndDate.getFullYear() -1, initialEndDate.getMonth(), initialEndDate.getDate()), 
  initialEndDate
);


const StatCard = ({ title, value, change, icon, color, bgColor, changeColor }) => {
  const isPositive = change && !change.startsWith('-');
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-lg relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mt-10 -mr-10 opacity-50"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${isPositive ? (changeColor ? changeColor.positive : 'text-green-200') : (changeColor ? changeColor.negative : 'text-red-200')}`}>
              {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white/20`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${color}`})}
        </div>
      </div>
    </div>
  );
};

const ActiveShapePieChart = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333"  className="dark:fill-gray-300 text-xs">{`${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const Analytics = () => {
  const { isDarkMode, themeColors } = useTheme();
  const [dateRange, setDateRange] = useState({
    startDate: initialStartDate.toISOString().split('T')[0],
    endDate: initialEndDate.toISOString().split('T')[0],
    label: 'Last 30 Days'
  });
  
  const [selectedBusinessId, setSelectedBusinessId] = useState(mockBusinessData[0].id);

  const availablePlatformsForBusiness = useMemo(() => {
    const business = mockBusinessData.find(b => b.id === selectedBusinessId);
    if (!business) return [];
    return Object.keys(business.linkedPlatforms).filter(p => business.linkedPlatforms[p]);
  }, [selectedBusinessId]);

  const [activePlatform, setActivePlatform] = useState(availablePlatformsForBusiness[0] || '');
  const [filteredData, setFilteredData] = useState([]);
  const [activeEngagementPieIndex, setActiveEngagementPieIndex] = useState(0);
  const [activeSentimentPieIndex, setActiveSentimentPieIndex] = useState(0);

  // Reset platform filter when business changes
  useEffect(() => {
    setActivePlatform(availablePlatformsForBusiness[0] || '');
  }, [availablePlatformsForBusiness]);

  useEffect(() => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23,59,59,999); 

    const currentFilteredData = ALL_MOCK_DATA.filter(item => {
      const itemDate = new Date(item.date);
      const businessMatch = item.businessId === selectedBusinessId;
      const platformMatch = item.platform === activePlatform; // Filter by single platform
      return itemDate >= start && itemDate <= end && platformMatch && businessMatch;
    });
    setFilteredData(currentFilteredData);
  }, [dateRange, activePlatform, selectedBusinessId]);
  
  const aggregateMetrics = useMemo(() => {
    if (!filteredData.length) return {
      totalFollowers: 0, followersChange: '0%', engagementRate: '0%', engagementChange:'0%', totalPosts: 0, postsChange:'0 new posts', avgReach: '0', reachChange:'0%',
      totalLikes: 0, totalComments: 0, totalShares: 0, totalViews: 0,
      totalSentimentPositive: 0, totalSentimentNeutral: 0, totalSentimentNegative: 0,
    };

    let totalFollowers = 0;
    let latestDate = new Date(0);
    filteredData.forEach(item => {
        if (new Date(item.date) > latestDate) {
            latestDate = new Date(item.date);
            totalFollowers = item.followers;
        }
    });

    const followersChange = faker.number.int({ min: -5, max: 15 }); 
    const engagementRate = parseFloat(filteredData.reduce((sum, item) => sum + item.engagementRate, 0) / filteredData.length || 0).toFixed(1);
    const engagementChange = parseFloat(faker.number.float({ min: -1, max: 1 })).toFixed(1); 
    const totalPosts = filteredData.reduce((sum, item) => sum + item.posts, 0);
    const postsChange = faker.number.int({ min: -10, max: 20 }); 
    const avgReach = parseFloat(filteredData.reduce((sum, item) => sum + item.reach, 0) / filteredData.length || 0).toFixed(0);
    const reachChange = faker.number.int({ min: -10, max: 10 }); 

    return {
      totalFollowers,
      followersChange: `${followersChange > 0 ? '+' : ''}${followersChange}%`,
      engagementRate: `${engagementRate}%`,
      engagementChange: `${engagementChange > 0 ? '+' : ''}${engagementChange}%`,
      totalPosts,
      postsChange: `${postsChange > 0 ? '+' : ''}${postsChange} new posts`,
      avgReach: parseInt(avgReach).toLocaleString(),
      reachChange: `${reachChange > 0 ? '+' : ''}${reachChange}%`,
      totalLikes: filteredData.reduce((sum, item) => sum + item.likes, 0),
      totalComments: filteredData.reduce((sum, item) => sum + item.comments, 0),
      totalShares: filteredData.reduce((sum, item) => sum + item.shares, 0),
      totalViews: filteredData.reduce((sum, item) => sum + item.views, 0),
      totalSentimentPositive: filteredData.reduce((sum, item) => sum + item.sentimentPositive, 0),
      totalSentimentNeutral: filteredData.reduce((sum, item) => sum + item.sentimentNeutral, 0),
      totalSentimentNegative: filteredData.reduce((sum, item) => sum + item.sentimentNegative, 0),
    };
  }, [filteredData]);

  const followerGrowthChartData = useMemo(() => {
    const dailyData = {};
    let currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    while(currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dailyData[dateStr] = { date: dateStr, followers: 0 };
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    Object.keys(dailyData).forEach(dateStr => {
        let latestFollowersForPlatformOnDate = 0;
        let recordDate = new Date(dateRange.startDate);
        recordDate.setDate(recordDate.getDate() -1); 

        filteredData.filter(d => new Date(d.date) <= new Date(dateStr))
                    .forEach(d => {
                        if(new Date(d.date) > recordDate) {
                            latestFollowersForPlatformOnDate = d.followers;
                            recordDate = new Date(d.date);
                        }
                    });
        dailyData[dateStr].followers = latestFollowersForPlatformOnDate;
    });

    const series = Object.values(dailyData).sort((a,b) => new Date(a.date) - new Date(b.date));
    if(series.length === 1) return [series[0], {...series[0], date: new Date(new Date(series[0].date).getTime() + 86400000).toISOString().split('T')[0] }];
    return series.length > 0 ? series : [{date: dateRange.startDate, followers: 0}, {date: dateRange.endDate, followers: 0}];
  }, [filteredData, dateRange.startDate, dateRange.endDate]);

  const topPerformingPosts = useMemo(() => {
    const latestPostsMap = new Map();
    filteredData.forEach(item => {
      const postTitle = item.title || faker.lorem.sentence(5).slice(0,-1); 
      const postId = `${postTitle}-${item.platform}-${item.date}`; 
      if (!latestPostsMap.has(postId)) {
        latestPostsMap.set(postId, {
          ...item,
          id: postId,
          title: postTitle,
          engagementScore: item.likes + item.comments * 2 + item.shares * 3,
        });
      }
    });
    return Array.from(latestPostsMap.values()).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 5);
  }, [filteredData]);

  const sharesTrendChartData = useMemo(() => {
    const dailyShares = {};
    let currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyShares[dateStr] = { date: dateStr, shares: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    filteredData.forEach(item => {
      if (dailyShares[item.date]) {
        dailyShares[item.date].shares += item.shares;
      }
    });
    const series = Object.values(dailyShares).sort((a,b) => new Date(a.date) - new Date(b.date));
    if (series.length === 1) return [series[0], {...series[0], date: new Date(new Date(series[0].date).getTime() + 86400000).toISOString().split('T')[0]}];
    return series.length > 0 ? series : [{date: dateRange.startDate, shares: 0}, {date: dateRange.endDate, shares: 0}];
  }, [filteredData, dateRange.startDate, dateRange.endDate]);

  const sentimentChartData = useMemo(() => [
    { name: 'Positive', value: aggregateMetrics.totalSentimentPositive, color: themeColors.success },
    { name: 'Neutral', value: aggregateMetrics.totalSentimentNeutral, color: themeColors.secondary },
    { name: 'Negative', value: aggregateMetrics.totalSentimentNegative, color: themeColors.danger },
  ].filter(s => s.value > 0), [aggregateMetrics, themeColors]);

  const contentTypePerformanceChartData = useMemo(() => {
    const performance = {};
    contentTypes.forEach(type => performance[type] = { name: type, engagement: 0 });
    filteredData.forEach(item => {
      if (performance[item.contentType]) {
        performance[item.contentType].engagement += (item.likes + item.comments + item.shares);
      }
    });
    return Object.values(performance).filter(ct => ct.engagement > 0);
  }, [filteredData]);

  const engagementBreakdownChartData = useMemo(() => [
    { name: 'Likes', value: aggregateMetrics.totalLikes, color: themeColors.primary },
    { name: 'Comments', value: aggregateMetrics.totalComments, color: themeColors.accent },
    { name: 'Shares', value: aggregateMetrics.totalShares, color: themeColors.info },
  ].filter(e => e.value > 0), [aggregateMetrics, themeColors]);

  const onEngagementPieEnter = (_, index) => setActiveEngagementPieIndex(index);
  const onSentimentPieEnter = (_, index) => setActiveSentimentPieIndex(index);


  const statCards = [
    { title: "Total Followers", value: aggregateMetrics.totalFollowers.toLocaleString(), change: aggregateMetrics.followersChange, icon: <Users />, color: "text-white", bgColor: "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800" },
    { title: "Engagement Rate", value: aggregateMetrics.engagementRate, change: aggregateMetrics.engagementChange, icon: <TrendingUp />, color: "text-white", bgColor: "bg-gradient-to-br from-pink-500 to-pink-700 dark:from-pink-600 dark:to-pink-800" },
    { title: "Total Posts", value: aggregateMetrics.totalPosts.toLocaleString(), change: aggregateMetrics.postsChange, icon: <BarChart2 />, color: "text-white", bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800" },
    { title: "Avg. Reach", value: aggregateMetrics.avgReach, change: aggregateMetrics.reachChange, icon: <Eye />, color: "text-white", bgColor: "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800" }
  ];
  
  const engagementOverviewCards = [
     { title: "Total Likes", value: aggregateMetrics.totalLikes.toLocaleString(), icon: <ThumbsUp size={24}/>, color: themeColors.primary },
     { title: "Total Comments", value: aggregateMetrics.totalComments.toLocaleString(), icon: <MessageSquare size={24}/>, color: themeColors.accent },
     { title: "Total Shares", value: aggregateMetrics.totalShares.toLocaleString(), icon: <Share2 size={24}/>, color: themeColors.info },
     { title: "Total Views", value: aggregateMetrics.totalViews.toLocaleString(), icon: <Activity size={24}/>, color: themeColors.success },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Analytics & Insights</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 shadow-sm"
            >
              {mockBusinessData.map(biz => (
                <option key={biz.id} value={biz.id}>{biz.name}</option>
              ))}
            </select>
            <Briefcase className="w-4 h-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={activePlatform}
              onChange={(e) => setActivePlatform(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 shadow-sm"
            >
              {availablePlatformsForBusiness.length > 0 ? (
                availablePlatformsForBusiness.map(platformId => (
                  <option key={platformId} value={platformId}>
                    {platformDetails[platformId]?.name || platformId}
                  </option>
                ))
              ) : (
                <option disabled>No platforms linked</option>
              )}
            </select>
            <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {activePlatform && platformDetails[activePlatform] ? React.cloneElement(platformDetails[activePlatform].icon, {size: 16}) : null}
            </span>
          </div>
          <DateRangePicker onRangeChange={setDateRange} />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-1">Engagement Overview</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Summary of key engagement metrics for the selected period and platforms.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementOverviewCards.map(card => (
                 <div key={card.title} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 flex items-center">
                    <div className="p-3 rounded-full mr-4" style={{backgroundColor: `${card.color}20`}}>
                        {React.cloneElement(card.icon, {style: {color: card.color}})}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                 </div>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Follower Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerGrowthChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month:'short', day:'numeric'})} tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`}}
                    labelStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                    itemStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                    formatter={(value) => value.toLocaleString()}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line type="monotone" dataKey="followers" name="Total Followers" stroke={themeColors.primary} strokeWidth={2} dot={{ r: 4, fill: themeColors.primary }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Shares/Reposts Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sharesTrendChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month:'short', day:'numeric'})} tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
                <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`}}
                    labelStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                    itemStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                    formatter={(value) => value.toLocaleString()}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Line type="monotone" dataKey="shares" name="Total Shares" stroke={themeColors.info} strokeWidth={2} dot={{ r: 4, fill: themeColors.info }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sentiment Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeSentimentPieIndex}
                  activeShape={ActiveShapePieChart}
                  data={sentimentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onSentimentPieEnter}
                >
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-sentiment-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                 <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom" 
                  iconSize={10}
                  wrapperStyle={{fontSize: "12px", lineHeight: "20px", paddingTop: "10px"}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Content Type Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentTypePerformanceChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                <XAxis type="number" tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} width={80} />
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`}}
                    labelStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                    itemStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="engagement" name="Total Engagement" fill={themeColors.accent} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Engagement Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeEngagementPieIndex}
                  activeShape={ActiveShapePieChart}
                  data={engagementBreakdownChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onEngagementPieEnter}
                >
                  {engagementBreakdownChartData.map((entry, index) => (
                    <Cell key={`cell-engagement-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom" 
                  iconSize={10}
                  wrapperStyle={{fontSize: "12px", lineHeight: "20px", paddingTop: "10px"}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Top Performing Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPerformingPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium max-w-xs truncate" title={post.title}>{post.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.engagementScore.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topPerformingPosts.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">No posts match current filters.</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 dark:from-theme-primary/20 dark:to-theme-accent/20 p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h3 className="text-2xl font-semibold mb-2">Want Deeper Insights?</h3>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
              Upgrade to our Pro plan to unlock advanced analytics, competitor benchmarking, AI-powered recommendations, and custom report generation.
            </p>
            <button className="mt-6 bg-theme-primary hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors">
              Upgrade to Pro
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center">
             <TrendingUp className="w-24 h-24 text-theme-primary opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
