import React from 'react';
import { Theme, Button, Flex, Text, Container, Section } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import '@radix-ui/themes/styles.css';

const LearnMore: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <main>
          {/* Hero Section */}
          <Section size="3" className="py-24 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 opacity-30 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-indigo-300 to-blue-300 opacity-30 blur-3xl" />
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '3px 3px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }} />
            </div>

            <Container size="4" className="px-2 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <Flex direction="column" gap="4" className="text-center lg:text-left opacity-0 translate-y-4 animate-[fadeInUp_600ms_ease-out_forwards]">
                  <div className="relative inline-block">
                    <div className="absolute -inset-x-6 -inset-y-3 -z-10 opacity-30 blur-xl" style={{ backgroundImage: 'radial-gradient(circle at 40% 50%, rgba(0,0,0,0.28), transparent 60%)' }} />
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] block md:inline">Everything you need,</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] block md:inline md:ml-2">beautifully integrated.</span>
                    </h1>
                  </div>
                  <Text size="5" color="gray" className="mx-auto lg:mx-0 max-w-2xl leading-relaxed">
                    Learn how GetCovered.io streamlines policies, claims, and documents with a delightful, secure experience.
                  </Text>
                  <Flex gap="4" mt="6" align={{ initial: 'center', lg: 'start' }} justify={{ initial: 'center', lg: 'start' }} className="opacity-0 translate-y-2 animate-[fadeInUp_800ms_ease-out_forwards]">
                    <Button size="4" onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5">Start Free</Button>
                    <Button size="4" variant="soft" onClick={() => navigate('/')} className="backdrop-blur bg-white/70 hover:bg-white/90 border border-gray-200 transition-all duration-300">Back Home</Button>
                  </Flex>
                </Flex>

                {/* Product preview panel */}
                <div className="relative opacity-0 translate-y-4 animate-[fadeInUp_700ms_ease-out_forwards]">
                  <div className="group perspective-[1200px]">
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
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* Deep Dive Features */}
          <Section size="3" className="py-24 relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.08), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.08), transparent 35%)' }} />
              <div className="absolute inset-0 pointer-events-none opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            </div>

            <Container size="4" className="px-2 sm:px-0">
              <Flex direction="column" gap="8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">Platform pillars</div>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">Secure, intuitive, and fast by design</span>
                  </h2>
                  <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Under the hood: hardened auth, real-time updates, and a delightful UI built with care.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Security First',
                      desc: 'Google OAuth, rotating tokens, and transport hardening keep your data safe.'
                    },
                    {
                      title: 'Effortless Control',
                      desc: 'All policies, claims, and docs in one clean dashboard with powerful filters.'
                    },
                    {
                      title: 'Real-time Insight',
                      desc: 'Stay ahead with live updates, analytics, and proactive reminders.'
                    },
                  ].map((f, i) => (
                    <div key={i} className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 shadow-lg shadow-blue-100/40 transition-transform duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
                      <div className="rounded-2xl h-full w-full bg-white/90 backdrop-blur p-6">
                        <div className="relative mb-5">
                          <div className="absolute -inset-3 opacity-20 blur-xl bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl" />
                          <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-blue-600 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M3.75 6A.75.75 0 0 1 4.5 5.25h15a.75.75 0 0 1 0 1.5h-15A.75.75 0 0 1 3.75 6Zm0 6c0-.414.336-.75.75-.75h15a.75.75 0 0 1 0 1.5h-15A.75.75 0 0 1 3.75 12Zm.75 4.5a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-gray-900">{f.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Flex>
            </Container>
          </Section>

          {/* FAQs */}
          <Section size="3" className="py-24 relative">
            <Container size="4" className="px-2 sm:px-0">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">FAQ</div>
                <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">Answers to common questions</span>
                </h3>
                <p className="mt-3 text-gray-600 max-w-2xl mx-auto">If you have more questions, our team is here 24/7.</p>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: 'How do I sign up?',
                    a: 'Click Start Free or Create Account, sign in with Google, and you are set.'
                  },
                  {
                    q: 'Is my data secure?',
                    a: 'We use Google OAuth, token rotation, and encrypted transport for safety.'
                  },
                  {
                    q: 'Can I invite my team?',
                    a: 'Yes, collaborate by inviting teammates and managing roles in settings.'
                  },
                  {
                    q: 'Do you have support?',
                    a: 'Absolutely — real humans 24/7 with fast response times.'
                  }
                ].map((f, i) => (
                  <div key={i} className="rounded-2xl p-6 bg-white shadow-sm border border-gray-100 mx-2 sm:mx-0">
                    <div className="text-lg font-bold text-gray-900">{f.q}</div>
                    <p className="mt-2 text-sm text-gray-600">{f.a}</p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>

          {/* Final CTA */}
          <Section size="3" className="py-16">
            <Container size="4" className="px-2 sm:px-0">
              <div className="relative rounded-3xl overflow-hidden mx-2 sm:mx-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-95" />
                <div className="relative p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-extrabold text-white">Ready to get covered?</h4>
                      <p className="mt-2 text-blue-50 max-w-md">Join GetCovered.io and take control with a modern, secure dashboard built for you.</p>
                    </div>
                    <div className="flex md:justify-end">
                      <div className="flex gap-3">
                        <Button size="3" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => navigate('/signup')}>Get Started</Button>
                        <Button size="3" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => navigate('/')}>Back Home</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </Theme>
  );
};

export default LearnMore;


