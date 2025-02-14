import React, { useState, useEffect, useRef } from "react";
import { NavBar } from "../common/NavBar";
import { HeroImage } from "./HeroImage";
import { HeroContent } from "./HeroContent";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import { useUser } from "@clerk/clerk-react";
import landing_background from "../../assets/landing_background.png";
import { CardDefault } from "./cards/verticalcard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample Card Data
const items = [
  {
    title: "Streamline Your Workflow",
    subtitle: "Optimize and automate your business processes effortlessly.",
    image: "",
  },
  {
    title: "AI-Powered Insights",
    subtitle: "Leverage artificial intelligence to make data-driven decisions.",
    image: "",
  },
  {
    title: "Secure Digital Agreements",
    subtitle: "Sign, store, and manage contracts with industry-leading security.",
    image: "",
  },
  {
    title: "Seamless Collaboration",
    subtitle: "Work together in real-time with built-in team management tools.",
    image: "",
  },
  {
    title: "Effortless Document Management",
    subtitle: "Upload, organize, and retrieve files instantly from anywhere.",
    image: "",
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const user = useUser().user;

  const [showMain, setShowMain] = useState(true);
  const [showRoller, setShowRoller] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-50% 0px -10%" });

  const scrollRef = useRef(null); // 🔹 Moved out of useEffect

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = headerHeight * 0.5;

      if (scrollY <= threshold) {
        setHeaderOpacity(1 - scrollY / threshold);
      } else {
        setHeaderOpacity(0);
      }

      if (scrollY > 100) {
        setShowMain(false);
        setShowRoller(true);
      } else {
        setShowMain(true);
        setShowRoller(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // 🔹 Fixed Scroll Function
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Adjust scroll step
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="flex flex-col pt-10 py-10 px-10 w-screen min-h-screen max-md:px-5 max-md:max-w-full bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${landing_background})` }}
    >
      <NavBar
        siteName="signEase"
        navItems={[
          { text: "Login", onClick: () => navigate("/login"), ariaLabel: "login" },
          { text: "About", onClick: () => navigate("/about"), ariaLabel: "about" },
        ]}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md"
      />

      <header
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className={`flex flex-wrap gap-10 mt-5 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl ${
          showRoller ? "opacity-0 transition-opacity duration-1000" : "opacity-100"
        }`}
      >
        <HeroImage src="/hero_image.png" alt="hero_image" />
        <HeroContent title="Manage Your Business Faster" subtitle="Understand and make deals with AI" titleId="hero-title" />
      </header>

      <main className="mt-40 flex justify-center flex-col h-screen">
        <div ref={textRef} className="opacity-1 flex text-center justify-center">
          <h1 className="text-4xl font-bold">
            {"What you can expect".split("").map((word, index) => (
              <motion.span
                key={index}
                className="mr-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isTextInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Carousel with Arrows */}
        <div className="w-screen flex justify-center relative">
          {/* Left Arrow */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Card Container */}
          <div
            ref={scrollRef}
            className="h-[60vh] w-[70vw] mt-6 flex flex-row gap-8 border rounded-2xl p-6 overflow-x-auto 
                   justify-start items-center scrollbar-hide snap-x scroll-smooth"
          >
            {items.map(({ title, subtitle, image }, index) => (
              <div key={index} className="flex-shrink-0">
                <CardDefault Title={title} SubTitle={subtitle} Image={image} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10"
            onClick={() => scroll("right")}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </main>

      <footer>
        <h2>Facing trouble with login?</h2>
        <form></form>
      </footer>
    </div>
  );
};
