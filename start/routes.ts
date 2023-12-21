/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  // News CRUD
  Route.get('/news/create', 'ArticlesController.create').as('news.create');
  Route.post('/news', 'ArticlesController.store').as('news.store');
  Route.get('/news/:slug', 'ArticlesController.show').as('news.show');
  Route.get('/news/:slug/edit', 'ArticlesController.edit').as('news.edit');
  Route.patch('/news/:slug', 'ArticlesController.update')
  // .where('id', /^[0-9]+$/);
  // .where('id', {
  //   match: /^[0-9]+$/,
  //   cast: (id) => Number(id),
  // })
  .as('news.update');
  Route.delete('/news/:slug', 'ArticlesController.destroy').as('news.destroy');

  // TAG CRUD
  Route.get('/tag', 'TagsController.index').as('tag.index');
  Route.get('/tag/create', 'TagsController.create').as('tag.create');
  Route.post('/tag', 'TagsController.store').as('tag.store');
  Route.get('/tag/:slug/edit', 'TagsController.edit').as('tag.edit');
  Route.patch('/tag/:slug', 'TagsController.update').as('tag.update');
  Route.delete('/tag/:slug', 'TagsController.destroy').as('tag.destroy');
  
  Route.post("/logout", async ({ auth, response }) => {
    await auth.use("web").logout();
    response.redirect("/login");
  }).as("auth.logout");
}).middleware("auth");

Route.on('/').render('welcome').as('home');

Route.get('/news', 'ArticlesController.index').as('news.index');
// Route.get('/news', async (ctx) => new ArticlesController().index(ctx)).as('news.view');


Route.on('/login').render('auth/login').as('auth.login');
Route.post("/login", async ({ auth, request, response }) => {
  const email = request.input("email");
  const password = request.input("password");

  await auth.use("web").attempt(email, password);
  return response.redirect("/news");
});
