import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const formatMessage = (message) => {
  // Tách message tại dấu '/' và lấy phần đầu tiên
  return message.split("/")[0];
};

const NotificationDropdown = ({ show, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      fetchNotifications();
    }
  }, [show]);

  const fetchNotifications = async () => {
    setLoading(true);
    const accessToken = Cookies.get("access_token");

    try {
      const response = await fetch(
        "http://cnpm.duytech.site/api/job/notifications_job/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  // Phân loại thông báo
  const responseNotifications = notifications.filter(
    (notif) =>
      notif.message.includes("chấp nhận") || notif.message.includes("từ chối")
  );

  const matchNotifications = notifications.filter((notif) =>
    notif.message.includes("công việc mới phù hợp")
  );

  return (
    <div className="absolute top-full right-0 bg-white shadow-md rounded-md py-2 w-96 z-20">
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "all"
              ? "text-blueColor border-b-2 border-blueColor"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "responses"
              ? "text-blueColor border-b-2 border-blueColor"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("responses")}
        >
          Responses
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "matches"
              ? "text-blueColor border-b-2 border-blueColor"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("matches")}
        >
          Job Matches
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-3 text-center text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="px-4 py-3 text-center text-red-500">{error}</div>
        ) : (
          <>
            {activeTab === "all" && (
              <div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-800">
                      {formatMessage(notif.message)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "responses" && (
              <div>
                {responseNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-800">
                      {formatMessage(notif.message)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "matches" && (
              <div>
                {matchNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-800">
                      {formatMessage(notif.message)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {notifications.length === 0 && (
              <div className="px-4 py-3 text-center text-gray-500">
                Không có thông báo mới
              </div>
            )}
          </>
        )}
      </div>
      {/* <div className="px-4 py-2 border-t border-gray-200">
        <button className="text-sm text-center w-full text-blue-600 hover:underline">
          View all notifications
        </button>
      </div> */}
    </div>
  );
};

export default NotificationDropdown;
