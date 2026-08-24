import express from "express"; 
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
import { UserModel, ContentModel, LinkModel} from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const signupSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(4).max(50)
});
import {random} from "./utils.js"
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import { enrichContentWithAI, generateEmbedding, cosineSimilarity, generateChatResponse } from "./ai.js";
import { universalExtract } from "./extractor.js";

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads to keep extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
});
const upload = multer({ storage: storage });

//routes
app.post("/api/v1/signup",async (req,res)=>{
   const parsed = signupSchema.safeParse(req.body);
   if (!parsed.success) {
       res.status(400).json({ message: "Invalid input format", issues: parsed.error.issues });
       return;
   }
   const username = parsed.data.username;
   const password = parsed.data.password;
try {
   const hashedPassword = await bcrypt.hash(password, 10);
   await UserModel.create({
    username: username,
    password: hashedPassword
   })
   res.json({
      message: "user signed up"
   })
} catch(e) {
   res.status(411).json({
      message:"user already exist"
   })
}
})

app.post("/api/v1/signin",async (req,res)=>{
   const parsed = signupSchema.safeParse(req.body);
   if (!parsed.success) {
       res.status(400).json({ message: "Invalid input format", issues: parsed.error.issues });
       return;
   }
   const username = parsed.data.username;
   const password = parsed.data.password;
   const existingUser = await UserModel.findOne({
      username
   })
   if (existingUser) { //if existinguser exist
      const passwordMatch = await bcrypt.compare(password, existingUser.password as string);
      if (passwordMatch) {
          const token = jwt.sign({
             id: existingUser._id
          },JWT_PASSWORD)

          res.json({
             token,
             username: existingUser.username,
             profilePicUrl: existingUser.profilePicUrl
          })
          return;
      }
   }
   
   res.status(403).json({
       message: "incorect credentials"
   })
})

app.post("/api/v1/user/profile-pic", userMiddleware, upload.single('file'), async (req, res) => {
   if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
   }
   
   const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
   
   const userId = res.locals.userId;

   await UserModel.updateOne({ _id: userId }, { profilePicUrl: fileUrl });

   res.json({
      profilePicUrl: fileUrl
   });
});

app.put("/api/v1/user/password", userMiddleware, async (req, res) => {
   const currentPassword = req.body.currentPassword;
   const newPassword = req.body.newPassword;

   const userId = res.locals.userId;

   const user = await UserModel.findOne({
      _id: userId
   });

   if (!user || !(await bcrypt.compare(currentPassword, user.password as string))) {
      res.status(403).json({ message: "Incorrect current password" });
      return;
   }

   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
   await UserModel.updateOne({ _id: userId }, { password: hashedNewPassword });
   res.json({ message: "Password updated successfully" });
});

app.delete("/api/v1/user", userMiddleware, async (req, res) => {
   const userId = res.locals.userId;

   await ContentModel.deleteMany({ userId });
   await LinkModel.deleteOne({ userId });
   await UserModel.deleteOne({ _id: userId });

   res.json({ message: "Account deleted successfully" });
});

//to create a content route , create a content schema in db

function generateTags(title: string, link: string, type: string): string[] {
   const tags: Set<string> = new Set();
   const textToSearch = `${title} ${link}`.toLowerCase();

   if (type === 'youtube') tags.add('video');
   if (type === 'twitter') tags.add('social');
   if (type === 'document') tags.add('document');
   if (type === 'link') tags.add('web');

   const keywords = {
      'react': 'react',
      'javascript': 'programming',
      'js': 'programming',
      'typescript': 'programming',
      'python': 'programming',
      'node': 'programming',
      'recursion': 'programming',
      'tutorial': 'learning',
      'learn': 'learning',
      'course': 'learning',
      'music': 'music',
      'song': 'music',
      'workout': 'health',
      'fitness': 'health',
      'health': 'health',
      'design': 'design',
      'ui': 'design',
      'ux': 'design',
      'news': 'news',
      'tech': 'technology',
      'ai': 'ai',
      'artificial intelligence': 'ai',
      'machine learning': 'ai'
   };

   for (const [keyword, tag] of Object.entries(keywords)) {
      if (textToSearch.includes(keyword)) {
         tags.add(tag);
      }
   }

   return Array.from(tags);
}

app.post("/api/v1/upload", userMiddleware, upload.single('file'), async (req, res) => {
   if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
   }
   
   const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
   
   res.json({
      link: fileUrl
   });
});

app.post("/api/v1/content", userMiddleware, async (req,res)=>{
  

   const link = req.body.link;
   const type = req.body.type;
   const title = req.body.title;
   const content = req.body.content;
   
   const generatedTags = generateTags(title || "", link || content || "", type || "");

   let previewImage = "";
   let previewDescription = "";

   if (type === "link" && link) {
      try {
         const response = await axios.get(link, { timeout: 5000 });
         const $ = cheerio.load(response.data);
         previewImage = $('meta[property="og:image"]').attr('content') || "";
         previewDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
      } catch (e) {
         console.error("Failed to fetch link metadata:", e);
      }
   }

   let extractedTextStr = "";
   if (link) {
       console.log(`Running universal extraction for type: ${type}`);
       extractedTextStr = await universalExtract(type || "link", link);
   }

   const newContent = await ContentModel.create({
      link,
      title,
      type,
      userId: res.locals.userId,
      tags: generatedTags,
      previewImage,
      previewDescription,
      content: content,
      extractedText: extractedTextStr
   })

   // Trigger AI enrichment in the background
   enrichContentWithAI(newContent._id.toString(), title || "", extractedTextStr || link || content || "", type || "");

   res.json({
      message: "Content added"
   })
})

