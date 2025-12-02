import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { EventsGrid } from '@/components/EventsGrid';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { SubscribeForm } from '@/components/SubscribeForm';

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
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading font-bold text-3xl text-text-primary mb-6">
                About <span className="text-primary-teal">Allen Insider</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Allen Insider is a community newsletter dedicated to keeping Allen, TX
                residents in the loop about local events, happenings, and hidden gems
                in our growing city.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Every Thursday at 4 PM, we send out a carefully curated list of the
                best events happening that weekend. From farmers markets to live
                music, family activities to fitness classes — we&apos;ve got you covered.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed">
                This is a passion project brought to you by{' '}
                <span className="text-secondary-gold font-semibold">4Ever Young</span>,
                a medical spa opening in Allen in June 2026. We believe in building
                community before building business.
              </p>
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
