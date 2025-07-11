// import React, { useState, useEffect, useMemo } from 'react';
// import { Download, ArrowUp, ArrowDown, TrendingUp, Users, Eye, MessageSquare, Share2, ThumbsUp, Activity, BarChart2, Facebook, Instagram, Twitter, Linkedin, Youtube as YoutubeIcon } from 'lucide-react'; // Added platform icons
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, Sector } from 'recharts';
// import { faker } from '@faker-js/faker';
// import DateRangePicker from '../components/DateRangePicker';
// import PlatformFilter from '../components/PlatformFilter';
// import { useTheme } from '../contexts/ThemeContext';

// const platformDetails = {
//   facebook: { name: 'Facebook', color: '#4267B2', icon: <Facebook size={16} /> },
//   instagram: { name: 'Instagram', color: '#E1306C', icon: <Instagram size={16} /> },
//   twitter: { name: 'Twitter', color: '#1DA1F2', icon: <Twitter size={16} /> },
//   linkedin: { name: 'LinkedIn', color: '#0077B5', icon: <Linkedin size={16} /> },
//   youtube: { name: 'YouTube', color: '#FF0000', icon: <YoutubeIcon size={16} /> },
// };
// const platforms = Object.keys(platformDetails);

// const generateMockData = (startDate, endDate) => {
//   const data = [];
//   let currentDate = new Date(startDate);
//   const finalEndDate = new Date(endDate);

//   while (currentDate <= finalEndDate) {
//     platforms.forEach(platform => {
//       data.push({
//         date: currentDate.toISOString().split('T')[0],
//         platform: platform,
//         followers: faker.number.int({ min: 500, max: 50000 }),
//         newFollowers: faker.number.int({ min: -50, max: 200 }),
//         engagementRate: parseFloat(faker.number.float({ min: 0.5, max: 10 }).toFixed(1)),
//         posts: faker.number.int({ min: 0, max: 5 }),
//         reach: faker.number.int({ min: 100, max: 100000 }),
//         impressions: faker.number.int({ min: 200, max: 200000 }),
//         likes: faker.number.int({ min: 10, max: 5000 }),
//         comments: faker.number.int({ min: 1, max: 1000 }),
//         shares: faker.number.int({ min: 0, max: 500 }),
//         views: platform === 'youtube' ? faker.number.int({min: 100, max: 50000}) : faker.number.int({min: 50, max: 10000}),
//       });
//     });
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
//   return data;
// };

// const initialEndDate = new Date();
// const initialStartDate = new Date();
// initialStartDate.setDate(initialEndDate.getDate() - 29); // Default to last 30 days

// const ALL_MOCK_DATA = generateMockData(
//   new Date(initialEndDate.getFullYear() -1, initialEndDate.getMonth(), initialEndDate.getDate()), // Generate data for past year
//   initialEndDate
// );


