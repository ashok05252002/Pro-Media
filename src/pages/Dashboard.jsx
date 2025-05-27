import React, {useEffect, useState} from 'react';
import { Plus, BarChart2, TrendingUp, Users, Calendar, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { extCompanyProductData } from '../API/api';

const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = !change.includes('-');
  
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-start">
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

const ActivityCard = ({ title, activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor} mr-3 flex-shrink-0`}>
              <span className={`${activity.textColor} font-medium`}>{activity.icon}</span>
            </div>
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-secondary">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceCard = ({ title, channels }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {channels.map((channel, index) => (
          <div key={index} className="flex justify-between items-center pb-4 border-b dark:border-gray-700 last:border-0 last:pb-0">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${channel.bgColor} flex items-center justify-center mr-3`}>
                <span className={`${channel.textColor} text-sm font-bold`}>{channel.icon}</span>
              </div>
              <div className="font-medium">{channel.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{channel.followers}</div>
              <div className="text-sm text-green-500">{channel.growth}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  console.log(localStorage.getItem('authToken'));
  const navigate = useNavigate();
  const [registerPrdct, setResgisterPrdct] = useState(false)


  const handleRegNewProduct = () => {
    navigate ("/regproduct")
  } 
  
  
  const stats = [
    { 
      title: "Total Posts", 
      value: "248", 
      change: "+12% from last month", 
      icon: <BarChart2 className="w-6 h-6 text-white" />,
      color: "from-[#FF6B6B] to-[#FF8E8E]"
    },
    { 
      title: "Engagement Rate", 
      value: "5.2%", 
      change: "+0.8% from last month", 
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "from-[var(--color-primary)] to-[var(--color-accent)]"
    },
    { 
      title: "Scheduled Posts", 
      value: "12", 
      change: "Next post in 2 hours", 
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "from-[#FFB31F] to-[#FFCB66]"
    },
    { 
      title: "New Followers", 
      value: "1.2K", 
      change: "-3% from last month", 
      icon: <Users className="w-6 h-6 text-white" />,
      color: "from-[#36D399] to-[#6AE6B5]"
    }
  ];

  const recentActivities = [
    { 
      title: "New post published on Facebook", 
      time: "2 hours ago", 
      icon: "FB", 
      bgColor: "bg-blue-100", 
      textColor: "text-blue-600" 
    },
    { 
      title: "Instagram story viewed by 1.5K users", 
      time: "4 hours ago", 
      icon: "IG", 
      bgColor: "bg-pink-100", 
      textColor: "text-pink-600" 
    },
    { 
      title: "New comment on LinkedIn post", 
      time: "Yesterday", 
      icon: "LI", 
      bgColor: "bg-blue-100", 
      textColor: "text-blue-800" 
    },
    { 
      title: "Twitter post reached 5K impressions", 
      time: "2 days ago", 
      icon: "TW", 
      bgColor: "bg-blue-100", 
      textColor: "text-blue-400" 
    }
  ];

  const channelPerformance = [
    { name: 'Facebook', followers: '12.5K', growth: '+2.4%', icon: 'FB', bgColor: 'bg-blue-600', textColor: 'text-white' },
    { name: 'Instagram', followers: '24.8K', growth: '+5.7%', icon: 'IG', bgColor: 'bg-pink-600', textColor: 'text-white' },
    { name: 'Twitter', followers: '8.3K', growth: '+1.2%', icon: 'TW', bgColor: 'bg-blue-400', textColor: 'text-white' },
    { name: 'LinkedIn', followers: '5.1K', growth: '+3.8%', icon: 'LI', bgColor: 'bg-blue-800', textColor: 'text-white' }
  ];

  useEffect(() => {
      const token = localStorage.getItem('authToken');
      extCompanyProductData()  // testing must use user_id
            .then(response => {
              console.log("debugging1",response)
              if (response.status === ( 200 || 201))
              { 
                if(response.data.length !== 0)
                { setResgisterPrdct (false) }
                else
                { setResgisterPrdct (true) }
              }
              else {
                console.log(response.statusText)
              }
              })
            .catch(error => {
              console.error("Error fetching data:", error);
            });
    }, []);
  

  return (
    <div className="space-y-6">

      <div style={{justifyContent: "flex-end"}}>
        {/* <button onClick={handleRegNewProduct}>
            Register New Product
        </button> */}
        <button className="ml-auto flex gap-2 px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md" onClick={handleRegNewProduct}>
          <Plus className="w-4 h-4" />
          <span className= "text-white"> 
            {registerPrdct?"Register My Business":"Add My Business"}
          </span>
        </button>
        <button 
          onClick={() => navigate('/add-business')}
          className="flex items-center gap-2 px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md shadow-sm transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          <span className='text-white'>Add Business</span>
        </button>
      </div>


      {/* After use */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div> */}
      
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard title="Recent Activity" activities={recentActivities} />
        <PerformanceCard title="Channel Performance" channels={channelPerformance} />
      </div> */}
      
      {/* <div className="bg-gradient-to-r from-theme-light-accent to-theme-light-accent/60 dark:from-theme-dark-accent/20 dark:to-theme-dark-accent/20 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h3 className="text-xl font-semibold mb-2">Ready to boost your social presence?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Connect more platforms and reach a wider audience with our premium features.
            </p>
            <button className="mt-4 bg-theme-primary hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Upgrade Now
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="absolute -top-10 -right-10">
                <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/739b/c72e/00ccdfac86c98f764c0d40b9082c0948?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eVvY0kExVSk8VGAneULrqM2Pco4VJ7Mw6QwHRH9C2kFQJJ21zDnKl4S6a-WCgoEwGvLvtgLX3E1oXtEKZCtwV~QCZ3pJGZrULGwb-lFt50Vkz9GUkNWsO62AW-QJVvlMuyxEI83ze4I4AxRWtbP1KXpAoRanxyPfp1mIw6nW6HL~KYSVpIxOvBfCtsXhUdoYEuX23P2~2Is6e90aFNdD9hR5Nca-sXWaMFSqWRYx~SKcthrPBsV8l49eeiht-7BTEVIgpxNd2hJ75qJpaam6s7tRn9ADVHi7Fm5v1nvee-p9VJagdp-3DKc1-ADYXQm085srbBYWhiUY6mMb2HGYRg__" 
                  alt="Instagram" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="absolute -top-5 left-5">
                <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/2a24/b449/84b56ff07b56668620f15573e764d067?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=d4LU~nmR0kPwxmfOJLTMj2-R6CYzM2MTiJbOXedjLLIIgbzh2oKG6wMtWin~vunusnHZkWKzpxRKlW-NnmpfjEzvuw4rl6PYzDEXppgI9y7qwzhgBdLjRYxsG8oMsa-T6xCRWe0sOoE~sPqX~vw3W4jrzTNSSv2M87qphVQvreislgx308iYLvFz9NhzM4vNcopE39P6-WeJ~5Md-slOmvlfolhpssogU4~vi61qtlZFnQQkrSYjFjAitk6rLi0MYLD8KpSikWS7aAjeXpnI0dmuQXq90nxUQoZwUzEXbbCqLBd6wg3LQxuoS2DKSivf-X6LiDUN2gN54Jwe5TOZZA__" 
                  alt="Facebook" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="absolute top-10 -left-10">
                <img src="https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/19e4/0fbd/c222f0e3a99098c46e9d51b2c4c453a9?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Ncr7dm2TqLQyaXmJTvEZIOYxi8typD1jNMmt~pVvI6kNQ6ZLwPrLrGzbxmStVqbsYV~sLs85lNdCFCim2Q-pWbrxJwjvGKzzjucDGBZg42YhLjJI6zRQsKkEhb6yvzBOGFBXVW3CgG3~i-SL4Tj7fM-6shcEcvumARjUzgMLInU~Btak2aylmeW~F8G8De4LG7wgfLcDf7f-IAqSUzXWqW0CeIPnr9FajtNrp~0aDWkS7p~OEpY1xPdQqWlCJ18mA8S0s4D1leV5aQr29ZP6gL5v~QIkehjUPuIFGtt8BobiDtD3e-UuE--jpakPkpZv4TmItEbp21wdlTMWuSHHSA__" 
                  alt="X" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
