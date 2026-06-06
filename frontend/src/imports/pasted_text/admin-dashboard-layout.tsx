# Aarambh Institute — Dashboard Implementation Prompt
## AI Agent Handover: Admin + Teacher + Student Portals

---

## 🧠 CONTEXT FOR AI AGENT

You are building 3 role-based dashboard portals for **Aarambh Institute** — a JEE/NEET coaching platform in Bhopal.

### Existing Codebase (DO NOT BREAK)
- **Framework:** React 18 + Vite + TypeScript
- **Router:** `react-router` (v7 style with `createBrowserRouter`)
- **Styling:** Tailwind CSS v4 + custom theme in `src/styles/theme.css`
- **Animations:** `motion/react` (Motion v12) — already installed
- **Icons:** `lucide-react` — already installed
- **Components:** 46 shadcn/ui components in `src/app/components/ui/`
- **Package manager:** pnpm

### Existing Color Theme (MUST MATCH)
```
Background dark:    #05101F → #0A1A35 → #0D0A1E (gradient)
Primary accent:     #FF5C00 (orange)
Secondary accent:   #FF9A3C → #FFD166 (amber gradient)
Glassmorphism card: backdrop-blur-xl, border border-white/15, bg-white/[0.03..0.08]
Text primary:       #FFFFFF
Text secondary:     rgba(255,255,255,0.6) → rgba(255,255,255,0.4)
Success:            #2F9E44 (green)
Info:               #3B5BDB (blue)
Danger:             #D4183D
```

### Existing Typography
```css
@import 'Inter' (300–900) + 'Poppins' (400–900) from Google Fonts
Body: Inter
Display/Heading: Poppins font-black (weight 900)
```

### Existing Animation Patterns
```tsx
// Page enter:
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}

// Hover button:
whileHover={{ scale: 1.04, boxShadow: "0 0 0 4px rgba(255,92,0,0.2)" }}
whileTap={{ scale: 0.97 }}

// Stagger children:
variants={{ container: { staggerChildren: 0.08 }, item: { initial: { opacity:0, y:20 }, animate: { opacity:1, y:0 } } }}

// Float loop:
animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
```

---

## 📁 FILES TO CREATE

### New Routes to add in `src/app/routes.ts`
```tsx
{ path: "admin",   Component: AdminLayout,   children: [
  { index: true,                Component: AdminDashboard },
  { path: "students",           Component: AdminStudents },
  { path: "teachers",           Component: AdminTeachers },
  { path: "content",            Component: AdminContent },
  { path: "queries",            Component: AdminQueries },
  { path: "analytics",          Component: AdminAnalytics },
]},
{ path: "teacher", Component: TeacherLayout, children: [
  { index: true,                Component: TeacherDashboard },
  { path: "notes",              Component: TeacherNotes },
  { path: "announcements",      Component: TeacherAnnouncements },
  { path: "students",           Component: TeacherStudents },
  { path: "chat",               Component: TeacherChat },
]},
{ path: "student", Component: StudentLayout,  children: [
  { index: true,                Component: StudentDashboard },
  { path: "notes",              Component: StudentNotes },
  { path: "subjects",           Component: StudentSubjects },
  { path: "chat",               Component: StudentChat },
  { path: "performance",        Component: StudentPerformance },
]},
```

---

## 🔴 PORTAL 1 — ADMIN DASHBOARD

### Layout: `src/app/pages/admin/AdminLayout.tsx`

