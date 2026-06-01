import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Code, 
  Palette, 
  PenTool, 
  BarChart3, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  PlayCircle,
  Globe,
  ShieldCheck,
  Cpu,
  LogOut,
  User as UserIcon,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Ethiopia');
  const { data: jobs } = useJobs();

  const categoriesList = [
    'All Categories',
    'IT & Software',
    'Design & Creative',
    'Writing & Translation',
    'Marketing & Sales',
    'Data Science',
    'Admin Support'
  ];

  const locationsList = [
    'All Ethiopia',
    'Addis Ababa',
    'Dire Dawa',
    'Bahir Dar',
    'Mekelle',
    'Gondar',
    'Hawassa',
    'Adama',
    'Remote'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { title: 'Web Development', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Mobile Apps', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Design & Creative', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50' },
    { title: 'Writing & Translation', icon: PenTool, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Data Science', icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Digital Marketing', icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const steps = [
    { 
      title: 'Post a Job', 
      desc: 'Tell us about your project. We\'ll help you find the right talent.',
      icon: PenTool 
    },
    { 
      title: 'Receive Bids', 
      desc: 'Get quotes from multiple freelancers in minutes.',
      icon: Users 
    },
    { 
      title: 'Choose Freelancer', 
      desc: 'Compare portfolios and reviews to pick your favorite.',
      icon: CheckCircle2 
    },
    { 
      title: 'Get Work Done', 
      desc: 'Collaborate and pay only when you\'re 100% satisfied.',
      icon: Zap 
    }
  ];

  const freelancers = [
    { name: 'Abebe Kebede', skill: 'Full-stack Developer', rating: 4.9, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { name: 'Sara Tesfaye', skill: 'UI/UX Designer', rating: 5.0, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { name: 'Daniel Mulugeta', skill: 'Mobile App Expert', rating: 4.8, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-kefit-primary/10">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-kefit-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-kefit-primary/40 group-hover:rotate-12 transition-transform">
              <Zap className="w-7 h-7 fill-current" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Kefit</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-black text-white hover:text-kefit-primary transition-colors">Home</Link>
            <a href="#how-it-works" className="text-sm font-black text-slate-400 hover:text-white transition-colors">How It Works</a>
            <Link to="/jobs" className="text-sm font-black text-slate-400 hover:text-white transition-colors">Browse Jobs</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-black text-slate-400 hover:text-white transition-colors">Login</Link>
                <Link to="/register">
                  <Button size="sm" variant="outline" className="font-black border-2 border-white/20 text-white hover:bg-white/10">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white/5 transition-all outline-none group"
                >
                  <div className="w-10 h-10 rounded-xl bg-kefit-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-kefit-primary/20 group-hover:scale-105 transition-transform">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-black text-white leading-none mb-1">{user.name}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-kefit-primary px-2 py-0.5 bg-kefit-primary/10 rounded-md border border-kefit-primary/20">
                      {user.role}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-3 z-20 backdrop-blur-2xl"
                    >
                      <div className="p-3 mb-2 border-b border-white/5">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-black text-white truncate">{user.email}</p>
                      </div>

                      <div className="space-y-1">
                        <Link 
                          to={user.role === 'Client' ? '/client/dashboard' : '/dashboard'}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all font-black text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button 
                          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all font-black text-sm"
                          onClick={() => {
                            setIsProfileOpen(false);
                            // Add logic for settings if exists
                          }}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <div className="h-px bg-white/5 my-2" />
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all font-black text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}

            <Link to="/client/post-job">
              <Button size="sm" className="bg-kefit-primary hover:bg-slate-900 font-black shadow-lg shadow-kefit-primary/10">
                Post a Project
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-white" onClick={() => setMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-3xl border-b border-white/10 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <Link to="/" className="text-2xl font-black text-white" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="#how-it-works" className="text-2xl font-black text-slate-400" onClick={() => setMenuOpen(false)}>How It Works</a>
            <Link to="/jobs" className="text-2xl font-black text-slate-400" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            <div className="h-px bg-white/5 my-4" />
            
            {!user ? (
              <>
                <Link to="/login" className="text-2xl font-black text-slate-400" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-2xl font-black text-kefit-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-kefit-primary flex items-center justify-center text-white font-black text-xl shadow-xl shadow-kefit-primary/20">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-black text-white">{user.name}</p>
                    <p className="text-sm font-black text-kefit-primary uppercase tracking-widest">{user.role}</p>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>
                <Link to={user.role === 'Client' ? '/client/dashboard' : '/dashboard'} className="text-2xl font-black text-white px-2" onClick={() => setMenuOpen(false)}>
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); setMenuOpen(false); }} 
                  className="text-left text-2xl font-black text-red-500 px-2"
                >
                  Sign Out
                </button>
              </div>
            )}
            
            <Link to="/client/post-job" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-kefit-primary font-black py-4">Post a Project</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 lg:pt-48 lg:pb-52 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-30 bg-slate-950 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000" 
            alt="Collaboration Workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
        </div>

        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[5%] w-[500px] h-[500px] bg-kefit-primary/20 rounded-full blur-[120px] -z-10"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-[5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] -z-10"
        />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-kefit-primary text-sm font-black uppercase tracking-widest mb-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kefit-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-kefit-primary"></span>
                </span>
                Transforming the Future of Work
              </div>
              <h1 className="text-6xl lg:text-[10rem] font-black text-white leading-[0.9] tracking-tighter mb-10">
                Talent <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-kefit-primary via-emerald-400 to-white/90">meets opportunity.</span>
              </h1>
              <p className="text-2xl lg:text-3xl text-slate-200 font-medium leading-relaxed max-w-3xl mb-14">
                The most immersive ecosystem for professionals in Ethiopia. Connect with top teams 
                and build your legacy with remote talent you deserve.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  className="h-20 px-12 text-2xl font-black bg-kefit-primary hover:bg-kefit-primary/90 text-white transition-all shadow-[0_20px_50px_rgba(33,184,113,0.3)] rounded-3xl"
                  onClick={() => navigate('/login')}
                >
                  Hire Top Talent
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-20 px-12 text-2xl font-black border-4 border-white/20 bg-white/5 backdrop-blur-lg text-white hover:bg-white/10 transition-all rounded-3xl"
                  onClick={() => navigate('/jobs')}
                >
                  Find Premium Work
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section Separator - Deep Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-40 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-full fill-slate-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,0V120H0Z"></path>
          </svg>
        </div>
      </section>


      {/* Search Section (Glassmorphism Dark) */}
      <section className="relative z-20 -mt-20 lg:-mt-28 mb-12">
        <div className="max-w-7xl mx-auto px-6 font-sans">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-4 lg:p-6 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row gap-4 items-center"
            >
              {/* Keywords Search */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-kefit-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Service keywords..." 
                  className="w-full h-16 bg-white/5 rounded-2xl pl-16 pr-6 border border-white/5 focus:outline-none focus:ring-2 focus:ring-kefit-primary/50 placeholder:text-slate-500 font-bold text-lg text-white outline-none transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative w-full lg:w-64">
                <button 
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsLocationOpen(false);
                  }}
                  className="h-16 w-full px-8 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-slate-300 hover:bg-white/10 transition-all font-bold text-lg"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-kefit-primary" />
                    <span className="truncate">{selectedCategory}</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-transform", isCategoryOpen && "rotate-180")} />
                </button>

                {isCategoryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
                  >
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all font-bold text-sm"
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Location Dropdown */}
              <div className="relative w-full lg:w-64">
                <button 
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="h-16 w-full px-8 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-slate-300 hover:bg-white/10 transition-all font-bold text-lg"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-kefit-primary" />
                    <span className="truncate">{selectedLocation}</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-transform", isLocationOpen && "rotate-180")} />
                </button>

                {isLocationOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
                  >
                    {locationsList.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all font-bold text-sm"
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <Button size="lg" className="h-16 px-12 bg-kefit-primary hover:bg-kefit-primary/90 font-black w-full lg:w-auto rounded-2xl text-lg shadow-2xl shadow-kefit-primary/20 text-white">
                Find Talent
              </Button>
            </motion.div>
        </div>
      </section>

      {/* Immersive Heading Section: At Your Fingertips */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000" 
            alt="Productivity" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm shadow-inner" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/90" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter mb-8 italic">
              AT YOUR <span className="text-kefit-primary">FINGERTIPS.</span>
            </h2>
            <p className="text-2xl lg:text-3xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
              Experience the power of Ethiopia's most advanced workforce platform. <br className="hidden lg:block"/>
              Everything you need to hire, manage and pay is just one click away.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Data Network" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="mb-24 flex flex-col items-center text-center">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Trending Expertise</h2>
            <div className="w-24 h-2 bg-kefit-primary rounded-full mb-8" />
            <p className="text-slate-400 text-2xl font-medium max-w-2xl leading-relaxed">
              Unlock extraordinary potential across every digital discipline. 
              Find your perfect match in our curated categories.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group p-12 rounded-[3.5rem] border border-white/5 bg-white/5 backdrop-blur-3xl hover:bg-white/10 hover:border-kefit-primary/50 transition-all cursor-pointer shadow-2xl"
              >
                <div className={cn("w-20 h-20 rounded-[1.5rem] mb-10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6", cat.bg)}>
                  <cat.icon className={cn("w-10 h-10", cat.color)} />
                </div>
                <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{cat.title}</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 group-hover:text-slate-300 transition-colors">
                  Drive innovation with certified experts dedicated to {cat.title.toLowerCase()} excellence.
                </p>
                <div className="flex items-center text-kefit-primary font-black text-sm uppercase tracking-[0.2em] gap-3">
                  Explore Specialists <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition Wave Reverse */}
      <div className="h-32 w-full overflow-hidden leading-[0] bg-slate-50 -z-10">
        <svg className="relative block w-full h-full fill-slate-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V120H3.13C104,111.41,200.7,80.12,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <header className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">Simple 4-Step Process</h2>
            <div className="flex justify-center gap-2 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="w-3 h-3 rounded-full bg-kefit-primary" />)}
            </div>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              We've made hiring easy, fast, and secure so you can focus on building your vision.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 relative">
            {/* Animated Connector Line */}
            <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-kefit-primary/0 via-kefit-primary to-kefit-primary/0 -z-0" />
            
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center group"
              >
                <div className="w-28 h-28 mx-auto bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-kefit-primary shadow-2xl mb-10 border border-slate-700 group-hover:bg-kefit-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 overflow-hidden relative">
                  <step.icon className="w-12 h-12 relative z-10" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 font-medium text-base leading-relaxed px-4">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition Wave Bottom */}
      <div className="h-32 w-full overflow-hidden leading-[0] bg-slate-900">
        <svg className="relative block w-full h-full fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,0V120H0Z"></path>
        </svg>
      </div>

      {/* Featured Jobs */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-kefit-primary/10 border border-kefit-primary/20 text-kefit-primary text-xs font-black uppercase tracking-[0.3em] mb-6">
                Active Markets
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-8">Latest Opportunities</h2>
              <p className="text-slate-400 text-2xl font-medium leading-relaxed">
                Elite projects curated from Ethiopia's most ambitious companies. 
                Your next milestone starts here.
              </p>
            </div>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="font-black px-12 h-20 border-4 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all rounded-[2rem] uppercase tracking-widest text-sm backdrop-blur-xl">
                Explore All Tenders
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {(jobs || []).slice(0, 3).map((job) => (
              <motion.div 
                key={job.id} 
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 flex flex-col group h-full shadow-2xl transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-kefit-primary/10 blur-3xl -z-10 group-hover:bg-kefit-primary/20 transition-all" />
                
                <div className="flex items-center justify-between mb-10">
                  <span className="px-5 py-2.5 bg-kefit-primary/10 text-kefit-primary text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl border border-kefit-primary/20">
                    {job.status}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 font-black">
                    <Users className="w-5 h-5 text-kefit-primary" />
                    <span className="text-sm">{job.bidCount || 0} Proposals</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 group-hover:text-kefit-primary transition-colors leading-[1.1]">{job.title}</h3>
                <p className="text-slate-400 text-lg font-medium mb-12 flex-1 line-clamp-3 leading-relaxed group-hover:text-slate-300 transition-colors">{job.description}</p>
                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Fixed Budget</p>
                    <div className="text-white font-black text-3xl">
                      {job.budget.toLocaleString()} <span className="text-sm font-bold text-slate-500 ml-1">ETB</span>
                    </div>
                  </div>
                  <Link to={`/jobs/${job.id}`}>
                    <Button className="font-black bg-kefit-primary hover:bg-kefit-primary/90 text-white rounded-[1.5rem] px-8 h-16 shadow-2xl shadow-kefit-primary/20 text-lg">
                      Bid Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" 
            alt="Business Meeting" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="mb-24 flex flex-col items-center text-center">
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Kefit Elite Network</h2>
            <div className="w-20 h-2 bg-kefit-primary mb-8" />
            <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
              Work with the top 1% of digital professionals in Ethiopia, verified for skill and reliability.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-12">
            {freelancers.map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 flex flex-col items-center text-center shadow-2xl hover:bg-white/10 hover:border-kefit-primary/50 transition-all px-12"
              >
                <div className="relative mb-10">
                  <div className="absolute -inset-4 bg-kefit-primary/20 rounded-full blur-2xl" />
                  <img src={f.image} alt={f.name} className="relative w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-white/5 shadow-2xl" />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-slate-100">
                    <ShieldCheck className="w-6 h-6 text-blue-500 fill-current" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{f.name}</h3>
                <p className="text-kefit-primary font-black text-xs uppercase tracking-[0.2em] mb-10 px-6 py-2 bg-kefit-primary/10 rounded-full border border-kefit-primary/20">{f.skill}</p>
                
                <div className="flex items-center gap-3 bg-white/5 px-8 py-3.5 rounded-2xl border border-white/10 mb-10">
                  <Star className="w-6 h-6 text-orange-400 fill-current" />
                  <span className="text-xl font-black text-white">{f.rating}</span>
                  <span className="text-slate-500 font-bold ml-1">/ 5.0</span>
                </div>
                
                <Button variant="ghost" className="font-black text-kefit-primary hover:text-white hover:bg-kefit-primary uppercase tracking-[0.2em] text-xs transition-all w-full h-14 rounded-2xl border border-kefit-primary/20">
                  View Full Profile
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-48 px-6 bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[5rem] p-12 lg:p-40 text-center shadow-[0_100px_150px_-50px_rgba(33,184,113,0.4)] group"
          >
            {/* Background Image with Deep Overlay */}
            <div className="absolute inset-0 -z-10 overflow-hidden bg-kefit-primary">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000" 
                alt="Visionary Teams" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-kefit-primary/95 via-kefit-primary/60 to-emerald-900/90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>
            
            <div className="relative z-10 space-y-12">
              <h2 className="text-6xl lg:text-[11rem] font-black text-white mb-10 leading-[0.85] tracking-tighter uppercase italic">
                READY TO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">EVOLVE?</span>
              </h2>
              <p className="text-xl lg:text-3xl text-white/90 font-medium mb-16 max-w-3xl mx-auto leading-relaxed backdrop-blur-md bg-white/5 py-6 px-10 rounded-full border border-white/10 inline-block">
                Join thousands of businesses and freelancers getting work done the modern way in Ethiopia.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="h-24 px-20 bg-white text-kefit-primary hover:bg-slate-100 text-3xl font-black rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                  onClick={() => navigate('/register')}
                >
                  Join Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-24 px-20 border-4 border-white/40 text-white hover:bg-white/10 text-3xl font-black rounded-3xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
                  onClick={() => navigate('/jobs')}
                >
                  Find Talent
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-950 pt-32 pb-10 overflow-hidden">
        {/* Immersive Background for Footer */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" 
            alt="Digital Connection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 lg:gap-12 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-kefit-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-kefit-primary/20">
                  <Zap className="w-7 h-7 fill-current" />
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">Kefit</span>
              </div>
              <p className="text-slate-400 font-medium max-w-sm leading-relaxed text-lg mb-10">
                Empowering Ethiopia's digital economy by connecting world-class talent with meaningful opportunities.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map(s => (
                  <motion.div 
                    key={s} 
                    whileHover={{ y: -5, backgroundColor: '#21b871' }}
                    className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer transition-colors"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px]">For Clients</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Post a Project</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Hire Talent</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Enterprise Solutions</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Security First</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px]">For Freelancers</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Find High-Value Work</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Build Portfolio</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Skill Assessments</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Referral Program</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px]">Resources</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Community Blog</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Success Stories</li>
                <li className="hover:text-kefit-primary transition-colors cursor-pointer">Kefit Academy</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
              © 2026 Kefit Global. High performance remote work.
            </p>
            <div className="flex gap-10 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              <span className="hover:text-white transition-colors cursor-pointer">HQ Addis Ababa</span>
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
