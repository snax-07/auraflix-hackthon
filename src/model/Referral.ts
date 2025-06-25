import mongoose , {Schema , models , model , Model , type Document, Types} from "mongoose";


enum ReferralStatus {
  PENDING = "pending",
  REGISTERED = "registered",
  CONVERTED = "converted", // Paid for a plan
  EXPIRED = "expired",
}

interface IReferral {
  _id: string
  referrerId: Types.ObjectId |  string // Reference to User (who referred)
  email: string // Email of the person being referred
  code: string // Unique referral code
  status: ReferralStatus
  referredUserId?: Types.ObjectId | string // Reference to User (who was referred)
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  convertedAt?: Date
}


const referralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      required: true,
      default: ReferralStatus.PENDING,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    convertedAt: {
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
referralSchema.virtual("referrer", {
  ref: "User",
  localField: "referrerId",
  foreignField: "_id",
  justOne: true,
})

referralSchema.virtual("referredUser", {
  ref: "User",
  localField: "referredUserId",
  foreignField: "_id",
  justOne: true,
})

// Indexes
referralSchema.index({ referrerId: 1 })
referralSchema.index({ code: 1 })
referralSchema.index({ email: 1 })
referralSchema.index({ status: 1 })
referralSchema.index({ referredUserId: 1 })

// Create and export the model
const Referral: Model<IReferral> =
  mongoose.models.Referral || model<IReferral>("Referral", referralSchema)

export default Referral