```
SIDEBAR (fixed left, 260px wide, full height):
- Background: #05101F with right border border-white/10
- Logo block at top: GraduationCap icon + "Aarambh" + "Admin Panel" tag in orange pill
- Navigation sections:
  OVERVIEW:    Dashboard (LayoutDashboard icon)
  MANAGEMENT:  Students (Users), Teachers (GraduationCap), Content (FileText)
  ENGAGEMENT:  Queries (MessageSquare), Analytics (BarChart3)
- Active link style: bg-orange-500/15 border-l-2 border-orange-500 text-orange-400
- Inactive link style: text-white/50 hover:text-white hover:bg-white/5
- Bottom: Admin profile avatar + name + "Super Admin" badge + logout button

TOPBAR (fixed top, height 64px):
- Background: #05101F/90 backdrop-blur
- Left: Page title (dynamic, from current route)
- Right: Search input (glassmorphism style) + Bell icon with red notification dot + Admin avatar

MAIN CONTENT AREA:
- margin-left: 260px, padding: 32px
- Background: linear-gradient(135deg, #05101F 0%, #0A1A35 100%)
- min-height: 100vh
```

### Page: `src/app/pages/admin/AdminDashboard.tsx`

```
STAT CARDS ROW (4 cards, grid-cols-4, gap-4):
Each card:
  - glassmorphism: bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6
  - Icon circle: w-12 h-12 rounded-xl, gradient background matching card color
  - Big number: text-3xl font-black text-white (animate count-up on mount using useMotionValue)
  - Label: text-sm text-white/50
  - Change badge: "+12% this month" in green/red pill

Cards:
  1. Total Students — 1,248 — blue (#3B5BDB) icon — Users icon
  2. Active Teachers — 24 — green (#2F9E44) icon — GraduationCap icon
  3. Total Revenue — ₹12.4L — orange (#FF5C00) icon — IndianRupee icon
  4. Pending Queries — 8 — red (#D4183D) icon — MessageCircle icon

CHARTS ROW (grid-cols-3, gap-4):
  LEFT CHART (col-span-2): "Enrollment Trend" — line chart showing monthly enrollments
    - Use recharts LineChart with custom dark theme
    - Gradient fill under the line (orange to transparent)
    - Data: Jan–Jun with values [180, 220, 195, 310, 280, 340]

  RIGHT CHART (col-span-1): "Batch Distribution" — donut chart
    - Segments: JEE Main (40%), JEE Advanced (25%), NEET (35%)
    - Colors: #FF5C00, #3B5BDB, #2F9E44
    - Center text: "Total Batches: 12"

RECENT ACTIVITY TABLE (full width):
  - Header: "Recent Enrollments" + "View All" button
  - Columns: Student Name | Batch | Fee Status | Enrolled Date | Action
  - Rows: 5 sample students with realistic Indian names
  - Fee Status: colored badges (Paid=green, Pending=amber, Overdue=red)
  - Row hover: bg-white/[0.03]
  - Action: "View Profile" link in orange
```

### Page: `src/app/pages/admin/AdminStudents.tsx`

```
HEADER ROW:
  - H1: "Student Management"
  - Right: "Bulk Upload" button (Upload icon, outlined) + "Add Student" button (orange gradient)

FILTERS ROW:
  - Search input: "Search by name, phone, email..."
  - Batch filter dropdown: All Batches | JEE-2026-A | JEE-2026-B | NEET-2026 | ...
  - Class filter: All | Class 10 | Class 11 | Class 12
  - Status filter: All | Active | Inactive | Fee Pending

BULK UPLOAD SECTION (collapsible, hidden by default):
  - Toggle button shows/hides this section
  - Drop zone: dashed border border-white/20, "Drag & drop CSV file here or click to browse"
  - Download template link: "Download Sample CSV Template"
  - File requirements text: "CSV must have columns: Name, Email, Phone, Batch, Class, FeeStatus"
  - Upload button: "Upload & Create Accounts" in orange

STUDENTS TABLE:
  Columns: Checkbox | Avatar+Name | Email | Phone | Batch | Class | Fee Status | Joined | Actions
  Features:
    - Checkbox on each row for bulk select
    - "Select All" checkbox in header
    - Bulk action bar appears when rows selected: "Send SMS | Change Batch | Delete Selected"
    - Sortable columns (click header to sort)
    - Pagination: 20 per page, prev/next buttons

STUDENT DETAIL MODAL (Dialog from shadcn):
  - Opens on clicking student name
  - Tabs: Profile | Performance | Fee History | Notes Access
  - Profile tab: Avatar, name, contact, batch, class, enrollment date, parent info
  - Performance tab: Subject-wise bar chart, attendance percentage, test scores
  - Fee History tab: Table of payments with dates and amounts
  - Notes Access tab: List of notes/batches they have access to
```

