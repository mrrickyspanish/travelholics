import Hero from '@/components/Hero';
// Main landing page
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
