import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from "framer-motion";

const CreateAccount = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg p-8 shadow-lg"
      >
        <SignUp 
          afterSignUpUrl="/organization"   
          signInUrl="/login"  
        />
      </motion.div>
    </motion.div>
  );
};

export default CreateAccount;
