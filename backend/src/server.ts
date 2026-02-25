import { app } from "./app";

const PORT = 3000;

app.listen(PORT , () => {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log(`Server running on port ${PORT}`);
});