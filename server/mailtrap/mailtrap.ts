import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.MAIL_TRAP_API_TOKEN) {
  throw new Error("MAIL_TRAP_API_TOKEN is not defined in environment variables");
}

// Initialize Mailtrap client
export const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_API_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Tastio",
};

