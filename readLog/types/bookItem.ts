export type BookItem = {
  id: string;
  title: string;
  author: string;
  date: string;
  pageCount: number;
  currentPage: number;
  category: string;
  status: string;
  imageName: any; // require('../assets/...') or { uri: '...' }
};
