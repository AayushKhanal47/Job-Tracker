import { Link } from "react-router-dom";
import { CheckCircle, Bell, Users, ArrowRight, Star } from "lucide-react";

const steps = [
  {
    title: "Create Account",
    description:
      "Sign up as a user or admin to get started with your job search journey.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Browse Jobs",
    description:
      "Explore thousands of job listings tailored to your skills and preferences.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Apply & Track",
    description:
      "Submit applications and monitor your progress with real-time updates.",
    icon: <Bell className="w-6 h-6" />,
  },
  {
    title: "Get Hired",
    description:
      "Manage offers, negotiate terms, and land your dream position.",
    icon: <Star className="w-6 h-6" />,
  },
];

const features = [
  {
    title: "Smart Application Tracking",
    description:
      "Organize and monitor all your job applications with intelligent status updates and reminders.",
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Real-Time Notifications",
    description:
      "Never miss an opportunity with instant alerts for application updates and deadlines.",
    icon: <Bell className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Role-Based Dashboard",
    description:
      "Customized experience for job seekers and recruiters with secure access controls.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
  },
];

const testimonials = [
  {
    quote:
      "JobTracker transformed my job search completely. I landed my dream role in just 3 weeks!",
    author: "Aayush Khanal",
    role: "Software Engineer",
    rating: 5,
  },
  {
    quote:
      "The organization features and notifications kept me on top of every opportunity. Highly recommend!",
    author: "Ryan Giggs",
    role: "Product Manager",
    rating: 5,
  },
  {
    quote:
      "As a recruiter, the admin features give me perfect control over candidate management.",
    author: "Rohit Sharma",
    role: "HR Director",
    rating: 5,
  },
];

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Track your career journey
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Land Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Dream Job
                  </span>{" "}
                  Faster
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Stay organized and never miss an opportunity. Track
                  applications, manage interviews, and secure offers all in one
                  powerful platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup?role=USER"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-200">
                  See How It Works
                </a>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
              </div>
            </div>

            <div id="how-it-works" className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-gray-600">
                  Simple steps to transform your job search
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and
              maximize your success rate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Job Seekers Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Join them who've transformed their careers with JobTracker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-16">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join with our successful job seekers who've found their dream
                roles with JobTracker
              </p>
              <Link
                to="/signup?role=USER"
                className="group inline-flex items-center px-10 py-5 bg-white text-blue-700 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Your Journey Today
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-blue-200 text-sm mt-4">
                Free for everyone • Setup in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
