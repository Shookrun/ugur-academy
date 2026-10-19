import CourseSection from "@/components/ui/CourseSection";
import GallerySection from "@/components/ui/GallerySection";
import Hero from "@/components/ui/Hero";
import PartnersSection from "@/components/ui/PartnersSections";
import WhatsappBanner from "@/components/ui/WhatsappBanner";

export default function Home() {
  return (
    <div>
      <Hero />

      <WhatsappBanner />

      <CourseSection />

      <GallerySection />

      <PartnersSection />
    </div>
  );
}