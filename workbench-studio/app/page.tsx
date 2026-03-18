"use client";

import About from "@/components/about";
import Ethos from "@/components/ethos";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero";
import Process from "@/components/process";
import Card from "@/components/ui/card";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="max-w-165 mx-auto px-6">
        <Header />
        <HeroSection />
        <section
          className="py-10 flex flex-col gap-3 fade-up"
          style={{
            animationDelay: "120ms",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            className="text-xs tracking-widest font-medium"
            style={{ color: "var(--muted)" }}
          >
            the products
          </p>
          <Card />
        </section>
        <Ethos />
        <Process />
        <About />
        <Footer />
      </div>
    </main>
  );
}
