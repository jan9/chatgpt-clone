import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

// allow cross-origin requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// to parse json
app.use(express.json());

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//   console.log("success", req.auth.userId);
//   res.send("test success");
// });

app.post(
  "/api/chats",
  ClerkExpressRequireAuth({
    // Add options here
    // See the Middleware options section for more details
  }),
  async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
      // CREATE A NEW CHAT
      const newChat = new Chat({
        userId: userId,
        history: [{ role: "user", parts: [{ text }] }],
      });

      const savedChat = await newChat.save();

      // CHECK IF THE USERCHATS EXISTS
      const userChats = await UserChats.find({ userId: userId });

      // IF DOESN'T EXIST, CREATE A NEW ONE AND ADD THE CHAT
      if (!userChats.length) {
        const newUserChats = new UserChats({
          userId: userId,
          chats: [
            {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          ],
        });
        await newUserChats.save();
      } else {
        // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
        await UserChats.updateOne(
          { userId: userId },
          {
            $push: {
              chats: {
                _id: savedChat._id,
                title: text.substring(0, 40),
              },
            },
          }
        );
        res.status(201).send(newChat._id);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error creating chat!");
    }
  }
);

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = UserChats.find({ userId });
    // or use UserChats.findOne
    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats");
  }
});

// catch 400 errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

// listening for port
app.listen(port, () => {
  // mongoose connection to mongoDB
  databaseConnection();
  console.log("Server running on 3000");
});
