import { Schema , type Document , model , models , Model, Types } from "mongoose"

enum ActivityType {
  PROJECT_CREATED = "project_created",
  EDITOR_ASSIGNED = "editor_assigned",
  VERSION_UPLOADED = "version_uploaded",
  REVISION_REQUESTED = "revision_requested",
  PROJECT_APPROVED = "project_approved",
  PROJECT_DECLINED = "project_declined",
  PROJECT_COMPLETED = "project_completed",
  PAYMENT_PROCESSED = "payment_processed",
  YOUTUBE_UPLOADED = "youtube_uploaded",
}
interface IActivityLog {
  _id: string
  projectId: Types.ObjectId | string // Reference to Project
  userId: Types.ObjectId  | string // Reference to User (who performed the action)
  type: ActivityType
  details?: Record<string, any> // Additional details as JSON
  createdAt: Date
}


const activityLogSchema = new Schema<IActivityLog>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

// Virtual references
activityLogSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
})

activityLogSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
})

// Indexes
activityLogSchema.index({ projectId: 1 })
activityLogSchema.index({ userId: 1 })
activityLogSchema.index({ type: 1 })
activityLogSchema.index({ createdAt: -1 })

// Create and export the model
const ActivityLog: Model<IActivityLog> =
  models.ActivityLog || model<IActivityLog>("ActivityLog", activityLogSchema)

export default ActivityLog