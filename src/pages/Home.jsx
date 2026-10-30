import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import ImpactStats from "../components/home/ImpactStats";
import UniversityPartners from "../components/home/UniversityPartners";
import StudyDestinations from "../components/home/StudyDestinations";
import ServicesPreview from "../components/home/ServicesPreview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import StudyFinancingPartners from "../components/home/StudyFinancingPartners";
import StudentTestimonials from "../components/home/StudentTestimonials";
import ClosingCTA from "../components/home/ClosingCTA";
import Footer from "../components/home/Footer";
import CustomCursor from "../components/common/CustomCursor";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar logoSrc="/images/logo.png" />
      <CustomCursor />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-white"
      >
        {/* Your hero will go here on a pure white background. */}
        <Hero  videoSrc="/videos/hero.mp4"/>
        <ImpactStats />
        <UniversityPartners />
        <StudyDestinations />
        <ServicesPreview />
        <WhyChooseUs />
        <StudyFinancingPartners />
        <StudentTestimonials />
        <ClosingCTA />
        <Footer />
      </main>
    </div>
  );
}