import { Schema , type Document , model , models , Model, Types } from "mongoose";

enum FileType {
    SOURCE = "source",
  ASSET = "asset",
  VERSION = "version",
  THUMBNAIL = "thumbnail",
  OTHER = "other",
}

interface IFile {
  _id: string
  projectId: Types.ObjectId  | string// Reference to Project
  uploadedById: Types.ObjectId | string  // Reference to User
  name: string
  type: FileType
  url: string
  size: number // Size in bytes
  mimeType: string
  versionNumber?: number // For version files
  isLatestVersion?: boolean // For version files
  createdAt: Date
  updatedAt: Date
}

const fileSchema = new Schema<IFile>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    uploadedById: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(FileType),
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // Size in bytes
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    versionNumber: {
      type: Number,
      required: false,
    },
    isLatestVersion: {
      type: Boolean,
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
fileSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
})

fileSchema.virtual("uploadedBy", {
  ref: "User",
  localField: "uploadedById",
  foreignField: "_id",
  justOne: true,
})

fileSchema.virtual("revisions", {
  ref: "Revision",
  localField: "_id",
  foreignField: "fileId",
})

const File: Model<IFile> = models.File || model<IFile>("File", fileSchema)

export default File