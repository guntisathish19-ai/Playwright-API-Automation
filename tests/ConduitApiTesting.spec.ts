import { expect } from "../Utils/custom-expect";
import { test } from "../Utils/Fiextures";
import { createToken } from "../helpers/createToken"

let authToken: string

test.beforeAll('run it before all', async ({ config }) => {
   /* const tokenResponse = await api
        .path('/users/login')
        //.body({ "user": { "email": "sathishkumar@test.com", "password": "Test@123" } })
        .body({"user": { "email": config.email, "password": config.password }})
        .postRequest(200)

    const token = tokenResponse.user.token
    authToken = 'Token ' + token*/
    authToken = await createToken( config.email, config.password  ) //we are replacing above script in createToken helpers
    
});

test('Get articles test', async ({ api }) => {

    const response = await api
        .path('articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)

    //added below lines to verify q.parameters reset to default after above get request
    const response2 = await api
        .path('/tags')
        .getRequest(200)

    expect(response2.tags[2]).shouldEqual('Git')
    expect(response2.tags.length).shouldBeLessThanOrEqual(10)

});

test('Get tags test', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags[2]).shouldEqual('Git')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)

});

test('Create, Update and Delete an article test', async ({ api }) => {
    //create a new article
    const createArticleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "TestTwo",
                "description": "pwapi from postman",
                "body": "this is test article creation from postman",
                "tagList": []
            }
        })
        .postRequest(201)
    const slugId = createArticleResponse.article.slug
    expect(createArticleResponse.article.title).shouldEqual('TestTwo')

    //update an existing article
    const updateRequestRespone = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "Test title modified",
                "description": "put request",
                "body": "from put request",
                "tagList": [],
                "slug": "Test-title-52544"
            }
        })
        .putRequest(200)
    const modifiedSlugId = updateRequestRespone.article.slug
    expect(updateRequestRespone.article.title).shouldEqual('Test title modified')
    expect(updateRequestRespone.article.author.username).shouldEqual("sathishkumpwapi")

    //Delete an existing article
    const deleteRequestResponse = await api
        .path(`/articles/${modifiedSlugId}`)
        .headers({  Authorization: authToken })
        .deleteRequest(204)

    //get articles
    const response = await api
        .path('articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
      
    expect(response.articles.title).not.shouldEqual('Test title modified')
    expect(response.articles.title).not.shouldEqual('TestTwo')
    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)

});