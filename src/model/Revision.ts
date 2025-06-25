import { Schema , type Document , model , models  ,Model, Types } from "mongoose";

export interface IRevision {
  _id: string
  projectId: Types.ObjectId | string // Reference to Project
  fileId: Types.ObjectId |  string // Reference to File (the version being revised)
  requestedById: Types.ObjectId | string // Reference to User (who requested the revision)
  notes: string
  isResolved: boolean
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

const revisionSchema = new Schema<IRevision>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    requestedById: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
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

// Virtual references
revisionSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
})

revisionSchema.virtual("file", {
  ref: "File",
  localField: "fileId",
  foreignField: "_id",
  justOne: true,
})

revisionSchema.virtual("requestedBy", {
  ref: "User",
  localField: "requestedById",
  foreignField: "_id",
  justOne: true,
})

revisionSchema.virtual("tags", {
  ref: "RevisionTag",
  localField: "_id",
  foreignField: "revisionId",
})



// Create and export the model
const Revision: Model<IRevision> =
  models.Revision || model<IRevision>("Revision", revisionSchema)

export default Revision