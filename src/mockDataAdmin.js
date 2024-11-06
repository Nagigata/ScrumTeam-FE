import { tokens } from "./theme";

export const mockPieData = [
  {
    id: "candidates",
    label: "Candidates",
    value: 12361,
    color: "hsl(104, 70%, 50%)",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    value: 6441,
    color: "hsl(162, 70%, 50%)",
  },
  {
    id: "administrators",
    label: "Administrators",
    value: 570,
    color: "hsl(291, 70%, 50%)",
  },
];

export const mockLineData = [
  {
    id: "Successful Job Placements",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "January",
        y: 101,
      },
      {
        x: "February",
        y: 175,
      },
      {
        x: "March",
        y: 186,
      },
      {
        x: "April",
        y: 216,
      },
      {
        x: "May",
        y: 235,
      },
      {
        x: "June",
        y: 256,
      },
      {
        x: "July",
        y: 288,
      },
      {
        x: "August",
        y: 332,
      },
      {
        x: "September",
        y: 381,
      },
      {
        x: "October",
        y: 301,
      },
      {
        x: "November",
        y: 335,
      },
      {
        x: "December",
        y: 314,
      },
    ],
  },
];
