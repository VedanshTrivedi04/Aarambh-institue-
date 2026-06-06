"""
Seed command: python manage.py seed_data

Creates a full demo dataset including:
  - 1 Admin (superuser)
  - 3 Teachers
  - 10 Students
  - 3 Subjects
  - 2 Batches
  - Enrollments
  - Announcements
  - Tests + Scores
  - Attendance Records
  - Chat Rooms
"""

import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction


class Command(BaseCommand):
    help = "Seed the database with demo data for all portals"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete all existing seed data before seeding (keeps superusers)",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write(self.style.WARNING("ðŸ—‘  Flushing existing seed data..."))
            self._flush()

        self.stdout.write(self.style.MIGRATE_HEADING("[*] Starting seed..."))

        with transaction.atomic():
            admin = self._create_admin()
            teachers = self._create_teachers()
            subjects = self._create_subjects()
            batches = self._create_batches(subjects, teachers)
            students = self._create_students(batches)
            self._create_courses()
            self._create_announcements(teachers, batches, admin)
            self._create_tests_and_scores(batches, subjects, teachers, students)
            self._create_attendance(batches, students, teachers)
            self._create_chat_rooms(teachers, students)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 55))
        self.stdout.write(self.style.SUCCESS("[OK] Seed data created successfully!"))
        self.stdout.write(self.style.SUCCESS("=" * 55))
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING("[KEY] Login Credentials:"))
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("  [ADMIN]"))
        self.stdout.write("      Email   : admin@aarambh.com")
        self.stdout.write("      Password: Admin@1234")
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("  [TEACHERS]"))
        self.stdout.write("      Email   : physics.teacher@aarambh.com  | Password: Teacher@1234")
        self.stdout.write("      Email   : chemistry.teacher@aarambh.com | Password: Teacher@1234")
        self.stdout.write("      Email   : maths.teacher@aarambh.com    | Password: Teacher@1234")
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("  [STUDENTS]  (all passwords: Student@1234)"))
        self.stdout.write("      student1@aarambh.com  to  student10@aarambh.com")
        self.stdout.write("")

    # ------------------------------------------------------------------ #
    #  FLUSH                                                               #
    # ------------------------------------------------------------------ #
    def _flush(self):
        from apps.chat.models import ChatRoom, Message
        from apps.performance.models import AttendanceSession, AttendanceRecord, Test, Score
        from apps.announcements.models import Announcement
        from apps.academics.models import Batch, BatchEnrollment, Subject
        from apps.users.models import CustomUser, StudentProfile, TeacherProfile, AdminProfile

        Message.objects.all().delete()
        ChatRoom.objects.all().delete()
        Score.objects.all().delete()
        AttendanceRecord.objects.all().delete()
        AttendanceSession.objects.all().delete()
        Test.objects.all().delete()
        Announcement.objects.all().delete()
        BatchEnrollment.objects.all().delete()
        Batch.objects.all().delete()
        Subject.objects.all().delete()
        # Delete CMS courses
        from apps.content.models import Course
        Course.objects.filter(slug__startswith='aarambh-').delete()
        # Only delete non-superusers we created
        CustomUser.objects.filter(email__endswith="@aarambh.com").delete()

    # ------------------------------------------------------------------ #
    #  ADMIN                                                               #
    # ------------------------------------------------------------------ #
    def _create_admin(self):
        from apps.users.models import CustomUser, AdminProfile

        admin, created = CustomUser.objects.get_or_create(
            email="admin@aarambh.com",
            defaults={
                "phone": "9000000000",
                "first_name": "Aarambh",
                "last_name": "Admin",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
                "username": "aarambh_admin",
            },
        )
        if created:
            admin.set_password("Admin@1234")
            admin.save()
            AdminProfile.objects.get_or_create(
                user=admin,
                defaults={
                    "admin_level": "super_admin",
                    "department": "Management",
                    "can_manage_fees": True,
                    "can_delete_content": True,
                    "can_manage_users": True,
                },
            )
            self.stdout.write(f"  âœ“ Admin created: admin@aarambh.com")
        else:
            self.stdout.write(f"  â†© Admin already exists: admin@aarambh.com")
        return admin

    # ------------------------------------------------------------------ #
    #  TEACHERS                                                            #
    # ------------------------------------------------------------------ #
    def _create_teachers(self):
        from apps.users.models import CustomUser, TeacherProfile

        teacher_data = [
            {
                "email": "physics.teacher@aarambh.com",
                "phone": "9111111111",
                "first_name": "Rahul",
                "last_name": "Mishra",
                "username": "teacher_rahul",
                "qualification": "M.Sc Physics, IIT Bombay",
                "experience_years": 8,
                "bio": "Expert in JEE Physics with 8+ years of teaching experience. Specializes in Mechanics and Electrodynamics.",
                "specialization": "Mechanics, Electrodynamics, Modern Physics",
                "achievement": "500+ students scored 90%+ in Physics",
                "employee_id": "EMP001",
            },
            {
                "email": "chemistry.teacher@aarambh.com",
                "phone": "9111111112",
                "first_name": "Priya",
                "last_name": "Sharma",
                "username": "teacher_priya",
                "qualification": "M.Sc Chemistry, Delhi University",
                "experience_years": 6,
                "bio": "Chemistry expert with focus on Organic Chemistry and Physical Chemistry for JEE/NEET.",
                "specialization": "Organic Chemistry, Physical Chemistry",
                "achievement": "400+ students cracked NEET with 95+ percentile",
                "employee_id": "EMP002",
            },
            {
                "email": "maths.teacher@aarambh.com",
                "phone": "9111111113",
                "first_name": "Vikram",
                "last_name": "Singh",
                "username": "teacher_vikram",
                "qualification": "M.Sc Mathematics, IIT Kanpur",
                "experience_years": 10,
                "bio": "Mathematics wizard known for simplifying complex topics. Expert in Calculus and Algebra.",
                "specialization": "Calculus, Algebra, Trigonometry, Coordinate Geometry",
                "achievement": "300+ JEE Advanced selections in 5 years",
                "employee_id": "EMP003",
            },
        ]

        teachers = []
        for data in teacher_data:
            teacher, created = CustomUser.objects.get_or_create(
                email=data["email"],
                defaults={
                    "phone": data["phone"],
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "role": "teacher",
                    "username": data["username"],
                },
            )
            if created:
                teacher.set_password("Teacher@1234")
                teacher.save()
            TeacherProfile.objects.get_or_create(
                user=teacher,
                defaults={
                    "employee_id": data["employee_id"],
                    "qualification": data["qualification"],
                    "experience_years": data["experience_years"],
                    "bio": data["bio"],
                    "specialization": data["specialization"],
                    "achievement": data["achievement"],
                    "joining_date": date.today() - timedelta(days=data["experience_years"] * 365),
                    "rating": round(random.uniform(4.3, 5.0), 1),
                    "rating_count": random.randint(50, 300),
                    "is_active_teacher": True,
                },
            )
            teachers.append(teacher)
            status = "âœ“" if created else "â†©"
            self.stdout.write(f"  {status} Teacher: {data['first_name']} {data['last_name']} ({data['email']})")

        return teachers

    # ------------------------------------------------------------------ #
    #  SUBJECTS                                                            #
    # ------------------------------------------------------------------ #
    def _create_subjects(self):
        from apps.academics.models import Subject

        subject_data = [
            {"name": "Physics", "code": "PHY101", "description": "Covers Mechanics, Electrodynamics, Modern Physics, Optics and Thermodynamics for JEE/NEET"},
            {"name": "Chemistry", "code": "CHE101", "description": "Physical, Organic, and Inorganic Chemistry for JEE/NEET preparation"},
            {"name": "Mathematics", "code": "MAT101", "description": "Algebra, Calculus, Trigonometry, Coordinate Geometry, and Vectors for JEE"},
        ]

        subjects = []
        for data in subject_data:
            subj, created = Subject.objects.get_or_create(
                code=data["code"],
                defaults={"name": data["name"], "description": data["description"]},
            )
            subjects.append(subj)
            status = "âœ“" if created else "â†©"
            self.stdout.write(f"  {status} Subject: {data['name']}")

        return subjects

    # ------------------------------------------------------------------ #
    #  CMS COURSES (Public Website)                                        #
    # ------------------------------------------------------------------ #
    def _create_courses(self):
        from apps.content.models import Course

        course_data = [
            {
                "name": "JEE Advanced Preparation",
                "slug": "aarambh-jee-advanced",
                "short_desc": "JEE Main & Advanced",
                "description": "Comprehensive 2-year program covering Physics, Chemistry, and Mathematics for IIT-JEE aspirants. Includes weekly tests, doubt sessions, and personalized mentoring.",
                "features": ["Physics", "Chemistry", "Mathematics", "Weekly Mock Tests", "Doubt Sessions", "Study Material"],
                "target_exam": "JEE Advanced",
                "order": 1,
                "is_active": True,
            },
            {
                "name": "NEET Medical Preparation",
                "slug": "aarambh-neet",
                "short_desc": "NEET UG",
                "description": "Focused program for NEET UG aspirants covering Physics, Chemistry, and Biology. Includes NCERT-based approach, PYQ analysis, and full-length mock tests.",
                "features": ["Physics", "Chemistry", "Biology", "NCERT Focus", "PYQ Analysis", "Mock Tests"],
                "target_exam": "NEET UG",
                "order": 2,
                "is_active": True,
            },
            {
                "name": "Class 10 Board Excellence",
                "slug": "aarambh-class-10",
                "short_desc": "10th Board Exams",
                "description": "Complete coaching for Class 10 board exams across MP Board, CBSE, and ICSE. Covers all subjects with concept clarity, practice papers, and board exam strategies.",
                "features": ["All Subjects", "MP Board", "CBSE", "ICSE", "Practice Papers", "Revision Classes"],
                "target_exam": "10th Board",
                "order": 3,
                "is_active": True,
            },
            {
                "name": "Foundation Course (Class 9)",
                "slug": "aarambh-class-9-foundation",
                "short_desc": "Class 9 Foundation",
                "description": "Build a strong conceptual foundation in Class 9 for future competitive exams. Covers school syllabus plus early JEE/NEET exposure and olympiad preparation.",
                "features": ["Science", "Mathematics", "Olympiad Prep", "Concept Building", "Board Alignment"],
                "target_exam": "Foundation",
                "order": 4,
                "is_active": True,
            },
        ]

        for data in course_data:
            course, created = Course.objects.get_or_create(
                slug=data["slug"],
                defaults=data,
            )
            status = "[+]" if created else "[=]"
            self.stdout.write(f"  {status} Course: {data['name']}")

    # ------------------------------------------------------------------ #
    #  BATCHES                                                             #
    # ------------------------------------------------------------------ #
    def _create_batches(self, subjects, teachers):
        from apps.academics.models import Batch

        batch_data = [
            {
                "name": "JEE Advanced 2026 - Batch A",
                "class_grade": "12",
                "target_exam": "jee",
                "start_date": date.today() - timedelta(days=90),
                "end_date": date.today() + timedelta(days=180),
                "status": "active",
                "max_capacity": 40,
                "current_strength": 10,
            },
            {
                "name": "NEET 2026 - Batch B",
                "class_grade": "12",
                "target_exam": "neet",
                "start_date": date.today() - timedelta(days=60),
                "end_date": date.today() + timedelta(days=210),
                "status": "active",
                "max_capacity": 35,
                "current_strength": 5,
            },
        ]

        physics, chemistry, maths = subjects
        teacher_physics, teacher_chem, teacher_maths = teachers

        batches = []
        for i, data in enumerate(batch_data):
            batch, created = Batch.objects.get_or_create(
                name=data["name"],
                defaults={
                    "class_grade": data["class_grade"],
                    "target_exam": data["target_exam"],
                    "start_date": data["start_date"],
                    "end_date": data["end_date"],
                    "status": data["status"],
                    "max_capacity": data["max_capacity"],
                    "current_strength": data["current_strength"],
                },
            )
            if created:
                # Add subjects
                if data["target_exam"] == "jee":
                    batch.subjects.add(physics, chemistry, maths)
                    batch.primary_teachers.add(teacher_physics, teacher_chem, teacher_maths)
                else:
                    batch.subjects.add(physics, chemistry)
                    batch.primary_teachers.add(teacher_physics, teacher_chem)

            batches.append(batch)
            status = "âœ“" if created else "â†©"
            self.stdout.write(f"  {status} Batch: {data['name']}")

        return batches

    # ------------------------------------------------------------------ #
    #  STUDENTS                                                            #
    # ------------------------------------------------------------------ #
    def _create_students(self, batches):
        from apps.users.models import CustomUser, StudentProfile
        from apps.academics.models import BatchEnrollment

        student_names = [
            ("Aryan", "Sharma"), ("Priya", "Patel"), ("Rahul", "Gupta"),
            ("Sneha", "Verma"), ("Amit", "Kumar"), ("Neha", "Singh"),
            ("Rohan", "Joshi"), ("Kavya", "Mehta"), ("Vikash", "Yadav"), ("Anika", "Tiwari"),
        ]

        cities = ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"]
        boards = ["cbse", "mp_board", "icse"]
        streams = ["science"]

        batch_a, batch_b = batches
        students = []

        for i, (first, last) in enumerate(student_names):
            email = f"student{i+1}@aarambh.com"
            student, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "phone": f"9{i+1:09d}",  # 9000000001 to 9000000010
                    "first_name": first,
                    "last_name": last,
                    "role": "student",
                    "username": f"student_{first.lower()}_{i+1}",
                },
            )
            if created:
                student.set_password("Student@1234")
                student.save()

            StudentProfile.objects.get_or_create(
                user=student,
                defaults={
                    "roll_number": f"ARB2026{i+1:03d}",
                    "admission_number": f"ADM2026{i+1:03d}",
                    "class_grade": "12",
                    "board": random.choice(boards),
                    "stream": "science",
                    "date_of_birth": date(2007, random.randint(1, 12), random.randint(1, 28)),
                    "address_city": random.choice(cities),
                    "address_state": "Madhya Pradesh",
                    "address_pincode": f"4620{random.randint(10, 99)}",
                    "parent_name": f"Mr. {last}",
                    "parent_phone": f"9{i+2:09d}",
                    "previous_percentage": round(random.uniform(70.0, 95.0), 2),
                },
            )

            # Enroll first 5 in Batch A, rest in Batch B (or both for first 2)
            target_batch = batch_a if i < 5 else batch_b
            BatchEnrollment.objects.get_or_create(
                student=student,
                batch=target_batch,
                defaults={"status": "active"},
            )

            students.append(student)
            status = "âœ“" if created else "â†©"
            self.stdout.write(f"  {status} Student: {first} {last} ({email})")

        return students

    # ------------------------------------------------------------------ #
    #  ANNOUNCEMENTS                                                       #
    # ------------------------------------------------------------------ #
    def _create_announcements(self, teachers, batches, admin):
        from apps.announcements.models import Announcement

        ann_data = [
            {
                "title": "Welcome to Aarambh Institute!",
                "content": "Dear Students, welcome to the new academic session 2026. We are excited to have you with us. Please ensure you have downloaded the study app and set up your profile.",
                "priority": "normal",
                "is_global": True,
                "author": admin,
            },
            {
                "title": "JEE Advanced Mock Test - This Saturday",
                "content": "A full-length JEE Advanced mock test will be conducted this Saturday from 9:00 AM to 12:00 PM. All JEE batch students must attend. Syllabus: Physics chapters 1-5, Chemistry Organic Part 1, Maths Calculus.",
                "priority": "urgent",
                "is_global": False,
                "batch": batches[0],
                "author": teachers[0],
            },
            {
                "title": "NEET Biology Special Class",
                "content": "Special revision class for NEET Biology (Human Physiology) scheduled for Wednesday 5 PM. Attendance is mandatory. Notes will be uploaded after the class.",
                "priority": "high",
                "is_global": False,
                "batch": batches[1],
                "author": teachers[1],
            },
            {
                "title": "Holiday Notice - Eid Celebration",
                "content": "The institute will remain closed on Monday due to Eid. Classes will resume from Tuesday as per the regular schedule.",
                "priority": "normal",
                "is_global": True,
                "author": admin,
            },
            {
                "title": "Physics Chapter 3 Notes Uploaded",
                "content": "Notes for Chapter 3 - Laws of Motion have been uploaded. Please download and study before the next class. Important derivations are marked with a star.",
                "priority": "normal",
                "is_global": False,
                "batch": batches[0],
                "author": teachers[0],
            },
        ]

        for data in ann_data:
            target_batch = data.pop("batch", None)
            ann, created = Announcement.objects.get_or_create(
                title=data["title"],
                defaults=data,
            )
            if created and target_batch:
                ann.target_batches.add(target_batch)
            status = "[+]" if created else "[=]"
            self.stdout.write(f"  {status} Announcement: {data['title'][:45]}...")

    # ------------------------------------------------------------------ #
    #  TESTS & SCORES                                                      #
    # ------------------------------------------------------------------ #
    def _create_tests_and_scores(self, batches, subjects, teachers, students):
        from apps.performance.models import Test, Score

        physics, chemistry, maths = subjects
        batch_a, batch_b = batches

        test_defs = [
            # (batch, subject, title, date, max_marks, student_slice)
            (batch_a, physics, "Physics Unit Test 1 - Kinematics", date.today() - timedelta(days=45), 100, students[:5]),
            (batch_a, chemistry, "Chemistry Unit Test 1 - Atomic Structure", date.today() - timedelta(days=38), 100, students[:5]),
            (batch_a, maths, "Mathematics Unit Test 1 - Algebra", date.today() - timedelta(days=30), 100, students[:5]),
            (batch_a, physics, "Physics Unit Test 2 - Laws of Motion", date.today() - timedelta(days=20), 100, students[:5]),
            (batch_a, maths, "Mathematics Unit Test 2 - Calculus", date.today() - timedelta(days=10), 100, students[:5]),
            (batch_b, physics, "NEET Physics Mock Test 1", date.today() - timedelta(days=35), 180, students[5:]),
            (batch_b, chemistry, "NEET Chemistry Mock Test 1 - Organic", date.today() - timedelta(days=25), 180, students[5:]),
        ]

        for batch, subject, title, test_date, max_marks, enrolled_students in test_defs:
            test, created = Test.objects.get_or_create(
                title=title,
                batch=batch,
                defaults={
                    "subject": subject,
                    "date": test_date,
                    "max_marks": max_marks,
                    "syllabus": f"Chapters covered in {subject.name} up to this date",
                },
            )

            for student in enrolled_students:
                marks = round(random.uniform(max_marks * 0.45, max_marks * 0.95), 2)
                grade = "Excellent" if marks >= max_marks * 0.85 else "Good" if marks >= max_marks * 0.65 else "Average"
                Score.objects.get_or_create(
                    test=test,
                    student=student,
                    defaults={
                        "marks_obtained": marks,
                        "remarks": grade,
                    },
                )

            status = "âœ“" if created else "â†©"
            self.stdout.write(f"  {status} Test: {title[:50]}")

    # ------------------------------------------------------------------ #
    #  ATTENDANCE                                                          #
    # ------------------------------------------------------------------ #
    def _create_attendance(self, batches, students, teachers):
        from apps.performance.models import AttendanceSession, AttendanceRecord

        batch_a, batch_b = batches
        students_a = students[:5]
        students_b = students[5:]

        # Create 20 sessions for each batch in the past 30 days
        session_config = [
            (batch_a, teachers[0], students_a),
            (batch_b, teachers[1], students_b),
        ]

        for batch, teacher, enrolled_students in session_config:
            # Pick 20 unique working days in the past 30 days
            session_dates = []
            for delta in range(30, 0, -1):
                d = date.today() - timedelta(days=delta)
                if d.weekday() < 5:  # Mon-Fri only
                    session_dates.append(d)
                if len(session_dates) >= 20:
                    break

            sessions_created = 0
            for session_date in session_dates:
                session, created = AttendanceSession.objects.get_or_create(
                    batch=batch,
                    date=session_date,
                    defaults={"marked_by": teacher},
                )
                if created:
                    sessions_created += 1

                for student in enrolled_students:
                    # 85% chance present
                    status = "present" if random.random() < 0.85 else "absent"
                    AttendanceRecord.objects.get_or_create(
                        session=session,
                        student=student,
                        defaults={"status": status},
                    )

            self.stdout.write(f"  âœ“ Attendance: {batch.name} â€” {len(session_dates)} sessions")

    # ------------------------------------------------------------------ #
    #  CHAT ROOMS                                                          #
    # ------------------------------------------------------------------ #
    def _create_chat_rooms(self, teachers, students):
        from apps.chat.models import ChatRoom, Message

        teacher_physics, teacher_chem, teacher_maths = teachers
        students_a = students[:5]
        students_b = students[5:]

        # Group chat for JEE batch
        jee_room, created = ChatRoom.objects.get_or_create(
            name="JEE Batch A - General",
            defaults={"is_group": True},
        )
        if created:
            jee_room.participants.add(teacher_physics, teacher_maths, *students_a)
            Message.objects.create(room=jee_room, sender=teacher_physics, content="Welcome to JEE Batch A chat! Feel free to ask your doubts here anytime.")
            Message.objects.create(room=jee_room, sender=students_a[0], content="Thank you sir! We will definitely use this to clear our doubts.")
            Message.objects.create(room=jee_room, sender=teacher_maths, content="Remember, no doubt is too small. Ask away!")
        self.stdout.write(f"  {'âœ“' if created else 'â†©'} Chat Room: JEE Batch A - General")

        # Group chat for NEET batch
        neet_room, created = ChatRoom.objects.get_or_create(
            name="NEET Batch B - General",
            defaults={"is_group": True},
        )
        if created:
            neet_room.participants.add(teacher_chem, teacher_physics, *students_b)
            Message.objects.create(room=neet_room, sender=teacher_chem, content="Hello NEET aspirants! This is our official batch chat. Use it for quick questions.")
            Message.objects.create(room=neet_room, sender=students_b[0], content="Thank you ma'am! Can we share notes here too?")
            Message.objects.create(room=neet_room, sender=teacher_chem, content="Yes, feel free to share resources. Let's learn together!")
        self.stdout.write(f"  {'âœ“' if created else 'â†©'} Chat Room: NEET Batch B - General")

        # 1-on-1 chat between physics teacher and first student
        dm_room, created = ChatRoom.objects.get_or_create(
            name="",
            defaults={"is_group": False, "name": None},
        )
        # Only create if no 1-on-1 room exists yet
        existing_dm = ChatRoom.objects.filter(
            is_group=False,
            participants=teacher_physics,
        ).filter(participants=students_a[0]).first()

        if not existing_dm:
            dm_room = ChatRoom.objects.create(is_group=False, name=None)
            dm_room.participants.add(teacher_physics, students_a[0])
            Message.objects.create(room=dm_room, sender=students_a[0], content="Sir, I have a doubt in Laws of Motion. Newton's 3rd law application.")
            Message.objects.create(room=dm_room, sender=teacher_physics, content="Sure! Newton's 3rd law states that every action has an equal and opposite reaction. What's your specific doubt?")
            Message.objects.create(room=dm_room, sender=students_a[0], content="In a rocket launch, what is the reaction pair exactly?")
            Message.objects.create(room=dm_room, sender=teacher_physics, content="Great question! The rocket pushes exhaust gases downward (action), and the gases push the rocket upward (reaction). The pair acts on different bodies!")
            self.stdout.write(f"  âœ“ Chat Room: 1-on-1 (Rahul Sir â†” {students_a[0].first_name})")
        else:
            if created:
                dm_room.delete()  # Clean up the blank room we accidentally created
            self.stdout.write(f"  â†© Chat Room: 1-on-1 already exists")
