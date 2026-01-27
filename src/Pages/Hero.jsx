import React from 'react';

const Hero = () => {
    const logoPng = "https://i.ibb.co/8D7LzwTD/image-removebg-preview-1.png";

    return (
        <div className="w-full bg-gradient-to-b from-fuchsia-800 to-violet-900 text-white">
            {/* Main Hero Content */}
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
                {/* Logo + Welcome Text */}
                <div className="flex gap-2 items-end justify-center">
                    <img
                        src={logoPng}
                        alt=""
                        className="h-20"
                    />
                    <h1 className="text-3xl md:text-5xl text-green-400 font-medium welcomeFont text-left">
                        Welcome to <br /> <span className=" text-white logoFont font-bold">ASTERDESK</span>
                    </h1>
                </div>

                <p className="text-xl md:text-2xl py-4 md:py-6 font-medium text-gray-400 logoFont">
                    EXPLORE TOP-TIER SUBSCRIPTIONS WITH MASTERDESK
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button className="px-8 py-4 bg-white text-violet-900 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer">
                        Browse Plan
                    </button>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold rounded-lg shadow-lg transition">
                        Sign Up Now
                    </button>
                </div>
            </div>

            {/* How It Works Section */}

        </div>
    );
};

export default Hero;