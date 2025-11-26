import { SignupForm } from './SignupForm';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-teal via-primary-teal to-teal-light overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Never Miss What&apos;s Happening in{' '}
            <span className="text-secondary-gold">Allen, TX</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Get the best local events delivered to your inbox every Thursday.
            Concerts, festivals, family fun, food trucks, and more — curated just for Allen residents.
          </p>

          <div className="mb-8">
            <SignupForm />
          </div>

          <p className="text-white/70 text-sm">
            Join 500+ Allen locals who never miss a weekend. Free forever.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-gold">50+</div>
              <div className="text-white/70 text-sm">Weekly Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-gold">500+</div>
              <div className="text-white/70 text-sm">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-gold">Free</div>
              <div className="text-white/70 text-sm">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="#F8F8F6"
          />
        </svg>
      </div>
    </section>
  );
}
