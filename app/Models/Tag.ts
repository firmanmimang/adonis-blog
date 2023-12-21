import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify' 
import Article from './Article'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;
  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name']
  })
  public slug: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Article, {
    localKey: 'id',
    pivotForeignKey: 'article_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
  })
  public articles: ManyToMany<typeof Article>
}