### Page: `src/app/pages/admin/AdminTeachers.tsx`

```
HEADER: "Teacher Management" + "Add Teacher" button (orange)

TEACHER CARDS GRID (grid-cols-3, gap-6):
Each teacher card:
  - glassmorphism card with orange top border accent
  - Avatar circle: initials with gradient bg
  - Name: Poppins font-bold text-white
  - Subject badge: e.g., "Physics" in blue pill
  - Stats row: "12 Notes Uploaded | 3 Batches | 89% Student Rating"
  - Last active: "Active 2 hours ago" with green dot
  - Action buttons: "View Analytics" | "Edit Profile"

TEACHER ANALYTICS SECTION (below cards):
  - Dropdown to select teacher
  - Content Upload Chart: Bar chart — "Notes uploaded per month" for selected teacher
  - Engagement Stats: "Total downloads | Avg student rating | Active batches"
  - Content breakdown table: List of all content uploaded with date, batch, subject, download count
  - Color code activity: Green=active this week, Amber=last week, Red=no upload in 30 days
```

### Page: `src/app/pages/admin/AdminContent.tsx`

```
LANDING PAGE CONTENT MANAGER:
  - Tab layout: Hero | About | Courses | Faculty | Testimonials | Results | Contact

  Each tab has WYSIWYG-style form fields to update landing page content:

  HERO TAB:
    - Institute name (text input)
    - Tagline (text input)
    - Location (text input)
    - Stats (3 editable rows: Value + Label + Sub)
    - CTA button text
    - "Save Changes" button (orange)

  COURSES TAB:
    - Course cards list: each has Title | Description | Duration | Fee | Edit button
    - "Add New Course" button
    - Inline edit form on click

  FACULTY TAB:
    - Faculty cards list: Name | Subject | Qualification | Photo URL | Edit
    - "Add Faculty" button

  TESTIMONIALS TAB:
    - Testimonial list: Student name | Quote | Score | Year | Edit | Delete
    - "Add Testimonial" button

  RESULTS TAB:
    - Result entries: Student name | Score | Rank | Year | Photo URL | Edit
    - "Add Result" button

  All changes show: "Last updated: Today 3:45 PM" timestamp
  All save actions: Show success toast "Content updated successfully ✓"
```

### Page: `src/app/pages/admin/AdminQueries.tsx`

```
QUERIES INBOX:
  - Two-panel layout: Left=query list, Right=query detail

  LEFT PANEL (query list):
    - Search: "Search queries..."
    - Filter tabs: All | Unread | Replied | Closed
    - Each query item:
      Name + avatar initial | Subject preview | Time | Status badge
      Unread items have orange left border + bold text
    - Click to open in right panel

  RIGHT PANEL (query detail):
    - Query from: Name, Email, Phone, Submitted date
    - Full message text
    - Action buttons:
      "Mark as Read" | "Mark Resolved" | "Assign to Staff"
    - Reply section: Textarea + "Send Reply" button
    - Reply sends email to user's email (show notification)
    - Status history: Timeline of status changes
```

---

## 🟠 PORTAL 2 — TEACHER DASHBOARD

### Layout: `src/app/pages/teacher/TeacherLayout.tsx`

```
Same sidebar structure as AdminLayout but with teacher-specific navigation:
  MENU:
    Dashboard (LayoutDashboard)
    Upload Notes (Upload)
    Announcements (Megaphone)
    My Students (Users)
    Live Chat (MessageCircle)

Sidebar footer: Teacher name + "Physics Teacher" subject badge + logout

Topbar: "Welcome back, [Teacher Name]" + notification bell + avatar
```

### Page: `src/app/pages/teacher/TeacherDashboard.tsx`

