import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"

interface IMessageAttachment {
  _id: string
  messageId: Types.ObjectId | string 
  fileId: Types.ObjectId | string 
  createdAt: Date
}

const messageAttachmentSchema = new Schema<IMessageAttachment>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
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
messageAttachmentSchema.virtual("message", {
  ref: "Message",
  localField: "messageId",
  foreignField: "_id",
  justOne: true,
})

messageAttachmentSchema.virtual("file", {
  ref: "File",
  localField: "fileId",
  foreignField: "_id",
  justOne: true,
})


messageAttachmentSchema.index({ messageId: 1 })
messageAttachmentSchema.index({ fileId: 1 })


const MessageAttachment: Model<IMessageAttachment> =
 mongoose.models.MessageAttachment || model<IMessageAttachment>("MessageAttachment", messageAttachmentSchema)

export default MessageAttachment
