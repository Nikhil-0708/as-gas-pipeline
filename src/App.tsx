import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Wrench, 
  Flame, 
  Droplets, 
  Building2, 
  Search,
  Star,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Mail,
  Shield,
  ExternalLink,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateReview, fetchReviewsFromSheet, Review, sortReviews, submitReviewToSheet } from './services/reviewService';

// --- Helper Functions ---

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  fetch("/", {
    method: "POST",
    body: formData
  })
  .then(() => {
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const message = formData.get("message");

    const whatsappMessage = `
New Service Request

Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}
`;
    const whatsappURL = `https://wa.me/918688286504?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank");
    form.reset();
  })
  .catch((error) => alert("Form submission failed"));
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector("header");
      const offset = header ? (header as HTMLElement).offsetHeight : 70;
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Projects', id: 'projects' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="AS Gas Pipeline Logo" 
            className="h-12 md:h-14 w-auto object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              const textLogo = e.currentTarget.nextElementSibling as HTMLElement;
              if (textLogo) textLogo.style.display = 'block';
            }}
          />
          <span className={`text-2xl font-bold ml-2 ${isScrolled ? 'text-primary' : 'text-white'}`} style={{ display: 'none' }}>
            AS Gas Pipeline
          </span>
          {/* If the image is empty or missing, we still want the text logo as a fallback */}
          <noscript>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
              AS Gas Pipeline
            </span>
          </noscript>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)}
              className={`menu-item font-medium transition-colors cursor-pointer ${isScrolled ? 'text-gray-700 hover:text-accent' : 'text-white/90 hover:text-white'}`}
            >
              {link.name}
            </button>
          ))}
          <a href="tel:8688286504" className="bg-accent text-primary px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <Phone size={18} />
            Call Now
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={isScrolled ? 'text-primary' : 'text-white'}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  className="mobile-link block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      scrollToSection(link.id);
                    }, 50);
                  }}
                >
                  {link.name}
                </button>
              ))}
              <a href="tel:8688286504" className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-md font-bold">
                <Phone size={18} />
                Call Now: 8688286504
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/work1.jpg" 
          alt="Gas Pipeline Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase mb-4 border border-accent/30">
              Trusted Service in Hyderabad
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Professional Gas Pipeline <br />
              <span className="text-accent">Installation in Hyderabad</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              AS Gas Pipeline is a trusted gas pipeline installation service in Hyderabad specializing in LPG gas pipeline installation, copper pipe fitting, and gas leak repair services. Safe, affordable, and high-quality installation for homes & businesses with 5 years warranty.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="tel:8688286504" className="bg-accent text-primary px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 hover:bg-white transition-colors shadow-lg">
                <Phone size={20} />
                Call: 8688286504
              </a>
            </div>

            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-accent" />
                <span>5 Years Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-accent" />
                <span>Certified Experts</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-auto lg:ml-auto"
          >
            <h3 className="text-2xl font-bold text-primary mb-2">Get Free Quote</h3>
            <p className="text-gray-600 mb-6">Fast response guaranteed within 30 mins.</p>
            
            <form 
              name="quote-form" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="quote-form" />
              <div className="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Enter your name" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="Enter phone number" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (optional)</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea 
                  name="message"
                  rows={2}
                  placeholder="Your requirement..." 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-secondary transition-colors shadow-md">
                Get Free Quote
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      src: "/videos/video1.mp4",
      poster: "/images/work5.jpg",
      title: "Copper Pipe Fitting in Kitchen",
      desc: "Professional precision fitting for modern kitchens."
    },
    {
      id: 2,
      src: "/videos/video2.mp4",
      poster: "/images/work6.jpg",
      title: "Gas Pipeline Installation Process",
      desc: "Step-by-step safe installation by our certified team."
    }
  ];

  const openVideo = (src: string) => {
    setActiveVideo(src);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Watch Our Real Gas Pipeline Work</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <motion.div 
              key={video.id}
              whileHover={{ y: -10 }}
              className="bg-background rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
              onClick={() => openVideo(video.src)}
            >
              <div className="video-thumb">
                <img 
                  src={video.poster} 
                  alt={video.title} 
                  loading="lazy"
                  className="thumb-img opacity-90 group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="play-btn">▶</div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-primary">{video.title}</h4>
                <p className="text-gray-600 mt-2">{video.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="video-modal" 
            onClick={closeVideo}
          >
            <div className="video-container" onClick={(e) => e.stopPropagation()}>
              <video
                key={activeVideo}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={videos.find(v => v.src === activeVideo)?.poster || "/images/work5.jpg"}
                className="modal-video"
              >
                <source src={activeVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const TrustIndicators = () => {
  const stats = [
    { label: 'Projects Completed', value: '2000+', icon: <CheckCircle2 className="text-accent" /> },
    { label: 'Years Warranty', value: '5 Years', icon: <ShieldCheck className="text-accent" /> },
    { label: 'Open 24 Hours', value: '24/7', icon: <Clock className="text-accent" /> },
    { label: 'Affordable Pricing', value: 'Best Rates', icon: <Flame className="text-accent" /> },
  ];

  return (
    <section className="py-12 bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center flex flex-col items-center">
              <div className="mb-3 p-3 bg-white/10 rounded-full">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-white/60 font-medium border-t border-white/10 pt-8">
          Serving All Hyderabad & Secunderabad
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);

  const services = [
    {
      title: 'Gas Pipeline Installation',
      desc: 'Complete domestic gas pipeline installation in Hyderabad with high-quality materials and safety checks.',
      details: 'We provide end-to-end gas pipeline installation for residential properties in Hyderabad. Our process ensures maximum safety and compliance with industry standards.',
      benefits: [
        'Safe pipeline installation for homes',
        'High quality copper pipes',
        'Leak proof testing',
        'Professional technicians',
        '5 year warranty'
      ],
      icon: <Flame size={32} />,
      img: '/images/work2.jpg'
    },
    {
      title: 'Copper Pipe Fitting',
      desc: 'Premium copper pipe gas fitting Hyderabad for kitchens, ensuring durability and leak-proof performance.',
      details: 'Copper is the gold standard for gas pipelines due to its durability and safety profile. We specialize in precision copper fitting for modern kitchens in Hyderabad.',
      benefits: [
        'Premium copper material',
        'Long lasting durability',
        'Clean kitchen finish',
        'Proper gas flow pressure'
      ],
      icon: <Wrench size={32} />,
      img: '/images/work3.jpg'
    },
    {
      title: 'Gas Leak Repair',
      desc: 'Emergency gas leak repair Hyderabad and detection services available 24/7 across the city.',
      details: 'Gas leaks are serious emergencies. Our rapid response team in Hyderabad uses advanced detection tools to locate and fix leaks immediately.',
      benefits: [
        'Emergency repair service',
        'Leak detection tools',
        'Quick response',
        'Safety inspection included'
      ],
      icon: <ShieldCheck size={32} />,
      img: '/images/work4.jpg'
    },
    {
      title: 'LPG Connection Setup',
      desc: 'Safe and efficient LPG gas pipeline installation Hyderabad for residential apartments and homes.',
      details: 'Setting up a new LPG connection requires expert handling of regulators and valves. We ensure your kitchen in Hyderabad is ready for safe cooking.',
      benefits: [
        'Cylinder connection setup',
        'Safe regulator fitting',
        'Kitchen pipeline routing'
      ],
      icon: <Droplets size={32} />,
      img: '/images/work5.jpg'
    },
    {
      title: 'Commercial Gas Pipeline',
      desc: 'Heavy-duty gas pipeline service in Hyderabad for restaurants, hotels, and commercial kitchens.',
      details: 'Commercial kitchens have high demand and strict safety requirements. We design and install high-pressure systems for the hospitality industry in Hyderabad.',
      benefits: [
        'Suitable for restaurants',
        'High pressure pipeline',
        'Industrial grade fittings'
      ],
      icon: <Building2 size={32} />,
      img: '/images/work7.jpg'
    },
    {
      title: 'Maintenance & Inspection',
      desc: 'Regular maintenance and safety inspection for your gas pipeline service in Hyderabad to ensure safety.',
      details: 'Prevention is better than cure. Our routine inspections in Hyderabad identify potential issues before they become dangerous or expensive problems.',
      benefits: [
        'Routine safety checks',
        'Gas pressure testing',
        'Prevent leakage risk'
      ],
      icon: <Search size={32} />,
      img: '/images/work6.jpg'
    },
  ];

  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Professional Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide a wide range of gas installation and maintenance services with a focus on safety and quality.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              {service.img && (
                <div className="mb-6 rounded-xl overflow-hidden h-40">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="w-16 h-16 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              <button 
                onClick={() => setSelectedService(service)}
                className="inline-flex items-center gap-2 mt-6 text-accent font-bold hover:gap-3 transition-all cursor-pointer"
              >
                Learn More <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-primary hover:text-white transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="h-48 sm:h-64 relative">
                <img 
                  src={selectedService.img} 
                  alt={selectedService.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">{selectedService.title}</h3>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {selectedService.details}
                </p>
                
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-accent" />
                  Key Benefits:
                </h4>
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  {selectedService.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <div className="mt-1 w-1.5 h-1.5 bg-accent rounded-full shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                  <a href="tel:8688286504" className="flex-1 min-w-[140px] bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-md">
                    <Phone size={20} />
                    Call Now
                  </a>
                  <a 
                    href="https://wa.me/918688286504?text=I%20want%20more%20information%20about%20gas%20pipeline%20service" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-md"
                  >
                    <MessageCircle size={20} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Gallery = () => {
  const images = [
    { src: '/images/work1.jpg', category: 'Modern Kitchen Setup' },
    { src: '/images/work2.jpg', category: 'Professional Installation' },
    { src: '/images/work3.jpg', category: 'Copper Fitting Work' },
    { src: '/images/work4.jpg', category: 'Safety Inspection' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Work Gallery</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-md"
            >
              <img 
                src={img.src} 
                alt={img.category} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-lg">{img.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Featured Project</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We recently completed a complex domestic gas pipeline installation in a high-rise apartment complex. This project involved precision copper pipe fitting and integrated safety systems.
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-primary mb-2">Project Details:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-accent" /> Location: Banjara Hills</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-accent" /> Type: Domestic Copper Fitting</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-accent" /> Status: 100% Completed</li>
              </ul>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video"
          >
            <img 
              src="/images/work7.jpg" 
              alt="Featured Project" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-accent text-primary px-4 py-1 rounded-full text-sm font-bold">
              Latest Work
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/work1.jpg" 
                alt="Gas Installation" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent rounded-2xl -z-0 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary rounded-2xl -z-0 hidden md:block"></div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Gas Installation Service in Hyderabad</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              AS Gas Pipeline provides professional gas pipeline installation services across Hyderabad & Secunderabad. We specialize in copper pipe fitting in kitchen and LPG gas pipeline installation for residential and commercial properties.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                'Safe & Secure Installation',
                'Proper Pressure Testing',
                'Leak-proof Pipeline System',
                'Clean & Professional Finishing Work'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-accent/20 p-1 rounded-full">
                    <CheckCircle2 className="text-accent" size={20} />
                  </div>
                  <span className="font-semibold text-primary">{item}</span>
                </div>
              ))}
            </div>

            <a href="tel:8688286504" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary transition-all shadow-lg">
              Call Now: 8688286504
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastApprovedReview, setLastApprovedReview] = useState<Review | null>(null);
  const isStatusUpdated = useRef(false);
  const isMapsClicked = useRef(false);

  const handlePopupClose = () => {
    setIsModalOpen(false);
  }
  
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1yW_rXF6fW0N_Wv4v1E-4mZ3XW8u5mX3XW8u5m/edit";

  // Load reviews on mount
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const fetched = await fetchReviewsFromSheet(SHEET_URL);
        
        const validated = fetched
          .map(r => ({
            ...r,
            positivityScore: validateReview(r).positivityScore
          }))
          .filter(r => r.rating >= 3);

        const sorted = sortReviews(validated);
        setDynamicReviews(sorted);
      } catch (error) {
        console.error("Error loading reviews:", error);
        setDynamicReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    const currentReview: Review = { name, rating, review: message };

    try {
      // 1. Simple Validation (Instant)
      const validation = validateReview(currentReview);
      const scoredReview = { ...currentReview, positivityScore: validation.positivityScore };
      
      // 2. Logic for Approved Reviews (3, 4, or 5 stars + keywords)
      if (validation.isApproved) {
        setLastApprovedReview(scoredReview);
        setDynamicReviews(prev => {
          // Rule: Show latest 3-5 with rating priority
          const newList = sortReviews([scoredReview, ...prev]).slice(0, 5);
          return newList;
        });
        
        setIsModalOpen(true);
        // NOTE: Submission happens inside the modal buttons (submitReviewToSheet)
      } else {
        // Submit unapproved reviews immediately as "N/R" (No popup shows)
        await submitReviewToSheet({ name, rating, review: message }, "N/R");
      }

      setSubmitted(true);
      form.reset();
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitted(true); // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real customer feedback from our valued clients in Hyderabad.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Review Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Thank you for your review!</h3>
                <p className="text-gray-600 mb-6 font-medium">Your feedback helps us maintain high service quality in Hyderabad.</p>
                
                {lastApprovedReview && (
                  <div className="bg-accent/10 p-6 rounded-2xl mb-8 border border-accent/20">
                    <p className="text-sm font-bold text-primary mb-4 flex items-center justify-center gap-2">
                      <Star size={16} className="fill-accent text-accent" />
                      Help others find us!
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/GXksoDh9GP5jS5AL8"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { 
                        isMapsClicked.current = true;
                      }}
                      className="inline-flex items-center gap-3 bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-primary transition-all text-base mb-2"
                    >
                      Post on Google Maps <ExternalLink size={18} />
                    </a>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setRating(5);
                    setLastApprovedReview(null);
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all"
                >
                  Submit Another Review
                </button>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-primary mb-6">Submit Your Review</h3>
                <form 
                  onSubmit={handleReviewSubmit} 
                  className="space-y-6"
                  name="customer-review"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            size={32}
                            className={
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Review Message</label>
                    <textarea 
                      name="message"
                      required 
                      placeholder="Share your experience (e.g., professionalism, safety, installation quality...)"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none transition-all"
                    ></textarea>
                    <p className="text-[10px] text-gray-400 mt-2 italic">* Reviews are automatically analyzed for authenticity and quality.</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing Review..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Display Reviews */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary mb-6">High Quality Feedback</h3>
            
            {isLoadingReviews ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 h-32 rounded-2xl w-full"></div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {dynamicReviews.map((review, idx) => (
                  <motion.div 
                    key={`${review.name}-${idx}`} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden"
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{review.review}"</p>
                    <div className="text-sm font-bold text-primary flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-xs font-black">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      — {review.name}
                    </div>
                    {/* Quality indicator badge */}
                    <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Top Review
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Shield size={14} className="text-blue-500" /> 
                Reviews are verified for authenticity and quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handlePopupClose()}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl text-center"
            >
              <button 
                onClick={() => handlePopupClose()}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="fill-accent text-accent" />
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-3">Help others find us!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your review is valuable. Would you like to post the same review on Google Maps?
              </p>

              <div className="space-y-4">
                <a 
                  href="https://maps.app.goo.gl/GXksoDh9GP5jS5AL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (lastApprovedReview) {
                      submitReviewToSheet(
                        { 
                          name: lastApprovedReview.name, 
                          rating: lastApprovedReview.rating, 
                          review: lastApprovedReview.review 
                        }, 
                        "R"
                      );
                    }
                    setIsModalOpen(false);
                  }}
                  className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-md"
                >
                  <ExternalLink size={20} />
                  Post on Google Maps
                </a>
                <button 
                  onClick={() => {
                    if (lastApprovedReview) {
                      submitReviewToSheet(
                        { 
                          name: lastApprovedReview.name, 
                          rating: lastApprovedReview.rating, 
                          review: lastApprovedReview.review 
                        }, 
                        "N/R"
                      );
                    }
                    setIsModalOpen(false);
                  }}
                  className="w-full text-gray-500 font-bold py-3 hover:text-primary transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Need Gas Pipeline Installation Near You?</h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Call or WhatsApp now for fast and safe installation service in Hyderabad. We are available 24/7.</p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="tel:8688286504" className="bg-accent text-primary px-10 py-5 rounded-xl font-bold text-xl flex items-center gap-3 hover:bg-white transition-all shadow-xl">
            <Phone size={24} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-8 text-lg">
              AS Gas Pipeline is a trusted gas pipeline installation service in Hyderabad specializing in LPG gas pipeline installation, copper pipe fitting, and gas leak repair services.
            </p>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/5 p-4 rounded-xl text-primary">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">Our Location</h4>
                  <p className="text-gray-600">Hyder Nagar, RamNaresh Nagar, Kukatpally, Hyderabad, Telangana 500085</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/5 p-4 rounded-xl text-primary">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">Phone Number</h4>
                  <a href="tel:8688286504" className="text-gray-600 hover:text-accent transition-colors">8688286504</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/5 p-4 rounded-xl text-primary">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">Email Address</h4>
                  <a href="mailto:arunmaxx431@gamil.com" className="text-gray-600 hover:text-accent transition-colors">arunmaxx431@gamil.com</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/5 p-4 rounded-xl text-primary">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">Working Hours</h4>
                  <p className="text-gray-600">Open 24 Hours / 7 Days a Week</p>
                </div>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-primary mb-3">Service Areas:</h4>
                <p className="text-gray-600">We provide gas pipeline service in Hyderabad across Kukatpally, KPHB, Miyapur, Hyder Nagar, Bachupally, Nizampet, Pragathi Nagar, JNTU, and Moosapet.</p>
              </div>
            </div>
          </div>

          <div className="bg-background p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h3>
            <form 
              name="quote-form" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="quote-form" />
              <div className="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="8688286504" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (optional)</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your requirement..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-md">
                Get Free Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <img 
                src="/logo.png" 
                alt="AS Gas Pipeline Logo" 
                className="h-16 md:h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.currentTarget.style.display = 'none';
                  const textLogo = e.currentTarget.nextElementSibling as HTMLElement;
                  if (textLogo) textLogo.style.display = 'block';
                }}
              />
              <h3 className="text-2xl font-bold mb-6" style={{ display: 'none' }}>AS Gas Pipeline</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Professional domestic gas pipeline installation services, copper pipe fitting, and maintenance across Hyderabad.
            </p>
            <div className="flex gap-4">
              <a href="tel:8688286504" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="#services" className="hover:text-accent transition-colors">Gas pipeline installation</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Copper pipe fitting</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Gas leak repair</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Maintenance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-accent transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-accent shrink-0" />
                <a href="tel:8688286504" className="hover:text-accent transition-colors">8688286504</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-accent shrink-0" />
                <a href="mailto:arunmaxx431@gamil.com" className="hover:text-accent transition-colors">arunmaxx431@gamil.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-accent shrink-0" />
                <span>Hyder Nagar, RamNaresh Nagar, Kukatpally, Hyderabad, Telangana 500085</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-accent shrink-0" />
                <span>Open 24 Hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} AS Gas Pipeline. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <VideoSection />
      <TrustIndicators />
      <Services />
      <Gallery />
      <Projects />
      <About />
      <CTASection />
      <Contact />
      <ReviewSection />
      <Footer />
    </div>
  );
}
