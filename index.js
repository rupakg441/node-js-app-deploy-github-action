 import express from "express";
import {connect} from "./db.js";
import UserRoutes from "./Routes/UserRoutes.js";
import v8 from "v8";
import fs from "fs";

connect().then(() => {
const app = express();
const PORT = process.env.PORT || 5000;

  app.use(express.json());
  app.use("/api/user", UserRoutes);  
    app.use("/", (req, res)=>{

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });    });  

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});

