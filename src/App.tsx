import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import EducatorSidebar from "./components/educator/educators-sidebar";
import EducatorBody from "./components/educator/educator-body";
import Header from "./components/mainarea/header";
import UpdatesList from "./components/updates/updates-list";
import CalendarView from "./components/calender/calender-view";
import Calendermobile from "./components/calender/calender-view-mobile";
import TerminalHeader from "./components/terminal/terninal-header";
import IdeBody from "./components/terminal/terminal-body";
import HomeBody from "./components/Home/Home-view";
import LandingPage from "./components/Landingpage/landing-page";
import LoginPage from "./components/Landingpage/login-page";
import FilesystBody from "./components/File/filesystbody";
import { Loader2 } from "lucide-react";
import FileHeader from "./components/File/Filesystemheader";
import { useFileTree } from "./components/File/file-tree-utils";
import { getCurrentUser, type CurrentUser } from "@/utils/current_user";
import ModuleList from "./components/educator/notes/modulelist";
import CourseList from "./components/educator/notes/course-list";
import LessonBuilder from "./components/educator/notes/lesson_builder";

type AuthState = "checking" | "authenticated" | "unauthenticated";

interface SelectedFile {
  id: string;
  name: string;
  value: string;
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showModuleView, setShowModuleView] = useState(false);
  const [showLessonView, setShowLessonView] = useState(false); // Add this

  // --- File explorer state: shared tree + path/back-forward history ---
  const { tree, loading: filesLoading, error: filesError, refetch: refreshFiles } = useFileTree();
  const [filesHistory, setFilesHistory] = useState<string[]>([""]);
  const [filesHistoryIndex, setFilesHistoryIndex] = useState(0);

  // --- Active file state for IDE ---
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const filesCurrentPath = filesHistory[filesHistoryIndex];
  const filesCanGoBack = filesHistoryIndex > 0;
  const filesCanGoForward = filesHistoryIndex < filesHistory.length - 1;

  const navigateFiles = useCallback(
    (path: string) => {
      setFilesHistory((prev) => {
        const truncated = prev.slice(0, filesHistoryIndex + 1);
        if (truncated[truncated.length - 1] === path) return prev;
        return [...truncated, path];
      });
      setFilesHistoryIndex((prev) => prev + 1);
    },
    [filesHistoryIndex]
  );

  const goFilesBack = useCallback(() => {
    setFilesHistoryIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goFilesForward = useCallback(() => {
    setFilesHistoryIndex((prev) => Math.min(filesHistory.length - 1, prev + 1));
  }, [filesHistory.length]);

  const isIDE = active === "IDE";
  const isAdmin = currentUser?.role === "admin";

  // Reset course views when switching away from Course tab
  useEffect(() => {
    if (active !== "Course") {
      setShowModuleView(false);
      setShowLessonView(false);
    }
  }, [active]);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const user = await getCurrentUser();
        if (!cancelled) {
          if (user) {
            setCurrentUser(user);
            setAuthState("authenticated");
          } else {
            setAuthState("unauthenticated");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        if (!cancelled) setAuthState("unauthenticated");
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  if (authState === "checking") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070a09] text-[#8a9c94]">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  if (authState !== "authenticated") {
    if (!hasEnteredApp) {
      return <LandingPage onStartBuilding={() => setHasEnteredApp(true)} />;
    }
    return <LoginPage onLoginSuccess={() => setAuthState("authenticated")} />;
  }

  // --- Admin users get the educator layout entirely ---
  if (isAdmin) {
    return (
      <div className="flex h-screen w-full bg-zinc-950 text-white">
        <EducatorSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          active={active}
          onSelect={setActive}
          onModuleViewChange={setShowModuleView}
        />

        <main className="flex h-screen w-full flex-1 flex-col md:w-auto">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <div className="flex-1 min-h-0 overflow-hidden">
            <EducatorBody active={active} showModuleView={showModuleView} />
          </div>
        </main>
      </div>
    );
  }

  // Determine what to show in the main content area
  const showCourseList = active === "Course" && !showModuleView && !showLessonView;
  const showModuleList = active === "Course" && showModuleView && !showLessonView;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        active={active}
        onSelect={setActive}
        filesTree={tree}
        onNavigateFiles={navigateFiles}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        onModuleViewChange={setShowModuleView}
        onLessonViewChange={setShowLessonView}
      />

      <main className="flex h-screen w-full flex-1 flex-col md:w-auto">
        {isIDE ? (
          <TerminalHeader
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            tree={tree}
            currentPath={filesCurrentPath}
            onRefresh={refreshFiles}
          />
        ) : active === "Files" ? (
          <FileHeader
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            currentPath={filesCurrentPath}
            canGoBack={filesCanGoBack}
            canGoForward={filesCanGoForward}
            onHome={() => setActive("Home")}
            onBack={goFilesBack}
            onForward={goFilesForward}
          />
        ) : (
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          {active === "Home" ? (
            <HomeBody />
          ) : active === "Updates" ? (
            <UpdatesList />
          ) : active === "Calendar" ? (
            <>
              <div className="block h-full md:hidden">
                <Calendermobile />
              </div>
              <div className="hidden h-full md:block">
                <CalendarView />
              </div>
            </>
          ) : active === "IDE" ? (
            <IdeBody selectedFile={selectedFile} />
          ) : active === "Files" ? (
            <FilesystBody
              tree={tree}
              loading={filesLoading}
              error={filesError}
              currentPath={filesCurrentPath}
              onNavigate={navigateFiles}
              onRefresh={refreshFiles}
            />
          ) : active === "Course" ? (
            // Course view with conditional rendering
            <>
              {showCourseList && <CourseList />}
              {showModuleList && <ModuleList />}
              {showLessonView && <LessonBuilder />}
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-white">{active}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                This is the {active.toLowerCase()} view. Content goes here.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}