# LogicTree Academy — Frontend

**Coding · Maths · Physics**

The LogicTree Academy frontend is a React and TypeScript web application exploring an interactive learning and development environment that brings together educational content, coding tools, file management, and learning workflows.

The interface is designed around the broader LogicTree direction: connecting coding, mathematics, and physics with practical tools and interactive software experiences.

This repository contains the frontend application, including its landing page, authenticated application interfaces, educator-oriented content tools, calendar views, file explorer, and browser-based coding environment.

The project is an evolving engineering codebase. Its components and integrations continue to develop, and the presence of a particular interface does not necessarily mean that every related workflow is complete or production-ready.

**GitHub repository:** https://github.com/bongomnotoaza-sketch/logictree-frontend-react-app

---

## 1. Project Overview

The frontend provides the user-facing layer for the LogicTree Academy environment. It brings together several interface areas that support learning, content organisation, and software development.

### Project Objectives

- **Connect learning and coding:** Bring educational content and development tools into a shared interface.
- **Support structured learning:** Provide interfaces for courses, modules, lessons, and educational activities.
- **Explore browser-based development:** Integrate code editing, terminal interfaces, and file-management functionality.
- **Organise learning activity:** Present calendar views and update-related information.
- **Create a cohesive environment:** Use a shared application layout to bring different tools and workflows together.
- **Support continued experimentation:** Provide a frontend foundation that can evolve alongside the backend and supporting services.

## 2. Application Experience

The application includes a public-facing landing page and an authenticated application interface.

### Landing Page

The landing page introduces the LogicTree Academy direction and its focus on coding, mathematics, and physics.

Its interface includes:

- LogicTree branding and navigation.
- An overview of the learning and development concept.
- Illustrative code and output.
- Links to sections describing the project and its founder.
- Entry points for login and signup-related flows.
- Responsive navigation for smaller screens.

### Authentication and Session State

The application checks the current user's session through a backend endpoint and selects the appropriate interface based on the authentication state.

The frontend includes:

- An initial session-checking state.
- A landing experience for unauthenticated visitors.
- A login interface.
- User information used by the application layout.
- Role-based rendering for the educator interface.

Authentication is integrated with backend routes; the frontend itself should not be treated as the sole security boundary.

### Main Application Layout

The authenticated interface uses a sidebar and main content area to organise the application's different sections.

The primary navigation includes areas such as:

- Home.
- Updates.
- Calendar.
- IDE.
- Files.
- Course-related views.

The layout also includes separate educator-oriented navigation and content interfaces for users identified by the application as administrators.

## 3. Core Interface Features

The following sections describe functionality represented in the available source code. The completeness of individual workflows depends on their supporting backend services and integrations.

### Home Dashboard

The Home area provides a central view within the authenticated application.

It acts as one of the primary destinations in the application layout and provides a foundation for presenting relevant learning and development content.

### Calendar

The calendar area contains desktop and mobile-oriented views.

Its components include:

- Calendar navigation.
- Calendar content sections.
- Lesson-related cards and lists.
- Assignment-related cards and lists.
- Event-related cards and lists.
- A mobile-specific calendar layout.

The separate mobile and desktop components allow the interface to adapt to different screen sizes.

### Updates

The Updates area presents update cards containing information such as headings, subjects, initials, and dates.

It provides a dedicated interface for displaying update-related content within the application.

### File Explorer

The file explorer provides a visual interface for navigating a file-and-folder tree.

The source includes functionality for:

- Displaying files and folders.
- Navigating directories.
- Maintaining back-and-forward navigation history.
- Creating files and folders.
- Renaming files and folders.
- Copying files and folders.
- Moving files and folders.
- Deleting files and folders.
- Drag-and-drop movement within the interface.
- Context-menu interactions.
- Refreshing the displayed file tree.

These operations rely on supporting utilities and backend services. Their availability and behaviour depend on the configured integration.

### Browser-Based IDE

The IDE area explores a development environment within the web application.

Its interface includes components for:

- Code editing through Monaco Editor.
- Terminal display through xterm.js.
- Terminal and workspace navigation.
- File selection and editor state.
- Preview-window functionality.
- Terminal-related controls and layout.

