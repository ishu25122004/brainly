// create user model scheme here
import mongoose, {model , Schema} from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//connect the mongo db
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/brainly";
mongoose.connect(mongoUri)

//first create schema then create model that this schemas model name is "User"
//1.user schema & user model
const UserSchema = new Schema({
    username: {type: String, unique: true},//this does not constarint the entry on database level b/c if it is you also add same userdirectly to mongo db , but this work by mongoose library
    password: String,
    profilePicUrl: String
})

export const UserModel =  model("User" , UserSchema);

//2.content schema & content model
const ContentSchema = new Schema({
    title:String,
    link: String,
    tags: [{type: String}],
    type: String,
    userId: {type:mongoose.Types.ObjectId, ref: 'User', required: true},
    isPinned: {type: Boolean, default: false},
    isTrashed: {type: Boolean, default: false},
    previewImage: String,
    previewDescription: String,
    content: String, // for manual markdown notes
    extractedText: String, // AI extracted text from PDFs/YouTube
    summary: String, // AI generated summary
    embedding: [Number] // Vector embedding for RAG
})

export const ContentModel = model("Content",ContentSchema);//here Content is the name of the model


const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref:'User', required: true,unique:true},
})

export const LinkModel = model("Link",LinkSchema);