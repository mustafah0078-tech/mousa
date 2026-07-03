import { useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "motion/react";
import React from "react";
import { Clock, MapPin, Calendar, Heart, Map, ChevronUp, Languages, Menu, X } from "lucide-react";
import Hero from "./components/Hero";
import RSVPForm from "./components/RSVPForm";
import AIConcierge from "./components/AIConcierge";
import AudioPlayer from "./components/AudioPlayer";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for navbar styles and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-ivory to-cream font-body text-taupe-neutral antialiased relative overflow-x-hidden"
    >
      {/* Custom Romantic Follow-Cursor */}
      <CustomCursor />

      {/* Floating Audio Soundtrack Player */}
      <AudioPlayer />

      {/* AI Wedding Concierge Butler Panel */}
      <AIConcierge lang={lang} />

      {/* 1. Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/30 via-gold to-gold/30 z-50 origin-left" style={{ transformScale: "none" }}>
        {/* Simple inline script or motion support for progress */}
        <motion.div
          className="h-full bg-gold"
          style={{
            scaleX: useScroll().scrollYProgress,
            transformOrigin: "left"
          }}
        />
      </div>

      {/* 2. Glassmorphic Transparent Navbar */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-ivory/85 backdrop-blur-md border-b border-border-neutral py-4 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Name */}
          <button
            id="nav-logo"
            onClick={() => scrollToSection("home")}
            className="font-serif text-xl md:text-2xl font-light tracking-widest text-dark-neutral hover:text-gold transition-colors duration-300 focus:outline-none"
          >
            {lang === "en" ? "Mousa ♡ Sadeen" : "موسى ♡ سدين"}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-stone-neutral">
            <button id="nav-home" onClick={() => scrollToSection("home")} className="hover:text-gold transition-colors duration-300">
              {lang === "en" ? "Home" : "الرئيسية"}
            </button>
            <button id="nav-details" onClick={() => scrollToSection("details")} className="hover:text-gold transition-colors duration-300">
              {lang === "en" ? "Details" : "التفاصيل"}
            </button>
            <button id="nav-rsvp" onClick={() => scrollToSection("rsvp-section")} className="hover:text-gold transition-colors duration-300">
              {lang === "en" ? "RSVP" : "تأكيد الحضور"}
            </button>

            {/* Language Switcher Toggle */}
            <button
              id="btn-lang-toggle"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-neutral hover:border-gold/50 bg-white/20 hover:bg-white text-gold font-semibold transition-all duration-300 focus:outline-none"
            >
              <Languages size={14} />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              id="btn-lang-toggle-mobile"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/20 bg-white/40 text-gold text-xs font-mono font-semibold focus:outline-none"
            >
              <Languages size={12} />
              <span>{lang === "en" ? "عربي" : "EN"}</span>
            </button>

            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-stone-700 hover:text-gold transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-gradient-to-br from-ivory to-cream border-b border-border-neutral p-6 flex flex-col gap-4 shadow-sm z-30 font-mono text-sm tracking-wider uppercase text-center"
            >
              <button id="mobile-nav-home" onClick={() => scrollToSection("home")} className="py-2 text-stone-neutral hover:text-gold transition-colors">
                {lang === "en" ? "Home" : "الرئيسية"}
              </button>
              <button id="mobile-nav-details" onClick={() => scrollToSection("details")} className="py-2 text-stone-neutral hover:text-gold transition-colors">
                {lang === "en" ? "Details" : "التفاصيل"}
              </button>
              <button id="mobile-nav-rsvp" onClick={() => scrollToSection("rsvp-section")} className="py-2 text-stone-neutral hover:text-gold transition-colors">
                {lang === "en" ? "RSVP" : "تأكيد الحضور"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. Hero Section (Contains Countdown, Fading Loader, Particles) */}
      <Hero lang={lang} />

      {/* 6. Romantic Quote Section */}
      <section id="quote-section" className="py-20 md:py-32 relative text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <Heart size={24} className="text-gold/30 mx-auto animate-pulse" />
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5 }}
            className="font-serif text-2xl md:text-4xl text-dark-neutral leading-relaxed font-light italic tracking-wide"
          >
            {lang === "en"
              ? "“May Allah bless you both and join you in goodness.”"
              : "«بارك الله لهما وجمع بينهما في خير»"}
          </motion.p>
          <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-6" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-stone-neutral block mt-2">
            Mousa & Sadeen
          </span>
        </div>
      </section>

      {/* 7. Wedding Details Section (Timing, Venue, dress code, parking) */}
      <section id="details" className="py-16 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-stone-neutral font-mono block mb-2"
          >
            {lang === "en" ? "Celebration Details" : "تفاصيل الحفل والمراسم"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-dark-neutral tracking-wide font-light"
          >
            {lang === "en" ? "Where & When" : "الزمان والمكان"}
          </motion.h2>
          <div className="w-16 h-[1px] bg-gold/30 mx-auto mt-4" />
        </div>

        {/* Details Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Time and Date */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-md border border-border-neutral p-8 rounded-3xl hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-500 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group relative overflow-hidden"
          >
            <div className="flex gap-4 items-start">
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 text-gold">
                <Clock size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-dark-neutral font-light font-semibold">
                  {lang === "en" ? "The Sacred Timings" : "توقيت المراسم"}
                </h3>
                <p className="font-body text-base md:text-lg text-taupe-neutral leading-relaxed">
                  {lang === "en" ? (
                    <>
                      <strong>Groom's Zaffeh:</strong> 5:30 PM <br />
                      <strong className="block mt-2">Main Ceremony & Reception:</strong> 8:00 PM <br />
                    </>
                  ) : (
                    <>
                      <strong>زفة العريس:</strong><br />
                      الساعة ٥:٣٠ مساءً<br />
                      <strong className="block mt-2">مراسم الاستقبال والزفاف:</strong><br />
                      الساعة ٨:٠٠ مساءً
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Venue and Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="bg-white/40 backdrop-blur-md border border-border-neutral p-8 rounded-3xl hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-500 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group relative overflow-hidden"
          >
            <div className="flex gap-4 items-start">
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 text-gold">
                <MapPin size={24} />
              </div>
              <div className="space-y-3 w-full">
                <h3 className="font-serif text-xl text-dark-neutral font-light font-semibold">
                  {lang === "en" ? "The Gorgeous Venue" : "الموقع وقاعة الفرح"}
                </h3>
                <p className="font-body text-base md:text-lg text-taupe-neutral leading-relaxed">
                  {lang === "en" ? (
                    <>
                      <strong>Grand Views Estate</strong> <br />
                      Airport Road <br />
                      Amman, Jordan.
                    </>
                  ) : (
                    <>
                      <strong>مزرعة وقاعات Grand Views</strong> <br />
                      طريق المطار، عمان، الأردن.
                    </>
                  )}
                </p>
                <div className="pt-2">
                  <a
                    id="link-google-maps"
                    href="https://maps.google.com/?q=Amman+Airport+Road"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold hover:bg-gold hover:text-white bg-transparent rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-sm cursor-none"
                  >
                    <Map size={12} />
                    <span>{lang === "en" ? "Navigate to Venue" : "عرض الموقع على الخريطة"}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 8. Luxury Glass RSVP Form */}
      <RSVPForm lang={lang} />

      {/* 10. Footers */}
      <footer className="bg-gradient-to-b from-cream to-ivory border-t border-border-neutral py-16 text-center text-stone-neutral relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <span className="font-serif text-2xl text-gold block">With Love ♡</span>
          <h4 className="font-serif text-3xl text-dark-neutral font-light tracking-widest italic">
            {lang === "en" ? "Mousa & Sadeen" : "موسى و سدين"}
          </h4>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sand-neutral">
            {lang === "en" ? "Friday, July 17, 2026 • Amman, Jordan" : "الجمعة، ١٧ تموز ٢٠٢٦ • عمان، الأردن"}
          </p>
          <div className="text-[10px] text-stone-neutral font-mono mt-8">
            © 2026 Mousa & Sadeen. All Rights Reserved. Crafted with absolute elegance.
          </div>
        </div>
      </footer>

      {/* 11. Luxury Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="btn-scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 bg-white/40 border border-border-neutral hover:border-gold text-gold hover:text-white hover:bg-gold p-3 rounded-full shadow-sm transition-all duration-300 focus:outline-none cursor-none"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