The terminal component uses WebSocket communication to connect to a terminal service. The browser interface therefore depends on the availability and configuration of the supporting service.

The IDE is part of the project's broader exploration of interactive development tools in an educational environment.

### Courses, Modules, and Lessons

The course-related interfaces support educator-oriented content organisation and lesson creation.

The source includes components for:

- Course lists and course cards.
- Module lists and module cards.
- Course, module, and lesson navigation.
- Lesson-building interfaces.
- Lesson content components for headings, subheadings, text, images, videos, and code.
- Saving lesson content through a backend utility.

These interfaces provide a foundation for building and organising structured educational material.

### Educator Interface

The educator area uses a separate sidebar and body layout for educator-oriented workflows.

The application selects this layout when the current user has the administrator role. It includes course-related navigation and interfaces for working with modules and lessons.

The role-based interface selection is a frontend presentation decision and does not replace server-side authorization.

## 4. Technology Stack

The frontend uses a modern React and TypeScript toolchain.

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript 6 | Static typing and maintainability |
| Vite 8 | Frontend development tooling and builds |
| Tailwind CSS 4 | Utility-based styling |
| `@tailwindcss/vite` | Tailwind integration with Vite |
| Monaco Editor | Code-editing interface |
| xterm.js | Terminal interface in the browser |
| `@xterm/addon-fit` | Terminal sizing support |
| Lucide React | Interface icons |
| React Icons | Additional icon components |
| Radix UI | Accessible interface primitives |
| Base UI | Interface components and primitives |
| React Day Picker | Calendar-related UI functionality |
| date-fns | Date utilities |
| Class Variance Authority | Component variant styling |
| clsx and tailwind-merge | Conditional and merged CSS classes |
| ESLint | Linting and code-quality checks |

The project also includes React-oriented tooling and TypeScript configuration for its component-based architecture.

## 5. System Architecture

The frontend is built around reusable React components and supporting utility modules.

The main application component coordinates authentication state, navigation, the selected application area, file navigation history, and role-based layout selection. Individual components implement specific areas of the interface.

### Frontend Responsibilities

- Present the landing and login experiences.
- Check the current user session through the backend.
- Render the main or educator-oriented application layout.
- Coordinate navigation between application areas.
- Manage relevant interface state.
- Present files, calendar content, lessons, and development tools.
- Call supporting utilities for backend operations.

### Backend Integration

The frontend communicates with supporting backend services for authentication, file-system operations, learning content, and terminal functionality.

The Vite development configuration defines proxy routes for selected paths, including `/auth`, `/filesystem`, and `/notes`, targeting a local service on port `4002`.

The terminal component also contains WebSocket connection logic targeting a terminal service on port `4000`.

These addresses describe the current development configuration visible in the source code. They are not production service URLs, and deployed environments require appropriate service configuration.

### High-Level Architecture

```text
                    LOGICTREE ACADEMY
                            |
                            v
                  React + TypeScript UI
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
      Learning          Developer        Application
      Interfaces          Tools            Navigation
          |                 |                 |
          v                 v                 v
     Courses and        Monaco Editor     Home, Updates,
     Lesson Builder     and xterm.js      Calendar, Files
          |                 |                 |
          +-----------------+-----------------+
                            |
                            v
                 Backend and Supporting
                       Services
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
    Authentication     File-System       Learning Content
       Endpoints        Endpoints           Endpoints
                            |
                            v
                    Terminal WebSocket
                         Service
```

This is a conceptual overview of the frontend's main responsibilities and visible integrations. It does not imply that all services are deployed together or that every workflow is fully integrated.

## 6. Project Structure

The repository organises application interfaces into feature-oriented component directories, with utilities and shared types maintained separately.

```text
logictree-frontend-react-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── File/
│   │   ├── Home/
│   │   ├── Landingpage/
│   │   ├── calender/
│   │   ├── courses/
│   │   ├── educator/
│   │   │   └── notes/
│   │   ├── mainarea/
│   │   ├── sidebar/
│   │   ├── terminal/
│   │   ├── ui/
│   │   └── updates/
│   ├── lib/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── header.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── components.json
├── eslint.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── tsconfig.json
└── vite.config.ts
```

