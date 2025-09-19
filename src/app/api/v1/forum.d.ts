interface Comment {
  id: string;
  author: string;
  message: string;
  likes: number;
  subcomments: Comment[];
}

export { Comment }