import pkg from "typeorm"

const { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } = pkg

@Entity({ name: "syncpostsjob" })
export class SyncPostsJob {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  repository: string

  @Column()
  branch: string

  @Column({ type: "varchar2" })
  commitSha: string

  @CreateDateColumn()
  startedAt!: Date

  @Column({ type: "timestamp", nullable: true })
  finishedAt: Date | undefined

  @Column({ type: "simple-json" })
  messages: string[] = []

  @Column({ type: "varchar2", nullable: true })
  error: string | undefined

  constructor(repository: string, branch: string, commitSha: string) {
    this.repository = repository
    this.branch = branch
    this.commitSha = commitSha
  }
}
