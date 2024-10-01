import { motion } from "framer-motion";
import WavyDivider from "./WavyDivider";
import { useNavigate } from "react-router-dom";

const AuthSection = ({
  title,
  description,
  backgroundImage,
  isSignUp = false,
}) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <div
      className="w-1/2 p-12 text-white relative bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-[#22272e] opacity-80"></div>
      <WavyDivider position={isSignUp ? "right" : "left"} />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`relative z-10 text-center ${isSignUp ? "ml-10" : "mr-10"}`}
      >
        <h2 className="text-4xl font-bold mb-6 text-[#e1e2fe]">{title}</h2>
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <img
            src="/assets/logo.png"
            alt="DevHunt Logo"
            className="h-32 w-32 mx-auto cursor-pointer"
            onClick={handleLogoClick}
          />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-4xl mb-14 text-[#e1e2fe]"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
        >
          <strong>Dev</strong>Hunt
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm text-[#e1e2fe]"
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthSection;
