import React, { useState, useMemo } from 'react';
import { BarChart2, TrendingUp, Users, Calendar as CalendarIconLucide, ArrowUp, ArrowDown, Youtube, Briefcase, FileEdit, BarChart3 as AnalyticsIcon, Globe, Zap, Newspaper, AlertTriangle, Instagram, LayoutList, MessageSquare, Rocket, Lightbulb, Facebook, Settings } from 'lucide-react';
import { useTheme, themeOptions } from '../contexts/ThemeContext';
import { BarChart as RechartsBarChartComponent, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import GettingStartedCard from '../components/dashboard/GettingStartedCard';
import TipsCard from '../components/dashboard/TipsCard';
import CalendarViewPage from './CalendarViewPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// --- MOCK DATA ---
const mockBusinessData = [
  { id: 'biz1', name: 'TechCorp Solutions' },
  { id: 'biz2', name: 'Innovate Hub' },
  { id: 'biz3', name: 'GreenLeaf Organics' },
];

const mockDashboardDataByBusiness = {
  biz1: {
    stats: [
      { title: "Total Posts", value: "248", change: "+12%", icon: <FileEdit /> },
      { title: "Engagement Rate", value: "5.2%", change: "+0.8%", icon: <TrendingUp /> },
      { title: "Scheduled Posts", value: "12", change: "Next: 2h", icon: <CalendarIconLucide /> },
      { title: "New Followers", value: "1.2K", change: "-3%", icon: <Users /> }
    ],
    topPost: {
      platform: 'Facebook',
      icon: <Facebook size={16} style={{color: themeOptions.colors.blue.primary || '#4267B2'}}/>,
      title: 'Our new AI-powered analytics is live!',
      engagement: '1.8K Likes, 245 Comments',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
    },
    socialBeats: [
      { type: 'tip', icon: <Zap size={18} className="text-yellow-500"/>, text: 'Tip for TechCorp: Share behind-the-scenes content to boost engagement.' },
      { type: 'news', icon: <Newspaper size={18} className="text-blue-500"/>, text: 'News: LinkedIn algorithm now favors expert content.' },
    ],
    audienceGrowthData: [
      { month: 'Jan', facebook: 2300, instagram: 2800, twitter: 1750, linkedin: 1200, youtube: 2080 },
      { month: 'Feb', facebook: 2600, instagram: 3200, twitter: 2000, linkedin: 1400, youtube: 2360 },
      { month: 'Mar', facebook: 2900, instagram: 3600, twitter: 2250, linkedin: 1600, youtube: 2640 },
    ]
  },
  biz2: {
    stats: [
      { title: "Total Posts", value: "150", change: "+5%", icon: <FileEdit /> },
      { title: "Engagement Rate", value: "8.9%", change: "+1.2%", icon: <TrendingUp /> },
      { title: "Scheduled Posts", value: "8", change: "Next: 1d", icon: <CalendarIconLucide /> },
      { title: "New Followers", value: "2.1K", change: "+8%", icon: <Users /> }
    ],
    topPost: {
      platform: 'Instagram',
      icon: <Instagram size={16} style={{color: themeOptions.colors.pink.primary || '#E1306C'}}/>,
      title: 'Innovate Hub\'s Design Sprint was a huge success!',
      engagement: '3.1K Likes, 450 Comments',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
    },
    socialBeats: [
      { type: 'tip', icon: <Zap size={18} className="text-yellow-500"/>, text: 'Tip for Innovate Hub: Use Instagram Reels to showcase your creative process.' },
      { type: 'alert', icon: <AlertTriangle size={18} className="text-red-500"/>, text: 'Alert: Check your ad spend, it seems higher than usual.' },
    ],
    audienceGrowthData: [
      { month: 'Jan', facebook: 1100, instagram: 4200, twitter: 900, linkedin: 2200, youtube: 1500 },
      { month: 'Feb', facebook: 1200, instagram: 4800, twitter: 1000, linkedin: 2500, youtube: 1700 },
      { month: 'Mar', facebook: 1300, instagram: 5500, twitter: 1100, linkedin: 2800, youtube: 1900 },
    ]
  },
  biz3: {
    stats: [
      { title: "Total Posts", value: "98", change: "+20%", icon: <FileEdit /> },
      { title: "Engagement Rate", value: "4.1%", change: "-0.5%", icon: <TrendingUp /> },
      { title: "Scheduled Posts", value: "25", change: "Next: 4h", icon: <CalendarIconLucide /> },
      { title: "New Followers", value: "800", change: "+15%", icon: <Users /> }
    ],
    topPost: {
      platform: 'YouTube',
      icon: <Youtube size={16} style={{color: '#FF0000'}}/>,
      title: 'Our organic farming journey - A documentary.',
      engagement: '5.5K Views, 600 Likes',
      image: 'https://images.unsplash.com/photo-1597362925123-516541354213?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60',
    },
    socialBeats: [
      { type: 'tip', icon: <Zap size={18} className="text-yellow-500"/>, text: 'Tip for GreenLeaf: Share user-generated content to build community.' },
      { type: 'news', icon: <Newspaper size={18} className="text-blue-500"/>, text: 'News: "Organic" is a top trending keyword on Pinterest.' },
    ],
    audienceGrowthData: [
      { month: 'Jan', facebook: 3000, instagram: 1500, twitter: 500, linkedin: 300, youtube: 4000 },
      { month: 'Feb', facebook: 3200, instagram: 1700, twitter: 600, linkedin: 400, youtube: 4500 },
      { month: 'Mar', facebook: 3500, instagram: 2000, twitter: 700, linkedin: 500, youtube: 5000 },
    ]
  }
};
// --- END MOCK DATA ---

const StatCard = ({ title, value, change, icon, iconBgColor, iconColor }) => {
  const isPositive = change && !change.includes('-');

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg h-full border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-0.5">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2.5 rounded-lg`} style={{backgroundColor: `${iconBgColor}20`}}>
          {React.cloneElement(icon, { className: "w-5 h-5", style: {color: iconBgColor || '#6b7280'} })}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</h3>
        {change && (
          <p className={`text-xs mt-1 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
            {change}
          </p>
        )}
      </div>
    </div>
  );
};



const AudienceGrowthCard = ({ data }) => {
  const { isDarkMode } = useTheme();
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true, instagram: true, twitter: true, linkedin: true, youtube: true
  });

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const platformStaticColors = {
    facebook: themeOptions.colors.blue.primary || "#4267B2",
    instagram: themeOptions.colors.pink.primary || "#E1306C",
    twitter: "#1DA1F2",
    linkedin: themeOptions.colors.blue.dark || "#0077B5",
    youtube: "#FF0000"
  };

  return (

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Audience Growth</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(selectedPlatforms).map(([platform, isSelected]) => (
          <button
            key={platform} onClick={() => togglePlatform(platform)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-all duration-200 shadow-sm border
                        ${isSelected ? `text-white border-transparent` : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            style={{ backgroundColor: isSelected ? platformStaticColors[platform] : '' }}
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 ${isSelected ? 'bg-white/70' : ''}`} style={!isSelected ? { backgroundColor: platformStaticColors[platform] } : {}}></span>
            <span className="capitalize">{platform}</span>
          </button>
        ))}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChartComponent data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="month" tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`, borderRadius: '0.5rem', color: isDarkMode ? "#f9fafb" : "#111827"}} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            {selectedPlatforms.facebook && (<RechartsBar dataKey="facebook" name="Facebook" fill={platformStaticColors.facebook} radius={[4, 4, 0, 0]} />)}
            {selectedPlatforms.instagram && (<RechartsBar dataKey="instagram" name="Instagram" fill={platformStaticColors.instagram} radius={[4, 4, 0, 0]} />)}
            {selectedPlatforms.twitter && (<RechartsBar dataKey="twitter" name="Twitter" fill={platformStaticColors.twitter} radius={[4, 4, 0, 0]} />)}
            {selectedPlatforms.linkedin && (<RechartsBar dataKey="linkedin" name="LinkedIn" fill={platformStaticColors.linkedin} radius={[4, 4, 0, 0]} />)}
            {selectedPlatforms.youtube && (<RechartsBar dataKey="youtube" name="YouTube" fill={platformStaticColors.youtube} radius={[4, 4, 0, 0]} />)}
          </RechartsBarChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const QuickActionsCard = () => {
  const navigate = useNavigate();
  const actions = [
    { name: 'Create Post', icon: <FileEdit size={20}/>,  path: '/post-creation', color: 'hover:bg-blue-500 dark:hover:bg-blue-600' },
    { name: 'View Calendar', icon: <CalendarIconLucide size={20}/>, path: '/calendar-view', color: 'hover:bg-green-500 dark:hover:bg-green-600' },
    { name: 'Manage Business', icon: <Globe size={20}/>, path: '/channels', color: 'hover:bg-purple-500 dark:hover:bg-purple-600' },
    { name: 'View Analytics', icon: <AnalyticsIcon size={20}/>, path: '/analytics', color: 'hover:bg-yellow-500 dark:hover:bg-yellow-600' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full"> {/* Changed here */}
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 hover:text-white">
        {actions.map(action => (
          <button
            key={action.name}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 ${action.color} text-gray-700 dark:text-gray-200 hover:text-white transition-all duration-200 group`}
          >
            {React.cloneElement(action.icon, { className: "mb-1.5 text-theme-primary group-hover:text-white transition-colors"})}
            <span className="text-xs hover:text-white font-medium text-center">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const navigate = useNavigate();
  const { themeColors } = useTheme();
  const [selectedBusinessId, setSelectedBusinessId] = useState(mockBusinessData[0].id);

  const currentBusinessData = useMemo(() => {
    return mockDashboardDataByBusiness[selectedBusinessId] || mockDashboardDataByBusiness.biz1;
  }, [selectedBusinessId]);

  const statsWithColors = useMemo(() => [
    { ...currentBusinessData.stats[0], iconBgColor: themeColors.primary },
    { ...currentBusinessData.stats[1], iconBgColor: themeOptions.colors.pink.primary },
    { ...currentBusinessData.stats[2], iconBgColor: themeOptions.colors.blue.primary },
    { ...currentBusinessData.stats[3], iconBgColor: themeColors.success }
  ], [currentBusinessData, themeColors]);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-800 shadow-sm"
            >
              {mockBusinessData.map(biz => (
                <option key={biz.id} value={biz.id}>{biz.name}</option>
              ))}
            </select>
            <Briefcase className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate('/add-business')}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsWithColors.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GettingStartedCard />
        <TipsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AudienceGrowthCard data={currentBusinessData.audienceGrowthData} />
        </div>
        <div className="lg:col-span-1">
            <QuickActionsCard />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;