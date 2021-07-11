import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { PostEntity } from "./Post"

@Entity({ name: "images" })
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  url: string

  @Column({ type: "clob" })
  placeholder: string

  @Column()
  sha256: string

  @ManyToOne(() => PostEntity, (post) => post.images)
  post!: PostEntity

  constructor(url: string, sha256: string, placeholder: string) {
    this.url = url
    this.sha256 = sha256
    this.placeholder = placeholder
  }
}
