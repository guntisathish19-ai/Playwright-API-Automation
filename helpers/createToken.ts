import { RequestHandler } from "../Utils/RequestHandler"
import { request } from "@playwright/test"
import { APILogger } from "../Utils/logger";
import { config } from "../api-test.config";

 export async function createToken(email: string, password: string){
    const context = await request.newContext()
    const logger = new APILogger();
    const api= new RequestHandler(context, config.baseUrl, logger)

    try{
        const tokenResponse = await api
        .path('/users/login')
        //.body({ "user": { "email": "sathishkumar@test.com", "password": "Test@123" } })
        .body({"user": { "email": email, "password": password }})
        .postRequest(200)

    const token = tokenResponse.user.token
    return 'Token ' + token
    } catch(error){
        Error.captureStackTrace(error as any, createToken)
        throw error
    } finally{
        await context.dispose()
    }
    
}