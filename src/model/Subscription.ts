import mongoose, { type Document, Schema, model, type Model, Types } from "mongoose"


export interface ISubscription {
  _id: string
  userId: Types.ObjectId | string // Reference to User
  planId: Types.ObjectId |string // Reference to Plan
  status: "active" | "canceled" | "expired"
  startDate: Date
  endDate: Date
  autoRenew: boolean
  paymentMethod?: string
  lastPaymentDate?: Date
  nextPaymentDate?: Date
  createdAt: Date
  updatedAt: Date
  canceledAt?: Date
}
const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    lastPaymentDate: {
      type: Date,
      required: false,
    },
    nextPaymentDate: {
      type: Date,
      required: false,
    },
    canceledAt: {
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
subscriptionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
})

subscriptionSchema.virtual("plan", {
  ref: "Plan",
  localField: "planId",
  foreignField: "_id",
  justOne: true,
})

// Indexes
subscriptionSchema.index({ userId: 1 })
subscriptionSchema.index({ planId: 1 })
subscriptionSchema.index({ status: 1 })
subscriptionSchema.index({ endDate: 1 })

// Create and export the model
const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || model<ISubscription>("Subscription", subscriptionSchema)

export default Subscription
