import mongoose , {IfAny, Model, Schema , model , models, type Document} from "mongoose";

enum UserRole {
    CREATOR = "creator",
    EDITOR = "editor",
    ADMIN = "admin"
}
interface IUser extends Document{
    _id : string,
    email : string
    password ?: string //Using bcrypt lib store hashed pas
    name : string
    role : UserRole
    avatar ?: string
    bio ?: string
    createdAt : Date
    updatedAt : Date
    googleId ?: string
    youtubeUrl ?: string
    instagramUrl : string
    PlanId ?: string 
    PlanExpiresAt ?: Date 
}

const UserSchema :Schema<IUser> = new Schema<IUser>({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },

    password : {
        type : String,
        required : false, //This is used for provider login(GOOGLE, GITHUB, ETC)
    },

    name : {
        type : String,
        required : true
    },

    role : {
        type : String,
        enum : Object.values(UserRole),
        required : true
    },

    avatar : {
        type : String,
        required : false
    },

    bio : {
        type : String,
        required : false
    },

    googleId : {
        type : String,
        required : false
    },

    youtubeUrl : {
        type : String,
        required : false
    },
    
    instagramUrl : {
        type : String,
        required : false
    },

    PlanId : {
        type : Schema.Types.ObjectId,
        ref : "Plan",
        required : false
    },

    PlanExpiresAt : {
        type : Date,
        required : false
    }

} , {timestamps : true , toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.password 
    },
  },})


// VIRTUAL REFRENCES :: ADDING DOCUMENT THAT CALLED ONE IN BUT WITHOUT COPYING
//  IT JUST LIKE VIRTUAL TABLE YOU CAN MANIPULATE IT LIKE NORMAL ONE

UserSchema.virtual("creatorProfile" , {
    ref : "CreatorProfile",
    localField : "_id",
    foreignField : "userId",
    justOne : true
});
UserSchema.virtual("editorProfile" , {
    ref : "EditorProfile",
    localField : "_id",
    foreignField : "userId",
    justOne : true
});

UserSchema.virtual("createdProjects", {
    ref: "Project",
    localField: "_id",
    foreignField: "creatorId",
});
  
UserSchema.virtual("assignedProjects", {
    ref: "Project",
    localField: "_id",
    foreignField: "editorId",
});
  
UserSchema.virtual("notifications", {
    ref: "Notification",
    localField: "_id",
    foreignField: "userId",
});
  
UserSchema.virtual("settings", {
    ref: "UserSettings",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});

const User : Model<IUser> = models.User || model<IUser>("User" , UserSchema);
export default User;