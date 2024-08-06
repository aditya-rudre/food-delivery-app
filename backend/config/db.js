import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://adirudre:1234598765@cluster0.yylloxo.mongodb.net/food-del").then(() => console.log("DB connected"))
} 