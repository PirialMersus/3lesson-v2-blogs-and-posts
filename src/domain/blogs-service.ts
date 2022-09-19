import {blogsRepository, IReturnedFindBloggersObj} from "../repositories/blogs-repository"
import {IBlog} from "../repositories/db"
import * as core from "express-serve-static-core";

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

    async findBlogById(id: number): Promise<IBlog | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, youtubeUrl: string): Promise<IBlog> {
        const newBlogger = {
            name,
            youtubeUrl,
            id: +(new Date()),
            createdAt: (new Date()).toISOString()
        }
        return blogsRepository.createBlogger(newBlogger)
    },
    async updateBlog(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, youtubeUrl)
    },

    async deleteBlog(id: number): Promise<boolean> {
        return blogsRepository.deleteBlog(id)
    }
}