import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { EventsGrid } from '@/components/EventsGrid';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { SubscribeForm } from '@/components/SubscribeForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EventsGrid />

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading font-bold text-3xl text-text-primary mb-12 text-center">
                About <span className="text-primary-teal">Allen Insider</span>
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary-teal/20">
                    <Image
                      src="/hamid-photo.jpg"
                      alt="Hamid Harzai"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-text-secondary text-lg leading-relaxed space-y-4">
                  <p>
                    I&apos;m <span className="font-semibold text-text-primary">Hamid Harzai</span>, husband to a beautiful wife and father to three amazing kids. We&apos;ve called Allen home for years. Like any busy parent here, I grew tired of the scavenger hunt across different websites and social feeds just to find weekend plans.
                  </p>
                  <p>
                    So, I built Allen Insider.
                  </p>
                  <p>
                    It&apos;s your weekly, curated guide to 50+ local events—delivered free every Thursday at 4 PM. One email. More time back with your family.
                  </p>
                  <p className="font-semibold text-text-primary text-xl mt-6">
                    Our Mission & Sponsorship
                  </p>
                  <p>
                    We curate the best of Allen because we believe every resident deserves the energy and vitality to experience it all.
                  </p>
                  <p>
                    Allen Insider is proudly sponsored by{' '}
                    <span className="font-semibold text-secondary-gold">4Ever Young Anti Aging Solutions</span>.
                  </p>
                  <p>
                    Our mission is the same: Help you look and feel your best so you can fully enjoy this incredible community. We are excited to open the clinic at Custer & 121 in mid-2026. We are building a community. This mission is supported by the upcoming 4Ever Young Anti-Aging & Wellness Clinic.
                  </p>
                  <p className="pt-4">
                    Thanks for being here.<br />
                    <span className="font-semibold text-text-primary">— Hamid</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe CTA Section */}
        <section
          id="subscribe"
          className="py-16 bg-gradient-to-br from-primary-teal to-teal-light"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl text-white mb-4">
              Never Miss Another Event
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of Allen locals who get the best events delivered to
              their inbox every Thursday. It&apos;s free, and you can unsubscribe anytime.
            </p>
            <SubscribeForm />
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
