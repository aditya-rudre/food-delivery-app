import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.yylloxo.mongodb.net/food-del").then(() => console.log("DB connected"))
} 

