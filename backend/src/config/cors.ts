import cors from "cors";



export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // allow requests with no origin (Postman, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
});