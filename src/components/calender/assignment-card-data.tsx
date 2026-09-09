export interface AssignmentCardData {
  subject: string;
  taskdescription: string;
  duedate: string;
}

const assignmentCards: AssignmentCardData[] = [
  {
    subject: "Maths",
    taskdescription: "Tutorial 03",
    duedate: "2026-09-10",
  },
  {
    subject: "English",
    taskdescription: "Essay Draft 01",
    duedate: "2026-09-12",
  },
  {
    subject: "Science",
    taskdescription: "Lab Report 02",
    duedate: "2026-09-15",
  },
  {
    subject: "History",
    taskdescription: "Research Paper Outline",
    duedate: "2026-09-18",
  },
  {
    subject: "Geography",
    taskdescription: "Map Analysis Worksheet",
    duedate: "2026-09-20",
  },
  {
    subject: "Art",
    taskdescription: "Portfolio Submission 01",
    duedate: "2026-09-22",
  },
  {
    subject: "Physical Education",
    taskdescription: "Fitness Log Week 3",
    duedate: "2026-09-24",
  },
  {
    subject: "Music",
    taskdescription: "Practice Recording 02",
    duedate: "2026-09-26",
  },
];

export default assignmentCards;