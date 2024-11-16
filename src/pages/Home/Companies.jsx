import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchCompany from "../../components/Home/SearchCompany";
import Companies from "../../components/Home/Companies";
import Value from "../../components/Home/Value";

const Home = () => {
  return (
    <motion.div
      className="w-[85%] m-auto bg-[#e6f9f3]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SearchCompany />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Companies />
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
