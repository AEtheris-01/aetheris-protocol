import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Statistics */}
      <Stats />

      {/* Features */}
      <Features />

      {/* Footer */}
      <Footer />
    </main>
  );
}