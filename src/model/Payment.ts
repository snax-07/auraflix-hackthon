import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment {
  _id: string
  projectId: Types.ObjectId |  string // Reference to Project
  editorId:  Types.ObjectId | string // Reference to User (editor)
  creatorId: Types.ObjectId | string // Reference to User (creator)
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod?: string // e.g., "paypal", "bank_transfer", "stripe"
  transactionId?: string // External payment processor ID
  notes?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

// Payment Schema
const paymentSchema = new Schema<IPayment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    editorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    transactionId: {
      type: String,
      required: false,
    },
    notes: {
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

// Virtual references
paymentSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
})

paymentSchema.virtual("editor", {
  ref: "User",
  localField: "editorId",
  foreignField: "_id",
  justOne: true,
})

paymentSchema.virtual("creator", {
  ref: "User",
  localField: "creatorId",
  foreignField: "_id",
  justOne: true,
})


paymentSchema.index({ projectId: 1 })
paymentSchema.index({ editorId: 1 })
paymentSchema.index({ creatorId: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: -1 })


const Payment: Model<IPayment> = mongoose.models.Payment || model<IPayment>("Payment", paymentSchema)

export default Payment
