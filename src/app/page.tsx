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
  Mail,
  Phone,
  HelpCircle,
  Shield,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inventory MS
              </h1>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {["Features", "Pricing", "Testimonials", "Contact"].map(
                (item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
                  </motion.a>
                )
              )}
            </nav>
            <div className="flex space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6 hover:bg-blue-200 transition-colors cursor-default">
                <Rocket className="w-4 h-4 mr-2" />
                Trusted by 10,000+ businesses worldwide
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
            >
              Inventory Management
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform your business with our powerful, intuitive inventory
              management platform. Track products, manage stock levels, and
              optimize your operations with real-time insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/login"
                className="group border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all relative overflow-hidden"
              >
                <span className="relative z-10">Watch Demo</span>
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500"
            >
              {[
                {
                  text: "No credit card required",
                  icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
                },
                {
                  text: "14-day free trial",
                  icon: <Star className="w-4 h-4 text-blue-500" />,
                },
                {
                  text: "Cancel anytime",
                  icon: <RefreshCw className="w-4 h-4 text-purple-500" />,
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                value: "10K+",
                label: "Active Users",
                color: "text-blue-600",
                icon: <Users className="w-8 h-8 mx-auto mb-2" />,
              },
              {
                value: "1M+",
                label: "Products Tracked",
                color: "text-purple-600",
                icon: <Package className="w-8 h-8 mx-auto mb-2" />,
              },
              {
                value: "99.9%",
                label: "Uptime",
                color: "text-green-600",
                icon: <BarChart3 className="w-8 h-8 mx-auto mb-2" />,
              },
              {
                value: "24/7",
                label: "Support",
                color: "text-orange-600",
                icon: <MessageSquare className="w-8 h-8 mx-auto mb-2" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="transform hover:scale-105 transition-transform"
              >
                <div className={`${stat.color}`}>{stat.icon}</div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage inventory
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your inventory management
              and boost your business efficiency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="w-8 h-8" />,
                title: "Real-time Inventory Tracking",
                description:
                  "Monitor your stock levels in real-time across multiple locations. Get instant alerts when items are running low and never run out of stock again.",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: <Tag className="w-8 h-8" />,
                title: "Smart Product Management",
                description:
                  "Organize products with categories, tags, and custom fields. Bulk import/export capabilities and barcode scanning for efficient management.",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Analytics",
                description:
                  "Get detailed insights with customizable reports and dashboards. Track trends, forecast demand, and make data-driven decisions.",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Automated Workflows",
                description:
                  "Set up automatic reorder points, supplier notifications, and workflow triggers to streamline your operations and save time.",
                gradient: "from-orange-500 to-orange-600",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description:
                  "Manage user permissions, assign roles, and collaborate with your team. Track who made changes and when for complete accountability.",
                gradient: "from-red-500 to-red-600",
              },
              {
                icon: <Link2 className="w-8 h-8" />,
                title: "Seamless Integrations",
                description:
                  "Connect with your existing tools and platforms. API access, webhooks, and pre-built integrations with popular business software.",
                gradient: "from-indigo-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                features: [
                  "Up to 1,000 products",
                  "5 inventory locations",
                  "Basic reporting",
                  "Email support",
                ],
                highlight: "border-gray-200",
                button: "bg-gray-900 hover:bg-gray-800",
              },
              {
                name: "Professional",
                price: "$79",
                features: [
                  "Up to 10,000 products",
                  "Unlimited locations",
                  "Advanced reporting",
                  "Priority support",
                  "API access",
                ],
                popular: true,
                highlight: "border-blue-500 shadow-2xl scale-105 z-10",
                button: "bg-blue-600 hover:bg-blue-700",
              },
              {
                name: "Enterprise",
                price: "$199",
                features: [
                  "Unlimited products",
                  "Unlimited locations",
                  "Custom reporting",
                  "24/7 support",
                  "Custom integrations",
                  "Dedicated account manager",
                ],
                highlight: "border-gray-200",
                button: "bg-gray-900 hover:bg-gray-800",
              },
            ].map((plan, index, arr) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col justify-between bg-white border-2 ${plan.highlight} rounded-2xl p-8 hover:border-blue-300 transition-all transform hover:-translate-y-1 relative min-h-[520px]`}
                style={{ minHeight: "520px" }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 tracking-tight">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto flex items-end justify-center">
                  <Link
                    href="/signup"
                    className={`w-full ${plan.button} text-white py-3 rounded-lg font-semibold transition-colors block text-center transform hover:scale-105 shadow-md`}
                    style={{ marginTop: "auto" }}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by businesses worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Inventory MS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Inventory MS has completely transformed how we manage our
                warehouse. The real-time tracking and automated alerts have
                saved us countless hours and prevented stockouts."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">John Smith</div>
                  <div className="text-gray-500 text-sm">
                    Operations Manager, TechCorp
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The analytics and reporting features are incredible. We can now
                make data-driven decisions about our inventory and have improved
                our efficiency by 40%."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">
                    Maria Johnson
                  </div>
                  <div className="text-gray-500 text-sm">CEO, RetailPlus</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Easy to use, powerful features, and excellent customer support.
                We migrated from our old system in just one week and haven't
                looked back since."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  DL
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">David Lee</div>
                  <div className="text-gray-500 text-sm">
                    Warehouse Manager, LogiFlow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your inventory management?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of businesses that trust Inventory MS to streamline
            their operations and boost efficiency. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IM</span>
                </div>
                <h3 className="text-2xl font-bold">Inventory MS</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most powerful and intuitive inventory management platform
                for modern businesses. Streamline your operations and boost
                efficiency today.
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
                    Pricing
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
