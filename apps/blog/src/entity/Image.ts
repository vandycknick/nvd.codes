import pkg from "typeorm"

import { PostEntity } from "./Post"

const { Column, Entity, PrimaryGeneratedColumn, ManyToOne } = pkg

@Entity({ name: "images" })
export class ImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  url: string

  @Column()
  width: number

  @Column()
  height: number

  @Column()
  sha256: string

  @Column({ type: "clob" })
  placeholder: string

  @ManyToOne(() => PostEntity, (post) => post.images)
  post!: PostEntity

  constructor(
    url: string,
    width: number,
    height: number,
    sha256: string,
    placeholder: string,
  ) {
    this.url = url
    this.width = width
    this.height = height
    this.sha256 = sha256
    this.placeholder = placeholder
  }
}
