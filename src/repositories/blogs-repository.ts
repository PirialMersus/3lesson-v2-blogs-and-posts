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
                    youtubeUrl: blog.youtubeUrl,
                    id: blog.id,
                    createdAt: blog.createdAt,
                }
            ))
        return new Promise((resolve) => {
            resolve(foundBloggers)
        })
    },

    async findBlogById(id: string): Promise<IBlog | null> {
        const blog = await blogsCollection.findOne({id})
        console.log('blog', blog)
        if (blog) {
            return ({
                name: blog.name,
                youtubeUrl: blog.youtubeUrl,
                id: blog.id,
                createdAt: blog.createdAt,
            })
        } else {
            return null
        }
    },
    // have to have return value type
    async createBlog(newBlog: IBlog): Promise<IBlog> {
        await blogsCollection.insertOne(newBlog)
        return newBlog
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