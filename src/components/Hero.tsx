import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Calendar, MapPin, ChevronDown } from "lucide-react";
import bgImage from "../assets/images/engaged_hands_ring_1783080851927.jpg";

interface HeroProps {
  lang: "en" | "ar";
}

export default function Hero({ lang }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Target date: July 17, 2026 at 8:00 PM
  const TARGET_DATE = new Date("2026-07-17T20:00:00").getTime();

  useEffect(() => {
    // Initial preloader duration (2.2s for beautiful suspense)
    const loaderTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => {
      clearTimeout(loaderTimer);
      clearInterval(interval);
    };
  }, []);

  // Generate very subtle floating petals/leaves inside hero
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 1.5,
    duration: 12 + Math.random() * 8,
    left: `${Math.random() * 100}%`,
    size: 6 + Math.random() * 8,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ivory to-cream select-none">
      {/* Background Image with Ken Burns Effect */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <img
          src={bgImage}
          alt="Engagement Ring"
          className="w-full h-full object-cover opacity-90 blur-sm"
        />
        {/* Subtle dark ivory/golden overlay for perfect readability (30-40% opacity) */}
        <div className="absolute inset-0 bg-[#3a3024] opacity-35 mix-blend-multiply" />
      </motion.div>

      {/* 1. Preloader Screen with Gold Paper Relief Style */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            id="wedding-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 bg-gradient-to-br from-ivory to-cream z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Elegant Calligraphy-style flower outlines */}
            <div className="absolute top-0 inset-x-0 h-40 opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.3),transparent)]" />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-gold block">
                {lang === "en" ? "Mousa & Sadeen" : "موسى و سدين"}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-dark-neutral font-light tracking-widest italic">
                {lang === "en" ? "The Invitation" : "دعوة زفاف ملوكية"}
              </h1>
              <div className="w-16 h-[1px] bg-gold/40 mx-auto" />
              <span className="font-body text-base text-stone-neutral block italic">
                {lang === "en" ? "Please wait for the cinematic experience..." : "انتظر اللحظة الساحرة..."}
              </span>
            </motion.div>

            <div className="absolute bottom-0 inset-x-0 h-40 opacity-20 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.3),transparent)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative clean minimalist orbs & points */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold opacity-[0.03] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold opacity-[0.05] blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-gold rounded-full opacity-40"></div>
        <div className="absolute top-2/3 right-10 w-1 h-1 bg-gold rounded-full opacity-60"></div>
      </div>

      {/* 2. Floating Golden Particles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute bg-gold rounded-full blur-[1px]"
            style={{
              left: petal.left,
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              opacity: petal.opacity * 0.5, // slightly more subtle for Clean Minimalism
              top: "-5%",
              animation: `fall ${petal.duration}s linear infinite`,
              animationDelay: `${petal.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3. Slow Animated Ambient Light Orb */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-slow-light pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-slow-light pointer-events-none" style={{ animationDelay: "5s" }} />

      {/* 4. Main Hero Storytelling Elements */}
      <div className="relative z-10 text-center max-w-4xl px-6 py-20 flex flex-col items-center justify-center flex-1">
        
        {/* Entrance text block */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="text-xs uppercase tracking-[0.4em] text-stone-neutral font-mono block mb-4"
        >
          {lang === "en" ? "Together Forever" : "معاً إلى الأبد"}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.6 }}
          className="font-serif text-xs uppercase tracking-[0.5em] text-sand-neutral mb-6 block text-center"
        >
          {lang === "en" ? "The Wedding Celebration of" : "مراسم فرح الزفاف الأنيق لكل من"}
        </motion.h1>

        {/* Big Romantic Calligraphy Names */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 my-6">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 2.8 }}
            className="font-serif text-5xl md:text-7xl text-dark-neutral font-light tracking-wide hover:text-gold transition-colors duration-500"
          >
            {lang === "en" ? "Mousa" : "موسى"}
          </motion.h2>
          
          <div className="flex items-center justify-center py-4">
            <div className="h-[1px] w-12 bg-gold/40"></div>
            <span className="px-4 text-[24px] text-gold font-serif">♡</span>
            <div className="h-[1px] w-12 bg-gold/40"></div>
          </div>

          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 3.0 }}
            className="font-serif text-5xl md:text-7xl text-dark-neutral font-light tracking-wide hover:text-gold transition-colors duration-500"
          >
            {lang === "en" ? "Sadeen" : "سدين"}
          </motion.h2>
        </div>

        {/* Date and Location Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center my-6 text-taupe-neutral bg-white/30 border border-border-neutral backdrop-blur-md px-6 py-3 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.02)] text-sm tracking-widest uppercase font-light"
        >
          <span className="flex items-center gap-2 font-mono">
            <Calendar className="text-gold" size={14} />
            <span>{lang === "en" ? "Friday, July 17, 2026" : "الجمعة، ١٧ تموز ٢٠٢٦"}</span>
          </span>
          <span className="hidden sm:inline w-[1px] h-4 bg-border-neutral" />
          <span className="flex items-center gap-2 font-mono">
            <MapPin className="text-gold" size={14} />
            <span>{lang === "en" ? "Grand Views, Amman" : "مزرعة Grand Views، عمان"}</span>
          </span>
        </motion.div>

        {/* Premium Countdown Clock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.6 }}
          className="flex justify-center gap-6 max-w-xl mx-auto my-8"
        >
          {[
            { value: timeLeft.days, labelEn: "Days", labelAr: "أيام" },
            { value: timeLeft.hours, labelEn: "Hours", labelAr: "ساعات" },
            { value: timeLeft.minutes, labelEn: "Mins", labelAr: "دقائق" }
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <div className="text-gold opacity-40 pt-1 px-3 text-lg">:</div>}
              <div
                className="relative flex flex-col items-center justify-center bg-white/20 backdrop-blur-md border border-border-neutral hover:border-gold/50 rounded-2xl p-3 sm:p-5 w-20 sm:w-28 transition-all duration-300"
              >
                <span className="font-serif text-2xl sm:text-4xl text-gold font-light block">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-sand-neutral mt-1">
                  {lang === "en" ? item.labelEn : item.labelAr}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-none"
        onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-stone-neutral">
          {lang === "en" ? "View Details" : "التفاصيل"}
        </span>
        <ChevronDown className="text-gold animate-bounce mt-1" size={16} />
      </motion.div>

      {/* Embedded falling animation in style */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
          }
          100% {
            transform: translateY(110vh) rotate(360deg) translateX(50px);
          }
        }
      `}</style>
    </div>
  );
}
