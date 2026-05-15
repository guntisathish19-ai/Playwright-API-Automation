
const ENV = process.env.TEST_ENV
const env = ENV || 'qa'
console.log('Test Environment is: ' +env)

const config = {
    baseUrl: 'https://conduit-api.bondaracademy.com/api',
    email: 'sathishkumar@test.com',
    password: 'Test@123'
}

if(env === 'qa'){
    config.email= 'sathishkumar@test.com',
    config.password= 'Test@123'
}

if(env === 'dev'){
    config.email='pwapiuser@test.com',
    config.password='Welcome'
}

export {config}