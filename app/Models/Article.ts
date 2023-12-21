import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeCreate, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Tag from './Tag';

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string;
  @column()
  public slug: string;
  @column()
  public content: string;
  @column()
  public image: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Tag, {
    localKey: 'id',
    pivotForeignKey: 'article_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
    pivotTable: 'article_tags',
    pivotTimestamps: true
  })
  public tags: ManyToMany<typeof Tag>

  @beforeCreate()
  public static async createSlug(article: Article){
    article.slug = article.$dirty.title.replace(' ', '-') + +new Date();
  }
}
