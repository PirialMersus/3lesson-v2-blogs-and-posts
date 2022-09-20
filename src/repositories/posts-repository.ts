import {blogsCollection, IBlog, IPost, postsCollection} from "./db";
import {blogsRepository} from "./blogs-repository";
export interface IReturnedFindPostsObj {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IPost[]
}

export const postsRepository = {
    async findPosts(pageNumber: number, pageSize: number, skip: number): Promise<IPost[]> {
        const count = await postsCollection.find({}).count()
        const foundPosts: IPost[] = (await postsCollection
            .find({})
            // .skip(skip)
            // .limit(pageSize)
            .toArray())
            .map(post => ({
                id: post.id,
                blogId: post.blogId,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }))

        return new Promise((resolve) => {
            resolve(foundPosts)
        })
    },
    async findPostById(id: string): Promise<IPost | null> {
        let post = postsCollection.findOne({id})
        if (post) {
            return post
        } else {
            return null
        }
    },
    // have to have return value type
    async createPost(newPost: IPost): Promise<IPost> {
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        const blog: IBlog | null = await blogsRepository.findBlogById(blogId)
        let result = await postsCollection.updateOne({id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId: blogId,
                blogName: blog?.name
                    ? blog?.name
                    : 'unknown'
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}