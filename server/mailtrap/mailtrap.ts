import { MailtrapClient } from "mailtrap";



 export const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_API_TOKEN !,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Tastio",
};
const recipients = [
  {
    email: "sahilrodies000@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);