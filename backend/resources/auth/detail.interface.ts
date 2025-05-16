import { Document } from 'mongoose'
import { User } from '@/resources/user'

interface Detail extends Document {
    title: string
    content: string
    author: User
    createdAt: Date
    updatedAt: Date
    isDeleted: boolean
}

export default Detail