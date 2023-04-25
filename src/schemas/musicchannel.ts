import mongoose, { Document } from "mongoose";

export interface MusicChannelSchema extends Document {

    Guild: string;
    Channel: string;
    VoiceChannel: string;
    Message: string;
    
}

export default mongoose.model("musicChannel", new mongoose.Schema({

    Guild: { type: String, required: true},
    Channel: { type: String, required: true},
    VoiceChannel: { type: String, required: true},
    Message: { type: String, required: true}
    
}))