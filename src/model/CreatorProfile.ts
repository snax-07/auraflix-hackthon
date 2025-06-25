import mongoose, { Model, Schema , models ,model , type Document, Types } from "mongoose";

enum UploadPrivacy{
    PRIVATE = "private",
    PUBLIC = "public",
    UNLISTED = "unlisted"
};

interface ICreatorProfile extends Document {
    _id : string
    userId : Types.ObjectId
    youtubeApiKey ?: string
    youtubeChannelId ?: string
    defaultUploadPrivacy : UploadPrivacy
    MaxEditors : number
    MaxProjects : number
    createdAt : Date
    updatedAt : Date
};

const CreatorProfileSchema : Schema<ICreatorProfile> = new Schema<ICreatorProfile>({
    
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        unique : true,
        required : true
    },
    youtubeApiKey : {
        type : String,
        required : false,
        unique : true
    },
    youtubeChannelId : {
        type : String,
        required : false,
        unique : false
    },
    defaultUploadPrivacy :{
        type : String,
        enum : Object.values(UploadPrivacy),
        default : UploadPrivacy.PRIVATE 
    },
    MaxEditors : {
        type : Number,
        default : 2,
    },
    MaxProjects : {
        type : Number,
        default : 10
    }
} , {timestamps : true});

CreatorProfileSchema.virtual("user" , {
    ref : "User",
    localField : "userId",
    foreignField : "_id",
    justOne : true
})

CreatorProfileSchema.index({userId : 1});//FOR FAST INDEXING

const CreatorProfile : mongoose.Model<ICreatorProfile> = models.CreatorProfile || model<ICreatorProfile>("CretorProfile"  , CreatorProfileSchema)
