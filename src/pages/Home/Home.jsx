import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "../../components/Home/Search";
import Job from "../../components/Home/Job";
import Value from "../../components/Home/Value";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="w-[85%] m-auto bg-[#e6f9f3]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Search />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Job />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Value />
      </motion.div>
    </motion.div>
  );
};

export default Home;