import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-primary">YourBrand</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="text-gray-600 hover:text-primary">Home</a>
          <a href="#" className="text-gray-600 hover:text-primary">Features</a>
          <a href="#" className="text-gray-600 hover:text-primary">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-primary text-white">
        <h2 className="text-4xl md:text-5xl font-bold">Build, Manage & Grow</h2>
        <p className="mt-4 text-lg md:text-xl">The ultimate platform for creators & editors</p>
        <button className="mt-6 px-6 py-3 bg-white text-primary font-bold rounded-md hover:bg-gray-200">
          Start for Free
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12">
        <h3 className="text-3xl font-bold text-center">Why Choose Us?</h3>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h4 className="text-xl font-bold text-primary">Seamless Collaboration</h4>
            <p className="text-gray-600 mt-2">Assign editors, manage projects & streamline workflows.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h4 className="text-xl font-bold text-primary">Deadline Reminders</h4>
            <p className="text-gray-600 mt-2">Get notified before deadlines to stay on track.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h4 className="text-xl font-bold text-primary">Effortless Video Queue</h4>
            <p className="text-gray-600 mt-2">Easily request & upload videos with a structured queue.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-secondary text-white">
        <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
        <p className="mt-2 text-lg">Join thousands of creators & editors today.</p>
        <button className="mt-6 px-6 py-3 bg-white text-secondary font-bold rounded-md hover:bg-gray-200">
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 bg-gray-200">
        © 2025 YourBrand. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
