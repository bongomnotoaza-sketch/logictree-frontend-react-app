import { useState } from "react"
import Slideshow from "./slideshow"
import LessonList from "./lesson-list"
import EventsList from "./events-list"
import AssignmentList from "./assignmentlist"

export default function CalenderNavMobile() {
    const [active, setActive] = useState("home")

    if (active !== "home") {
        return (
            <div className="relative h-full w-full">
                <button onClick={() => setActive("home")} className="absolute left-3 top-3 z-20 text-2xl text-white">
                    ←
                </button>

                {active === "events" && <EventsList />}
                {active === "lessons" && <LessonList />}
                {active === "assignments" && <AssignmentList />}
            </div>
        )
    }

    return (
        <div className="grid h-full w-full grid-rows-2 overflow-hidden">
            <div className="flex items-center justify-center">
                <div onClick={() => setActive("events")} className="flex h-[80%] w-[90%] cursor-pointer items-center justify-center rounded-md bg-white/70">
                    <p>Events</p>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <div className="flex items-center justify-center">
                    <Slideshow />
                </div>

                <div className="grid grid-rows-2">
                    <div className="flex items-center justify-center">
                        <div onClick={() => setActive("lessons")} className="flex h-[80%] w-[80%] cursor-pointer items-center justify-center rounded-md bg-[#14532d]">
                            <p>Lessons</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div onClick={() => setActive("assignments")} className="flex h-[80%] w-[80%] cursor-pointer items-center justify-center rounded-md bg-[#2d2d2d]">
                            <p>Assignments</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}