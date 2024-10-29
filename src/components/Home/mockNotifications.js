export const mockNotifications = {
  employerResponses: [
    {
      id: 1,
      type: "application",
      message:
        "Your application for Senior Frontend Developer at Google has been viewed",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    },
    {
      id: 2,
      type: "interview",
      message:
        "Interview scheduled with Microsoft for Full Stack Developer position",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      type: "application",
      message:
        "Amazon has responded to your application for Backend Developer position",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    },
  ],
  jobMatches: [
    {
      id: 5,
      type: "job_match",
      message:
        "New job match: Senior React Developer at Netflix - 90% match with your profile",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
      id: 6,
      type: "job_match",
      message:
        "New job match: Frontend Team Lead at Apple matches your experience",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      type: "job_match",
      message:
        "New job match: React Developer at Facebook matches your profile",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
  ],
};
