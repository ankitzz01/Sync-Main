import mongoose, { Document } from "mongoose";

export interface TempButtonSchema extends Document {

    Guild: string;
    Channel: string;
    MessageID: string;

}

export default mongoose.model("buttonRemove", new mongoose.Schema({

    Guild: { type: String, required: true},
    Channel: { type: String, required: true},
    MessageID: { type: String, required: true}
    
}))