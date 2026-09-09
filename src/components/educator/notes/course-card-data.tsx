type CourseCardProps = {
  imageUrl: string;
  borderColor: string;
  courseName: string;
  educatorName: string;
};

// Default course data - 8 sample courses
export const defaultCourses: CourseCardProps[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    borderColor: "#FF6B6B",
    courseName: "Web Development Bootcamp",
    educatorName: "Dr. Sarah Johnson"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    borderColor: "#4ECDC4",
    courseName: "Data Science Mastery",
    educatorName: "Prof. Michael Chen"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
    borderColor: "#FFD93D",
    courseName: "UI/UX Design Fundamentals",
    educatorName: "Emily Rodriguez"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    borderColor: "#6C5CE7",
    courseName: "Python Programming Pro",
    educatorName: "James Anderson"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    borderColor: "#FD79A8",
    courseName: "Machine Learning A-Z",
    educatorName: "Dr. Lisa Park"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    borderColor: "#00B894",
    courseName: "Cloud Architecture",
    educatorName: "Robert Kim"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    borderColor: "#E17055",
    courseName: "Business Analytics",
    educatorName: "Prof. Maria Garcia"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop",
    borderColor: "#74B9FF",
    courseName: "Mobile App Development",
    educatorName: "Alex Turner"
  }
];

