import React from 'react';
import { Theme, Button, Flex, Text, Container, Section } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import '@radix-ui/themes/styles.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <main>
          {/* Hero Section */}
          <Section size="3" className="py-20">
            <Container size="4">
              <Flex direction="column" gap="4" align="center" className="text-center opacity-0 translate-y-4 animate-[fadeInUp_600ms_ease-out_forwards]">
                <Text size="9" weight="bold" className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 transition-colors duration-300">
                  Welcome to GetCovered.io
                </Text>
                <Text size="5" color="gray" className="transition-colors duration-300">
                  Your trusted platform for comprehensive coverage solutions
                </Text>
                <Flex gap="4" mt="6" className="opacity-0 translate-y-2 animate-[fadeInUp_800ms_ease-out_forwards]">
                  <Button
                    size="4"
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="4"
                    variant="soft"
                    onClick={() => navigate('/signup')}
                    className="bg-gray-200 hover:bg-gray-300 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Create Account
                  </Button>
                </Flex>
              </Flex>
            </Container>
          </Section>

          {/* Features Section */}
          <Section size="3" className="py-20 bg-white">
            <Container size="4">
              <Flex direction="column" gap="8">
                <Text size="8" weight="bold" align="center" className="mb-8">
                  Why Choose GetCovered.io?
                </Text>
                <Flex gap="6" justify="center" wrap="wrap">
                  {[
                    {
                      title: 'Secure Platform',
                      description: 'Enterprise-grade security with Google OAuth integration'
                    },
                    {
                      title: 'Easy Management',
                      description: 'Intuitive dashboard for all your coverage needs'
                    },
                    {
                      title: 'Expert Support',
                      description: '24/7 support from our dedicated team'
                    }
                  ].map((feature, index) => (
                    <Flex
                      key={index}
                      direction="column"
                      gap="2"
                      className="w-[300px] p-6 rounded-xl bg-gray-50 opacity-0 translate-y-4 animate-[fadeInUp_600ms_ease-out_forwards]"
                      style={{ animationDelay: `${index * 100 + 200}ms` }}
                    >
                      <Text size="6" weight="bold" className="transition-colors duration-300">
                        {feature.title}
                      </Text>
                      <Text size="3" color="gray" className="transition-colors duration-300">
                        {feature.description}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Container>
          </Section>
        </main>
      </div>
    </Theme>
  );
};

export default Home;