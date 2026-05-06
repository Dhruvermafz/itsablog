export const mockClubs = [
  {
    id: 'club1',
    name: 'Mystery Lovers Club',
    description: 'For fans of mystery, thriller, and detective novels. Discuss plot twists, share theories, and discover new mysteries.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800',
    memberCount: 1247,
    postCount: 589,
    category: 'Genre',
    termsAndConditions: 'Be respectful to all members. No spoilers without warnings. Keep discussions relevant to mystery genre. Share your honest opinions but be constructive.',
    createdBy: 'Admin',
    createdAt: '2023-01-15'
  },
  {
    id: 'club2',
    name: 'Classic Literature Society',
    description: 'Exploring timeless classics from around the world. Deep discussions on themes, symbolism, and historical context.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    memberCount: 892,
    postCount: 423,
    category: 'Genre',
    termsAndConditions: 'Maintain intellectual discussions. Respect diverse interpretations. No hate speech. Cite sources when discussing historical context.',
    createdBy: 'Admin',
    createdAt: '2023-02-20'
  },
  {
    id: 'club3',
    name: 'Sci-Fi Universe',
    description: 'Science fiction enthusiasts unite! From space operas to cyberpunk, discuss futuristic worlds and mind-bending concepts.',
    coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=800',
    memberCount: 1856,
    postCount: 1024,
    category: 'Genre',
    termsAndConditions: 'Welcome all sci-fi subgenres. Mark spoilers clearly. Be kind to new members. Share recommendations freely.',
    createdBy: 'Admin',
    createdAt: '2023-03-10'
  },
  {
    id: 'club4',
    name: 'Book Club Monthly',
    description: 'Read one book per month together. Vote on selections, discuss themes, and make new reading friends.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
    memberCount: 2134,
    postCount: 867,
    category: 'Reading Group',
    termsAndConditions: 'Participate in monthly book votes. Read the selected book. Attend discussion threads. No bullying or harassment.',
    createdBy: 'Admin',
    createdAt: '2023-01-05'
  },
  {
    id: 'club5',
    name: 'Fantasy Realm',
    description: 'Epic fantasies, urban fantasy, and magical realism. Discuss world-building, magic systems, and character arcs.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    memberCount: 1678,
    postCount: 945,
    category: 'Genre',
    termsAndConditions: 'Embrace all fantasy subgenres. Use spoiler tags. Respect author preferences. Share fan art with credit.',
    createdBy: 'Admin',
    createdAt: '2023-02-14'
  },
  {
    id: 'club6',
    name: 'Non-Fiction Explorers',
    description: 'Dive into biographies, history, science, and self-improvement. Learn and grow together.',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    memberCount: 756,
    postCount: 412,
    category: 'Genre',
    termsAndConditions: 'Fact-check information. Provide sources. Respect different perspectives. Keep political debates civil.',
    createdBy: 'Admin',
    createdAt: '2023-03-22'
  }
];

export const mockClubPosts = [
  {
    id: 'post1',
    clubId: 'club1',
    userId: 'user1',
    userName: 'Sarah Chen',
    userAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366F1&color=fff',
    content: 'Just finished "The Silent Patient" and I\'m blown away! The twist at the end was something I never saw coming. Anyone else read this? What did you think?',
    bookTitle: 'The Silent Patient',
    bookAuthor: 'Alex Michaelides',
    likes: 34,
    comments: 12,
    createdAt: '2024-01-16T10:30:00Z'
  },
  {
    id: 'post2',
    clubId: 'club1',
    userId: 'user2',
    userName: 'James Wilson',
    userAvatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=6366F1&color=fff',
    content: 'Looking for recommendations similar to Agatha Christie\'s style but more modern. Any suggestions?',
    likes: 28,
    comments: 15,
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 'post3',
    clubId: 'club2',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    userAvatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6366F1&color=fff',
    content: 'Currently reading "Pride and Prejudice" for the third time. The social commentary is still so relevant today. Austen was truly ahead of her time.',
    bookTitle: 'Pride and Prejudice',
    bookAuthor: 'Jane Austen',
    likes: 67,
    comments: 23,
    createdAt: '2024-01-14T09:15:00Z'
  },
  {
    id: 'post4',
    clubId: 'club3',
    userId: 'user4',
    userName: 'Alex Kumar',
    userAvatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=6366F1&color=fff',
    content: 'Just started "Project Hail Mary" by Andy Weir. The science in this book is incredible! Has anyone else read it?',
    bookTitle: 'Project Hail Mary',
    bookAuthor: 'Andy Weir',
    likes: 89,
    comments: 34,
    createdAt: '2024-01-13T16:45:00Z'
  }
];

export const getStoredClubMemberships = () => {
  const stored = localStorage.getItem('itsablog_club_memberships');
  return stored ? JSON.parse(stored) : [];
};

export const joinClub = (userId, clubId) => {
  const memberships = getStoredClubMemberships();
  if (!memberships.find(m => m.userId === userId && m.clubId === clubId)) {
    memberships.push({
      id: 'membership' + Date.now(),
      userId,
      clubId,
      joinedAt: new Date().toISOString()
    });
    localStorage.setItem('itsablog_club_memberships', JSON.stringify(memberships));
  }
};

export const isUserMemberOfClub = (userId, clubId) => {
  const memberships = getStoredClubMemberships();
  return memberships.some(m => m.userId === userId && m.clubId === clubId);
};

export const getStoredClubPosts = (clubId) => {
  const stored = localStorage.getItem('itsablog_club_posts');
  const allPosts = stored ? JSON.parse(stored) : mockClubPosts;
  return clubId ? allPosts.filter(p => p.clubId === clubId) : allPosts;
};

export const createClubPost = (post) => {
  const posts = getStoredClubPosts();
  posts.unshift(post);
  localStorage.setItem('itsablog_club_posts', JSON.stringify(posts));
};
