import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function About() {
  const { profile, isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-white text-black md:pt-15">
      {/* Hero Section */}
      <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-3xl text-center sm:text-4xl font-bold mb-4">
              About <br />
              <span className="text-orange-500">PAL Robotics</span>
            </h1>
            <p className="text-gray-600 leading-relaxed text-justify">
              Research, Logistics, and Retail with Humanoid Mobility. We design
              cutting-edge humanoid and mobile robots that seamlessly navigate
              complex environments, optimizing workflows and elevating customer
              experiences.Our robots support researchers with precise data
              collection, streamline logistics with efficient transport, and
              engage shoppers with personalized retail interations RoboVation
              delivers adaptable solutions for a smarter, more efficient future.
              Partner with us to unlock new possibilities in automation and
              innovation.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src="/images/illustration3.jpg"
            alt="Robotics Illustration"
            className="md:block w-full md:h-120 rounded-2xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 px-4 sm:px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeUp}
            className="p-6 rounded-xl bg-linear-to-b from-black to-orange-500 text-center shadow-md"
          >
            <h2 className="text-xl font-semibold mb-3 text-orange-500">
              Our Mission
            </h2>
            <p className="text-white/90">
              To democratize access to robotics investment by allowing
              individuals to earn predictable returns from automated systems.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-6 rounded-xl bg-linear-to-b from-black to-orange-500 text-center shadow-md"
          >
            <h2 className="text-xl font-semibold mb-3 text-orange-500">
              Our Vision
            </h2>
            <p className="text-white/90">
              To become a leading robotics investment platform in emerging
              markets through transparency, innovation, and trust.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-10">
            How Investments Generate Returns
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "1. Robot Deployment",
                "Funds are used to deploy robots in revenue-generating environments.",
              ],
              [
                "2. Revenue Generation",
                "Robots operate continuously, generating income through services.",
              ],
              [
                "3. Investor Returns",
                "Investors receive fixed ROI based on selected plans.",
              ],
            ].map(([title, desc], i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 bg-white rounded-xl shadow-lg"
              >
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src="/images/illustration4.jpg"
            alt="Security Illustration"
            className="md:block w-full rounded-2xl"
            loading="lazy"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold mb-4">Trust & Transparency</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Fixed investment plans</li>
              <li>• Automated payouts</li>
              <li>• Secure MTN & Airtel mobile payments</li>
              <li>• Clear investment terms</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-black text-white py-12 px-4 sm:px-6 lg:px-12"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-3 text-orange-500">
            Risk Disclosure
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            All investments carry risk. While we aim to provide predictable
            returns through robotics automation, returns are not guaranteed.
            Users are encouraged to invest responsibly.
          </p>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="pt-10 pb-16 px-4 sm:px-6 lg:px-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Start Investing?</h2>
        <p className="text-gray-600 mb-6">
          Explore our investment plans and become part of the robotics future.
        </p>
        {!isAuthenticated && (
          <a
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
          >
            Get Started
          </a>
        )}
      </motion.section>
    </div>
  );
}
