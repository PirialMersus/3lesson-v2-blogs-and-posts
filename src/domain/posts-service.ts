import {blogsRepository} from "../repositories/blogs-repository"
import {IPost} from "../repositories/db"
import {postsRepository} from "../repositories/posts-repository"

export const postsService = {
    async findPosts(pageNumber: number, pageSize: number): Promise<IPost[]> {

        const skip = (pageNumber - 1) * pageSize
        return postsRepository.findPosts(pageNumber, pageSize, skip)
    },
    async findPostById(id: string): Promise<IPost | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost> {
        const blog = await blogsRepository.findBlogById(blogId)
        const newPost: IPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : 'unknown',
            id: (+(new Date())).toString(),
            createdAt: (new Date()).toISOString()
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: string): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}