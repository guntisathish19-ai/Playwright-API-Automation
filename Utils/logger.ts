
export class APILogger{

    private recentlogs: any [] = [];

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any){
        const logEntry = { method, url, headers, body };
        this.recentlogs.push({type: 'Request Details', data: logEntry})
    }

    logResponse(statusCode: number, body?: any){
        const logEntry = { statusCode, body }
        this.recentlogs.push({type: 'Response Details', data: logEntry})
    }

    getRecentLogs(){
        const logs = this.recentlogs.map(log => {
            return `====${log.type}====\n${JSON.stringify(log.data, null, 4)}`
        }).join('\n\n')
        return logs
    }
}