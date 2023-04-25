import mongoose, { Document } from "mongoose";

export interface PlaylistSchema extends Document {

    User: string;
    Playlist: [{
        name: string;
        songs: string[];
        private: boolean;
        created: number;
    }];

}

export default mongoose.model("playlist", new mongoose.Schema({

    User: { type: String, required: true },
    Playlist: [{
        name: { type: String, required: true },
        songs: { type: [String], required: true },
        private: { type: Boolean, required: true },
        created: { type: Number, required: true }
    }],

}))