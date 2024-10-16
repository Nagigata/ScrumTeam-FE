import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RoleSelect = ({ setRole }) => {
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-blueColor">
          What type of account would you like to sign up for?
        </h2>
        <div className="flex justify-around mb-8">
          <button
            onClick={() => handleRoleSelect("candidate")}
            className="px-6 py-3 bg-blueColor text-white rounded-md"
          >
            Sign Up as Candidate
          </button>
          <button
            onClick={() => handleRoleSelect("recruiter")}
            className="px-6 py-3 bg-green-600 text-white rounded-md"
          >
            Sign Up as Recruiter
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="#"
            className="text-blueColor hover:text-[#535ac8] font-semibold transition duration-200"
          >
            <Link to="/login">Log In</Link>
          </motion.a>
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
