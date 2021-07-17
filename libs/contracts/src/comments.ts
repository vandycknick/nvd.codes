export type PostComments = {
  id: string
  title: string
  url: string
  reactions: Reaction[]
  comments: Comment[]
  totalComments: number
}

export type Reaction = {
  content: string
  count: number
}

export type Comment = {
  id: string
  createdAt: string
  body: string
  author: {
    avatarUrl: string
    login: string
  }
  reactions: Reaction[]
}
