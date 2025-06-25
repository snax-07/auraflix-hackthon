import mongoose, { type Document, Schema, model, type Model } from "mongoose"
import { Types } from "mongoose"


interface IUserSettings {
  _id: string
  userId: Types.ObjectId |  string // Reference to User
  emailNotifications: boolean
  pushNotifications: boolean
  notificationPreferences?: Record<string, boolean> // JSON object with notification type preferences
  theme: "light" | "dark" | "system"
  createdAt: Date
  updatedAt: Date
}
const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    notificationPreferences: {
      type: Schema.Types.Mixed,
      required: false,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
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
userSettingsSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
})

// Indexes
userSettingsSchema.index({ userId: 1 })

// Create and export the model
const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings || model<IUserSettings>("UserSettings", userSettingsSchema)

export default UserSettings
