import { motion } from "framer-motion";
import Hero from "./Hero";
import HowItWork from "./HowItWork";
import Sliders from "./Sliders";
import Plans from "./Plans";
import Advantages from "./Advantages";


const Home = () => {
    return (
        <motion.div>
            <Hero />
            <HowItWork />
            <Sliders />
            <Plans />
            <Advantages />
        </motion.div>
    );
};

export default Home;
