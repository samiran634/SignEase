import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import { useUser } from "@clerk/clerk-react";
import landing_background from "../../assets/landing_background.png";
import { NavBar } from "../common/NavBar";
import { HeroImage } from "./HeroImage";
import { HeroContent } from "./HeroContent";
import { CardDefault } from "./cards/verticalcard";
import { FaChevronLeft, FaChevronRight, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// Sample Card Data
const items = [
  { title: "Streamline Your Workflow", subtitle: "Optimize and automate your business processes effortlessly.", image: "/automate_business.png" },
  { title: "AI-Powered Insights", subtitle: "Leverage artificial intelligence to make data-driven decisions.", image: "/ai_insights.png" },
  { title: "Secure Digital Agreements", subtitle: "Sign, store, and manage contracts with industry-leading security.", image: "/secure.png" },
  { title: "Seamless Collaboration", subtitle: "Work together in real-time with built-in team management tools.", image: "/togather.png" },
  { title: "Effortless Document Management", subtitle: "Upload, organize, and retrieve files instantly from anywhere.", image: "/effortless.png" },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const user = useUser().user;

  const [showRoller, setShowRoller] = useState(false);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-50% 0px -10%" });

  const scrollRef = useRef(null);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [footerOpacity, setFooterOpacity] = useState(0);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight || 100;
      const footerHeight = footerRef.current?.offsetHeight || 200;

      // Adjust Header Opacity
      setHeaderOpacity(Math.max(1 - scrollY / (headerHeight * 0.7), 0));

      // Adjust Footer Opacity (Appears on Scroll Down)
      const documentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      const footerVisiblePoint = documentHeight - viewportHeight - footerHeight * 0.5;
      setFooterOpacity(scrollY >= footerVisiblePoint ? 1 : scrollY / footerVisiblePoint);

      // Show/hide roller effect
      setShowRoller(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smooth: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="flex flex-col pt-10 py-10 px-10 w-screen min-h-screen max-md:px-5 max-md:max-w-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${landing_background})` }}
    >
      {/* Navbar */}
      <NavBar
        siteName="signEase"
        navItems={[
          { text: "Login", onClick: () => navigate("/login"), ariaLabel: "login" },
          { text: "About", onClick: () => navigate("/about"), ariaLabel: "about" },
          { text: "Contact", onClick: () => navigate("/contact"), ariaLabel: "contact" }
        ]}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md"
      />

      {/* Hero Section */}
      <header
        ref={headerRef}
        style={{ opacity: headerOpacity, transition: "opacity 0.5s ease-in-out" }}
        className={`flex flex-wrap gap-10 mt-5 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl ${
          showRoller ? "opacity-0" : "opacity-100"
        }`}
      >
        <HeroImage src="/hero_image.png" alt="hero_image" />
        <HeroContent title="Manage Your Business Faster" subtitle="Understand and make deals with AI" titleId="hero-title" />
      </header>

      {/* Main Content */}
      <main className="mt-40 flex justify-center flex-col h-screen w-screen">
        <div ref={textRef} className="opacity-1 flex text-center justify-center">
          <h1 className="text-4xl font-bold">
            {"What you can expect".split("").map((word, index) => (
              <motion.span
                key={index}
                className="mr-2 mt-4"
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
 
        <div className="  flex  justify-center relative">
          {/* Left Arrow */}
          <button
            className="absolute left-36 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Card Container */}
          <div
            ref={scrollRef}
            className="h-[70vh] w-[80vw] mt-6 flex flex-row gap-8 border rounded-2xl p-6 overflow-x-auto 
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
            className="absolute right-36 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10"
            onClick={() => scroll("right")}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </main>
      {/* Footer */}
      <footer
        ref={footerRef}
        style={{ opacity: footerOpacity, transition: "opacity 0.5s ease-in-out" }}
        className="bg-gray-800 text-white py-12 px-6 mt-10"
      >
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Video Tutorial */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Facing trouble creating an account?</h2>
          <p className="text-gray-300 mb-4">Watch this quick tutorial to get started.</p>
          <div className="relative w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-48 rounded-lg"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Tutorial Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-4">We're here to help! Fill out the form below.</p>
          <form className="bg-gray-800 p-6 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mb-3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full mb-3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full mb-3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom: Social Links */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400">
        <p>© {new Date().getFullYear()} SignEase. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-500">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="hover:text-red-600">
            <FaYoutube size={24} />
          </a>
        </div>
      </div>
      </footer>
    </div>
  );
};
