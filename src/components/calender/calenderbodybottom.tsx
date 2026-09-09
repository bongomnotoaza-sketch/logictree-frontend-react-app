import Slideshow from "./slideshow";
import LessonList from "./lesson-list";
import AssignmentList from "./assignmentlist";

export default function CalenderBodyBottom() {
    return (
        <>
            <div className="grid h-full w-full grid-cols-3 overflow-hidden">
                <Slideshow />
                <LessonList />
                <AssignmentList />
            </div>
        </>
    )
}