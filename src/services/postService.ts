import mongoose from "mongoose";
import PostModel, { IPost } from "../models/postModel";

interface PostQueryParams {
  search?: string;
  category?: string;
  author?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  return await PostModel.create(postData);
};

export const getFilteredPosts = async (query: PostQueryParams) => {
  const {
    search,
    category,
    author,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    order = "desc",
  } = query;

  let filter: any = {};

  // Search by title or content
  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") },
      { content: new RegExp(search, "i") },
    ];
  }

  // Category filter
  console.log(category, "catefgory");

  if (category && category != "all") filter.category = category;

  // Author filter
  if (author) filter.author = author;

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // Pagination
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  // Sorting
  const sortOrder = order === "asc" ? 1 : -1;

  // Fetch posts
  const posts = await PostModel.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(pageSize);

  // Get total count
  const totalPosts = await PostModel.countDocuments(filter);

  return {
    totalPosts,
    totalPages: Math.ceil(totalPosts / pageSize),
    currentPage: pageNumber,
    posts,
  };
};

export const getUserPosts = async (userId: string): Promise<IPost[]> => {
  return await PostModel.find({ creatorId: userId });
};

export const getPostById = async (postId: string): Promise<IPost | null> => {
  return await PostModel.findById(postId).populate("creatorId", "name email");
};

export const updatePost = async (
  postId: string,
  updateData: Partial<IPost>
): Promise<IPost | null> => {
  return await PostModel.findByIdAndUpdate(postId, updateData, { new: true });
};

export const deletePost = async (postId: string): Promise<IPost | null> => {
  return await PostModel.findByIdAndDelete(postId);
};

export const boostPost = async (postId: string): Promise<IPost | null> => {
  const post = await PostModel.findById(postId);
  if (!post) throw new Error("Post not found");

  // Find an existing premium post by the same creator
  const existingPremiumPost = await PostModel.findOne({
    creatorId: post.creatorId,
    isPremium: true,
    _id: { $ne: post._id },
  });

  if (existingPremiumPost) {
    await PostModel.findByIdAndUpdate(existingPremiumPost._id, {
      isPremium: false,
    });
  }

  post.isPremium = true;
  return post.save();
};

export const getAllPremiumPosts = async (): Promise<IPost[]> => {
  return await PostModel.find({ isPremium: true });
};