app.get("/api/v1/content", userMiddleware,async(req,res)=>{
   const userId = res.locals.userId;
   const content = await ContentModel.find({
      userId: userId
   }).populate("userId","username")
   res.json({
      content
   })
})

app.delete("/api/v1/content",userMiddleware, async(req,res)=>{
   const contentId = req.body.contentId;
   await ContentModel.updateOne({
      _id: contentId,
      userId: res.locals.userId
   }, {
      isTrashed: true
   })
   res.json({
      message: "Moved to trash"
   })
})

app.post("/api/v1/content/restore",userMiddleware, async(req,res)=>{
   const contentId = req.body.contentId;
   await ContentModel.updateOne({
      _id: contentId,
      userId: res.locals.userId
   }, {
      isTrashed: false
   })
   res.json({
      message: "Restored from trash"
   })
})

app.delete("/api/v1/content/permanent",userMiddleware, async(req,res)=>{
   const contentId = req.body.contentId;
   await ContentModel.deleteMany({
      _id: contentId,
      userId: res.locals.userId
   })
   res.json({
      message: "Permanently deleted"
   })
})

app.put("/api/v1/content", userMiddleware, async(req, res)=>{
   const contentId = req.body.contentId;
   const link = req.body.link;
   const type = req.body.type;
   const title = req.body.title;
   const isPinned = req.body.isPinned;
   const content = req.body.content;
   const tags = req.body.tags;
   
   let updateData: any = {};
   
   if (tags !== undefined) {
      updateData.tags = tags;
   }
   
   if (title !== undefined) updateData.title = title;
   if (link !== undefined) updateData.link = link;
   if (type !== undefined) updateData.type = type;
   if (content !== undefined) updateData.content = content;
   
   if (title !== undefined || link !== undefined || type !== undefined || content !== undefined) {
      if (tags === undefined) {
          updateData.tags = generateTags(title || "", link || content || "", type || "");
      }
   }
   
   if (isPinned !== undefined) {
      updateData.isPinned = isPinned;
   }

   await ContentModel.updateOne(
      {
         _id: contentId,
         userId: res.locals.userId
      },
      updateData
   )
   res.json({
      message: "Content updated"
   })
})

app.post("/api/v1/brain/share",userMiddleware ,async (req,res)=>{
   const share = req.body.share;
   if(share){
      const existingLink = await LinkModel.findOne({
         userId: res.locals.userId
      });
      if(existingLink){
         res.json({
             hash: existingLink.hash
         })
         return;
      }
      const hash = random(10) //random str of length 10
      await LinkModel.create({
         userId: res.locals.userId,
         hash: hash
      })

      res.json({
         hash
      })
   }
   else{
      await LinkModel.deleteOne({
         userId: res.locals.userId
      })
      res.json({
      message: "removed link"
   })
   }
   
})

app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    const hash = req.params.shareLink;
      
    const link = await LinkModel.findOne({
          hash
    });
    

    if(!link) { //if link is not there
      res.status(411).json({
         message: "sorry incorrect input"
      })
      return;
    }
    const content = await ContentModel.find({
      userId: link.userId
    })

    const user = await UserModel.findOne({
      _id: link.userId
    })

    if(!user){
      res.status(411).json({
         message: "user not found,error should ideally not happen"
      })
      return;
    }
    res.json({
      username: user?.username,
      content: content
    })
})
app.post("/api/v1/chat", userMiddleware, async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) {
            res.status(400).json({ message: "Question is required" });
            return;
        }

        // 1. Generate embedding for the question
        const questionEmbedding = await generateEmbedding(question);
        if (!questionEmbedding) {
            res.status(500).json({ message: "Failed to generate embedding for the question" });
            return;
        }

        // 2. Fetch all user content that has an embedding
        const userId = res.locals.userId;
        const userContent = await ContentModel.find({
            userId,
            embedding: { $exists: true, $ne: [] },
            isTrashed: false
        });

        if (userContent.length === 0) {
            res.json({ answer: "You don't have any notes with AI embeddings yet. Try adding some new notes first!" });
            return;
        }

        // 3. Compute cosine similarity for each document
        const similarities = userContent.map(content => {
            const sim = cosineSimilarity(questionEmbedding, content.embedding);
            return { content, similarity: sim };
        });

        // 4. Sort by similarity (descending) and pick the top 5
        similarities.sort((a, b) => b.similarity - a.similarity);
        const topMatches = similarities.slice(0, 5);
        
        // 5. Extract text to feed as context
        const contextTexts = topMatches.map(match => {
            const manualNote = match.content.content ? `\nManual Note: ${match.content.content}` : "";
            const extracted = match.content.extractedText ? `\nExtracted Text: ${match.content.extractedText}` : "";
            return `Title: ${match.content.title}\nSummary: ${match.content.summary}${manualNote}${extracted}\nLink: ${match.content.link || ""}`;
        });

        // 6. Generate answer using RAG
        const answer = await generateChatResponse(question, contextTexts);

        res.json({ answer });
    } catch (e) {
        console.error("Chat error:", e);
        res.status(500).json({ message: "Internal server error during chat" });
    }
});

app.listen(3000);