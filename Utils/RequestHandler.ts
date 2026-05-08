import { APIRequestContext, expect } from "@playwright/test"

export class RequestHandler{
    private request: APIRequestContext
    private baseUrl!: string
    private defaultBaseUrl: string = ''
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, baseUrl: string){
        this.request = request
        this.defaultBaseUrl = baseUrl
    }


    url(url: string){
        this.baseUrl = url
        return this
    }

    path(path: string){
        this.apiPath = path
        return this
    }

    params(params: object){
        this.queryParams = params
        return this
    }

    headers(headers: Record<string, string>){
        this.apiHeaders = headers
        return this
    }

    body(body: object){
        this.apiBody = body
        return this
    }

    async getRequest(statusCode: number){
        const url = this.getUrl()
        const response = await this.request.get(url, {headers: this.apiHeaders})
        const responseJson = await response.json()
        expect(response.status()).toEqual(statusCode)
        return responseJson
    }

    async postRequest(statusCode: number){
        const url = this.getUrl()
        const response = await  this.request.post(url, {
                headers: this.apiHeaders,
                data: this.apiBody
            })
        const responseJson = await response.json()
        expect(response.status()).toEqual(statusCode)
        return responseJson
    }

    async putRequest(statusCode: number){
        const url = this.getUrl()
        const response = await  this.request.put(url, {
                headers: this.apiHeaders,
                data: this.apiBody
            })
        console
        const responseJson = await response.json()
        expect(response.status()).toEqual(statusCode)
        return responseJson
    }

    async deleteRequest(statusCode: number){
        const url = this.getUrl()
        const response = await  this.request.delete(url, {
                headers: this.apiHeaders,
            })
        expect(response.status()).toEqual(statusCode)
        
    }

    private getUrl(){
        const base = (this.baseUrl || this.defaultBaseUrl) // remove trailing slash .replace(/\/$/, '');
        const path = this.apiPath.startsWith('/') ? this.apiPath : `/${this.apiPath}`

        const url = new URL(`${base}${path}`);
        for(const [key, value] of Object.entries(this.queryParams)){
            url.searchParams.append(key, value)
        }
        return url.toString()
    }
}