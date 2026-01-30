import { ListPlus, Settings } from 'lucide-react';
import React from 'react';
import AddNewPlatform from '../Component/AddNewPlatform';
import ManagePlatform from '../Component/ManagePlatform';
import AddNewSubscription from './AddNewSubscription';
import ManageSubscription from './ManageSubscription';
import ManageOrders from './ManageOrders';
import AllOrders from './AllOrders';

const OrdersManagement = () => {
    const allTabs = [
        { name: "All Orders", icon: ListPlus },
        { name: "Manage Orders", icon: Settings },
        // { name: "Add New Subscription", icon: ListPlus },
        // { name: "Manage Subscription", icon: Settings },
    ]
    // set active tab----->
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className=''>
            {/* heding */}
            <div className="">
                <h1 className="text-xl md:text-2xl font-semibold  text-gray-900">Manage Your All Orders</h1>
            </div>
            {/* tab sections */}
            <div className="grid my-4 w-full grid-cols-2 md:grid-cols-6 gap-4 items-center">
                {
                    allTabs.map((tab, index) => (
                        <div
                            onClick={() => setActiveTab(index)}
                            key={index} className={` ${activeTab === index ? "bg-emerald-500 text-white" : "bg-gray-100"} rounded-lg shadow cursor-pointer  h-full`}>
                            <div className="flex flex-col justify-center items-center gap-2 p-3 text-center md:p-4">
                                <tab.icon size={24} />
                                <p className="text-sm font-medium">{tab.name}</p>
                            </div>
                        </div>
                    ))
                }

            </div>

            {/* all sections */}
            {
                activeTab === 0 && <AllOrders />

            }
            {
                activeTab === 1 && <ManageOrders />
            }

        </div>
    );
};

export default OrdersManagement;