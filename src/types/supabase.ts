export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      designs: {
        Row: {
          id: string
          name: string
          slug: string
          url: string
          category: string
          content: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          url: string
          category: string
          content: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          url?: string
          category?: string
          content?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}