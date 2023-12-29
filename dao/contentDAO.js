const modelManager = require('../models/modelManager');
const {styleSchema, heroSchema, homeSchema} = require('../models/content');

class ContentDAO {
    constructor(tenantId) {
        this.tenantId = tenantId;
    }

    // Posts
    async createPost(postData) {
        const Post = modelManager.getModelForTenant(this.tenantId, homeSchema, 'Post', 'posts');
        const post = new Post(postData);
        await post.save();
        return post;
    }

    async getAllPosts() {
        const Post = modelManager.getModelForTenant(this.tenantId, homeSchema, 'Post', 'posts');
        return await Post.find();
    }

    async findPostById(postId){
        const HeroModel = modelManager.getModelForTenant(this.tenantId, homeSchema, 'Post', 'posts');
        return await HeroModel.find({ _id: postId });
    }

    async updatePost(postId, updateData) {
        const Post = modelManager.getModelForTenant(this.tenantId, homeSchema, 'Post', 'posts');
        return await Post.findByIdAndUpdate(postId, updateData, { new: true });
    }

    // Hero Image
    async createHero(heroData) {
        const Hero = modelManager.getModelForTenant(this.tenantId, heroSchema, 'Hero', 'hero');
        const hero = new Hero(heroData);
        await hero.save();
        return hero;
    }

    async getHero() {
        const HeroModel = modelManager.getModelForTenant(this.tenantId, heroSchema, 'Hero', 'hero');
        return await HeroModel.find();
    }

    async findHeroById(heroId){
        const HeroModel = modelManager.getModelForTenant(this.tenantId, heroSchema, 'Hero', 'hero');
        return await HeroModel.find({ _id: heroId });
    }

    async updateHero(heroId, newImageData) {
        const HeroModel = modelManager.getModelForTenant(this.tenantId, heroSchema, 'Hero', 'hero');
        return await HeroModel.findByIdAndUpdate(heroId, newImageData, { new: true });
    }

    // Public Style
    async getPublicStyle(tenantId) {
        const PublicStyle = modelManager.getModelForTenant(this.tenantId, styleSchema, 'Style', 'styles');
        return await PublicStyle.findOne({});
    }

    async updatePublicStyle(styleData) {
        const PublicStyle = modelManager.getModelForTenant(this.tenantId, styleSchema, 'Style', 'styles');
        const existingStyle = await PublicStyle.findOne({})
        if (existingStyle) {
            Object.assign(existingStyle, styleData);
            return await existingStyle.save();
        } else {
            const newStyle = new PublicStyle({...styleData});
            return await newStyle.save();
        }
    }
}

module.exports = ContentDAO;
