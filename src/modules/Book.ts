export type Book = {
    id: string;
    title: string;
    writer: string;
    read: boolean;
    review?: "liked" | "disliked";
  };