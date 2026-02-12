import React, { useRef } from 'react';
import { Mail, Phone } from 'lucide-react';
import helloImage from '../assets/hello.png';

const Contact = () => {
  const contactRef = useRef(null);

  return (
    <section
      ref={contactRef}
      className="bg-[#0e0f1a] py-20 px-6 w-full flex justify-center"
    >
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-[#1b1c2e] to-[#161925] p-10 rounded-3xl shadow-[0_0_60px_rgba(0,255,255,0.05)]">
        
        {/* Contact Text Section */}
        <div className="space-y-6 text-white">
          <p className="text-xl text-cyan-400">How can we help you?</p>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Contact us
          </h2>
          <p className="text-xl text-gray-300 max-w-md">
            We’re here to help and answer any questions you might have. We look forward to hearing from you!
          </p>

          <div className="space-y-4 text-xl">
            <div className="flex items-center text-gray-300">
              <Phone className="text-cyan-400 w-5 h-5 mr-3" />
              <span>+91 9410748512</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="text-cyan-400 w-5 h-5 mr-3" />
              <span>killswitch2025@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Contact Image */}
        <div className="space-y-6 flex justify-center">
          <img
            src={helloImage}
            alt="Contact Us"
            className="rounded-2xl shadow-lg  w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