```
STATS ROW (4 cards):
  1. My Students — 186 — per all batches
  2. Notes Uploaded — 34 — this month
  3. Avg Download Rate — 78% — notes download ratio
  4. Pending Announcements — 2 — unread by students

QUICK ACTIONS ROW (3 big action cards):
  1. "Upload New Notes" — Upload icon — orange gradient — links to /teacher/notes
  2. "New Announcement" — Megaphone icon — blue gradient — links to /teacher/announcements
  3. "View Student Performance" — BarChart icon — green gradient — links to /teacher/students

MY BATCHES SECTION:
  Grid of batch cards (grid-cols-3):
  Each batch card:
    - Batch name: "JEE-2026-Batch-A"
    - Subject: "Physics"
    - Student count: "42 students"
    - Notes uploaded: "12 notes"
    - Last activity: "2 hours ago"
    - Click → goes to that batch's note list

RECENT UPLOADS TABLE:
  Columns: File Name | Batch | Subject | Upload Date | Downloads | Actions
  Last 10 uploads visible
  Actions: View | Edit | Delete
```

### Page: `src/app/pages/teacher/TeacherNotes.tsx`

```
HEADER: "Notes & Study Material" + "Upload New" button (orange)

BATCH/SUBJECT FILTERS:
  - Batch selector tabs: JEE-2026-A | JEE-2026-B | NEET-2026 | All
  - Subject filter: Physics | Chemistry | Maths | Biology | All

UPLOAD FORM (collapsible panel, appears on "Upload New" click):
  glassmorphism card with:
    - Title input: "Note/File Title" (required)
    - Description textarea: "Short description for students"
    - Batch multi-select: checkboxes for each batch (can assign to multiple)
    - Subject select dropdown
    - Chapter/Topic input: "e.g., Laws of Motion"
    - File upload dropzone:
        Accepts: PDF, DOC, DOCX, PPT, PPTX, MP4 (video)
        Shows file name + size after selection
        File size limit: 50MB
    - Visibility toggle: "Published" / "Draft"
    - "Upload Notes" button (orange gradient)
    - Cancel button (outlined)

NOTES GRID (grid-cols-3 on desktop, grid-cols-1 mobile):
Each note card (glassmorphism):
  - File type icon (PDF=red, Video=blue, PPT=orange, DOC=gray)
  - Title: font-semibold text-white
  - Batch badge: e.g., "JEE-2026-A" in blue pill
  - Subject badge: "Physics" in orange pill
  - Chapter: text-white/50 text-sm
  - Upload date + download count
  - Status: Published (green dot) / Draft (gray dot)
  - Actions row: Download | Edit | Delete | 👁 View count

EDIT MODAL:
  - Same fields as upload form, pre-filled
  - "Update Note" button
```

### Page: `src/app/pages/teacher/TeacherAnnouncements.tsx`

```
HEADER: "Announcements" + "Post New" button

COMPOSE PANEL (shown on "Post New"):
  - Title: "Announcement title"
  - Message: Large textarea
  - Target:
      Radio: "All My Students" | "Specific Batch" | "Specific Subject"
      If "Specific Batch": batch multi-select checkboxes
  - Priority: Normal | Important | Urgent (colored badges)
    Normal=white, Important=amber, Urgent=red
  - Schedule: "Post Now" toggle vs Date-time picker
  - "Post Announcement" button (orange)

ANNOUNCEMENTS LIST:
  Each announcement card:
    - Priority badge (top-right)
    - Title: font-bold text-white
    - Message: truncated with "Read more"
    - Target: "JEE-2026-A • Physics" pills
    - Date + time
    - Seen count: "Seen by 34/42 students" with progress bar
    - Actions: Edit | Delete | "Re-send to unseen"
```

### Page: `src/app/pages/teacher/TeacherStudents.tsx`

