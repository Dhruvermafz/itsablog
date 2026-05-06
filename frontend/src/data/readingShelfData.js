// Reading shelf data management

export const SHELF_TYPES = {
  CURRENTLY_READING: 'currently_reading',
  WANT_TO_READ: 'want_to_read',
  RECOMMENDED: 'recommended',
  FINISHED: 'finished'
};

export const getStoredReadingShelf = (userId) => {
  const stored = localStorage.getItem('itsablog_reading_shelf');
  const allShelves = stored ? JSON.parse(stored) : [];
  return userId ? allShelves.filter(item => item.userId === userId) : allShelves;
};

export const addToShelf = (userId, bookId, shelfType, recommendedBy = null) => {
  const shelves = JSON.parse(localStorage.getItem('itsablog_reading_shelf') || '[]');
  
  // Check if book already exists in any shelf for this user
  const existingIndex = shelves.findIndex(
    item => item.userId === userId && item.bookId === bookId
  );
  
  if (existingIndex >= 0) {
    // Update existing entry
    shelves[existingIndex].shelfType = shelfType;
    shelves[existingIndex].updatedAt = new Date().toISOString();
    if (recommendedBy) shelves[existingIndex].recommendedBy = recommendedBy;
  } else {
    // Add new entry
    shelves.push({
      id: 'shelf' + Date.now(),
      userId,
      bookId,
      shelfType,
      recommendedBy,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('itsablog_reading_shelf', JSON.stringify(shelves));
};

export const removeFromShelf = (userId, bookId) => {
  const shelves = JSON.parse(localStorage.getItem('itsablog_reading_shelf') || '[]');
  const filtered = shelves.filter(
    item => !(item.userId === userId && item.bookId === bookId)
  );
  localStorage.setItem('itsablog_reading_shelf', JSON.stringify(filtered));
};

export const getBookShelfStatus = (userId, bookId) => {
  const shelves = getStoredReadingShelf(userId);
  const item = shelves.find(s => s.bookId === bookId);
  return item ? item.shelfType : null;
};

// Private notes management
export const getStoredNotes = (userId) => {
  const stored = localStorage.getItem('itsablog_notes');
  const allNotes = stored ? JSON.parse(stored) : [];
  return userId ? allNotes.filter(note => note.userId === userId) : allNotes;
};

export const getBookNote = (userId, bookId) => {
  const notes = getStoredNotes(userId);
  return notes.find(note => note.bookId === bookId);
};

export const saveNote = (userId, bookId, content) => {
  const notes = JSON.parse(localStorage.getItem('itsablog_notes') || '[]');
  const existingIndex = notes.findIndex(
    note => note.userId === userId && note.bookId === bookId
  );
  
  if (existingIndex >= 0) {
    notes[existingIndex].content = content;
    notes[existingIndex].updatedAt = new Date().toISOString();
  } else {
    notes.push({
      id: 'note' + Date.now(),
      userId,
      bookId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('itsablog_notes', JSON.stringify(notes));
};

export const deleteNote = (userId, bookId) => {
  const notes = JSON.parse(localStorage.getItem('itsablog_notes') || '[]');
  const filtered = notes.filter(
    note => !(note.userId === userId && note.bookId === bookId)
  );
  localStorage.setItem('itsablog_notes', JSON.stringify(filtered));
};
