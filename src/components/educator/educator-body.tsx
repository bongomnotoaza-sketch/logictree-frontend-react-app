// EducatorBody.tsx
import { useState } from "react";
import CourseList from "./notes/course-list";
import ModuleList from "./notes/modulelist";
import LessonContentCreator from "./notes/lessoncontentcreator";
import { saveLessonContent } from "@/utils/lesson-body";
import type { LessonElement } from "./notes/lessoncontentcreator";

interface EducatorBodyProps {
    active: string;
    showModuleView?: boolean;
    showLessonView?: boolean;
    lessonName?: string;
    /** Optional: pass a real lesson id from parent. Falls back to 1 for now. */
    lessonId?: number;
}

export default function EducatorBody({
    active,
    showModuleView = false,
    showLessonView = false,
    lessonName,
    lessonId = 1, // hard-coded default
}: EducatorBodyProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showCourseList =
        active === "Course" && !showModuleView && !showLessonView;
    const showModuleList =
        active === "Course" && showModuleView && !showLessonView;
    const showLessonCreator = active === "Course" && showLessonView;

    const handleSave = async (content: LessonElement[]) => {
        setSaving(true);
        setError(null);
        try {
            const created = await saveLessonContent(content, lessonId);
            console.log("Created bodies:", created);
            alert(`Saved ${created.length} element(s) ✅`);
        } catch (e: any) {
            setError(e.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Status banners */}
            {error && (
                <div className="bg-red-900/50 text-red-200 px-4 py-2 text-sm">
                    {error}
                </div>
            )}
            {saving && (
                <div className="bg-green-900/50 text-green-200 px-4 py-2 text-sm">
                    Saving…
                </div>
            )}

            {/* Body */}
            <div className="flex-1 min-h-0">
                {showCourseList && <CourseList />}
                {showModuleList && <ModuleList />}
                {showLessonCreator && (
                    <LessonContentCreator
                        lessonName={lessonName}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
}