```
MY STUDENTS — PERFORMANCE VIEW

BATCH TABS: One tab per teacher's batch

PER BATCH VIEW:
  SUMMARY ROW (3 stat cards):
    - Avg Attendance: 86%
    - Avg Test Score: 72/100
    - Notes Completion: 64% (downloaded all notes)

  STUDENT TABLE:
    Columns: Student | Attendance % | Test Scores | Notes Downloaded | Performance | Action
    - Performance column: color-coded pill
        90%+: "Excellent" green
        70-89%: "Good" blue
        50-69%: "Average" amber
        Below 50%: "Needs Help" red
    - Clicking a student row opens a detail panel:
        Line chart of test scores over time
        Attendance heatmap (calendar view)
        List of notes they've NOT downloaded (for follow-up)
    - "Add Score" button per student:
        Mini modal: Test name | Date | Score | Max Score | "Save"

  BULK UPDATE:
    - "Upload Test Results" button: CSV upload
    - CSV format: student_id, test_name, score, max_score, date
```

### Page: `src/app/pages/teacher/TeacherChat.tsx`

```
REAL-TIME CHAT INTERFACE

TWO-PANEL LAYOUT:

LEFT PANEL — Conversations list:
  - Tabs: "My Students" | "Group Chat"
  - Student list with:
      Avatar (initials) | Name | Last message preview | Time | Unread count badge
  - Search students: "Search by name..."
  - Online indicator: green dot for online, gray for offline
  - Clicking student opens chat in right panel

RIGHT PANEL — Chat window:
  - Header: Student avatar + name + batch + "Online/Last seen X ago"
  - Message area (scrollable):
      Teacher messages: right-aligned, orange bubble bg-orange-500/20 border border-orange-500/30
      Student messages: left-aligned, glassmorphism bubble bg-white/[0.06] border border-white/10
      Message: text content + timestamp below
      File attachments: paper icon + filename + download link
  - Input area (fixed bottom):
      File attach button (Paperclip icon)
      Message textarea (auto-resize, max 4 rows)
      Send button (orange, ArrowUp or Send icon)
      Enter key sends, Shift+Enter for new line

GROUP CHAT TAB:
  - Same UI but "Batch: JEE-2026-A" label in header
  - All students in that batch can see messages
  - Teacher can pin important messages (pushpin icon)
  - Pinned messages appear at top in a collapsible bar

NOTE: Use mock state for now. Implement with WebSocket/Supabase realtime later.
```

---

## 🟢 PORTAL 3 — STUDENT DASHBOARD

### Layout: `src/app/pages/student/StudentLayout.tsx`

```
SIDEBAR (same structure, student navigation):
  MENU:
    Dashboard (LayoutDashboard)
    My Subjects (BookOpen)
    Study Notes (FileText)
    Live Chat (MessageCircle)
    My Performance (TrendingUp)

Sidebar footer: Student name + "JEE-2026-Batch-A" batch badge + logout

Topbar: "Hello, [Student Name] 👋" + notification bell + avatar
```

### Page: `src/app/pages/student/StudentDashboard.tsx`

```
WELCOME HERO CARD (full width):
  glassmorphism card with orange left border:
  "Welcome back, Aryan! 🎯"
  "You have 3 new notes and 2 announcements today."
  Quick links: "View Notes →" | "Check Announcements →"

STATS ROW (4 cards):
  1. Notes Available — 48 (all notes in my batches)
  2. Downloaded — 31 (notes I've accessed)
  3. My Attendance — 88%
  4. Last Test Score — 74/100

TODAY'S ANNOUNCEMENTS (card):
  - List of announcements from my teachers, newest first
  - Each: Priority badge | Title | Teacher name | Time
  - "Mark as Read" per announcement
  - Unread announcements highlighted with orange left border

MY SUBJECTS GRID (grid-cols-3):
  Per subject card:
    - Subject name (Physics, Chemistry, Maths)
    - Teacher name + avatar
    - Notes count: "14 notes available"
    - Progress ring: "8/14 downloaded" as circular progress
    - "View Notes" button

RECENT NOTES (table):
  Latest 5 notes across all subjects:
  Icon | Title | Subject | Teacher | Uploaded | Download button
```

