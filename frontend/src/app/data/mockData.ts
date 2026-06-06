export const mockStudents = [
  { id: "S001", name: "Aryan Sharma", email: "aryan@gmail.com", phone: "9876543210", batch: "JEE-2026-A", class: "12", feeStatus: "Paid", joined: "2024-06-15", avatar: "AS" },
  { id: "S002", name: "Priya Verma", email: "priya@gmail.com", phone: "9876543211", batch: "NEET-2026", class: "12", feeStatus: "Pending", joined: "2024-07-01", avatar: "PV" },
  { id: "S003", name: "Rahul Gupta", email: "rahul@gmail.com", phone: "9876543212", batch: "JEE-2026-B", class: "11", feeStatus: "Paid", joined: "2024-06-20", avatar: "RG" },
  { id: "S004", name: "Sneha Patel", email: "sneha@gmail.com", phone: "9876543213", batch: "JEE-2026-A", class: "12", feeStatus: "Overdue", joined: "2024-05-10", avatar: "SP" },
  { id: "S005", name: "Amit Joshi", email: "amit@gmail.com", phone: "9876543214", batch: "NEET-2026", class: "11", feeStatus: "Paid", joined: "2024-07-15", avatar: "AJ" },
  { id: "S006", name: "Riya Malhotra", email: "riya@gmail.com", phone: "9876543215", batch: "JEE-2026-A", class: "12", feeStatus: "Paid", joined: "2024-06-10", avatar: "RM" },
  { id: "S007", name: "Karan Singh", email: "karan@gmail.com", phone: "9876543216", batch: "JEE-2026-B", class: "11", feeStatus: "Pending", joined: "2024-07-20", avatar: "KS" },
  { id: "S008", name: "Neha Agarwal", email: "neha@gmail.com", phone: "9876543217", batch: "NEET-2026", class: "12", feeStatus: "Paid", joined: "2024-06-25", avatar: "NA" },
];

export const mockTeachers = [
  { id: "T001", name: "Dr. Rahul Mishra", subject: "Physics", batches: ["JEE-2026-A", "JEE-2026-B"], notesUploaded: 28, rating: 4.8, avatar: "RM", qualification: "PhD Physics, IIT Delhi" },
  { id: "T002", name: "Priya Sharma", subject: "Chemistry", batches: ["NEET-2026", "JEE-2026-A"], notesUploaded: 34, rating: 4.7, avatar: "PS", qualification: "M.Sc Chemistry, DU" },
  { id: "T003", name: "Vikram Singh", subject: "Maths", batches: ["JEE-2026-A", "JEE-2026-B"], notesUploaded: 42, rating: 4.9, avatar: "VS", qualification: "M.Sc Mathematics, IIT Bombay" },
  { id: "T004", name: "Dr. Anita Gupta", subject: "Biology", batches: ["NEET-2026"], notesUploaded: 19, rating: 4.6, avatar: "AG", qualification: "PhD Biology, AIIMS Delhi" },
];

export const mockNotes = [
  { id: "N001", title: "Laws of Motion — Complete Notes", subject: "Physics", chapter: "Laws of Motion", batch: ["JEE-2026-A"], type: "pdf", size: "2.4MB", uploadDate: "2024-11-01", downloads: 38, teacher: "Dr. Rahul Mishra", status: "published" },
  { id: "N002", title: "Organic Chemistry Part 1", subject: "Chemistry", chapter: "Organic Chem", batch: ["NEET-2026"], type: "pdf", size: "3.1MB", uploadDate: "2024-11-03", downloads: 29, teacher: "Priya Sharma", status: "published" },
  { id: "N003", title: "Integration Tricks Master Class", subject: "Maths", chapter: "Integration", batch: ["JEE-2026-A", "JEE-2026-B"], type: "video", size: "180MB", uploadDate: "2024-11-05", downloads: 52, teacher: "Vikram Singh", status: "published" },
  { id: "N004", title: "Human Anatomy — Digestive System", subject: "Biology", chapter: "Digestion", batch: ["NEET-2026"], type: "ppt", size: "5.2MB", uploadDate: "2024-11-06", downloads: 22, teacher: "Dr. Anita Gupta", status: "published" },
  { id: "N005", title: "Kinematics Quick Revision", subject: "Physics", chapter: "Kinematics", batch: ["JEE-2026-A"], type: "pdf", size: "1.8MB", uploadDate: "2024-11-07", downloads: 45, teacher: "Dr. Rahul Mishra", status: "published" },
  { id: "N006", title: "Thermodynamics Lecture Video", subject: "Chemistry", chapter: "Thermodynamics", batch: ["JEE-2026-A", "NEET-2026"], type: "video", size: "220MB", uploadDate: "2024-11-02", downloads: 33, teacher: "Priya Sharma", status: "published" },
];

