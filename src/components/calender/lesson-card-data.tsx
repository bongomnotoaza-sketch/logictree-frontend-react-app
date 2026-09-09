export interface LessonCardData {
  subject: string;
  lessontime: string;
}

const lessonCards: LessonCardData[] = [
  {
    subject: "Maths",
    lessontime: "8:00am",
  },
  {
    subject: "English",
    lessontime: "9:00am",
  },
  {
    subject: "Science",
    lessontime: "10:00am",
  },
  {
    subject: "History",
    lessontime: "11:00am",
  },
  {
    subject: "Geography",
    lessontime: "12:00pm",
  },
  {
    subject: "Art",
    lessontime: "1:00pm",
  },
  {
    subject: "Physical Education",
    lessontime: "2:00pm",
  },
  {
    subject: "Music",
    lessontime: "3:00pm",
  },
];

export default lessonCards;