### Page: `src/app/pages/student/StudentNotes.tsx`

```
HEADER: "Study Notes"

FILTER ROW:
  - Subject tabs: All | Physics | Chemistry | Maths | Biology
  - Chapter/Topic search input
  - Sort: Newest First | Oldest First | Most Downloaded

NOTES GRID (grid-cols-3 desktop, grid-cols-1 mobile):
Each note card (glassmorphism):
  - File type icon colored (PDF=red, Video=blue, PPT=orange)
  - Title: font-semibold text-white
  - Subject + Chapter pills
  - Teacher: "By Rahul Sir" with small avatar
  - Upload date
  - "NEW" badge if uploaded in last 48 hours
  - "Downloaded" green checkmark if already accessed
  - Download button (orange, outlined):
      - On click: simulate download + mark as downloaded
      - Downloaded state: gray "Downloaded ✓" button

NOTE DETAIL VIEW (clicking card opens modal or page):
  - Full title + description
  - Teacher info
  - Chapter/topic
  - File details: type, size
  - "Download File" button
  - "Related Notes" (same subject/chapter)
```

### Page: `src/app/pages/student/StudentSubjects.tsx`

```
MY SUBJECTS & TEACHERS PAGE

BATCH INFO CARD (top):
  - "Your Batch: JEE-2026-Batch-A"
  - Batch schedule: "Mon, Wed, Fri — 4:00 PM to 6:00 PM"
  - Next class: "Physics — Tomorrow 4:00 PM"

TEACHERS GRID (grid-cols-2 or 3):
  Per teacher card:
    - Large avatar (initials with gradient)
    - Teacher name: font-bold
    - Subject: "Physics" badge in orange
    - Qualification: "M.Sc Physics, IIT Bombay"
    - Notes count: "14 notes available for you"
    - Rating: ★★★★☆ (4.8/5)
    - "Message" button → opens chat with that teacher
    - "View Notes" button → goes to notes filtered by this teacher/subject

INFO SECTION:
  - "Your subjects in this batch" — list of subject names with icons
  - "Exam schedule" — upcoming test dates (table: Date | Subject | Syllabus)
```

### Page: `src/app/pages/student/StudentChat.tsx`

```
CHAT INTERFACE (same structure as TeacherChat but from student POV):

LEFT PANEL — My Teachers list:
  - Shows only teachers of my enrolled batch/subjects
  - Physics Teacher: Rahul Sir | Chemistry: Priya Ma'am | etc.
  - Online status + last message preview + unread count

RIGHT PANEL — Chat window:
  - Same message bubble UI as TeacherChat (colors swapped)
  - Student messages: right-aligned, orange bubble
  - Teacher messages: left-aligned, glassmorphism bubble
  - File attachment display
  - Message input with send button

GROUP CHAT section:
  - "My Batch Group" — JEE-2026-A
  - Can see all teacher announcements here too
  - Students can send messages (teacher can mute individuals)
```

### Page: `src/app/pages/student/StudentPerformance.tsx`

```
PERFORMANCE ANALYTICS

OVERVIEW ROW (3 stat cards):
  - Overall Percentile: 78th
  - Tests Attempted: 12/15
  - Best Score: 91/100 (Chemistry — Oct 2024)

SUBJECT-WISE PERFORMANCE (3 cards in row):
  Per subject card:
    - Subject name + icon
    - Circular progress chart showing avg score %
    - Last 5 test scores listed
    - "Strong topics" list (green tags)
    - "Weak topics" list (red tags)

TEST HISTORY TABLE:
  Columns: Test Name | Subject | Date | Score | Max | Percentile | Rank in Batch
  - Last 15 tests
  - Color-coded score: green if above class avg, red if below

PROGRESS CHART (full width):
  - Line chart: My score vs Batch average over time
  - X-axis: test dates
  - Y-axis: score percentage
  - Two lines: "My Score" (orange) + "Batch Avg" (blue dashed)
  - recharts LineChart with dark theme styling

ATTENDANCE SECTION:
  - Attendance % per subject
  - Month-wise attendance calendar (green/red dots per class day)
```

