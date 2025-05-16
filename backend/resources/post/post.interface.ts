import { Document } from 'mongoose'
import { User } from '@/resources/user'
import { File } from '@/resources/file'

interface Post extends Document {
    title: string
    content: string
    category: string
    categoryId: string
    author: User
    image: File
    video: File
    createdAt: Date
    updatedAt: Date
    numberOfViews: number
    isDeleted: boolean
}

export default Post