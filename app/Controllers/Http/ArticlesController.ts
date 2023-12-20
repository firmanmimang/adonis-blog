// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Application from "@ioc:Adonis/Core/Application";
// import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";
import CreateArticleValidator from "App/Validators/CreateArticleValidator";

export default class ArticlesController
{
  public async index({view}) {
    const articles = await Article.all();
    return view.render('news/view', {
      articles: articles,
    });
  }

  public create({view}) {
    return view.render('news/create')
  }

  public async store({request, response}) {
    
    // const {title, image, content} = request.body();
    const payload = await request.validate(CreateArticleValidator);

    // await Database.table('articles').insert({
    //   ...payload,
    //   slug: payload.title.replace(' ', '-') + new Date()
    // });

    await payload.image.move(Application.publicPath("images"));
    payload.image = payload.image.fileName;

    await Article.create(payload);

    return response.redirect().back();
  }

  public async show({ view, params }) {
    const article = await Article.findByOrFail('slug', params.slug);
    return view.render("news/show", { article });
  }

  public async edit({view,params}) {
    const article = await Article.findByOrFail('slug', params.slug);
    return view.render('news/edit', { article })
  }

  public async update({request, response, params}) {
    
    const payload = await request.validate(CreateArticleValidator);

    await payload.image.move(Application.publicPath("images"));
    payload.image = payload.image.fileName;
    await Article.query().where("slug", params.slug).update(payload);
    // await Database.from('articles').where('slug', params.slug).update({...payload,});

    return response.redirect().back();
  }

  public async destroy({response, params}) {

    const article = await Article.findByOrFail('slug', params.slug);
    if(article) article.delete();
    return response.redirect().back();
  }
}
