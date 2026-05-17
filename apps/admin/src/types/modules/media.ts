export interface Media {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  storageProvider?: 'local' | 'vercel-blob' | string;
  storageKey?: string | null;
  pathname?: string | null;
  folderId?: number | null;
  createdAt: string;
  updatedAt: string;
}
