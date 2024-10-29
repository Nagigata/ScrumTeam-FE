import React from "react";

const NotificationIcon = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case "application":
        return "📝";
      case "interview":
        return "🗣️";
      case "job_match":
        return "🎯";
      default:
        return "📢";
    }
  };

  return <span className="mr-3 text-xl">{getIcon()}</span>;
};

const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

const NotificationSection = ({ title, notifications, onMarkAsRead }) => (
  <>
    <div className="px-4 py-2 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
    </div>
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
          !notification.read ? "bg-blue-50" : ""
        }`}
        onClick={() => onMarkAsRead(notification.id)}
      >
        <div className="flex items-start">
          <NotificationIcon type={notification.type} />
          <div className="flex-1">
            <p className="text-sm text-[#6f6f6f]">{notification.message}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-[#959595]">
                {getTimeAgo(notification.created_at)}
              </p>
              {!notification.read && (
                <span className="text-xs text-blueColor font-medium">New</span>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
    ;
  </>
);

export default NotificationSection;
