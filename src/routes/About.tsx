import Hero from '@/components/common/Hero'
import { MISSION_STATEMENT, VISION_STATEMENT, ABOUT_DOROTHY } from '@/lib/content'

export default function About() {
  return (
    <div>
      <Hero title="About Us" subtitle="Honoring Dorothy's Legacy" height="medium" />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          {/* Dorothy's Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Remembering Dorothy R. Morgan</h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div className="order-2 md:order-1">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">{ABOUT_DOROTHY}</p>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-4 md:space-y-6">
                <div className="relative">
                  <img
                    src="/drm-image2.jpg"
                    alt="Dorothy R. Morgan"
                    className="w-full h-auto rounded-lg shadow-lg object-cover border-2 border-brand-purple/20"
                  />
                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-full h-full border-2 border-brand-lavender/30 rounded-lg -z-10" />
                </div>
                <div className="relative">
                  <img
                    src="/drm-image5.jpg"
                    alt="Dorothy R. Morgan with family"
                    className="w-full h-auto rounded-lg shadow-lg object-cover border-2 border-brand-purple/20"
                  />
                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-full h-full border-2 border-brand-lavender/30 rounded-lg -z-10" />
                </div>
              </div>
            </div>
            {/* Background accent image */}
            <div className="relative mt-8 rounded-lg overflow-hidden bg-gray-50 p-8">
              <div
                className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/drm-image.jpg)' }}
              />
              <div className="relative z-10">
                <p className="text-gray-700 leading-relaxed italic text-center">
                  "Her spirit lives on through the lives she touched and the love she shared."
                </p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="card bg-gray-50 border-l-4 border-brand-purple">
              <p className="text-lg text-gray-700 leading-relaxed">{MISSION_STATEMENT}</p>
            </div>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <div className="card bg-gray-50 border-l-4 border-deep-navy">
              <p className="text-lg text-gray-700 leading-relaxed">{VISION_STATEMENT}</p>
            </div>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Family Support</h3>
                <p className="text-gray-600">
                  We provide resources, counseling, and financial assistance to families affected
                  by tragedy, helping them heal and rebuild their lives.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Youth Programs</h3>
                <p className="text-gray-600">
                  Through scholarships, mentorship, and educational programs, we empower young
                  people to achieve their dreams and reach their full potential.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Community Healing</h3>
                <p className="text-gray-600">
                  We organize events, support groups, and memorial activities that bring people
                  together and promote healing through connection.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Remembrance</h3>
                <p className="text-gray-600">
                  We honor the memory of Dorothy and all those lost on September 11, 2001, ensuring
                  their legacy lives on through acts of compassion and service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

