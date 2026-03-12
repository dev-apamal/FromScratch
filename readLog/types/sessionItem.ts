export type SessionItem = {
  id: string;
  bookId: string;
  startTime: number; // unix timestamp ms
  endTime: number; // unix timestamp ms
  durationSeconds: number;
  pagesReadInSession: number;
  startPage: number;
  endPage: number;
};

export type BookSessionData = {
  bookId: string;
  sessions: SessionItem[];
  totalTimeSeconds: number;
  totalPagesRead: number; // currentPage equivalent
};
