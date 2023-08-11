import { Client, Account } from 'appwrite'

const client = new Client()
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('64a9c93e2b4809e8efd7')
const account = new Account(client)

export { client, account }
