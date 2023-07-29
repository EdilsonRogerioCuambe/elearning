import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 MongoDB conectado com sucesso!");
  } catch (error) {
    console.log("🚀 MongoDB falhou ao conectar!");
    process.exit(1);
  }
};