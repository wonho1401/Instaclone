import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import mgTransport from "nodemailer-mailgun-transport";
import jwt from "jsonwebtoken";

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

export const sendMail = (email) => {
  const options = {
    auth: {
      api_key: process.env.API_KEY,
      domain: process.env.DOMAIN,
    },
  };
  const client = nodemailer.createTransport(mgTransport(options));

  return client
    .sendMail(email)
    .then(() => {
      console.log("Message sent");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const sendSecretMail = (address, secret) => {
  const email = {
    from: "wonho@instaclone.com",
    to: address,
    subject: "Login for Instaclone",
    html: `Login code is <strong>${secret} </strong>. <br/> Have a nice day :)`,
  };
  return sendMail(email);
};

export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);
