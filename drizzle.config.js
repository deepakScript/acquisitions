import "dotenv/config";
const url = process.env.DATABASE_URL;

export default {
  schema: "./src/models/*.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url,
  },
};
