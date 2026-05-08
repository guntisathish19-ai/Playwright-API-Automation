import { expect } from "@playwright/test";
import { test } from "../Utils/Fiextures";

let authToken: string

test.beforeAll('run it before all', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({ "user": { "email": "sathishkumar@test.com", "password": "Test@123" } })
        .postRequest(200)

    const token = tokenResponse.user.token
    authToken = 'Token ' + token
});

test('Get articles test', async ({ api }) => {

    const response = await api
        .path('articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)

});

test('Get tags test', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags[2]).toBe('Git')
    expect(response.tags.length).toBeLessThanOrEqual(10)

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
    expect(createArticleResponse.article.title).toEqual('TestTwo')

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
    expect(updateRequestRespone.article.title).toEqual('Test title modified')
    expect(updateRequestRespone.article.author.username).toEqual("sathishkumpwapi")

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
      
    expect(response.articles.title).not.toEqual('Test title modified')
    expect(response.articles.title).not.toEqual('TestTwo')
    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)

});