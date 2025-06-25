import { Document  , Schema , model , models} from "mongoose";

export interface Editor extends Document{
  username : string
  name : string
  email : string
  password : string
  creators : []
  completedProject : number
  portfolio : string
  rating : number
};


const editorModel = new Schema({
  username : {type : String , required : true }
})