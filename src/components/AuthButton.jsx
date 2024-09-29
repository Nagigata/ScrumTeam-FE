import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import AuthGoogleButton from "./AuthGoogleButton";

const AuthButton = ({ label, isLoading, isSubmitting, onClick }) => {
  return (
    <div className="flex flex-col space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#19ADC8] hover:bg-[#535ac8] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 flex items-center justify-center"
        type="submit"
        onClick={onClick}
        disabled={isSubmitting || isLoading}
      >
        {isLoading ? (
          <CircularProgress size="24px" color="inherit" />
        ) : (
          <>
            {label} <ChevronRightOutlinedIcon className="ml-2" />
          </>
        )}
      </motion.button>
      <AuthGoogleButton />
    </div>
  );
};

export default AuthButton;
