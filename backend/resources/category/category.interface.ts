import { Document } from 'mongoose'
import { File } from '@/resources/file'

interface Category extends Document {
    name: string
    description: string
    image: File
    createdAt: Date
    updatedAt: Date
    isDeleted: boolean
}

export default Category