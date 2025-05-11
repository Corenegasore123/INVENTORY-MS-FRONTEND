import type React from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, BoxIcon, CheckCircle, ClipboardList, Settings, Truck, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <BoxIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">InventoryPro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Streamline Your Inventory Management
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Track, manage, and optimize your inventory with our powerful and intuitive platform. Save time, reduce
                costs, and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/auth/register"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-center"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#demo"
                  className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors text-center"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-500 rounded-lg"></div>
                <img
                  src="/invdash.png"
                  alt="Inventory Management Dashboard"
                  className="relative rounded-lg shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">5,000+</p>
              <p className="text-gray-600 mt-2">Businesses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">10M+</p>
              <p className="text-gray-600 mt-2">Products Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">99.9%</p>
              <p className="text-gray-600 mt-2">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">24/7</p>
              <p className="text-gray-600 mt-2">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your inventory efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BoxIcon className="h-10 w-10 text-indigo-600" />}
              title="Inventory Tracking"
              description="Track inventory levels across multiple locations with real-time updates and alerts."
            />
            <FeatureCard
              icon={<ClipboardList className="h-10 w-10 text-indigo-600" />}
              title="Product Management"
              description="Manage product details, categories, and variants with ease."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-indigo-600" />}
              title="Analytics & Reports"
              description="Gain insights with powerful analytics and customizable reports."
            />
            <FeatureCard
              icon={<Truck className="h-10 w-10 text-indigo-600" />}
              title="Order Management"
              description="Track orders, manage fulfillment, and update inventory automatically."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-indigo-600" />}
              title="User Permissions"
              description="Control access with role-based permissions for your team members."
            />
            <FeatureCard
              icon={<Settings className="h-10 w-10 text-indigo-600" />}
              title="Customizable"
              description="Tailor the system to your specific business needs and workflows."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple onboarding process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and set up your company profile.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Import Data</h3>
              <p className="text-gray-600">Import your existing inventory data or start from scratch.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Managing</h3>
              <p className="text-gray-600">Begin tracking and optimizing your inventory right away.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Trusted by thousands of businesses worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="InventoryPro has transformed how we manage our warehouse. We've reduced stockouts by 75% and improved efficiency across the board."
              author="Sarah Johnson"
              company="Retail Solutions Inc."
            />
            <TestimonialCard
              quote="The analytics features alone are worth the investment. We now have real-time insights into our inventory that have helped us make better business decisions."
              author="Michael Chen"
              company="Global Distributors"
            />
            <TestimonialCard
              quote="Customer support is exceptional. Any time we've had questions, the team has been quick to respond and incredibly helpful."
              author="Jessica Martinez"
              company="Artisan Crafts Co."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that's right for your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$49"
              period="per month"
              description="Perfect for small businesses just getting started"
              features={[
                "Up to 1,000 products",
                "2 user accounts",
                "Basic reporting",
                "Email support",
                "1 inventory location",
              ]}
              buttonText="Start Free Trial"
              buttonLink="/auth/register"
              highlighted={false}
            />
            <PricingCard
              title="Professional"
              price="$99"
              period="per month"
              description="Ideal for growing businesses with multiple locations"
              features={[
                "Up to 10,000 products",
                "10 user accounts",
                "Advanced reporting",
                "Priority email support",
                "5 inventory locations",
                "API access",
              ]}
              buttonText="Start Free Trial"
              buttonLink="/auth/register"
              highlighted={true}
            />
            <PricingCard
              title="Enterprise"
              price="$249"
              period="per month"
              description="For large businesses with complex inventory needs"
              features={[
                "Unlimited products",
                "Unlimited user accounts",
                "Custom reporting",
                "24/7 phone & email support",
                "Unlimited inventory locations",
                "API access",
                "Dedicated account manager",
              ]}
              buttonText="Contact Sales"
              buttonLink="/contact"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to optimize your inventory?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust InventoryPro to manage their inventory efficiently.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-indigo-600 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BoxIcon className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">InventoryPro</span>
              </div>
              <p className="text-gray-400">
                Streamline your inventory management with our powerful and intuitive platform.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} InventoryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  company,
}: {
  quote: string
  author: string
  company: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="mb-4 text-indigo-600">
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-600 mb-4">{quote}</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-500 text-sm">{company}</p>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted,
}: {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  highlighted: boolean
}) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${
        highlighted ? "border-2 border-indigo-600 shadow-xl scale-105 z-10" : "border border-gray-200 shadow-md"
      }`}
    >
      {highlighted && <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">Most Popular</div>}
      <div className="p-6 bg-white">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-500 ml-2">{period}</span>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link
          href={buttonLink}
          className={`block w-full text-center py-2 px-4 rounded-md font-medium ${
            highlighted
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
          } transition-colors`}
        >
          {buttonText}
        </Link>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