export const mockAnnouncements = [
  { id: "A001", title: "Test on Sunday!", message: "Unit test for Laws of Motion this Sunday at 10 AM. Please revise chapters 1-3.", priority: "urgent", teacher: "Dr. Rahul Mishra", batch: ["JEE-2026-A"], date: "2024-11-07", seenCount: 34, totalStudents: 42 },
  { id: "A002", title: "New Notes Uploaded", message: "Organic Chemistry Part 2 has been uploaded. Check your notes section.", priority: "normal", teacher: "Priya Sharma", batch: ["NEET-2026"], date: "2024-11-06", seenCount: 28, totalStudents: 35 },
  { id: "A003", title: "Holiday Notice", message: "Institute will be closed on Nov 14th for Diwali celebrations.", priority: "important", teacher: "Admin", batch: ["all"], date: "2024-11-05", seenCount: 120, totalStudents: 120 },
  { id: "A004", title: "Parent-Teacher Meeting", message: "PTM scheduled for Nov 18th. Attendance is mandatory.", priority: "important", teacher: "Admin", batch: ["all"], date: "2024-11-04", seenCount: 95, totalStudents: 120 },
];

export const mockQueries = [
  { id: "Q001", name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "9876540001", message: "I want to know about JEE batch fees and schedule. My son is in class 11 and wants to join for JEE 2027 preparation.", status: "unread", date: "2024-11-07 10:23", avatar: "RK" },
  { id: "Q002", name: "Meena Sharma", email: "meena@gmail.com", phone: "9876540002", message: "Is there a hostel facility available near the institute? We are from Indore and need accommodation.", status: "replied", date: "2024-11-06 14:15", avatar: "MS" },
  { id: "Q003", name: "Suresh Patel", email: "suresh@gmail.com", phone: "9876540003", message: "Can my daughter join in January for NEET 2026? What will be the fee structure?", status: "closed", date: "2024-11-05 09:00", avatar: "SP" },
  { id: "Q004", name: "Anjali Dubey", email: "anjali@gmail.com", phone: "9876540004", message: "Do you provide study material for class 10 CBSE board exam preparation?", status: "unread", date: "2024-11-07 15:30", avatar: "AD" },
];

export const enrollmentData = [
  { month: "Jan", enrollments: 180 },
  { month: "Feb", enrollments: 220 },
  { month: "Mar", enrollments: 195 },
  { month: "Apr", enrollments: 310 },
  { month: "May", enrollments: 280 },
  { month: "Jun", enrollments: 340 },
];

export const batchDistribution = [
  { name: "JEE Main", value: 40, color: "#FF5C00" },
  { name: "JEE Advanced", value: 25, color: "#3B5BDB" },
  { name: "NEET", value: 35, color: "#2F9E44" },
];

export const mockBatches = [
  { id: "B001", name: "JEE-2026-A", subject: "All Subjects", students: 42, notesCount: 28, schedule: "Mon, Wed, Fri — 4:00 PM to 6:00 PM" },
  { id: "B002", name: "JEE-2026-B", subject: "All Subjects", students: 38, notesCount: 24, schedule: "Tue, Thu, Sat — 4:00 PM to 6:00 PM" },
  { id: "B003", name: "NEET-2026", subject: "PCB", students: 35, notesCount: 32, schedule: "Mon, Wed, Fri — 6:30 PM to 8:30 PM" },
];

export const mockTestScores = [
  { id: "TS001", studentId: "S001", testName: "Physics Unit Test 1", subject: "Physics", date: "2024-10-15", score: 74, maxScore: 100, percentile: 78 },
  { id: "TS002", studentId: "S001", testName: "Chemistry Mid Term", subject: "Chemistry", date: "2024-10-20", score: 82, maxScore: 100, percentile: 85 },
  { id: "TS003", studentId: "S001", testName: "Maths Quiz 1", subject: "Maths", date: "2024-10-25", score: 68, maxScore: 100, percentile: 72 },
];
