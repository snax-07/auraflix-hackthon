import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"


export enum NotificationType {
  PROJECT_ASSIGNED = "project_assigned",
  VERSION_UPLOADED = "version_uploaded",
  REVISION_REQUESTED = "revision_requested",
  PROJECT_APPROVED = "project_approved",
  PROJECT_DECLINED = "project_declined",
  PAYMENT_RECEIVED = "payment_received",
  PAYMENT_SENT = "payment_sent",
  MESSAGE_RECEIVED = "message_received",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
}

export interface INotification {
  _id: string
  userId: Types.ObjectId | string // Reference to User (recipient)
  type: NotificationType
  title: string
  content: string
  isRead: boolean
  linkUrl?: string // URL to navigate to when clicked
  relatedId?: string // ID of related entity (project, payment, etc.)
  createdAt: Date
  updatedAt: Date
}
const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    linkUrl: {
      type: String,
      required: false,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
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


notificationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
})


notificationSchema.index({ userId: 1 })
notificationSchema.index({ type: 1 })
notificationSchema.index({ isRead: 1 })
notificationSchema.index({ createdAt: -1 })


const Notification: Model<INotification> =
  mongoose.models.Notification || model<INotification>("Notification", notificationSchema)
export default Notification
