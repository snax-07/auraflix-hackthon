import mongoose, { type Document, Schema, model, type Model } from "mongoose"

export interface IPlan {
  _id: string
  name: string // e.g., "Free", "Pro", "Enterprise"
  price: number
  currency: string
  billingCycle: "monthly" | "yearly"
  maxEditors: number
  maxProjects: number
  features: string[] // Array of feature strings
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Plan Schema
const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    maxEditors: {
      type: Number,
      required: true,
    },
    maxProjects: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
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
planSchema.virtual("subscriptions", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "planId",
})

// Indexes
planSchema.index({ isActive: 1 })
planSchema.index({ price: 1 })
planSchema.index({ billingCycle: 1 })

// Create and export the model
const Plan: Model<IPlan> = mongoose.models.Plan || model<IPlan>("Plan", planSchema)

export default Plan
