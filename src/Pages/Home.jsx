import { motion } from "framer-motion";
import Hero from "./Hero";

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-10"
        >
            <Hero />
        </motion.div>
    );
};

export default Home;