### Key Areas

| Path | Responsibility |
|---|---|
| `src/components/Landingpage/` | Landing and login interfaces |
| `src/components/Home/` | Home dashboard interface |
| `src/components/sidebar/` | Main application navigation |
| `src/components/mainarea/` | Shared main-area components |
| `src/components/calender/` | Calendar, event, lesson, and assignment interfaces |
| `src/components/updates/` | Update cards and update listing |
| `src/components/File/` | File explorer interface |
| `src/components/terminal/` | IDE, code editor, terminal, and workspace interfaces |
| `src/components/educator/` | Educator layout and related interfaces |
| `src/components/educator/notes/` | Course, module, lesson, and lesson-content components |
| `src/components/courses/` | Course, module, and lesson navigation components |
| `src/components/ui/` | Shared UI components |
| `src/utils/` | Session, file-operation, and learning-content utilities |
| `src/lib/` | Shared helper functionality |
| `src/types/` | Shared TypeScript declarations |
| `vite.config.ts` | Vite plugins, path aliases, and development proxy configuration |

## 7. Interface and Design Approach

### Feature-Based Components

The interface is divided into feature-oriented components so that areas such as the calendar, file explorer, IDE, and educator tools can be developed independently.

### Shared Application Layout

The sidebar and main content layout provide a consistent structure across the main application areas.

### Responsive Interfaces

The calendar includes distinct mobile and desktop presentations, while the landing page includes responsive navigation.

### Interactive Development Experience

Monaco Editor and xterm.js bring code editing and terminal presentation into the browser interface, supporting experimentation with integrated development tools.

### Dark Visual Theme

The application uses a dark interface with restrained green accents, reflecting the LogicTree Academy visual direction.

## 8. Security and Integration Considerations

The frontend depends on backend services for authenticated operations and data access. Important considerations include:

- Enforcing authentication and authorization on the server, not only in the interface.
- Validating file and folder operations on the backend.
- Restricting terminal access and command execution to authorised users.
- Protecting WebSocket connections and configuring them securely for deployed environments.
- Handling session failures and backend errors consistently.
- Avoiding the exposure of credentials or privileged configuration in client-side code.
- Configuring service endpoints appropriately for each environment.

A frontend role check controls which interface is displayed; it is not a substitute for backend access controls.

## 9. Current Development Status

The repository contains an evolving frontend implementation for LogicTree Academy.

The available source includes a landing page, login interface, authenticated application shell, sidebar navigation, calendar components, updates, file explorer, IDE-related components, and educator-oriented course and lesson interfaces.

Some views and integrations depend on supporting backend services, and the presence of an interface does not guarantee that the corresponding end-to-end workflow has been completed or tested in production.

The architecture and feature set may continue to change as the project develops.

## 10. Project Direction

The frontend is intended to support the broader LogicTree Academy exploration of interactive learning and software development.

Potential areas of continued development include:

- Refining the connection between learning content and development tools.
- Improving course, module, and lesson workflows.
- Strengthening file explorer and editor integration.
- Improving responsive behaviour and navigation.
- Refining authentication and session-handling experiences.
- Improving error handling and backend integration.
- Further developing the browser-based IDE and supporting terminal experience.

These are areas for continued exploration rather than guarantees of planned or completed features.

## 11. Project Ownership

LogicTree Academy is an independently developed project created by **Alikho Mnotoza**.

The repository is public for project visibility and technical review. Public availability should not be interpreted as permission to reproduce, redistribute, modify, or commercially exploit the source code.

Any applicable licence or separate written permission takes precedence over this statement.

## 12. Conclusion

The LogicTree Academy frontend explores how a single web interface can bring together educational workflows and interactive development tools.

Through React, TypeScript, reusable components, a file explorer, code-editing and terminal interfaces, calendar views, and educator-oriented content tools, the project establishes a frontend foundation for continued experimentation.

**LogicTree Academy — Coding · Maths · Physics.**
