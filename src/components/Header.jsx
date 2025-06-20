import React, { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSidebar } from '../contexts/SidebarContext';
import NotificationPanel from './NotificationPanel';
import socketService from '../services/SocketService';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { getNotification, markNotificationsAsRead } from '../API/api';


const Header = () => {
  const { toggleSidebar } = useSidebar();
  const userName = localStorage.getItem('username');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    console.log("Initializing Socket.IO connection");
    const socket = io(import.meta.env.VITE_BASE_API_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 2,
    });

    // Connection established
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server with ID:", socket.id);
      const storedUser = JSON.parse(localStorage.getItem("userData") ?? "null") || {};
      console.log('=connection=');
      console.log(storedUser.id);
      socket.emit("join", { userId: storedUser.id ?? 0 }, (response) => {
        console.log("Join room response:", response);
      });
    });

    // Notification handler
 


    // Connection error handling
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      toast.error("Failed to connect to notifications service");
    });

    // Disconnect handling
    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      if (reason === "io server disconnect") {
        // The server forcibly disconnected the socket
        socket.connect(); // Try to reconnect
      }
    });

    // Cleanup on component unmount
    return () => {
      console.log("Cleaning up Socket.IO connection");
      socket.off("connect");
      socket.off("notification");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    fetchInitialNotifications();
  },[showNotifications])

  const fetchInitialNotifications = async () => {
    // setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("userData") ?? "null") || {};
      const response = await getNotification(); 
      console.log(response['data']);
      if(response?.status == 200){
        setNotifications(response['data'] ?? []);
      }
    } catch (error) { 
      console.log(error); 
      // toast.error("Failed to load notifications1");
    } finally {
      // setIsLoading(false);
    }
  };

  // const markNotificationsAsRead = async (id) => {
  //   try {
  //     const response = await axios.patch(
  //       `${import.meta.env.VITE_BASE_API_URL}/notification/read/${id}`,
  //       { status: "read" }
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationsAsRead([notificationId]);
      // Optionally update local notification state/UI here
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
  const unreadIds = notifications.filter(n => !n.read).map(n => n.id);

  if (unreadIds.length === 0) return;

  try {
    await markNotificationsAsRead(unreadIds);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
};

  return (
    <header className="border-b border-[#FFC9CA]/20 py-4 px-6 flex justify-between items-center transition-colors duration-200 bg-white dark:bg-primary-dark">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-1 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium">{getGreeting()}, {userName}!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-theme-danger rounded-full"></span>
          </button>

          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)}  notifications={notifications} onClick={handleNotificationClick} onMarkAllAsRead={handleMarkAllAsRead}/>}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
