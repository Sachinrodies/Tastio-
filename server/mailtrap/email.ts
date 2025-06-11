import { client, sender } from "./mailtrap";
import {generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent} from "./htmlemail"
export const sendVerificationEmail=async(email:string,verificationCode:string)=>{
   
        const recipients=[{email}];
        try{
            const subject="Verify your email";
            const text=`Please use the following code to verify your email: ${verificationCode}`;
            
            const response=await client.send({
                from:sender,
                to:recipients,
                subject,
                text,
                html:htmlContent.replace("{verificationToken}",verificationCode)
            })
        }
       catch(error){
        throw new Error("Failed to send verification email");
       }
    }
    export const sendWelcomeEmail=async(email:string,name:string)=>{
        const recipients=[{email}];
        try{
        const subject="Welcome to Tastio";
        const text=`Welcome to Tastio, ${name}`;
        const htmlContent=generateWelcomeEmailHtml(name);
        const response=await client.send({
            from:sender,
            to:recipients,
            subject,
                text,
                html:htmlContent
            })
        }
        catch(error){
            throw new Error("Failed to send welcome email");
        }
    }
    export const sendResetPasswordEmail=async(email:string,resetToken:string)=>{
        const recipients=[{email}];
        try{
            const subject="Reset your password";
            const text=`Please use the following link to reset your password: ${resetToken}`;
            const htmlContent= generatePasswordResetEmailHtml(resetToken);
            const response=await client.send({
                from:sender,
                to:recipients,
                subject,
                text,
                html:htmlContent
            })
        }
        catch(error){
            throw new Error("Failed to send reset password email");
        }
    }
    export const resetPasswordSuccessEmail=async(email:string,resetToken:string)=>{
        const recipients=[{email}];
        try{
            const subject="Password reset successful";
            const text=`Your password has been reset successfully, ${resetToken}`;
            const htmlContent=generateResetSuccessEmailHtml();
            const response=await client.send({
                from:sender,
                to:recipients,
                subject,
                text,
                html:htmlContent
            })
        }
        catch(error){
            throw new Error("Failed to send reset password success email");
        }
    }