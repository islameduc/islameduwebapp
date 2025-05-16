import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { Post } from '@/resources/post'

const PostSchema = new Schema(
    {
        _id: { type: String, default: uuid },
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, required: true },
        categoryId: { type: String, required: true },
        author: { type: String, ref: 'User', required: true },
        image: { type: String, ref: 'File' },
        video: { type: String, ref: 'File' },
        numberOfViews: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
)

export default model<Post>('Post', PostSchema)