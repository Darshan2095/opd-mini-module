import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js DNS SRV lookup (querySrv ECONNREFUSED) issue on Windows/local network
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
    // Ignore error if DNS servers can't be set
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
    conn: null,
    promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (error) {
        // Ignore
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).catch((err) => {
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}