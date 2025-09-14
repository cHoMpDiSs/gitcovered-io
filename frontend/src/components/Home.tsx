import React from 'react';
import { Theme, Button, Flex, Text, Container, Section } from '@radix-ui/themes';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '@radix-ui/themes/styles.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <main>
          {/* Hero Section */}
          <Section size="3" className="py-20 relative overflow-hidden">
            {/* Animated background layers */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 opacity-30 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
              <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-300 to-blue-300 opacity-30 blur-3xl animate-[float_14s_ease-in-out_infinite_reverse]" />
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '3px 3px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }} />
            </div>

            <Container size="4" className="px-2 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left: copy + CTAs */}
                <Flex direction="column" gap="4" className="text-center lg:text-left opacity-0 translate-y-4 animate-[fadeInUp_600ms_ease-out_forwards]">
                  <div className="relative inline-block">
                    <div
                      className="absolute -inset-x-6 -inset-y-3 -z-10 opacity-30 blur-xl"
                      style={{ backgroundImage: 'radial-gradient(circle at 40% 50%, rgba(0,0,0,0.28), transparent 60%)' }}
                    />
                    <h1 className="text-6xl sm:text-6xl md:text-6xl font-extrabold tracking-tight md:whitespace-nowrap leading-tight">
                      <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] block md:inline"
                        style={{ backgroundSize: '200% 100%' }}
                      >
                        Coverage,
                      </span>
                      <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] block md:inline md:ml-2"
                        style={{ backgroundSize: '200% 100%' }}
                      >
                        Simplified.
                      </span>
                    </h1>
                  </div>
                  <Text size="5" color="gray" className="text-center lg:text-left mx-auto lg:mx-0 max-w-2xl leading-relaxed">
                    The modern way to view, manage, and protect your policies with clarity and confidence.
                  </Text>

                  {!isAuthenticated && (
                    <Flex gap="4" mt="6" align={{ initial: 'center', lg: 'start' }} justify={{ initial: 'center', lg: 'start' }} className="opacity-0 translate-y-2 animate-[fadeInUp_800ms_ease-out_forwards]">
                      <Button
                        size="4"
                        onClick={() => navigate('/signup')}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Get Started
                      </Button>
                      <Button
                        size="4"
                        variant="soft"
                        onClick={() => navigate('/signup')}
                        className="backdrop-blur bg-white/70 hover:bg-white/90 border border-gray-200 transition-all duration-300"
                      >
                        Create Account
                      </Button>
                    </Flex>
                  )}

                  {/* Logo cloud */}
                  <div className="mt-10 opacity-0 translate-y-2 animate-[fadeInUp_900ms_ease-out_forwards]">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 lg:text-left text-center">Trusted by modern teams</div>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-gray-400">
                      {['Acme', 'Globex', 'Umbrella', 'Initech', 'Soylent', 'Stark'].map((name, i) => (
                        <div key={i} className="text-sm sm:text-base font-semibold hover:text-gray-600 transition-colors">{name}</div>
                      ))}
                    </div>
                  </div>
                </Flex>

                {/* Right: product preview */}
                <div className="relative opacity-0 translate-y-4 animate-[fadeInUp_700ms_ease-out_forwards]">
                  <div className="group perspective-[1200px]">
                    {/* Desktop frame */}
                    <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden transform transition-transform duration-500 group-hover:-rotate-x-2 group-hover:rotate-y-2">
                      <div className="h-8 w-full bg-gray-100 flex items-center gap-2 px-3">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                      </div>
                      <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                        <div className="h-8 w-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded mb-6" />
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&q=60" alt="Analytics graph" className="h-24 w-full object-cover rounded bg-white" />
                          <img src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=600&q=60" alt="Apartment complex" className="h-24 w-full object-cover rounded bg-white" />
                          <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=60" alt="Modern apartments" className="h-24 w-full object-cover rounded bg-white" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=60" alt="Apartment complex overview" className="h-40 w-full object-cover rounded-lg border border-gray-200 bg-white shadow-inner" />
                      </div>
                    </div>

                    {/* Mobile frame */}
                    <div className="hidden xl:block absolute -bottom-8 -left-6 w-40 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden transform transition-transform duration-500 group-hover:rotate-x-2 group-hover:-rotate-y-2">
                      <div className="h-6 w-full bg-gray-100" />
                      <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                        <div className="h-5 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded mb-3" />
                        <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=60" alt="High-rise apartments" className="h-24 w-full object-cover rounded bg-white mb-2" />
                        <div className="h-10 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* Features Section */}
          <Section size="3" className="py-24 relative">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.08), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.08), transparent 35%)' }} />
              <div className="absolute inset-0 pointer-events-none opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            </div>

            <Container size="4" className="px-2 sm:px-0">
              <Flex direction="column" gap="6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                    Why Choose GetCovered.io?
                  </div>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">Built for trust, speed, and clarity</span>
                  </h2>
                  <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Everything you need to protect and manage coverage, crafted with care and modern security.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Secure Platform */}
                  <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 shadow-lg shadow-blue-100/40 transition-transform duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
                    <div className="rounded-2xl h-full w-full bg-white/90 backdrop-blur p-6">
                      <div className="relative mb-5">
                        <div className="absolute -inset-3 opacity-20 blur-xl bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl" />
                        <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-blue-600 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                            <path fillRule="evenodd" d="M12 1.5c-2.485 0-4.5 2.015-4.5 4.5V9a.75.75 0 0 1-1.5 0V6A6 6 0 1 1 18 6v3a.75.75 0 0 1-1.5 0V6c0-2.485-2.015-4.5-4.5-4.5Zm-6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6.75A2.75 2.75 0 0 1 14.25 20H9.75A2.75 2.75 0 0 1 7 17.25V10.5Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-gray-900">Secure Platform</h3>
                      <p className="mt-2 text-sm text-gray-600">Enterprise-grade security with Google OAuth, token rotation, and hardened transport.</p>
                      <div className="mt-5 flex items-center gap-2 text-blue-700 font-medium">
                        <span className="text-xs uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">SOC-ready</span>
                        <span className="text-xs uppercase tracking-wider bg-cyan-50 px-2 py-1 rounded text-cyan-700">2FA</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Easy Management */}
                  <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-lg shadow-cyan-100/40 transition-transform duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
                    <div className="rounded-2xl h-full w-full bg-white/90 backdrop-blur p-6">
                      <div className="relative mb-5">
                        <div className="absolute -inset-3 opacity-20 blur-xl bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl" />
                        <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-cyan-700 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                            <path d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 5.25c0-.414.336-.75.75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm.75 4.5a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5Z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-gray-900">Easy Management</h3>
                      <p className="mt-2 text-sm text-gray-600">A clean, intuitive dashboard for policies, claims, and documents — all in one place.</p>
                      <div className="mt-5 flex items-center gap-2">
                        <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">Fast</div>
                        <div className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">No clutter</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Expert Support */}
                  <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 shadow-lg shadow-indigo-100/40 transition-transform duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
                    <div className="rounded-2xl h-full w-full bg-white/90 backdrop-blur p-6">
                      <div className="relative mb-5">
                        <div className="absolute -inset-3 opacity-20 blur-xl bg-gradient-to-br from-indigo-400 to-blue-400 rounded-2xl" />
                        <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-700 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                            <path fillRule="evenodd" d="M7.5 3.75A3.75 3.75 0 0 0 3.75 7.5v3.75a3.75 3.75 0 0 0 3.75 3.75H9a.75.75 0 0 1 .75.75v1.318a1.5 1.5 0 0 0 2.414 1.184l2.803-2.102a1.5 1.5 0 0 1 .9-.3h.633A3.75 3.75 0 0 0 20.25 11.25V7.5A3.75 3.75 0 0 0 16.5 3.75h-9Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-gray-900">Expert Support</h3>
                      <p className="mt-2 text-sm text-gray-600">Real humans, 24/7. Fast response times and proactive guidance when you need it.</p>
                      <div className="mt-5 flex items-center gap-2">
                        <div className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded uppercase tracking-wider">24/7</div>
                        <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">SLA-backed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Flex>
            </Container>
          </Section>
        </main>
        {/* Add-on Sections */}
        <section className="py-20 bg-white/60">
          <Container size="4">
            {/* Metrics strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { k: '99.9%', v: 'Uptime' },
                { k: '<200ms', v: 'Auth latency' },
                { k: 'AES-256', v: 'Encryption' },
                { k: '24/7', v: 'Support' }
              ].map((m, i) => (
                <div key={i} className="rounded-2xl p-6 text-center bg-white shadow-sm border border-gray-100 mx-2 sm:mx-0">
                  <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">
                    {m.k}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{m.v}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-16">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  How it works
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">From sign-up to insight in minutes</span>
                </h3>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Connect',
                    desc: 'Sign in securely with Google OAuth and set your profile.'
                  },
                  {
                    title: 'Organize',
                    desc: 'Import policies and documents; everything lives in one place.'
                  },
                  {
                    title: 'Track',
                    desc: 'Real-time updates, analytics, and reminders that keep you ahead.'
                  }
                ].map((s, i) => (
                  <div key={i} className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 mx-2 sm:mx-0">
                    <div className="rounded-2xl h-full w-full bg-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">{s.title}</div>
                        <div className="text-xs text-gray-500">0{i + 1}</div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA banner */}
            <div className="mt-16 relative rounded-3xl overflow-hidden mx-2 sm:mx-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-95" />
              <div className="relative p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-extrabold text-white">Ready to simplify your coverage?</h4>
                    <p className="mt-2 text-blue-50 max-w-md">Join GetCovered.io and take control with a modern, secure dashboard built for you.</p>
                  </div>
                  <div className="flex md:justify-end">
                    <div className="flex gap-3">
                      <Button size="3" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => navigate('/signup')}>Get Started</Button>
                      <Button size="3" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => navigate('/learn-more')}>Learn more</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Footer />
    </Theme>
  );
};

export default Home;