import { motion } from "framer-motion";
import Hero from "./Hero";
import HowItWork from "./HowItWork";
import Sliders from "./Sliders";
import Plans from "./Plans";
import Advantages from "./Advantages";
import Testimonials from "@/Admin/MainLayout/Testimonials";


const Home = () => {
    return (
        <motion.div>
            <Hero />
            <HowItWork />
            {/* <Sliders /> */}
            <Plans />
            <Advantages />
            <Testimonials />
        </motion.div>
    );
};

export default Home;
