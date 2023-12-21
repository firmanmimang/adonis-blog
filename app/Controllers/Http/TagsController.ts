// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Tag from "App/Models/Tag";
import TagStoreValidator from "App/Validators/Tag/TagStoreValidator";
import TagUpdateValidator from "App/Validators/Tag/TagUpdateValidator";

export default class TagsController
{
  public async index({view}) {
    return view.render('tag/index', {
      tags: await Tag.all(),
    });
  }

  public create({view}) {
    return view.render('tag/create')
  }

  public async store({request, response, session}) {
    const payload = await request.validate(TagStoreValidator);

    const trx = await Database.transaction()

    try {
      const tag = new Tag();
      tag.name = payload.name;
      tag.useTransaction(trx);
      await tag.save();
      await trx.commit();
      
      return response.redirect().toRoute('tag.index');
    } catch (error) {
      await trx.rollback();
      session.flash('alert', {type: 'danger', message: 'Server Error',});
      return response.redirect().back();
    }
  }

  public async edit({view, params}) {
    return view.render('tag/edit', {
      tag: await Tag.findByOrFail('slug', params.slug);
    })
  }

  public async update({request, response, session, params}) {
    const payload = await request.validate(TagUpdateValidator);
    const tag = await Tag.findByOrFail('slug', params.slug);

    const trx = await Database.transaction()

    try {
      tag.name = payload.name;
      tag.useTransaction(trx);
      await tag.save();
      await trx.commit();
      
      return response.redirect().toRoute('tag.index');
    } catch (error) {
      await trx.rollback();
      session.flash('alert', {type: 'danger', message: 'Server Error',});
      return response.redirect().back();
    }
  }

  public async destroy ({response, session, params}) {
    const tag = await Tag.findByOrFail('slug', params.slug);

    const trx = await Database.transaction()

    try {
      tag.useTransaction(trx);
      await tag.delete();
      await trx.commit();
      
      session.flash('alert', {type: 'success', message: 'Success Delete',});
      return response.redirect().toRoute('tag.index');
    } catch (error) {
      await trx.rollback();
      session.flash('alert', {type: 'danger', message: 'Server Error',});
      return response.redirect().back();
    }
  }
}
