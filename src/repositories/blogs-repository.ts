import {blogsCollection, IBlog} from "./db";
import {IFindObj} from "../domain/blogs-service";
import {FindCursor} from "mongodb";
import {log} from "util";

export interface IReturnedFindBloggersObj {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IBlog[]
}

export const blogsRepository = {
    async findBlogs({name, pageNumber, pageSize, skip}: IFindObj): Promise<IBlog[]> {
        const findObject: any = {}
        if (name) findObject.name = {$regex: name}
        const count = await blogsCollection.find(findObject).count()
        const foundBloggers: IBlog[] = await blogsCollection
            .find(findObject)
            .toArray()
        return new Promise((resolve) => {
            resolve(foundBloggers)
        })
    },

    async findBlogById(id: number): Promise<IBlog | null> {
        const blog = blogsCollection.findOne({id})
        if (blog) {
            return blog
        } else {
            return null
        }
    },
    // have to have return value type
    async createBlogger(newBlog: IBlog): Promise<IBlog> {

        await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await blogsCollection.updateOne({id}, {
            $set: {name, youtubeUrl}
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: number): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}