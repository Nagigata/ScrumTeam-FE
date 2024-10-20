const mockApplications = [
  {
    id: 1,
    company: "Facebook",
    position: "Senior Developer",
    date: "2024-10-05",
    status: "In Progress",
    interviewer: "John Doe",
    nextStep: "Technical Interview",
    timeLeft: "3 days",
    logo: "/assets/companyLogo/facebook.png",
    progress: 60,
    stages: [
      { name: "Application Submitted", completed: true },
      { name: "Resume Screened", completed: true },
      { name: "Technical Assessment", completed: true },
      { name: "Technical Interview", completed: false },
      { name: "HR Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 2,
    company: "GitHub",
    position: "Backend Engineer",
    date: "2024-10-02",
    status: "Interviewed",
    interviewer: "Jane Smith",
    nextStep: "HR Interview",
    timeLeft: "5 days",
    logo: "/assets/companyLogo/github.png",
    progress: 80,
    stages: [
      { name: "Application Submitted", completed: true },
      { name: "Resume Screened", completed: true },
      { name: "Technical Assessment", completed: true },
      { name: "Technical Interview", completed: true },
      { name: "HR Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 3,
    company: "Instagram",
    position: "Frontend Developer",
    date: "2024-09-28",
    status: "Rejected",
    interviewer: "Michael Lee",
    nextStep: "None",
    timeLeft: "N/A",
    logo: "/assets/companyLogo/instagram.png",
    progress: 100,
    stages: [
      { name: "Application Submitted", completed: true },
      { name: "Resume Screened", completed: true },
      { name: "Technical Assessment", completed: true },
      { name: "Technical Interview", completed: true },
      { name: "HR Interview", completed: true },
      { name: "Offer", completed: false },
    ],
  },
  {
    id: 4,
    company: "Spotify",
    position: "Full Stack Developer",
    date: "2024-10-01",
    status: "Offered",
    interviewer: "Sophia Kim",
    nextStep: "Offer Negotiation",
    timeLeft: "2 days",
    logo: "/assets/companyLogo/spotify.png",
    progress: 90,
    stages: [
      { name: "Application Submitted", completed: true },
      { name: "Resume Screened", completed: true },
      { name: "Technical Assessment", completed: true },
      { name: "Technical Interview", completed: true },
      { name: "HR Interview", completed: true },
      { name: "Offer", completed: true },
    ],
  },
  {
    id: 5,
    company: "Reddit",
    position: "UI/UX Designer",
    date: "2024-09-25",
    status: "Interviewed",
    interviewer: "Emily Clark",
    nextStep: "Final Interview",
    timeLeft: "1 day",
    logo: "/assets/companyLogo/reddit.png",
    progress: 70,
    stages: [
      { name: "Application Submitted", completed: true },
      { name: "Resume Screened", completed: true },
      { name: "Portfolio Review", completed: true },
      { name: "Technical Interview", completed: true },
      { name: "Final Interview", completed: false },
      { name: "Offer", completed: false },
    ],
  },
];

export default mockApplications