import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280, // Twitter-style limit
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet" // Self-reference for threaded replies
        }
    ]
}, { timestamps: true });

export const Tweet = mongoose.model("Tweet", tweetSchema);