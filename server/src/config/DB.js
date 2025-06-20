

import mongoose from "mongoose"



export const connect = async () => {

   try {

      await mongoose.connect(process.env.MONGO_URI)
      console.log("mongoDB connected")
      return true

   } catch (error) {

      console.log("mongoDB connecting failed", error)
      return false
   }
}