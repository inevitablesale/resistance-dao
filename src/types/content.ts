export interface IPFSContent {
  contentSchema: string;
  contentType: string;
  title: string;
  content: string;
  metadata: {
    author?: string;
    publishedAt?: number;
    version?: number;
    language?: string;
    tags?: string[];
    coverImage?: string;
    attachments?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}
