import React from  'react'
import { SignIn } from '@clerk/clerk-react'
import {motion} from "framer-motion"

 const Login=()=>{
   return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent rounded-lg p-8 animate-fade-in-up border-2 border-solid z-index-50 shadow-orrange-600"
      >
        <SignIn />
      </motion.div>
    </motion.div>
   )
};
export default Login;