// const StatCard = ({ title, value, change, icon, color, bgColor, changeColor }) => {
//   const isPositive = change && !change.startsWith('-');
//   return (
//     <div className={`${bgColor} p-6 rounded-xl shadow-lg relative overflow-hidden`}>
//       <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mt-10 -mr-10 opacity-50"></div>
//       <div className="flex justify-between items-start relative z-10">
//         <div>
//           <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
//           <h3 className="text-3xl font-bold text-white">{value}</h3>
//           {change && (
//             <p className={`text-sm mt-2 flex items-center ${isPositive ? (changeColor ? changeColor.positive : 'text-green-200') : (changeColor ? changeColor.negative : 'text-red-200')}`}>
//               {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
//               {change}
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-full bg-white/20`}>
//           {React.cloneElement(icon, { className: `w-6 h-6 ${color}`})}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ActiveShapePieChart = (props) => {
//   const RADIAN = Math.PI / 180;
//   const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? 'start' : 'end';

//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
//         {payload.name}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//       />
//       <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333"  className="dark:fill-gray-300 text-xs">{`${value.toLocaleString()}`}</text>
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
//         {`(Rate ${(percent * 100).toFixed(2)}%)`}
//       </text>
//     </g>
//   );
// };


// const Analytics = () => {
//   const { isDarkMode, themeColors } = useTheme();
//   const [dateRange, setDateRange] = useState({
//     startDate: initialStartDate.toISOString().split('T')[0],
//     endDate: initialEndDate.toISOString().split('T')[0],
//     label: 'Last 30 Days'
//   });
//   const [activePlatforms, setActivePlatforms] = useState(platforms); // Initially all platforms
//   const [filteredData, setFilteredData] = useState([]);
//   const [activePieIndex, setActivePieIndex] = useState(0);

//   useEffect(() => {
//     const start = new Date(dateRange.startDate);
//     const end = new Date(dateRange.endDate);
//     end.setHours(23,59,59,999); // Ensure end date includes the whole day

//     const currentFilteredData = ALL_MOCK_DATA.filter(item => {
//       const itemDate = new Date(item.date);
//       const platformMatch = activePlatforms.length === 0 || activePlatforms.includes(item.platform); // If no platforms selected, show all
//       return itemDate >= start && itemDate <= end && platformMatch;
//     });
//     setFilteredData(currentFilteredData);
//   }, [dateRange, activePlatforms]);

//   const aggregateMetrics = useMemo(() => {
//     if (!filteredData.length) return {
//       totalFollowers: 0, followersChange: '0%', engagementRate: '0%', engagementChange:'0%', totalPosts: 0, postsChange:'0 new posts', avgReach: '0', reachChange:'0%',
//       totalLikes: 0, totalComments: 0, totalShares: 0, totalViews: 0
//     };

//     let totalFollowers = 0;
//     const latestFollowersByPlatform = {};

//     filteredData.forEach(item => {
//         if (!latestFollowersByPlatform[item.platform] || new Date(item.date) > new Date(latestFollowersByPlatform[item.platform].date)) {
//             latestFollowersByPlatform[item.platform] = { followers: item.followers, date: item.date };
//         }
//     });
//     totalFollowers = Object.values(latestFollowersByPlatform).reduce((sum, pf) => sum + pf.followers, 0);

//     const followersChange = faker.number.int({ min: -5, max: 15 }); 
//     const engagementRate = parseFloat(filteredData.reduce((sum, item) => sum + item.engagementRate, 0) / filteredData.length || 0).toFixed(1);
//     const engagementChange = parseFloat(faker.number.float({ min: -1, max: 1 })).toFixed(1); 
//     const totalPosts = filteredData.reduce((sum, item) => sum + item.posts, 0);
//     const postsChange = faker.number.int({ min: -10, max: 20 }); 
//     const avgReach = parseFloat(filteredData.reduce((sum, item) => sum + item.reach, 0) / filteredData.length || 0).toFixed(0);
//     const reachChange = faker.number.int({ min: -10, max: 10 }); 

//     return {
//       totalFollowers,
//       followersChange: `${followersChange > 0 ? '+' : ''}${followersChange}%`,
//       engagementRate: `${engagementRate}%`,
//       engagementChange: `${engagementChange > 0 ? '+' : ''}${engagementChange}%`,
//       totalPosts,
//       postsChange: `${postsChange > 0 ? '+' : ''}${postsChange} new posts`,
//       avgReach: parseInt(avgReach).toLocaleString(),
//       reachChange: `${reachChange > 0 ? '+' : ''}${reachChange}%`,
//       totalLikes: filteredData.reduce((sum, item) => sum + item.likes, 0),
//       totalComments: filteredData.reduce((sum, item) => sum + item.comments, 0),
//       totalShares: filteredData.reduce((sum, item) => sum + item.shares, 0),
//       totalViews: filteredData.reduce((sum, item) => sum + item.views, 0),
//     };
//   }, [filteredData]);

//   const engagementByPlatformChartData = useMemo(() => {
//     const result = {};
//     filteredData.forEach(item => {
//       if (!result[item.platform]) {
//         result[item.platform] = { name: platformDetails[item.platform].name, likes: 0, comments: 0, shares: 0 };
//       }
//       result[item.platform].likes += item.likes;
//       result[item.platform].comments += item.comments;
//       result[item.platform].shares += item.shares;
//     });
//     return Object.values(result);
//   }, [filteredData]);

//   const followerGrowthChartData = useMemo(() => {
//     const dailyData = {};

//     // Initialize dailyData with all dates in the range for all active platforms
//     let currentDate = new Date(dateRange.startDate);
//     const endDate = new Date(dateRange.endDate);
//     while(currentDate <= endDate) {
//         const dateStr = currentDate.toISOString().split('T')[0];
//         dailyData[dateStr] = { date: dateStr, followers: 0 };
//         activePlatforms.forEach(platform => {
//             dailyData[dateStr][platform] = 0; // Initialize follower count for each platform
//         });
//         currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Populate with actual follower data (latest for each day for each platform)
//     const latestPlatformFollowersPerDay = {};
//     filteredData.forEach(item => {
//         const dateKey = `${item.date}-${item.platform}`;
//         if (!latestPlatformFollowersPerDay[dateKey] || new Date(item.date) >= new Date(latestPlatformFollowersPerDay[dateKey].dateRecord)) {
//              latestPlatformFollowersPerDay[dateKey] = { followers: item.followers, dateRecord: item.date };
//         }
//     });

//     // Aggregate total followers per day
//     Object.keys(dailyData).forEach(dateStr => {
//         let dailyTotal = 0;
//         activePlatforms.forEach(platform => {
//             // Find the latest record for this platform up to dateStr
//             let latestFollowersForPlatformOnDate = 0;
//             let recordDate = new Date(dateRange.startDate);
//             recordDate.setDate(recordDate.getDate() -1); // Start before range

//             filteredData.filter(d => d.platform === platform && new Date(d.date) <= new Date(dateStr))
//                         .forEach(d => {
//                             if(new Date(d.date) > recordDate) {
//                                 latestFollowersForPlatformOnDate = d.followers;
//                                 recordDate = new Date(d.date);
//                             }
//                         });
//             dailyTotal += latestFollowersForPlatformOnDate;
//         });
//         dailyData[dateStr].followers = dailyTotal;
//     });

//     const series = Object.values(dailyData).sort((a,b) => new Date(a.date) - new Date(b.date));

//     if(series.length === 1) { // Handle single data point for line chart
//         return [series[0], {...series[0], date: new Date(new Date(series[0].date).getTime() + 86400000).toISOString().split('T')[0] }];
//     }

//     return series.length > 0 ? series : [{date: dateRange.startDate, followers: 0}, {date: dateRange.endDate, followers: 0}];

//   }, [filteredData, activePlatforms, dateRange.startDate, dateRange.endDate]);


//   const audienceDistributionChartData = useMemo(() => {
//     const latestFollowersByPlatformForDist = {}; // Correctly initialize here

//     filteredData.forEach(item => {
//         if (!latestFollowersByPlatformForDist[item.platform] || new Date(item.date) > new Date(latestFollowersByPlatformForDist[item.platform].date)) {
//             latestFollowersByPlatformForDist[item.platform] = { followers: item.followers, date: item.date };
//         }
//     });

//     return activePlatforms.map(platform => ({
//       name: platformDetails[platform].name,
//       value: latestFollowersByPlatformForDist[platform]?.followers || 0,
//       color: platformDetails[platform].color,
//     })).filter(p => p.value > 0);
//   }, [filteredData, activePlatforms]);

//   const topPerformingPosts = useMemo(() => {
//     // Create a map to store the latest version of each post based on its title and platform (as a pseudo-ID)
//     const latestPostsMap = new Map();
//     filteredData.forEach(item => {
//       const postTitle = item.title || faker.lorem.sentence(5).slice(0,-1); // Use existing title or generate one
//       const postId = `${postTitle}-${item.platform}`; // Create a unique ID based on title and platform

//       if (!latestPostsMap.has(postId) || new Date(item.date) > new Date(latestPostsMap.get(postId).date)) {
//         latestPostsMap.set(postId, {
//           ...item,
//           id: postId, // Use the generated ID
//           title: postTitle,
//           engagementScore: item.likes + item.comments * 2 + item.shares * 3,
//         });
//       }
//     });

//     return Array.from(latestPostsMap.values())
//       .sort((a, b) => b.engagementScore - a.engagementScore)
//       .slice(0, 5);
//   }, [filteredData]);


//   const onPieEnter = (_, index) => setActivePieIndex(index);

//   const statCards = [
//     { title: "Total Followers", value: aggregateMetrics.totalFollowers.toLocaleString(), change: aggregateMetrics.followersChange, icon: <Users />, color: "text-white", bgColor: "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800" },
//     { title: "Engagement Rate", value: aggregateMetrics.engagementRate, change: aggregateMetrics.engagementChange, icon: <TrendingUp />, color: "text-white", bgColor: "bg-gradient-to-br from-pink-500 to-pink-700 dark:from-pink-600 dark:to-pink-800" },
//     { title: "Total Posts", value: aggregateMetrics.totalPosts.toLocaleString(), change: aggregateMetrics.postsChange, icon: <BarChart2 />, color: "text-white", bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800" },
//     { title: "Avg. Reach", value: aggregateMetrics.avgReach, change: aggregateMetrics.reachChange, icon: <Eye />, color: "text-white", bgColor: "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800" }
//   ];

//   const engagementOverviewCards = [
//      { title: "Total Likes", value: aggregateMetrics.totalLikes.toLocaleString(), icon: <ThumbsUp size={24}/>, color: themeColors.primary },
//      { title: "Total Comments", value: aggregateMetrics.totalComments.toLocaleString(), icon: <MessageSquare size={24}/>, color: themeColors.accent },
//      { title: "Total Shares", value: aggregateMetrics.totalShares.toLocaleString(), icon: <Share2 size={24}/>, color: themeColors.info },
//      { title: "Total Views", value: aggregateMetrics.totalViews.toLocaleString(), icon: <Activity size={24}/>, color: themeColors.success },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//         <h1 className="text-2xl font-semibold">Analytics & Insights</h1>
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           <PlatformFilter selectedPlatforms={activePlatforms} onChange={setActivePlatforms} />
//           <DateRangePicker onRangeChange={setDateRange} />
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
//             <Download className="w-4 h-4" />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <StatCard 
//             key={index}
//             title={stat.title}
//             value={stat.value}
//             change={stat.change}
//             icon={stat.icon}
//             color={stat.color}
//             bgColor={stat.bgColor}
//           />
//         ))}
//       </div>

//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//         <h3 className="text-xl font-semibold mb-1">Engagement Overview</h3>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Summary of key engagement metrics for the selected period and platforms.</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {engagementOverviewCards.map(card => (
//                  <div key={card.title} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 flex items-center">
//                     <div className="p-3 rounded-full mr-4" style={{backgroundColor: `${card.color}20`}}>
//                         {React.cloneElement(card.icon, {style: {color: card.color}})}
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
//                         <p className="text-2xl font-bold">{card.value}</p>
//                     </div>
//                  </div>
//             ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h3 className="text-xl font-semibold mb-4">Engagement by Platform</h3>
//            <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={engagementByPlatformChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
//                 <XAxis dataKey="name" tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
//                 <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
//                 <Tooltip 
//                     contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`}} 
//                     labelStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
//                     itemStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
//                 />
//                 <Legend wrapperStyle={{fontSize: "12px"}}/>
//                 <Bar dataKey="likes" name="Likes" fill={themeColors.primary} radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="comments" name="Comments" fill={themeColors.accent} radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="shares" name="Shares" fill={themeColors.info} radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h3 className="text-xl font-semibold mb-4">Follower Growth</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={followerGrowthChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
//                 <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month:'short', day:'numeric'})} tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
//                 <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} tickFormatter={(value) => value.toLocaleString()} />
//                 <Tooltip 
//                     contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`}}
//                     labelStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
//                     itemStyle={{color: isDarkMode ? '#e5e7eb' : '#1f2937'}}
//                     formatter={(value) => value.toLocaleString()}
//                 />
//                 <Legend wrapperStyle={{fontSize: "12px"}}/>
//                 <Line type="monotone" dataKey="followers" name="Total Followers" stroke={themeColors.primary} strokeWidth={2} dot={{ r: 4, fill: themeColors.primary }} activeDot={{ r: 6 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h3 className="text-xl font-semibold mb-4">Audience Distribution by Platform</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   activeIndex={activePieIndex}
//                   activeShape={ActiveShapePieChart}
//                   data={audienceDistributionChartData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   dataKey="value"
//                   onMouseEnter={(_, index) => setActivePieIndex(index)}
//                 >
//                   {audienceDistributionChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Legend 
//                   layout="vertical" 
//                   align="right" 
//                   verticalAlign="middle" 
//                   iconSize={10}
//                   wrapperStyle={{fontSize: "12px", lineHeight: "20px"}}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2">
//           <h3 className="text-xl font-semibold mb-4">Top Performing Posts</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//               <thead className="bg-gray-50 dark:bg-gray-700/50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement Score</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {topPerformingPosts.map((post) => (
//                   <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium max-w-xs truncate" title={post.title}>{post.title}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       <span 
//                         className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max"
//                         style={{ backgroundColor: `${platformDetails[post.platform].color}20`, color: platformDetails[post.platform].color}}
//                       >
//                         {React.cloneElement(platformDetails[post.platform].icon, {size: 12})}
//                         {platformDetails[post.platform].name}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.engagementScore.toLocaleString()}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {topPerformingPosts.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">No posts match current filters.</p>}
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 dark:from-theme-primary/20 dark:to-theme-accent/20 p-8 rounded-xl shadow-lg">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="mb-4 md:mb-0 md:mr-6">
//             <h3 className="text-2xl font-semibold mb-2">Want Deeper Insights?</h3>
//             <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
//               Upgrade to our Pro plan to unlock advanced analytics, competitor benchmarking, AI-powered recommendations, and custom report generation.
//             </p>
//             <button className="mt-6 bg-theme-primary hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors">
//               Upgrade to Pro
//             </button>
//           </div>
//           <div className="w-full md:w-1/3 flex justify-center items-center">
//              <TrendingUp className="w-24 h-24 text-theme-primary opacity-70" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Briefcase,
} from 'lucide-react';

