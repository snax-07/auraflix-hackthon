import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"

export interface IRevisionTag extends Document {
  _id: string
  revisionId: Types.ObjectId | string // Reference to Revision
  tag: string // e.g., "color correction", "audio", "transitions"
  createdAt: Date
}

const revisionTagSchema = new Schema<IRevisionTag>(
  {
    revisionId: {
      type: Schema.Types.ObjectId,
      ref: "Revision",
      required: true,
    },
    tag: {
      type: String,
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

revisionTagSchema.virtual("revision", {
  ref: "Revision",
  localField: "revisionId",
  foreignField: "_id",
  justOne: true,
})

revisionTagSchema.index({ revisionId: 1 })
revisionTagSchema.index({ tag: 1 })

const RevisionTag: Model<IRevisionTag> =
  mongoose.models.RevisionTag || model<IRevisionTag>("RevisionTag", revisionTagSchema)

export default RevisionTag
