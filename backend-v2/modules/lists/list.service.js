// list.service.js
import lists from "../../models/lists.js";
import listItem from "../../models/listItem.js";
import listLike from "../../models/listLike.js";

class ListService {
  // ====================== List CRUD ======================

  async createList(userId, listData) {
    const newList = await lists.create({
      user: userId,
      title: listData.title,
      description: listData.description,
      isPublic: listData.isPublic !== undefined ? listData.isPublic : true,
      coverImage: listData.coverImage,
    });
    return newList;
  }

  async getLists({ page = 1, limit = 20, isPublic = true, userId }) {
    const query = {};

    if (isPublic !== undefined) query.isPublic = isPublic;
    if (userId) query.user = userId;

    const skip = (page - 1) * limit;

    const rawLists = await lists
      .find(query)
      .populate("user", "username avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    // Format data to match frontend expectations
    const formattedLists = rawLists.map((list) => ({
      id: list._id.toString(),
      name: list.title,
      description: list.description || "",
      coverImage:
        list.coverImage ||
        `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 10}/800/600`,
      userName: list.user?.username || "Anonymous",
      userAvatar: list.user?.avatar,
      likes: list.likesCount || 0,
      followers: 0, // You can implement followers later
      books: [], // Count only for now (or populate if needed)
      updatedAt: list.updatedAt,
      createdAt: list.createdAt,
    }));

    return {
      data: formattedLists,
      pagination: {
        page,
        limit,
        total: await lists.countDocuments(query),
        hasMore: formattedLists.length === limit,
      },
    };
  }

  async getUserLists(userId, { page = 1, limit = 15 }) {
    const skip = (page - 1) * limit;

    const rawLists = await lists
      .find({ user: userId })
      .populate("user", "username avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    return rawLists.map((list) => ({
      id: list._id.toString(),
      name: list.title,
      description: list.description || "",
      coverImage: list.coverImage,
      userName: list.user?.username,
      userAvatar: list.user?.avatar,
      likes: list.likesCount || 0,
      followers: 0,
      books: [],
      updatedAt: list.updatedAt,
    }));
  }

  async getListById(listId) {
    const list = await lists
      .findById(listId)
      .populate("user", "username avatar bio")
      .lean();

    if (!list) return null;

    return {
      id: list._id.toString(),
      name: list.title,
      description: list.description,
      coverImage: list.coverImage,
      userName: list.user?.username,
      userAvatar: list.user?.avatar,
      likes: list.likesCount || 0,
      followers: 0,
      books: [], // You can fetch items separately
      updatedAt: list.updatedAt,
      createdAt: list.createdAt,
      isPublic: list.isPublic,
    };
  }

  async updateList(listId, userId, updateData) {
    const updatedList = await lists
      .findOneAndUpdate(
        { _id: listId, user: userId },
        {
          title: updateData.title,
          description: updateData.description,
          isPublic: updateData.isPublic,
          coverImage: updateData.coverImage,
        },
        { new: true, runValidators: true },
      )
      .populate("user", "username avatar");

    if (!updatedList) throw new Error("List not found or unauthorized");

    return updatedList;
  }

  async deleteList(listId, userId) {
    const existingList = await lists.findOne({ _id: listId, user: userId });
    if (!existingList) throw new Error("List not found or unauthorized");

    await Promise.all([
      listItem.deleteMany({ list: listId }),
      listLike.deleteMany({ list: listId }),
    ]);

    await existingList.deleteOne();
    return { message: "List deleted successfully" };
  }

  // ====================== List Items ======================

  async addItemToList(listId, userId, bookId, note = "") {
    const existingList = await lists.findOne({ _id: listId, user: userId });
    if (!existingList) throw new Error("List not found or unauthorized");

    const item = await listItem.create({
      list: listId,
      book: bookId,
      note,
      position: await this.getNextPosition(listId),
    });

    await lists.findByIdAndUpdate(listId, { $inc: { itemsCount: 1 } });

    return item.populate("book", "title author coverUrl");
  }

  async getNextPosition(listId) {
    const lastItem = await listItem.findOne({ list: listId }).sort("-position");
    return lastItem ? lastItem.position + 1 : 1;
  }

  async removeItemFromList(listId, userId, bookId) {
    const existingList = await lists.findOne({ _id: listId, user: userId });
    if (!existingList) throw new Error("List not found or unauthorized");

    const deleted = await listItem.findOneAndDelete({
      list: listId,
      book: bookId,
    });

    if (!deleted) throw new Error("Item not found in list");

    await lists.findByIdAndUpdate(listId, { $inc: { itemsCount: -1 } });

    return { message: "Item removed from list" };
  }

  async getListItems(listId, { page = 1, limit = 30 }) {
    const skip = (page - 1) * limit;

    return await listItem
      .find({ list: listId })
      .populate("book", "title author coverUrl year pages")
      .sort("position")
      .skip(skip)
      .limit(limit);
  }

  // ====================== Likes ======================

  async toggleLike(listId, userId) {
    const existing = await listLike.findOne({ list: listId, user: userId });

    if (existing) {
      await existing.deleteOne();
      await lists.findByIdAndUpdate(listId, { $inc: { likesCount: -1 } });
      return { liked: false, likesCount: -1 };
    } else {
      await listLike.create({ list: listId, user: userId });
      await lists.findByIdAndUpdate(listId, { $inc: { likesCount: 1 } });
      return { liked: true, likesCount: 1 };
    }
  }
}

export default new ListService();
