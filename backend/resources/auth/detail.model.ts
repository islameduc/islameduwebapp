import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { Post } from '@/resources/post'

const DetailSchema = new Schema(
    {
        _id: { type: String, default: uuid },
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, ref: 'User', required: true },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
)

export default model<Post>('Detail', DetailSchema)