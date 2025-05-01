import { Link, Navigate, Outlet } from "react-router-dom";
// import { motion } from "framer-motion";
import { motion } from "motion/react"
import { Categories, Categories_new, howItWorks } from "../../data/dummydata"
// import { Briefcase, Home, Scissors, Wrench, Search, SlidersHorizontal, CalendarCheck, Star, Users, CheckCircle } from "lucide-react";
import { FaRectangleList, FaUsersViewfinder, FaCodeCompare, FaCalendarCheck, FaUsers , FaArrowUpRightDots, FaUsersRays} from "react-icons/fa6";

const Homepage = () => {
    return (
        <div className="bg-base-100 text-base-content">
            {/* <h1 className="text-3xl font-bold underline text-red-500">
                Hello world!
            </h1> */}
            {/* Hero Section */}
            {/* <section className="hero min-h-screen bg-primary text-primary-content">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold">Find Local Services Easily</h1>
                        <p className="py-6">Search, discover, and book services near you in just a few clicks.</p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <input type="text" placeholder="Search services..." className="input input-bordered w-full max-w-xs" />
                            <button className="btn btn-accent">Search</button>
                        </div>
                    </div>
                </div>
            </section>
             */}

            <section className="container mx-auto my-12 p-6 text-center ">
                <h2 className="text-3xl font-bold text-gray-800">Find the Best Services Near You</h2>
                <p className="mt-4 text-gray-600">Browse and connect with trusted professionals.</p>                 
                <Link to="/services" className="mt-6 btn btn-primary" >Get Started</Link>
            </section>
            {/* <div className="section-head container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div>
                        <span className="text-xl text-[#FFB600] font-semibold">Categories</span>
                        <h2 className="text-3xl font-bold text-[#022279]">Popular Categories</h2>
                    </div>

                    <!-- Right Column -->
                    <div className="text-[#0E1215]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </div>
            </div> */}
            {/* Popular Categories */}
            <section className="py-16 px-4 text-center bg-base-100">
                {/* <h2 className="text-3xl font-bold mb-8">Popular Categories</h2> */}
                <div className="mb-8">
                    <span className="text-xl text-[#FFB600] font-semibold">Categories</span>
                    <h2 className="text-3xl font-bold text-[#022279]">Popular Categories</h2>
                </div>
                {/* 
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {Categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            className="card bg-base-200 shadow-md p-6 items-center justify-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <div className="text-primary mb-2">{cat.icon}</div>
                            <div className="text-lg font-semibold">{cat.name}</div>
                        </motion.div>
                    ))}
                </div> */}

                <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {Categories_new.map((cat, i) => (
                        <motion.div
                            key={i}
                            className="card card-side bg-base-200 shadow-md p-6 items-center justify-center hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >

                            <figure className=" ">
                                <div className=" ">
                                    {/* <img src={`../src/assets${cat.image}`} alt={cat.title} /> */}
                                    <img src={cat.image} alt={cat.title} />
                                </div>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-sm">{cat.title}</h2>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
            {/* How It Works */}
            {/* <section className="bg-base-200 py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {howItWorks.map((step, i) => (
                        <motion.div
                            key={i}
                            className="card shadow-md p-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.15 }}
                        >
                            <div className="mb-4 text-primary">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p>{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section> */}
            <section className="bg-base-100 py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto rounded-xl bg-primary p-16">
                    <div className="card   bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <div className="bg-yellow-500 w-20 h-20 rounded-full flex justify-center items-center shadow-lg">
                                <FaUsersViewfinder className="text-white text-4xl" />
                            </div>
                            <h2 className="card-title">Search Services</h2>
                            <p>
                                Easily find services near you by category or location.
                            </p>

                        </div>
                    </div>
                    <div className="card   bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <div className="bg-yellow-500 w-20 h-20 rounded-full flex justify-center items-center shadow-lg">
                                <FaCodeCompare className="text-white text-4xl" />
                            </div>
                            <h2 className="card-title">Compare Options</h2>
                            <p>
                                Check reviews, pricing, and availability before booking.
                            </p>

                        </div>
                    </div>
                    <div className="card   bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <div className="bg-yellow-500 w-20 h-20 rounded-full flex justify-center items-center shadow-lg">
                                <FaCalendarCheck className="text-white text-4xl" />
                            </div>
                            <h2 className="card-title">Book Instantly</h2>
                            <p>
                                Schedule and book services directly through the platform.
                            </p>

                        </div>
                    </div>



                </div>
            </section>
            {/* Call to Action */}
            {/* <section className="bg-primary text-primary-content py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to find the right service?</h2>
                <p className="mb-6">Join us today and connect with top professionals.</p>
                <button className="btn btn-accent">Get Started</button>
            </section> */}

            <section className="bg-base-300   py-16 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to find the right service?</h2>
                <p className="mb-6">Join us today and connect with top professionals.</p>
                <Link to="/signup" className="btn btn-accent" >Get Started</Link>
            </section>
            {/* 
            <section className="py-16 px-4 text-center bg-base-300">
                <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
                <p className="mb-4">Connect with local service providers and customers.</p>
                <button className="btn btn-primary">Sign Up Now</button>
            </section> */}

            {/* Why choose us? */}
            <section className="bg-base-100 py-16 px-4 text-center">
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto rounded-xl bg-primary p-16"
                  
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.4, delay:  0.15 }}
                >
                    <div className="items-left text-left text-base-100">
                        <h2 className="text-warning uppercase font-semibold">Choose</h2>
                        <h2 className="text-3xl font-bold mb-4 text-base-100 ">Why Choose Us?</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <ul className="list rounded-box shadow-md">
                            <li className="list-row hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out">
                                <div className="bg-base-100 w-20 h-20 rounded-xl flex justify-center items-center shadow-lg">
                                    <FaUsers className="bg-yellow-500 text-4xl" />
                                </div>
                                <div>
                                    <h4 className="text-warning uppercase font-semibold">Meet new customers</h4>
                                    <p>Suspendisse tincidunt rutrum ante. Vestibulum elementum ipsum sit amet turpis elementum lobortis.</p>
                                </div>
                            </li>
                            <li className="list-row hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out">
                                <div className="bg-base-100 w-20 h-20 rounded-xl flex justify-center items-center shadow-lg">
                                    <FaArrowUpRightDots className="bg-yellow-500 text-4xl" />
                                </div>
                                <div>
                                    <h4 className="text-warning uppercase font-semibold">Grow your revenue</h4>
                                    <p>Suspendisse tincidunt rutrum ante. Vestibulum elementum ipsum sit amet turpis elementum lobortis.</p>
                                </div>
                            </li>
                            <li className="list-row hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out">
                                <div className="bg-base-100 w-20 h-20 rounded-xl flex justify-center items-center shadow-lg">
                                    <FaUsersRays className="bg-yellow-500 text-4xl" />
                                </div>
                                <div>
                                    <h4 className="text-warning uppercase font-semibold">Build your online reputation</h4>
                                    <p>Suspendisse tincidunt rutrum ante. Vestibulum elementum ipsum sit amet turpis elementum lobortis.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="flex justify-center items-center">
                        {/* <img src="../src/assets/images/pic1.jpg" alt="Why Choose Us" className="rounded-lg shadow-lg" /> */}
                        <img src="/images/pic1.jpg" alt="Why Choose Us" />
                    </div>
                </motion.div>
            </section>


        </div>

    )
}

export default Homepage;