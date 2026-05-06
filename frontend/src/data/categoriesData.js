// Categories and enhanced book data

export const bookCategories = [
  {
    id: 'cat1',
    name: 'Science Fiction & Fantasy',
    slug: 'sci-fi-fantasy',
    description: 'Journey to other worlds and dimensions',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
    books: ['3', '1', '6']
  },
  {
    id: 'cat2',
    name: 'Mystery & Thriller',
    slug: 'mystery-thriller',
    description: 'Edge-of-your-seat suspense',
    icon: '🔍',
    color: 'from-red-500 to-orange-500',
    books: ['2']
  },
  {
    id: 'cat3',
    name: 'Romance & Drama',
    slug: 'romance-drama',
    description: 'Stories of love and emotion',
    icon: '💕',
    color: 'from-rose-500 to-pink-500',
    books: ['4', '6']
  },
  {
    id: 'cat4',
    name: 'Self-Development',
    slug: 'self-development',
    description: 'Transform your life and mindset',
    icon: '🌟',
    color: 'from-emerald-500 to-teal-500',
    books: ['5']
  },
  {
    id: 'cat5',
    name: 'Literary Fiction',
    slug: 'literary-fiction',
    description: 'Thought-provoking narratives',
    icon: '📚',
    color: 'from-indigo-500 to-blue-500',
    books: ['1', '4']
  },
  {
    id: 'cat6',
    name: 'Contemporary Fiction',
    slug: 'contemporary',
    description: 'Modern stories of everyday life',
    icon: '🌆',
    color: 'from-cyan-500 to-blue-500',
    books: ['2', '1']
  }
];

// Enhanced book data with release dates and trending info
export const enhancedBooks = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    synopsis: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    year: 2020,
    releaseDate: '2020-08-13',
    genres: ['Fiction', 'Fantasy', 'Philosophy'],
    pages: 304,
    isbn: '9780525559474',
    trending: true,
    newRelease: false
  },
  {
    id: '2',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    synopsis: 'A powerful mystery about a young woman who grew up isolated in the marshes of North Carolina.',
    year: 2018,
    releaseDate: '2018-08-14',
    genres: ['Mystery', 'Romance', 'Historical'],
    pages: 384,
    isbn: '9780735219090',
    trending: true,
    newRelease: false
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBib29rJTIwY292ZXIlMjBhcnR8ZW58MHx8fHwxNzczNzYxNzQwfDA&ixlib=rb-4.1.0&q=85',
    rating: 4.8,
    synopsis: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller.',
    year: 2021,
    releaseDate: '2021-05-04',
    genres: ['Science Fiction', 'Thriller', 'Adventure'],
    pages: 496,
    isbn: '9780593135204',
    trending: true,
    newRelease: true
  },
  {
    id: '4',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://images.unsplash.com/photo-1760702156699-dd893dc7c7cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHw0fHxhZXN0aGV0aWMlMjBib29rJTIwY292ZXIlMjBhcnR8ZW58MHx8fHwxNzczNzYxNzQwfDA&ixlib=rb-4.1.0&q=85',
    rating: 4.6,
    synopsis: 'Aging Hollywood icon Evelyn Hugo finally tells the truth about her glamorous and scandalous life.',
    year: 2017,
    releaseDate: '2017-06-13',
    genres: ['Historical Fiction', 'Romance', 'LGBTQ'],
    pages: 400,
    isbn: '9781501161933',
    trending: false,
    newRelease: false
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1758803184789-a5dd872fe82e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxhZXN0aGV0aWMlMjBib29rJTIwY292ZXIlMjBhcnR8ZW58MHx8fHwxNzczNzYxNzQwfDA&ixlib=rb-4.1.0&q=85',
    rating: 4.9,
    synopsis: 'An easy and proven way to build good habits and break bad ones.',
    year: 2018,
    releaseDate: '2018-10-16',
    genres: ['Self-Help', 'Psychology', 'Productivity'],
    pages: 320,
    isbn: '9780735211292',
    trending: true,
    newRelease: false
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    synopsis: 'A tale of gods, kings, immortal fame and the human heart.',
    year: 2011,
    releaseDate: '2011-09-20',
    genres: ['Historical Fiction', 'Mythology', 'Romance'],
    pages: 378,
    isbn: '9780062060624',
    trending: false,
    newRelease: false
  }
];

export const getRecentlyReleased = () => {
  return enhancedBooks
    .filter(book => book.newRelease || book.year >= 2020)
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
};

export const getTrendingBooks = () => {
  return enhancedBooks.filter(book => book.trending);
};

export const getBooksByCategory = (categorySlug) => {
  const category = bookCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return enhancedBooks.filter(book => category.books.includes(book.id));
};
