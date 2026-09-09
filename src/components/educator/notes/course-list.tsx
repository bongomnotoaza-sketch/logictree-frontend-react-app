import CourseCard from './course-cards';
import { defaultCourses } from './course-card-data';

function CourseList() {
  return (
    <div className="w-full h-full flex flex-wrap justify-center content-center md:justify-start md:content-start gap-6 p-6 overflow-scroll">
      {defaultCourses.map((course, index) => (
        <CourseCard
          key={index}
          imageUrl={course.imageUrl}
          borderColor={course.borderColor}
          courseName={course.courseName}
          educatorName={course.educatorName}
        />
      ))}
    </div>
  );
}

export default CourseList;