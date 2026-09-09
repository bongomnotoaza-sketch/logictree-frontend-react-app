"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  PlayCircle,
  Flame,
  Clock3,
  BookOpen,
  Video,
} from "lucide-react"

import { getCurrentUser } from "@/utils/current_user"
import type { CurrentUser } from "@/utils/current_user"

const student = {
  name: "Maya",
  streakDays: 12,
  hoursThisWeek: 6.5,
  coursesInProgress: 4,
}

const continueCourse = {
  title: "Organic Chemistry II",
  lesson: "Lesson 14 · Reaction Mechanisms in Aldehydes",
  progress: 62,
  instructor: "Dr. Okafor",
}

const courses = [
  {
    title: "Organic Chemistry II",
    subject: "Chemistry",
    progress: 62,
    nextLesson: "Reaction Mechanisms in Aldehydes",
  },
  {
    title: "Linear Algebra",
    subject: "Mathematics",
    progress: 38,
    nextLesson: "Eigenvalues and Eigenvectors",
  },
  {
    title: "Modern World History",
    subject: "History",
    progress: 81,
    nextLesson: "The Cold War, Part Two",
  },
  {
    title: "Intro to Python",
    subject: "Computer Science",
    progress: 15,
    nextLesson: "Loops and Iteration",
  },
]

const deadlines = [
  { title: "Problem Set 6", course: "Linear Algebra", due: "Tomorrow, 11:59 PM" },
  { title: "Lab Report: Aldol Reactions", course: "Organic Chemistry II", due: "Fri, Sep 6" },
  { title: "Essay: Cuban Missile Crisis", course: "Modern World History", due: "Mon, Sep 9" },
]

const todaySchedule = [
  { time: "2:00 PM", title: "Office Hours", course: "Linear Algebra" },
  { time: "4:30 PM", title: "Live Review Session", course: "Organic Chemistry II" },
]

export default function HomeBody() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return (
    <>
      <div className="h-full w-full overflow-y-auto bg-black text-white">
        <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Good afternoon, {user?.first_name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Wednesday, September 4 · {student.streakDays}-day streak
            </p>
          </div>

          {/* Continue learning hero — the one bold panel */}
          <div className="relative overflow-hidden border border-zinc-800 bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-transparent to-black/40" />
            <div className="relative flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-emerald-500">Continue where you left off</span>
                <h2 className="text-xl md:text-2xl font-semibold">{continueCourse.title}</h2>
                <p className="text-sm text-zinc-400">{continueCourse.lesson}</p>
                <p className="text-xs text-zinc-600">Taught by {continueCourse.instructor}</p>
                <div className="mt-2 flex max-w-xs items-center gap-3">
                  <Progress
                    value={continueCourse.progress}
                    className="h-1 rounded-none bg-zinc-800 [&>*]:rounded-none [&>*]:bg-emerald-600"
                  />
                  <span className="whitespace-nowrap text-xs text-zinc-500">
                    {continueCourse.progress}%
                  </span>
                </div>
              </div>
              <Button className="w-full rounded-none bg-emerald-700 text-white hover:bg-emerald-600 md:w-auto">
                <PlayCircle className="mr-2 h-4 w-4" />
                Resume lesson
              </Button>
            </div>
          </div>

          {/* Quick stats — inline row, no boxes */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-zinc-800 border border-zinc-800">
            <div className="flex flex-col items-center gap-1 px-2 py-4 md:flex-row md:justify-center md:gap-3">
              <Flame className="h-4 w-4 text-emerald-500" />
              <div className="text-center md:text-left">
                <p className="text-sm md:text-base">{student.streakDays} days</p>
                <p className="text-[11px] text-zinc-500">Streak</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-4 md:flex-row md:justify-center md:gap-3">
              <Clock3 className="h-4 w-4 text-emerald-500" />
              <div className="text-center md:text-left">
                <p className="text-sm md:text-base">{student.hoursThisWeek}h</p>
                <p className="text-[11px] text-zinc-500">This week</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 px-2 py-4 md:flex-row md:justify-center md:gap-3">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <div className="text-center md:text-left">
                <p className="text-sm md:text-base">{student.coursesInProgress}</p>
                <p className="text-[11px] text-zinc-500">In progress</p>
              </div>
            </div>
          </div>

          {/* Your courses — list rows, not a card grid */}
          <div className="mt-8">
            <h3 className="mb-1 text-sm font-medium text-zinc-300">Your courses</h3>
            <div className="border-t border-zinc-800">
              {courses.map((course) => (
                <div
                  key={course.title}
                  className="flex flex-col gap-2 border-b border-zinc-800 py-4 md:flex-row md:items-center md:justify-between md:gap-6"
                >
                  <div className="flex flex-col gap-0.5 md:w-1/3">
                    <p className="text-sm">{course.title}</p>
                    <p className="text-xs text-zinc-500">{course.subject}</p>
                  </div>
                  <p className="text-xs text-zinc-500 md:w-1/3">
                    Next: {course.nextLesson}
                  </p>
                  <div className="flex items-center gap-3 md:w-1/4">
                    <Progress
                      value={course.progress}
                      className="h-1 rounded-none bg-zinc-800 [&>*]:rounded-none [&>*]:bg-emerald-600"
                    />
                    <span className="whitespace-nowrap text-xs text-zinc-500">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines and schedule — side by side on desktop, stacked on mobile */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-zinc-300">Upcoming deadlines</h3>
              <div className="border-t border-zinc-800">
                {deadlines.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start justify-between gap-3 border-b border-zinc-800 py-3"
                  >
                    <div>
                      <p className="text-sm">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.course}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-emerald-500">
                      {item.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-zinc-300">Today's schedule</h3>
              <div className="border-t border-zinc-800">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((event) => (
                    <div
                      key={event.title}
                      className="flex items-start gap-3 border-b border-zinc-800 py-3"
                    >
                      <Video className="mt-0.5 h-4 w-4 text-zinc-600" />
                      <div>
                        <p className="text-sm">{event.title}</p>
                        <p className="text-xs text-zinc-500">
                          {event.course} · {event.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="border-b border-zinc-800 py-3 text-sm text-zinc-500">
                    Nothing scheduled today. Good time to get ahead on a lesson.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}