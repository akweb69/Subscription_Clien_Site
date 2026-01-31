import useSettingsData from '@/Admin/Hooks/useSettingsData';
import { AppContext } from '@/context/AppContext';
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const logoPng = "https://i.ibb.co/8D7LzwTD/image-removebg-preview-1.png";
    const { settingsLoading, settingsData } = useSettingsData();
    const { user, loading } = React.useContext(AppContext);

    return (
        <div className="w-full bg-gradient-to-b from-fuchsia-800 to-violet-900 text-white">
            {/* Main Hero Content */}
            <div className="w-11/12 mx-auto  py-16 md:py-24 text-center">
                {/* Logo + Welcome Text */}
                <div className="flex gap-1  items-end justify-center">
                    <img
                        src={logoPng}
                        alt=""
                        className="h-20"
                    />
                    <h1 className="text-3xl -mb-2 md:text-5xl text-green-400 font-medium welcomeFont text-left">
                        Welcome to <br /> <span className=" text-white logoFont font-bold">
                            <span className="uppercase">{settingsData?.webName ? settingsData?.webName.slice(1, 2) : ""}</span>
                            {settingsData?.webName ? settingsData?.webName.slice(2, 1000) : "AsterDesk"}</span>
                    </h1>
                </div>

                <p className="text-xl md:text-2xl py-4 md:py-6 font-medium text-gray-400 logoFont">
                    EXPLORE TOP-TIER SUBSCRIPTIONS WITH MASTERDESK
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/plans" className="
  relative px-8 py-4
  bg-white text-violet-900 font-semibold
  rounded-xl shadow-lg
  overflow-hidden
  transition-all duration-300
  hover:scale-105
">
                        <span className="relative z-10">Browse Plan</span>
                        <span className="
    absolute top-0 -left-full w-full h-full
    bg-gradient-to-r from-transparent via-violet-200 to-transparent
    transition-all duration-700
    hover:left-full
  "></span>
                    </Link>

                    {
                        !loading && !user && (
                            <Link to="/signup" className="
  relative px-8 py-4
  rounded-xl
  font-semibold text-white
  bg-gradient-to-r from-violet-600 to-indigo-600
  shadow-lg
  transition-all duration-300
  hover:scale-105 hover:shadow-violet-500/40
  active:scale-95
  overflow-hidden
">
                                <span className="relative z-10">SignUp</span>
                                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition"></span>
                            </Link>

                        )
                    }

                </div>
            </div>

            {/* How It Works Section */}

        </div>
    );
};

export default Hero;