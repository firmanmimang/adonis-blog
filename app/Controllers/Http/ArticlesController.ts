// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Application from "@ioc:Adonis/Core/Application";
// import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import Tag from "App/Models/Tag";
import CreateArticleValidator from "App/Validators/CreateArticleValidator";

export default class ArticlesController
{
  public async index({view}) {
    const articles = await Article.all();
    return view.render('news/view', {
      articles: articles,
    });
  }

  public async create({view}) {
    return view.render('news/create', {
      tags: await Tag.all(),
    })
  }

  public async store({request, response}) {
    
    // const {title, image, content} = request.body();
    const payload = await request.validate(CreateArticleValidator);

    // await Database.table('articles').insert({
    //   ...payload,
    //   slug: payload.title.replace(' ', '-') + new Date()
    // });

    if(payload.image){
      await payload.image.move(Application.publicPath("images"));
      payload.image = payload.image.fileName;
    }

    const article = await Article.create(payload);
    article.related('tags').sync(payload.tags)

    return response.redirect().back();
  }

  public async show({ view, params }) {
    const article = await Article.findByOrFail('slug', params.slug);
    return view.render("news/show", { article });
  }

  public async edit({view,params}) {
    const article = await Article.query().preload('tags').where('slug', params.slug).firstOrFail();
    return view.render('news/edit', {
      article,
      tags: await Tag.all(),
    })
  }

  public async update({request, response, params}) {
    
    const payload = await request.validate(CreateArticleValidator);

    const article = await Article.findByOrFail('slug', params.slug);
    article.title = payload.title
    article.content = payload.content
    if(payload.image){
      await payload.image.move(Application.publicPath("images"));
      article.image = payload.image.fileName
    }
    article.related('tags').sync(payload.tags)
    article.save()

    return response.redirect().back();
  }

  public async destroy({response, params}) {

    const article = await Article.findByOrFail('slug', params.slug);
    if(article) article.delete();
    return response.redirect().back();
  }
}