---

## 🎨 SHARED UI PATTERNS (Use across all dashboards)

### Glassmorphism Card
```tsx
className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
// Hover state:
className="hover:bg-white/[0.07] hover:border-orange-500/30 transition-all duration-300 cursor-pointer"
```

### Stat Card with Count-Up
```tsx
// Use useMotionValue + animate from motion/react
// Start from 0, animate to target value on mount
// Example: animate(count, 1248, { duration: 1.5, ease: "easeOut" })
```

### Orange Gradient Button (Primary)
```tsx
className="px-6 py-3 rounded-xl font-semibold text-white"
style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)", boxShadow: "0 8px 30px rgba(255,92,0,0.3)" }}
// whileHover={{ scale: 1.04, boxShadow: "0 0 0 4px rgba(255,92,0,0.2)" }}
// whileTap={{ scale: 0.97 }}
```

### Ghost Button (Secondary)
```tsx
className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/15 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.08] hover:text-white transition-all"
```

### Badge/Pill
```tsx
// Green: className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20"
// Orange: className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20"
// Blue: className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20"
// Red: className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/20"
```

### Section Heading
```tsx
<h2 className="text-xl font-bold text-white mb-1">Section Title</h2>
<p className="text-white/50 text-sm">Optional subtitle</p>
```

### Input Field
```tsx
className="w-full px-4 py-3 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30
           focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10
           backdrop-blur-sm transition-all"
```

### Recharts Dark Theme Config
```tsx
// Apply to all charts:
background: "transparent"
CartesianGrid: strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"
XAxis/YAxis: tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false}
Tooltip: contentStyle={{ background: "#0A1A35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
Line/Bar color: #FF5C00 (primary) or #3B5BDB (secondary)
```

### Page Entry Animation
```tsx
// Wrap each page content in:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

---

## 📋 MOCK DATA TO USE

```tsx
// src/app/data/mockData.ts — create this file

export const mockStudents = [
  { id: "S001", name: "Aryan Sharma",    email: "aryan@gmail.com",   phone: "9876543210", batch: "JEE-2026-A", class: "12", feeStatus: "Paid",    joined: "2024-06-15" },
  { id: "S002", name: "Priya Verma",     email: "priya@gmail.com",   phone: "9876543211", batch: "NEET-2026",  class: "12", feeStatus: "Pending",  joined: "2024-07-01" },
  { id: "S003", name: "Rahul Gupta",     email: "rahul@gmail.com",   phone: "9876543212", batch: "JEE-2026-B", class: "11", feeStatus: "Paid",    joined: "2024-06-20" },
  { id: "S004", name: "Sneha Patel",     email: "sneha@gmail.com",   phone: "9876543213", batch: "JEE-2026-A", class: "12", feeStatus: "Overdue", joined: "2024-05-10" },
  { id: "S005", name: "Amit Joshi",      email: "amit@gmail.com",    phone: "9876543214", batch: "NEET-2026",  class: "11", feeStatus: "Paid",    joined: "2024-07-15" },
];

export const mockTeachers = [
  { id: "T001", name: "Dr. Rahul Mishra",  subject: "Physics",   batches: ["JEE-2026-A","JEE-2026-B"], notesUploaded: 28, rating: 4.8 },
  { id: "T002", name: "Priya Sharma",      subject: "Chemistry", batches: ["NEET-2026","JEE-2026-A"],  notesUploaded: 34, rating: 4.7 },
  { id: "T003", name: "Vikram Singh",      subject: "Maths",     batches: ["JEE-2026-A","JEE-2026-B"], notesUploaded: 42, rating: 4.9 },
  { id: "T004", name: "Dr. Anita Gupta",   subject: "Biology",   batches: ["NEET-2026"],               notesUploaded: 19, rating: 4.6 },
];

