import { test, expect, request } from '@playwright/test';
let authToken: string

test.beforeAll('run it before all', async ({ request }) => {
  const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    data: { "user": { "email": "sathishkumar@test.com", "password": "Test@123" } }
  })
  const responseJson = await response.json()
  const token = responseJson.user.token
  authToken = 'Token ' + token
});

test.afterAll('Execute it after all tests', async ({ }) => {
  console.log("Execute it after all tests")
});

test('Get Tags test', async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/tags")
  const responseJson = await response.json()
  expect(response.status()).toBe(200)
  expect(response.status()).shouldEqual(200)
  expect(responseJson.tags[2]).toBe('Git')
  expect(responseJson.tags.length).shouldBeLessThanOrEqualOrEqual(10)
  //console.log(responseJson)
});

test('Get all articles', async ({ request }) => {
  const response = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0")
  const responseJson = await response.json()
  expect(response.status()).toBe(200)
  expect(responseJson.articles.length).shouldBeLessThanOrEqualOrEqual(10)
  //console.log(responseJson)
});

test('Login request', async ({ request }) => {
  console.log(authToken)
});

test('Create , update and delete an article', async ({ request }) => {
  //login
 /** const respons = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
    data: { "user": { "email": "sathishkumar@test.com", "password": "Test@123" } }
  })
  const responsJson = await respons.json()
  const token = responsJson.user.token
  const authToken = 'Token ' + token
  //console.log(authToken)*/

  //create an article
  const response = await request.post("https://conduit-api.bondaracademy.com/api/articles", {
    data: {
      "article": {
        "title": "TestTwo",
        "description": "pwapi from postman",
        "body": "this is test article creation from postman",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const responseJson = await response.json()
  const slugId = responseJson.article.slug
  expect(response.status()).toBe(201)
  expect(responseJson.article.title).shouldEqual('TestTwo')
  //console.log(responseJson)

  //get articles
  const respon = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
    headers: {
      Authorization: authToken
    }
  })
  const responJson = await respon.json()
  expect(respon.status()).toBe(200)
  expect(responJson.articles.length).shouldBeLessThanOrEqualOrEqual(10)
  expect(responJson.articles[0].title).toBe('TestTwo')

  //update an article
  const re = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
      "article": {
        "title": "Test title modified",
        "description": "put request",
        "body": "from put request",
        "tagList": [],
        "slug": "Test-title-52544"
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const reJson = await re.json()
  const modifiedSlugId = reJson.article.slug
  //console.log(reJson)
  expect(respon.status()).toBe(200)
  expect(reJson.article.author.username).shouldEqual("sathishkumpwapi")

  //Delete articles
  const res = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${modifiedSlugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(res.status()).toBe(204)



});