import Tooltip from '../components/Tooltip';
import axios from 'axios';
import YTInsights from '../components/analytics/YTInsights';
import FBInsights from '../components/analytics/FBInsights';
import INInsights from '../components/analytics/INInsights';
import LNInsights from '../components/analytics/LNInsights';
import XInsights from '../components/analytics/XInsights';

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const DATA_SOURCE_PLATFORM_MAP = {
  7066: 'facebook',
  7378: 'instagram',
  8984: 'youtube',
  7668: 'linkedin',
  8487: 'twitter',
};

const allPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#2563eb' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#db2777' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: '#60a5fa' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: '#1d4ed8' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: '#ff0000' },
];

const Analytics1 = () => {
  const [businessList, setBusinessList] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState();
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState(null);
  const [dataSources, setDataSources] = useState([]);

  // Fetch business/products
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    axios.get(`${BASE_URL}/ext-product/list`)
      .then(res => {
        setBusinessList(res.data);
        if (res.data.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(res.data[0].id);
        }
      })
      .catch(() => setBusinessList([]));
  }, []);

  // Fetch data sources for selected business
  useEffect(() => {
    if (selectedBusinessId) {
      axios.get(`${BASE_URL}/ext-product/list_datasource/${selectedBusinessId}`)
        .then(res => {
          setDataSources(res.data);
          const allowed = res.data
            .map(ds => DATA_SOURCE_PLATFORM_MAP[ds.data_source_id])
            .filter(Boolean);
          setAvailablePlatforms(allPlatforms.filter(p => allowed.includes(p.id)));

          // Set default platform if not set
          if (!activePreviewPlatform && allowed.length > 0) {
            setActivePreviewPlatform(allowed[0]);
          }
        })
        .catch(() => {
          setAvailablePlatforms([]);
          setDataSources([]);
        });
    } else {
      setAvailablePlatforms([]);
      setDataSources([]);
    }
  }, [selectedBusinessId]);

  const platforms = availablePlatforms.length > 0 ? availablePlatforms : allPlatforms;

  return (
    <div className='space-y-6'>

      {/* Business Selection */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <label htmlFor="businessSelect" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            Select Business
          </label>
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              id="businessSelect"
              value={selectedBusinessId}
              onChange={e => setSelectedBusinessId(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700 text-sm"
            >
              <option value="">-- Select Business --</option>
              {businessList.map(biz => (
                <option key={biz.id} value={biz.id}>
                  {biz.product_name || biz.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 text-left sm:text-right">
            Select Platform
          </label>
          <div className="flex flex-wrap justify-start sm:justify-end gap-2">
            {platforms.map((platform) => {
              const isActive = activePreviewPlatform === platform.id;
              return (
                <Tooltip key={platform.id} text={platform.name} position="top">
                  <button
                    onClick={() => setActivePreviewPlatform(platform.id)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 ease-in-out
                      ${isActive ? 'shadow-inner scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'}
                    `}
                    style={{ borderColor: isActive ? platform.color : '#e0e0e0' }}
                  >
                    <div style={{ color: isActive ? platform.color : '#6b7280' }}>
                      {React.cloneElement(platform.icon, { size: 20 })}
                    </div>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activePreviewPlatform === "youtube" && <YTInsights />}

      {activePreviewPlatform === "facebook" && <FBInsights />}  
      {activePreviewPlatform === "twitter" && <XInsights />}
      {activePreviewPlatform === "linkedin" && <LNInsights />}
      {activePreviewPlatform === "instagram" && <INInsights />}
    </div>  
  );
};

export default Analytics1;
