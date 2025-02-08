import Header from "./components/header";
import Footer from "./components/footer";
import Hero from "./components/hero";
import FeaturedDestinations from "./components/featured-destinations";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturedDestinations />
      </main>
      <Footer />
    </div>
  );
}
