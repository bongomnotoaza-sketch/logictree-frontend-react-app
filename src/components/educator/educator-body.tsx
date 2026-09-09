import CourseList from "./notes/course-list";
import ModuleList from "./notes/modulelist";

interface EducatorBodyProps {
  active: string;
  showModuleView?: boolean;
}

export default function EducatorBody({ active, showModuleView = false }: EducatorBodyProps) {
  const showCourseList = active === "Course" && !showModuleView;
  const showModuleList = active === "Course" && showModuleView;

  return (
    <>
      <div className="w-full h-full">
        {showCourseList && <CourseList />}
        {showModuleList && <ModuleList />}
      </div>
    </>
  );
}