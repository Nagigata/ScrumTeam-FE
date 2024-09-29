import { motion } from "framer-motion";

const AuthGoogleButton = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative flex py-3 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center justify-center transition duration-200"
        type="button"
      >
        <img
          src="assets\google.png"
          alt="Google logo"
          className="w-5 h-5 mr-2"
        />
        Sign up with Google
      </motion.button>
    </div>
  );
};

export default AuthGoogleButton;
