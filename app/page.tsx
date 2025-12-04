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
                    I&apos;m <span className="font-semibold text-text-primary">Hamid Harzai</span> — proud father of three amazing kids and husband to a beautiful wife. We&apos;ve called Allen, Texas home for years now, and like most parents in this community, I got tired of hunting across Facebook groups, school emails, and city websites just to find weekend plans.
                  </p>
                  <p>
                    So I built Allen Insider.
                  </p>
                  <p>
                    Every Thursday at 4 PM, get a curated list of the best local events — farmers markets, live music, family activities, and hidden gems in our growing city. One email. No scavenger hunt.
                  </p>
                  <p>
                    This is a passion project — wellness and community matter deeply to us. We&apos;re also excited to be opening{' '}
                    <span className="font-semibold text-secondary-gold">4Ever Young Anti-Aging & Wellness Clinic</span> at Custer & 121 in mid-2026. We believe in building community before building business.
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
