import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler{
    private request: APIRequestContext
    private baseUrl!: string
    private defaultBaseUrl: string = ''
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}
    private logger: APILogger

    constructor(request: APIRequestContext, baseUrl: string, logger: APILogger){
        this.request = request
        this.defaultBaseUrl = baseUrl
        this.logger = logger
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
        this.logger.logRequest('GET', url, this.apiHeaders, this.apiBody) //request loggers
        const response = await this.request.get(url, {headers: this.apiHeaders})
        const responseStatus = response.status() //responseStatus = statuscode
        const responseJson = await response.json()
        this.logger.logResponse(responseStatus, responseJson) //response loggers
        this.statusCodeValidator(responseStatus, statusCode, this.getRequest)
        return responseJson
    }

    async postRequest(statusCode: number){
        const url = this.getUrl()
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody) //request loggers
        const response = await  this.request.post(url, {
                headers: this.apiHeaders,
                data: this.apiBody
            })
        const responseStatus = response.status() //responseStatus = statuscode
        const responseJson = await response.json()
        this.logger.logResponse(responseStatus, responseJson) //response loggers
        this.statusCodeValidator(responseStatus, statusCode, this.postRequest)
        return responseJson
    }

    async putRequest(statusCode: number){
        const url = this.getUrl()
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody) //request loggers
        const response = await  this.request.put(url, {
                headers: this.apiHeaders,
                data: this.apiBody
            })
        console
        const responseStatus = response.status() //responseStatus = statuscode
        const responseJson = await response.json()
        this.logger.logResponse(responseStatus, responseJson) //response loggers
        this.statusCodeValidator(responseStatus, statusCode, this.putRequest)
        return responseJson
    }

    async deleteRequest(statusCode: number){
        const url = this.getUrl()
        this.logger.logRequest('DELETE', url, this.apiHeaders) //request loggers
        const response = await  this.request.delete(url, {
                headers: this.apiHeaders,
            })
        const responseStatus = response.status() //responseStatus = statuscode
        this.logger.logResponse(responseStatus) //response loggers
        this.statusCodeValidator(responseStatus, statusCode, this.deleteRequest) // = expect(response.status()).shouldEqual(statusCode)
        
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

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function){
        if(actualStatus !== expectedStatus){
            const logs = this.logger.getRecentLogs()
            const error = new Error(`ExpectedStatus ${expectedStatus} but got ${actualStatus}\n\nRecent API Activity: \n${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }
}