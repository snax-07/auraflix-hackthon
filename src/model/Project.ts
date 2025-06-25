import { Schema , models  , model , type Document, Types, Model } from "mongoose";

enum ProjectStatus  {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  PENDING_APPROVAL = "pending_approval",
  REVISION_REQUESTED = "revision_requested",
  APPROVED = "approved",
  DECLINED = "declined",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}
interface project extends Document{
   _id : string
   title : string
   description : string
   creatorId : Types.ObjectId
   editorId : Types.ObjectId
   status : ProjectStatus
   dueDate ?: Date
   targetLength ?: number
   progress : number
   requirements ?: string
   isChatLocked : boolean
   youtubeUploadStatus ?: "not_started" | "in_progress" | "completed" | "failed"
   youtubeVideoId : string //Store returned url by youtube data api v3
   completedAt : Date
   createdAt : Date
   updatedAt : Date
}

const projectSchema = new Schema<project>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    editorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      required: true,
      default: ProjectStatus.DRAFT,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    targetLength: {
      type: Number, // Target video length in seconds
      required: false,
    },
    requirements: {
      type: String,
      required: false,
    },
    isChatLocked: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    youtubeUploadStatus: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "failed"],
      required: false,
    },
    youtubeVideoId: {
      type: String,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  },
)

projectSchema.virtual("creator", {
  ref: "User",
  localField: "creatorId",
  foreignField: "_id",
  justOne: true,
})

projectSchema.virtual("editor", {
  ref: "User",
  localField: "editorId",
  foreignField: "_id",
  justOne: true,
})

projectSchema.virtual("files", {
  ref: "File",
  localField: "_id",
  foreignField: "projectId",
})

projectSchema.virtual("revisions", {
  ref: "Revision",
  localField: "_id",
  foreignField: "projectId",
})

projectSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "projectId",
})

projectSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "projectId",
})

projectSchema.virtual("activityLogs", {
  ref: "ActivityLog",
  localField: "_id",
  foreignField: "projectId",
})

const Project: Model<project> = models.Project || model("Project" , projectSchema);
export default Project