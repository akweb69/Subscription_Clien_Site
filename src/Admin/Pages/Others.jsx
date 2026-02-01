import React from 'react';
import CouponSells from './CouponSells';
import CopyBtnVissibilty from './CopyBtnVissibilty';
import { motion } from 'framer-motion';

const Others = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    return (
        <div className='w-full'>
            <div className="pb-4 rounded-xl bg-white w-full grid md:grid-cols-2 gap-4 items-center">
                <div onClick={() => setActiveTab(0)} className="text-center capitalize bg-green-500 cursor-pointer text-white p-3 rounded-lg">coupon sales report</div>
                <div onClick={() => setActiveTab(1)} className="text-center capitalize bg-rose-500 cursor-pointer text-white p-3 rounded-lg">copy button visibility </div>
            </div>


            {/* main content */}
            {
                activeTab === 0 && <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 200 }}
                    transition={{ duration: 0.5 }}

                    className="">
                    <CouponSells />
                </motion.div>
            }
            {
                activeTab === 1 && <motion.div
                    initial={{ opacity: 0, y: 200 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 200 }}
                    transition={{ duration: 0.5 }}
                    className="">
                    <CopyBtnVissibilty />
                </motion.div>
            }
        </div>
    );
};

export default Others;