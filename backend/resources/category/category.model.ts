import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { Category } from '@/resources/category'

const CategorySchema = new Schema(
    {
        _id: { type: String, default: uuid },
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, ref: 'File' },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
)

export default model<Category>('Category', CategorySchema)
