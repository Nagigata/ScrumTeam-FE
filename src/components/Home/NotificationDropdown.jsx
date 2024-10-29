import React, { useState } from "react";
import NotificationSection from "./NotificationSection";
import { mockNotifications } from "./mockNotifications";

const NotificationDropdown = ({ show, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState("all");

  if (!show) return null;

  const allNotifications = [
    ...mockNotifications.employerResponses,
    ...mockNotifications.jobMatches,
  ];

  return (
    <div className="absolute top-full right-0 bg-white shadow-md rounded-md py-2 w-96 z-20">
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          <span className="text-xs text-blueColor cursor-pointer hover:underline">
            Mark all as read
          </span>
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
        {activeTab === "all" ? (
          allNotifications.length > 0 ? (
            <div>
              <NotificationSection
                title="Recruiter Responses"
                notifications={mockNotifications.employerResponses}
                onMarkAsRead={onMarkAsRead}
              />
              <NotificationSection
                title="Job Matches"
                notifications={mockNotifications.jobMatches}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              No new notifications
            </div>
          )
        ) : activeTab === "responses" ? (
          <NotificationSection
            title="Recruiter Responses"
            notifications={mockNotifications.employerResponses}
            onMarkAsRead={onMarkAsRead}
          />
        ) : (
          <NotificationSection
            title="Job Matches"
            notifications={mockNotifications.jobMatches}
            onMarkAsRead={onMarkAsRead}
          />
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
