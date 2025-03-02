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
import VarticalCard from "./cards/horizontalcard";
// Sample Card Data
const items = [
  {
    title: "Streamline Your Workflow",
    subtitle: "Optimize and automate your business processes effortlessly.",
    image: "/automate_business.png",
    text: "Enhance efficiency by automating repetitive tasks, reducing manual effort, and improving overall productivity."
  },
  {
    title: "AI-Powered Insights",
    subtitle: "Leverage artificial intelligence to make data-driven decisions.",
    image: "/ai_insights.png",
    text: "Utilize AI-driven analytics to uncover trends, predict outcomes, and make smarter business decisions with confidence."
  },
  {
    title: "Secure Digital Agreements",
    subtitle: "Sign, store, and manage contracts with industry-leading security.",
    image: "/secure.png",
    text: "Ensure the authenticity and safety of your agreements with encrypted e-signatures and secure cloud storage."
  },
  {
    title: "Seamless Collaboration",
    subtitle: "Work together in real-time with built-in team management tools.",
    image: "/togather.png",
    text: "Faster teamwork with real-time editing, shared workspaces, and communication tools to enhance productivity."
  },
  {
    title: "Effortless Document Management",
    subtitle: "Upload, organize, and retrieve files instantly from anywhere.",
    image: "/effortless.png",
    text: "Access and manage your documents easily with an intuitive system that ensures organization and quick retrieval."
  }
];


export const LandingPage = () => {
  const navigate = useNavigate();
  const user = useUser().user;
  const [showVerticalCard, setShowVerticalCard] = useState(false);
  const [showRoller, setShowRoller] = useState(false);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: false, margin: "-50% 0px -10%" });

  const scrollRef = useRef(null);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [footerOpacity, setFooterOpacity] = useState(0);

  const sectionRefs = {
    hero: useRef(null),
    main: useRef(null),
    footer: useRef(null),
  };

  const scrollToSection = (section) => {
    sectionRefs[section].current.scrollIntoView({ behavior: "smooth" });
  };

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
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (title, subtitle,text, event) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    console.log(rect);
    setSelectedCard({
      title,
      subtitle,
      text
    });
    setShowVerticalCard( !showVerticalCard);
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
          { text: "about", onClick: () => scrollToSection("main"), ariaLabel: "about" },
          { text: "contact", onClick: () => scrollToSection("footer"), ariaLabel: "contact" },
          { text: "Login", onClick: () => navigate("/login"), ariaLabel: "login" },
        ]}
        className="sticky top-0 z-9999 bg-white/80 backdrop-blur-md shadow-md"
      />

      {/* Hero Section */}
      <header
        ref={sectionRefs.hero}
        style={{ opacity: headerOpacity, transition: "opacity 0.5s ease-in-out" }}
        className={`flex flex-wrap gap-10 mt-5 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl ${
          showRoller ? "opacity-0" : "opacity-100"
        }`}
      >
        <HeroImage src="/hero_image.png" alt="hero_image" />
        <HeroContent title="Manage Your Business Faster" subtitle="Understand and make deals with AI" titleId="hero-title" />
      </header>

      {/* Main Content */}
      <main
        ref={sectionRefs.main}
        aria-label="main"
        className="mt-40 flex justify-center flex-col h-screen w-screen max-md:mt-20 max-md:w-full"
      >
        <motion.div ref={textRef}   className="opacity-1 flex text-center justify-center max-md:flex-col">
          <h1 className="text-4xl font-bold max-md:text-2xl">
            {"What you can expect".split('').map((word, index) => (
              <motion.span   key={index}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              style={word === " " ? { marginRight: "0.25em" } : {}}
              animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}>
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Carousel with Arrows */}
 
        <div className="  flex  justify-center relative">
          {/* Left Arrow */}
          <button
            className="absolute left-36 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10
                   md:left-36 md:top-1/2 md:transform md:-translate-y-1/2
                   max-md:left-5  max-md:transform-none"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft size={20} />
          </button>
            {/*  Cards */}
            <div
            ref={scrollRef}
      className="h-[70vh] w-[80vw] mt-6 flex flex-row gap-8 border rounded-2xl p-6 overflow-x-auto 
               justify-start items-center scrollbar-hide snap-x scroll-smooth"
               style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
    >
      {items.map(({ title, subtitle, image,text }, index) => (
        <div key={index} className="flex-shrink-0">
          <div onClick={(e) => handleCardClick(title, subtitle,text, e)}>
            <CardDefault Title={title} SubTitle={subtitle} Image={image} />
          </div>
        </div>
      ))}

      {showVerticalCard && selectedCard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: selectedCard.x, y: selectedCard.y }}
          animate={{ opacity: 1, scale: 1, x: selectedCard.x, y: selectedCard.y + 20 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute z-50      rounded-xl shadow-lg "
        >
          <VarticalCard Title={selectedCard.title} subtitle={selectedCard.subtitle} text={selectedCard.text} />
        </motion.div>
      )}
    </div>
      
          {/* Right Arrow */}
          <button
            className="absolute right-36 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 text-white rounded-full shadow-md 
                   hover:bg-gray-800 transition-all duration-300 z-10
                   md:right-36 md:top-1/2 md:transform md:-translate-y-1/2
                   max-md:right-5 max-md:transform-none"
            onClick={() => scroll("right")}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </main>
      {/* Footer */}
      <footer
        ref={sectionRefs.footer}
        style={{ opacity: footerOpacity, transition: "opacity 0.5s ease-in-out" }}
        className="bg-gray-800 text-white py-12 px-6 mt-10 max-md:py-6 max-md:px-3"
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
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-row sm:flex-row justify-between items-center text-gray-400">
        <div className="flex gap-4 mt-4 md:mt-0 max-md:flex-col max-md:items-center">
          <a href="#" className="hover:text-blue-500 max-md:mb-2">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-blue-500 max-md:mb-2">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-blue-500 max-md:mb-2">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="hover:text-blue-500 max-md:mb-2">
            <FaYoutube size={24} />
          </a>
        </div>
        <p className="text-gray-400 max-md:mt-4"> 2023 SignEase. All rights reserved.</p>
      </div>
      </footer>
    </div>
  );
};
