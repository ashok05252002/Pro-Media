import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, ArrowUp, ArrowDown, TrendingUp, Users, Eye, MessageSquare, Share2 } from 'lucide-react';

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.facebook, item.instagram, item.twitter, item.linkedin)));
  
  return (
    <div className="h-64 mt-4">
      <div className="flex h-full">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col justify-end items-center">
            <div className="w-full flex justify-center space-x-1">
              <div 
                className="w-3 bg-blue-600 rounded-t-lg"
                style={{ height: `${(item.facebook / maxValue) * 100}%` }}
              ></div>
              <div 
                className="w-3 bg-pink-600 rounded-t-lg"
                style={{ height: `${(item.instagram / maxValue) * 100}%` }}
              ></div>
              <div 
                className="w-3 bg-blue-400 rounded-t-lg"
                style={{ height: `${(item.twitter / maxValue) * 100}%` }}
              ></div>
              <div 
                className="w-3 bg-blue-700 rounded-t-lg"
                style={{ height: `${(item.linkedin / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs mt-2">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.followers));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.followers / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="h-64 mt-4 relative">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8884d8" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#8884d8" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Area under the line */}
        <path
          d={`M0,100 L${points} L100,100 Z`}
          fill="url(#gradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#8884d8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Dots */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100 + '%';
          const y = 100 - (item.followers / maxValue) * 100 + '%';
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#8884d8"
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between">
        {data.map((item, index) => (
          <div key={index} className="text-xs">{item.name}</div>
        ))}
      </div>
    </div>
  );
};

const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="h-64 flex justify-center items-center mt-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#f3f4f6" />
          {data.map((item, index) => {
            const startAngle = currentAngle;
            const angle = (item.value / total) * 360;
            currentAngle += angle;
            
            const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 45 * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 45 * Math.sin(((startAngle + angle) * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const colors = ['#0088FE', '#E91E63', '#00C49F', '#FFBB28'];
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={colors[index % colors.length]}
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color, bgColor }) => {
  const isPositive = !change.includes('-');
  
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-lg relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mt-10 -mr-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 -mb-8 -ml-8"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          <p className={`text-sm mt-2 flex items-center ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-white/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  
  const engagementData = [
    { name: 'Jan', facebook: 4000, instagram: 2400, twitter: 1800, linkedin: 1200 },
    { name: 'Feb', facebook: 3000, instagram: 2210, twitter: 2000, linkedin: 1300 },
    { name: 'Mar', facebook: 2000, instagram: 2290, twitter: 2200, linkedin: 1400 },
    { name: 'Apr', facebook: 2780, instagram: 3490, twitter: 2500, linkedin: 1500 },
    { name: 'May', facebook: 1890, instagram: 4490, twitter: 2800, linkedin: 1700 },
    { name: 'Jun', facebook: 2390, instagram: 3800, twitter: 2900, linkedin: 1800 },
    { name: 'Jul', facebook: 3490, instagram: 4300, twitter: 3100, linkedin: 2000 },
  ];
  
  const followerGrowthData = [
    { name: 'Jan', followers: 10000 },
    { name: 'Feb', followers: 12000 },
    { name: 'Mar', followers: 15000 },
    { name: 'Apr', followers: 18000 },
    { name: 'May', followers: 22000 },
    { name: 'Jun', followers: 28000 },
    { name: 'Jul', followers: 35000 },
  ];
  
  const platformDistributionData = [
    { name: 'Facebook', value: 40 },
    { name: 'Instagram', value: 30 },
    { name: 'Twitter', value: 20 },
    { name: 'LinkedIn', value: 10 },
  ];
  
  const topPerformingPosts = [
    {
      id: 1,
      title: 'Summer Collection Launch',
      platform: 'Instagram',
      engagement: '12.5K',
      reach: '45.2K',
      date: 'Jul 10, 2023',
    },
    {
      id: 2,
      title: 'Customer Testimonial Video',
      platform: 'Facebook',
      engagement: '8.7K',
      reach: '32.1K',
      date: 'Jul 5, 2023',
    },
    {
      id: 3,
      title: 'Industry News Update',
      platform: 'LinkedIn',
      engagement: '5.2K',
      reach: '18.9K',
      date: 'Jun 28, 2023',
    },
  ];

  const stats = [
    { 
      title: "Total Followers", 
      value: "35.2K", 
      change: "+12% from last month", 
      icon: <Users className="w-6 h-6 text-white" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-[#4E7FFF] to-[#7BA2FF]"
    },
    { 
      title: "Engagement Rate", 
      value: "5.7%", 
      change: "+0.8% from last month", 
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E]"
    },
    { 
      title: "Total Posts", 
      value: "248", 
      change: "+18 new posts", 
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-[#FFB31F] to-[#FFCB66]"
    },
    { 
      title: "Avg. Reach", 
      value: "28.4K", 
      change: "-3% from last month", 
      icon: <Eye className="w-6 h-6 text-white" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-[#36D399] to-[#6AE6B5]"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Analytics & Insights</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Calendar className="w-4 h-4" />
            <span>{dateRange}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
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
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4">Engagement by Platform</h3>
          <div className="flex justify-center mb-2">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
              <span className="text-xs">Facebook</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-pink-600 rounded-full mr-1"></div>
              <span className="text-xs">Instagram</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
              <span className="text-xs">Twitter</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-700 rounded-full mr-1"></div>
              <span className="text-xs">LinkedIn</span>
            </div>
          </div>
          <BarChart data={engagementData} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4">Follower Growth</h3>
          <LineChart data={followerGrowthData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4">Audience Distribution</h3>
          <PieChart data={platformDistributionData} />
          <div className="flex flex-wrap justify-center mt-4">
            {platformDistributionData.map((item, index) => {
              const colors = ['#0088FE', '#E91E63', '#00C49F', '#FFBB28'];
              return (
                <div key={index} className="flex items-center mr-4 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-xs">{item.name} ({item.value}%)</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Top Performing Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reach</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPerformingPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.platform === 'Instagram' ? 'bg-pink-100 text-pink-800' :
                        post.platform === 'Facebook' ? 'bg-blue-100 text-blue-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {post.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.engagement}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.reach}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-[#4E7FFF]/10 to-[#7BA2FF]/10 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h3 className="text-xl font-semibold mb-2">Want deeper insights?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Upgrade to our Pro plan to unlock advanced analytics, competitor benchmarking, and AI-powered recommendations.
            </p>
            <button className="mt-4 bg-[#4E7FFF] hover:bg-[#3A6BEB] text-white font-medium py-2 px-6 rounded-md transition-colors">
              Upgrade to Pro
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-[#4E7FFF]/20 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-[#4E7FFF]/30 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#4E7FFF] rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
