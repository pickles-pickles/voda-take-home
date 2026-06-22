import dotenv from "dotenv";
import { createServer } from "./server";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    console.log('test 2');
    const app = await createServer();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

bootstrap();