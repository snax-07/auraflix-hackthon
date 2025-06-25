import mongoose , {Schema , Types, model , models , type Document} from "mongoose";

interface IEditorprofile extends Document{ 
    _id : string
    userId : Types.ObjectId
    specialty ?: string
    hourlyRate ?: number
    fixedRatePerProject ?: number
    portfolio ?: string[]
    rating ?: number
    totalCompletedProjects : number
    createdAt : Date
    updatedAt : Date
}

const editorProfileSchema = new Schema<IEditorprofile>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      required: false,
    },
    hourlyRate: {
      type: Number,
      required: false,
    },
    fixedRatePerProject: {
      type: Number,
      required: false,
    },
    portfolio: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: false,
    },
    totalCompletedProjects: {
      type: Number,
      default: 0,
    }    
} , {timestamps : true})

editorProfileSchema.virtual('user' , {
    ref : "User",
    localField : "userId",
    foreignField: "_id",
    justOne : true
})


const EditorProfile : mongoose.Model<IEditorprofile> = models.EditorProfile || model<IEditorprofile>("EditorProfile", editorProfileSchema) || model<IEditorprofile>("EditorProfile", editorProfileSchema);
export default EditorProfile;