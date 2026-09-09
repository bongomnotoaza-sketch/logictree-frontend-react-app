import { useState, useEffect } from "react";
import { X } from "lucide-react";

import SidebarBrand from "../sidebar/sidebar-brand";
import SidebarFooter from "../sidebar/sidebar-footer";
import EducatorSidebarNav from "./educator-nav";
import CourseSidebar, { type CourseFilter } from "./notes/course-sidebar";
import ModuleSidebar, { type ModuleFilter } from "./notes/module-sidebar";
import LessonSidebar, { type LessonFilter } from "./notes/lesson-sidebar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
  onSelect: (label: string) => void;
  onModuleViewChange?: (isModuleView: boolean) => void;
  onLessonViewChange?: (isLessonView: boolean) => void;
}

type CoursePanelView = "course" | "module" | "lesson";

export default function EducatorSidebar({
  isOpen,
  onClose,
  active,
  onSelect,
  onModuleViewChange,
  onLessonViewChange,
}: SidebarProps) {
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [lessonFilter, setLessonFilter] = useState<LessonFilter>("all");
  const [coursePanelView, setCoursePanelView] = useState<CoursePanelView>("course");
  const showCoursePanel = active === "Course";

  // Notify parent when module view changes
  useEffect(() => {
    if (onModuleViewChange) {
      onModuleViewChange(coursePanelView === "module");
    }
  }, [coursePanelView, onModuleViewChange]);

  // Notify parent when lesson view changes
  useEffect(() => {
    if (onLessonViewChange) {
      onLessonViewChange(coursePanelView === "lesson");
    }
  }, [coursePanelView, onLessonViewChange]);

  const handleSelectCourse = (key: CourseFilter) => {
    setCourseFilter(key);
    if (key !== "all") {
      setCoursePanelView("module");
    }
  };

  const handleSelectModule = (key: ModuleFilter) => {
    setModuleFilter(key);
    if (key !== "all") {
      setCoursePanelView("lesson");
    }
  };

  const handleCourseBack = () => {
    setCoursePanelView("course");
    onSelect("Home");
  };

  const handleModuleBack = () => {
    setCoursePanelView("course");
  };

  const handleLessonBack = () => {
    setCoursePanelView("module");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex h-screen w-64 shrink-0 flex-col
          border-r border-zinc-800 bg-zinc-950 transition-transform duration-300
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="relative">
          <SidebarBrand />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showCoursePanel ? (
          coursePanelView === "lesson" ? (
            <LessonSidebar
              activeFilter={lessonFilter}
              onSelectFilter={setLessonFilter}
              onBack={handleLessonBack}
            />
          ) : coursePanelView === "module" ? (
            <ModuleSidebar
              activeFilter={moduleFilter}
              onSelectFilter={handleSelectModule}
              onBack={handleModuleBack}
            />
          ) : (
            <CourseSidebar
              activeFilter={courseFilter}
              onSelectFilter={handleSelectCourse}
              onBack={handleCourseBack}
            />
          )
        ) : (
          <EducatorSidebarNav
            active={active}
            onSelect={(label) => {
              onSelect(label);
              onClose();
            }}
          />
        )}

        <SidebarFooter />
      </aside>
    </>
  );
}