export const mockNotes = [
  { id: "N001", title: "Laws of Motion — Complete Notes", subject: "Physics",   chapter: "Laws of Motion", batch: ["JEE-2026-A"], type: "pdf",  size: "2.4MB", uploads: "2024-11-01", downloads: 38 },
  { id: "N002", title: "Organic Chemistry Part 1",        subject: "Chemistry", chapter: "Organic Chem",   batch: ["NEET-2026"],  type: "pdf",  size: "3.1MB", uploads: "2024-11-03", downloads: 29 },
  { id: "N003", title: "Integration Tricks Master Class", subject: "Maths",     chapter: "Integration",    batch: ["JEE-2026-A","JEE-2026-B"], type: "video", size: "180MB", uploads: "2024-11-05", downloads: 52 },
  { id: "N004", title: "Human Anatomy — Digestive System", subject: "Biology",  chapter: "Digestion",      batch: ["NEET-2026"],  type: "ppt",  size: "5.2MB", uploads: "2024-11-06", downloads: 22 },
];

export const mockAnnouncements = [
  { id: "A001", title: "Test on Sunday!", message: "Unit test for Laws of Motion this Sunday at 10 AM.", priority: "urgent",    teacher: "Dr. Rahul Mishra", batch: ["JEE-2026-A"], date: "2024-11-07" },
  { id: "A002", title: "New Notes Uploaded",  message: "Organic Chemistry Part 2 has been uploaded.", priority: "normal",    teacher: "Priya Sharma",     batch: ["NEET-2026"],  date: "2024-11-06" },
  { id: "A003", title: "Holiday Notice",      message: "Institute will be closed on Nov 14th.", priority: "important", teacher: "Admin",             batch: ["all"],        date: "2024-11-05" },
];

export const mockQueries = [
  { id: "Q001", name: "Rajesh Kumar",   email: "rajesh@gmail.com",  phone: "9876540001", message: "I want to know about JEE batch fees and schedule.", status: "unread",   date: "2024-11-07 10:23" },
  { id: "Q002", name: "Meena Sharma",   email: "meena@gmail.com",   phone: "9876540002", message: "Is there a hostel facility available near the institute?", status: "replied", date: "2024-11-06 14:15" },
  { id: "Q003", name: "Suresh Patel",   email: "suresh@gmail.com",  phone: "9876540003", message: "Can my daughter join in January for NEET 2026?", status: "closed",   date: "2024-11-05 09:00" },
];
```

---

## ✅ SUCCESS CRITERIA

1. All 3 dashboards fully render without errors
2. Sidebar navigation works — active state highlights correctly
3. All routes load the correct page component
4. Mock data renders in all tables/grids
5. Count-up animations trigger on dashboard load
6. recharts charts render with dark theme
7. Glassmorphism cards match existing landing page style
8. Orange gradient CTA buttons consistent with landing page
9. File upload dropzone shows drag-over state
10. Chat UI shows correct message alignment (teacher vs student)
11. Responsive: Sidebar collapses on mobile (hamburger toggle)
12. Performance MODAL opens on clicking student row in admin
13. Note download tracking updates UI state immediately
14. Batch filter works on Teacher Notes page
15. No TypeScript errors (`tsc --noEmit` passes)

---

## 🚫 DO NOT

- Do NOT break existing routes: `/`, `/about`, `/courses`, `/faculty`, `/results`, `/login`
- Do NOT change `theme.css` colors
- Do NOT install new npm packages (recharts already available via shadcn chart.tsx)
- Do NOT use `localStorage` for state — keep all state in React useState
- Do NOT use hardcoded pixel widths that break mobile layout
- Do NOT change existing component files in `src/app/components/` (landing page components)

---

*Aarambh Institute — Admin + Teacher + Student Dashboard Implementation Plan*
*Tech: React 18 + Vite + TypeScript + Motion + Tailwind v4 + shadcn/ui*
*Theme: Dark Navy (#05101F) + Orange (#FF5C00) + Glassmorphism*