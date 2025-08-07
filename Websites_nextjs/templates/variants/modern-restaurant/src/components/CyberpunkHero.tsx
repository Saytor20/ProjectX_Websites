import { restaurantData } from '@/data/restaurant';

export default function CyberpunkHero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid">
      {/* Dynamic background with cyberpunk elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated circuit patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="cyber-circuit-1"></div>
          <div className="cyber-circuit-2"></div>
          <div className="cyber-circuit-3"></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Scanning lines */}
        <div className="scanning-line-1"></div>
        <div className="scanning-line-2"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glitch effect title */}
        <div className="mb-8">
          <span className="text-cyan-400 text-sm font-mono uppercase tracking-[0.3em] block mb-4">
            [SYSTEM_ONLINE] • NEURAL_DINING • [ACCESS_GRANTED]
          </span>
          <h1 
            className="text-6xl md:text-8xl font-black mb-8 font-mono gradient-text glitch"
            data-text={restaurantData.name}
          >
            {restaurantData.name}
          </h1>
        </div>

        {/* Description with typewriter effect */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-mono typewriter-text">
            {restaurantData.description}
          </p>
          <div className="text-sm text-cyan-400 font-mono">
            [UPTIME: 25+ YEARS] • [STATUS: OPERATIONAL] • [QUALITY: PREMIUM]
          </div>
        </div>

        {/* Cyberpunk buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#menu" 
            className="group relative overflow-hidden bg-transparent border-2 border-cyan-400 text-cyan-400 px-8 py-4 font-mono text-lg font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-black cyber-button"
          >
            <span className="relative z-10">[ACCESS_MENU]</span>
            <div className="absolute inset-0 bg-cyan-400 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
          </a>
          <a 
            href="#contact" 
            className="group relative overflow-hidden bg-transparent border-2 border-purple-400 text-purple-400 px-8 py-4 font-mono text-lg font-bold transition-all duration-300 hover:bg-purple-400 hover:text-black cyber-button"
          >
            <span className="relative z-10">[INITIALIZE_CONTACT]</span>
            <div className="absolute inset-0 bg-purple-400 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
          </a>
        </div>

        {/* Stats display */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="neon-border p-4">
            <div className="text-2xl font-mono font-bold text-cyan-400 neon-glow">25+</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">YEARS_ACTIVE</div>
          </div>
          <div className="neon-border p-4">
            <div className="text-2xl font-mono font-bold text-purple-400 neon-glow">∞</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">FLAVOR_NODES</div>
          </div>
          <div className="neon-border p-4">
            <div className="text-2xl font-mono font-bold text-cyan-400 neon-glow">100%</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">SATISFACTION_RATE</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-cyan-400 text-xs font-mono opacity-50 animate-pulse">
        [CONNECTING...]
      </div>
      <div className="absolute bottom-20 right-10 text-purple-400 text-xs font-mono opacity-50 animate-pulse delay-500">
        [SIGNAL_STRONG]
      </div>
    </section>
  );
}