import {blogsCollection, IBlog} from "./db";
import {IFindObj} from "../domain/blogs-service";

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
        const foundBloggers: IBlog[] = (await blogsCollection
            .find(findObject)
            .toArray())
            .map(blog => (
                {
                    name: blog.name,
                    youtubeUrl: blog.name,
                    id: blog.id,
                    createdAt: blog.createdAt,
                }
            ))
        return new Promise((resolve) => {
            resolve(foundBloggers)
        })
    },

    async findBlogById(id: string): Promise<IBlog | null> {
        const blog = blogsCollection.findOne({id}, {projection: {_id: 0}})
        if (blog) {
            return blog
        } else {
            return null
        }
    },
    // have to have return value type
    async createBlog(newBlog: IBlog): Promise<IBlog | null>  {
        await blogsCollection.insertOne(newBlog)
        return blogsCollection.findOne({id: newBlog.id}, {projection: {_id: 0}})
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await blogsCollection.updateOne({id}, {
            $set: {name, youtubeUrl}
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}