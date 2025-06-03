"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Tag,
  BarChart3,
  RefreshCw,
  Users,
  Link2,
  Rocket,
  CheckCircle2,
  Star,
  MessageSquare,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-gray-900 font-extrabold text-lg">IM</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Inventory MS
              </h1>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {["Features", "Testimonials", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </nav>
            <div className="flex space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-800/50 backdrop-blur-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-900 hover:from-cyan-500 hover:to-purple-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium bg-gray-800/80 text-cyan-400 backdrop-blur-md mb-6 hover:bg-gray-700/80 transition-all">
                <Rocket className="w-4 h-4 mr-2" />
                Trusted by 10,000+ businesses worldwide
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8"
            >
              Inventory Management
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Reinvented
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionize your business with our free, intuitive inventory
              management platform. Track products, manage stock, and optimize
              operations with real-time insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-900 hover:from-cyan-500 hover:to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 relative overflow-hidden backdrop-blur-sm"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400"
            >
              {[
                {
                  text: "Completely free",
                  icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
                },
                {
                  text: "No credit card needed",
                  icon: <Star className="w-4 h-4 text-purple-400" />,
                },
                {
                  text: "Instant access",
                  icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
                },
              ].map((item, index) => (
                <div key={item.text} className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                value: "10K+",
                label: "Active Users",
                color: "text-cyan-400",
                icon: <Users className="w-10 h-10 mx-auto mb-3" />,
              },
              {
                value: "1M+",
                label: "Products Tracked",
                color: "text-purple-400",
                icon: <Package className="w-10 h-10 mx-auto mb-3" />,
              },
              {
                value: "99.9%",
                label: "Uptime",
                color: "text-green-400",
                icon: <BarChart3 className="w-10 h-10 mx-auto mb-3" />,
              },
              {
                value: "24/7",
                label: "Support",
                color: "text-orange-400",
                icon: <MessageSquare className="w-10 h-10 mx-auto mb-3" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <div className={`${stat.color}`}>{stat.icon}</div>
                <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Everything you need to manage inventory
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Powerful, free features designed to streamline your inventory
              management and supercharge your business efficiency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Package className="w-8 h-8" />,
                title: "Real-time Inventory Tracking",
                description:
                  "Monitor stock levels in real-time across multiple locations with instant low-stock alerts.",
                gradient: "from-cyan-400 to-cyan-600",
              },
              {
                icon: <Tag className="w-8 h-8" />,
                title: "Smart Product Management",
                description:
                  "Organize products with tags, categories, and barcode scanning for seamless management.",
                gradient: "from-green-400 to-green-600",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Analytics",
                description:
                  "Gain insights with customizable reports and dashboards to track trends and forecast demand.",
                gradient: "from-purple-400 to-purple-600",
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Automated Workflows",
                description:
                  "Automate reorder points and supplier notifications to save time and streamline operations.",
                gradient: "from-orange-400 to-orange-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description:
                  "Assign roles, manage permissions, and track changes for team accountability.",
                gradient: "from-red-400 to-red-600",
              },
              {
                icon: <Link2 className="w-8 h-8" />,
                title: "Seamless Integrations",
                description:
                  "Connect with your tools via API, webhooks, and pre-built integrations.",
                gradient: "from-cyan-400 to-purple-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-6 rounded-2xl shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1 backdrop-blur-md border border-gray-700/50"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Loved by businesses worldwide
            </h2>
            <p className="text-lg text-gray-400">
              Hear from our users about how Inventory MS transforms their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                "Inventory MS has streamlined our warehouse operations. Real-time
                tracking and automated alerts ensure we never miss a beat."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                  JS
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">John Smith</div>
                  <div className="text-gray-400 text-sm">
                    Operations Manager, TechCorp
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                "The dashboards and reports give us clear insights into inventory
                trends, boosting our efficiency by 40%."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                  MJ
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">
                    Maria Johnson
                  </div>
                  <div className="text-gray-400 text-sm">CEO, RetailPlus</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                "Intuitive and packed with features. We switched from our old
                system in a week and saw instant improvements."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                  DL
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white">David Lee</div>
                  <div className="text-gray-400 text-sm">
                    Warehouse Manager, LogiFlow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Transform your inventory management
          </h2>
          <p className="text-lg text-gray-200 mb-10 max-w-3xl mx-auto">
            Join thousands of businesses using Inventory MS to streamline
            operations and boost efficiency, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 backdrop-blur-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-900 font-extrabold text-lg">IM</span>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">Inventory MS</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate free inventory management platform for modern
                businesses. Streamline operations and boost efficiency today.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Inventory Management System. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}