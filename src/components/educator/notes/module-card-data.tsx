type ModuleCardProps = {
  imageUrl: string;
  borderColor: string;
  moduleName: string;
};

// Default module data - 8 sample modules
export const defaultModules: ModuleCardProps[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    borderColor: "#FF6B6B",
    moduleName: "Introduction to Web Development"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    borderColor: "#4ECDC4",
    moduleName: "Data Science Fundamentals"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
    borderColor: "#FFD93D",
    moduleName: "UI/UX Design Principles"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    borderColor: "#6C5CE7",
    moduleName: "Python Programming Basics"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    borderColor: "#FD79A8",
    moduleName: "Machine Learning Introduction"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    borderColor: "#00B894",
    moduleName: "Cloud Computing Essentials"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    borderColor: "#E17055",
    moduleName: "Business Analytics Basics"
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop",
    borderColor: "#74B9FF",
    moduleName: "Mobile App Development Fundamentals"
  }
];