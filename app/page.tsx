import BookingForm from "@/components/BookingForm";
import {
  Nav,
  Hero,
  Services,
  About,
  Process,
  BookSection,
  Faq,
  Footer,
  WhatsAppFAB,
} from "@/components/Sections";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <BookSection>
          <BookingForm />
        </BookSection>
        <Faq />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
