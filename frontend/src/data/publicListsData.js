// Public lists data and management

export const mockPublicLists = [
  {
    id: "publist1",
    name: "Must-Read Sci-Fi Classics",
    description: "Essential science fiction novels that shaped the genre",
    userId: "user1",
    userName: "Sarah Chen",
    userAvatar:
      "https://ui-avatars.com/api/?name=Sarah+Chen&background=6366F1&color=fff",
    books: ["3", "1", "5"],
    isPublic: true,
    likes: 234,
    followers: 89,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "publist2",
    name: "Summer Beach Reads 2024",
    description: "Light, enjoyable books perfect for vacation reading",
    userId: "user2",
    userName: "James Wilson",
    userAvatar:
      "https://ui-avatars.com/api/?name=James+Wilson&background=6366F1&color=fff",
    books: ["2", "4", "6"],
    isPublic: true,
    likes: 156,
    followers: 45,
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-12T16:20:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "publist3",
    name: "Life-Changing Non-Fiction",
    description: "Books that will transform your perspective on life",
    userId: "user3",
    userName: "Emily Rodriguez",
    userAvatar:
      "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6366F1&color=fff",
    books: ["5"],
    isPublic: true,
    likes: 312,
    followers: 127,
    createdAt: "2023-12-20T12:00:00Z",
    updatedAt: "2024-01-08T09:45:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "publist4",
    name: "Fantasy Epics to Get Lost In",
    description: "Immersive fantasy worlds with incredible world-building",
    userId: "user4",
    userName: "Alex Kumar",
    userAvatar:
      "https://ui-avatars.com/api/?name=Alex+Kumar&background=6366F1&color=fff",
    books: ["1", "6"],
    isPublic: true,
    likes: 189,
    followers: 67,
    createdAt: "2024-01-03T15:30:00Z",
    updatedAt: "2024-01-14T11:10:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "publist5",
    name: "Emotional Rollercoasters",
    description: "Books that will make you laugh, cry, and feel everything",
    userId: "user1",
    userName: "Sarah Chen",
    userAvatar:
      "https://ui-avatars.com/api/?name=Sarah+Chen&background=6366F1&color=fff",
    books: ["4", "2", "1"],
    isPublic: true,
    likes: 278,
    followers: 103,
    createdAt: "2023-12-28T09:00:00Z",
    updatedAt: "2024-01-11T13:25:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "publist6",
    name: "Mystery & Thriller Masterpieces",
    description: "Page-turners that will keep you up all night",
    userId: "user2",
    userName: "James Wilson",
    userAvatar:
      "https://ui-avatars.com/api/?name=James+Wilson&background=6366F1&color=fff",
    books: ["2", "3"],
    isPublic: true,
    likes: 423,
    followers: 156,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-13T17:40:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
  },
];

// ✅ Safe access helper
const getStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

// ✅ Get lists
export const getStoredPublicLists = () => {
  const storage = getStorage();
  if (!storage) return mockPublicLists;

  const stored = storage.getItem("itsablog_public_lists");
  return stored ? JSON.parse(stored) : mockPublicLists;
};

// ✅ Get list by ID
export const getListById = (listId) => {
  const lists = getStoredPublicLists();
  return lists.find((list) => list.id === listId);
};

// ✅ Like list
export const likeList = (userId, listId) => {
  const storage = getStorage();
  if (!storage) return false;

  const lists = getStoredPublicLists();
  const listIndex = lists.findIndex((l) => l.id === listId);

  if (listIndex >= 0) {
    const likedLists = JSON.parse(
      storage.getItem("itsablog_liked_lists") || "[]",
    );

    const alreadyLiked = likedLists.some(
      (l) => l.userId === userId && l.listId === listId,
    );

    if (!alreadyLiked) {
      lists[listIndex].likes += 1;
      likedLists.push({ userId, listId });

      storage.setItem("itsablog_liked_lists", JSON.stringify(likedLists));
      storage.setItem("itsablog_public_lists", JSON.stringify(lists));

      return true;
    }
  }

  return false;
};

// ✅ Follow list
export const followList = (userId, listId) => {
  const storage = getStorage();
  if (!storage) return false;

  const lists = getStoredPublicLists();
  const listIndex = lists.findIndex((l) => l.id === listId);

  if (listIndex >= 0) {
    const followedLists = JSON.parse(
      storage.getItem("itsablog_followed_lists") || "[]",
    );

    const alreadyFollowed = followedLists.some(
      (f) => f.userId === userId && f.listId === listId,
    );

    if (!alreadyFollowed) {
      lists[listIndex].followers += 1;

      followedLists.push({
        userId,
        listId,
        followedAt: new Date().toISOString(),
      });

      storage.setItem("itsablog_followed_lists", JSON.stringify(followedLists));
      storage.setItem("itsablog_public_lists", JSON.stringify(lists));

      return true;
    }
  }

  return false;
};

// ✅ Check liked
export const isListLiked = (userId, listId) => {
  const storage = getStorage();
  if (!storage) return false;

  const likedLists = JSON.parse(
    storage.getItem("itsablog_liked_lists") || "[]",
  );

  return likedLists.some((l) => l.userId === userId && l.listId === listId);
};

// ✅ Check followed
export const isListFollowed = (userId, listId) => {
  const storage = getStorage();
  if (!storage) return false;

  const followedLists = JSON.parse(
    storage.getItem("itsablog_followed_lists") || "[]",
  );

  return followedLists.some((f) => f.userId === userId && f.listId === listId);
};
