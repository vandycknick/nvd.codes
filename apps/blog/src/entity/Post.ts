import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm"

import { ImageEntity } from "./Image"

@Entity({ name: "posts" })
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  title!: string

  @Column()
  description!: string

  @Column({ type: "timestamp" })
  date!: Date

  @Column({ type: "number", nullable: true })
  draft = true

  @Column({ type: "clob" })
  content!: string

  @Column({ type: "simple-json" })
  categories: string[] = []

  @Column()
  slug!: string

  @Column()
  readingTime!: string

  @Column({ type: "varchar2" })
  cover!: string

  @Column({ type: "clob" })
  placeholder!: string

  @Column({ type: "simple-json" })
  placeholderCss: { [index: string]: string } = {}

  @Column()
  editUrl!: string

  @Column()
  sha256!: string

  @OneToMany(() => ImageEntity, (image) => image.post, { cascade: true })
  images!: ImageEntity[]
}
