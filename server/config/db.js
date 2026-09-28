import mongoose from 'mongoose';
import dns from 'dns';

// Configure public DNS resolvers to prevent ECONNREFUSED on MongoDB Atlas SRV queries on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    console.error(`Make sure MongoDB server is running locally on 127.0.0.1:27017 or provide a valid MONGODB_URI in .env`);
  }
};

export default connectDB;
