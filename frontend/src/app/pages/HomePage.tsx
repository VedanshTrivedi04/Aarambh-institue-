import { HeroSection } from "../components/HeroSection";
import { Ticker } from "../components/Ticker";
import { AboutSection } from "../components/AboutSection";
import { InstituteGallery } from "../components/InstituteGallery";
import { CoursesSection } from "../components/CoursesSection";
import { FacultySection } from "../components/FacultySection";
import { AchievementsSection } from "../components/AchievementsSection";
import { Testimonials } from "../components/Testimonials";
import { ContactSection } from "../components/ContactSection";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection />
      <Ticker />
      <AboutSection />
      <InstituteGallery />
      <CoursesSection showViewAll onViewAll={() => { navigate("/courses"); window.scrollTo({ top: 0 }); }} />
      <FacultySection showViewAll onViewAll={() => { navigate("/faculty"); window.scrollTo({ top: 0 }); }} />
      <AchievementsSection showViewAll onViewAll={() => { navigate("/results"); window.scrollTo({ top: 0 }); }} />
      <Testimonials />
      <ContactSection />
    </>
  );
}
