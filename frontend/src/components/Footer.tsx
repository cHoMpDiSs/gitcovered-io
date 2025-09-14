import React from 'react';
import { Container, Text } from '@radix-ui/themes';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/70 backdrop-blur relative">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.06), transparent 35%), radial-gradient(circle at 80% 90%, rgba(6,182,212,0.06), transparent 35%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <Container size="4" className="px-4 sm:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700">GetCovered.io</div>
            <Text size="2" color="gray" className="mt-2 block max-w-xs">Modern coverage management with clarity and confidence.</Text>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">Product</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a className="hover:text-gray-900" href="/learn-more">Learn more</a></li>
              <li><a className="hover:text-gray-900" href="/signup">Create account</a></li>
              <li><a className="hover:text-gray-900" href="/signin">Sign in</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">Company</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a className="hover:text-gray-900" href="/">Home</a></li>
              <li><a className="hover:text-gray-900" href="/learn-more#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">Legal</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a className="hover:text-gray-900" href="#">Privacy</a></li>
              <li><a className="hover:text-gray-900" href="#">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Text size="1" color="gray">© {new Date().getFullYear()} GetCovered.io. All rights reserved.</Text>
          <div className="flex items-center gap-3 text-gray-500">
            <a href="https://getcovered-io-d59e2aaeeb96.herokuapp.com" className="text-xs hover:text-gray-700">Status</a>
            <span className="text-gray-300">•</span>
            <a href="/learn-more" className="text-xs hover:text-gray-700">About</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;


