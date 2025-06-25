import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"

export interface IMessage {
  _id: string
  projectId: Types.ObjectId | string // Reference to Project
  senderId: Types.ObjectId | string // Reference to User
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// Virtual references
messageSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
})

messageSchema.virtual("sender", {
  ref: "User",
  localField: "senderId",
  foreignField: "_id",
  justOne: true,
})

messageSchema.virtual("attachments", {
  ref: "MessageAttachment",
  localField: "_id",
  foreignField: "messageId",
})

messageSchema.index({ projectId: 1 })
messageSchema.index({ senderId: 1 })
messageSchema.index({ isRead: 1 })
messageSchema.index({ createdAt: -1 })


const Message: Model<IMessage> = mongoose.models.Message || model<IMessage>("Message", messageSchema);
export default Message;
