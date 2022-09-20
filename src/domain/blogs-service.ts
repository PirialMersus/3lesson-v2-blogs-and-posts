import {blogsRepository} from "../repositories/blogs-repository"
import {IBlog} from "../repositories/db"

export interface IFindObj {
    name: string,
    pageNumber: number,
    pageSize: number,
    skip: number,
}

export const blogsService = {
    findBlogs(name: string, pageNumber: number, pageSize: number): Promise<IBlog[]> {


        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: IFindObj = {
            name,
            pageNumber,
            pageSize,
            skip,
        }

        return blogsRepository.findBlogs(findConditionsObj)
    },

    async findBlogById(id: string): Promise<IBlog | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, youtubeUrl: string): Promise<IBlog | null> {
        const newBlogger = {
            name,
            youtubeUrl,
            id: (+(new Date())).toString(),
            createdAt: (new Date()).toISOString()
        }
        return blogsRepository.createBlog(newBlogger)
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, youtubeUrl)
    },

    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepository.deleteBlog(id)
    }
}