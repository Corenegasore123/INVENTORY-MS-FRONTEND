import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inventory MS
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </nav>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                🚀 Trusted by 10,000+ businesses worldwide
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Inventory Management
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your business with our powerful, intuitive inventory management platform. Track products, manage
              stock levels, and optimize your operations with real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
              >
                Watch Demo
              </Link>
            </div>
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Products Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to manage inventory</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your inventory management and boost your business efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Real-time Inventory Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your stock levels in real-time across multiple locations. Get instant alerts when items are
                running low and never run out of stock again.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏷️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Product Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize products with categories, tags, and custom fields. Bulk import/export capabilities and barcode
                scanning for efficient management.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed insights with customizable reports and dashboards. Track trends, forecast demand, and make
                data-driven decisions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Automated Workflows</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up automatic reorder points, supplier notifications, and workflow triggers to streamline your
                operations and save time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage user permissions, assign roles, and collaborate with your team. Track who made changes and when
                for complete accountability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Seamless Integrations</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with your existing tools and platforms. API access, webhooks, and pre-built integrations with
                popular business software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Up to 1,000 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">5 inventory locations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Basic reporting</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 rounded-lg font-semibold transition-colors block text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 transform scale-105 shadow-xl">
              <div className="text-center">
                <div className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold mb-4">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span>Up to 10,000 products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span>Unlimited locations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span>API access</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-colors block text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Unlimited products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Unlimited locations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">24/7 phone support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 rounded-lg font-semibold transition-colors block text-center"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by businesses worldwide</h2>
            <p className="text-xl text-gray-600">See what our customers have to say about Inventory MS</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Inventory MS has completely transformed how we manage our warehouse. The real-time tracking and
                automated alerts have saved us countless hours and prevented stockouts."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">John Smith</div>
                  <div className="text-gray-500 text-sm">Operations Manager, TechCorp</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The analytics and reporting features are incredible. We can now make data-driven decisions about our
                inventory and have improved our efficiency by 40%."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Maria Johnson</div>
                  <div className="text-gray-500 text-sm">CEO, RetailPlus</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Easy to use, powerful features, and excellent customer support. We migrated from our old system in just
                one week and haven't looked back since."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  DL
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">David Lee</div>
                  <div className="text-gray-500 text-sm">Warehouse Manager, LogiFlow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your inventory management?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of businesses that trust Inventory MS to streamline their operations and boost efficiency.
            Start your free trial today!
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
                The most powerful and intuitive inventory management platform for modern businesses. Streamline your
                operations and boost efficiency today.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
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
            <p>© 2025 Inventory Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
