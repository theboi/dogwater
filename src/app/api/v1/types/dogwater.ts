export enum DogwaterCommand {
  Insight = 'insight',
  Bucket = 'bucket',
  Texture = 'texture',
  Watch = 'watch',
  Unwatch = 'unwatch'
}

export interface DogwaterPost {
  id: string;
  pageTitle: string;
  postTitle: string;
  date: Date;
  author: string;
  content: string;
  likes: number;
  comments: DogwaterComment[];
}

export interface DogwaterComment {
  id: string;
  date: Date;
  author: string;
  message: string;
  likes: number;
  subcomments: DogwaterComment[];
}

export interface DogwaterArticle {
  id: string;
  
}