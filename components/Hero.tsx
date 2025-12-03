import { SignupForm } from './SignupForm';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-teal via-teal-600 to-teal-light overflow-hidden min-h-[85vh] flex items-center">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/30 via-transparent to-primary-teal/30 animate-gradient" />

      {/* Geometric background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm0 80c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-secondary-gold/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float-slow" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-secondary-gold rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Every Thursday at 4 PM • 100% Free</span>
          </div>

          {/* Main headline with better typography */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 tracking-tight animate-slide-up px-2 sm:px-0">
            Discover What&apos;s Happening in{' '}
            <span className="text-secondary-gold inline-block animate-shimmer bg-gradient-to-r from-secondary-gold via-yellow-200 to-secondary-gold bg-[length:200%_100%]">
              Allen
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-light animate-slide-up-delayed px-4 sm:px-0">
            Your weekly curated guide to concerts, festivals, family fun, and hidden gems —
            <span className="font-semibold text-white"> delivered every Thursday.</span>
          </p>

          {/* Signup form with glassmorphism */}
          <div className="mb-8 animate-slide-up-more-delayed">
            <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-2 max-w-lg mx-auto border border-white/50">
              <SignupForm />
            </div>
          </div>

          {/* Social proof */}
          <p className="text-white/80 text-sm mb-12 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-secondary-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Join <strong>500+ happy subscribers</strong> who never miss a weekend</span>
          </p>

          {/* Stats with glassmorphism cards */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">Events/Week</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">10</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$0</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8F8F6"
          />
        </svg>
      </div>
    </section>
  );
}
