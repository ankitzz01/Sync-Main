import mongoose, { Document } from "mongoose";

export interface PlayedSchema extends Document {

    User: string;
    Played: number;
    Time: number;

}

export default mongoose.model("songsPlayed", new mongoose.Schema({

    User: { type: String, required: true },
    Played: { type: Number, required: true },
    Time: { type: Number, required: true }

}))