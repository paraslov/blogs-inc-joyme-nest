import { Connection } from 'mongoose'

export const deleteAllData = async (databaseConnection: Connection) => {
  console.log('@> db connection: ', databaseConnection)
  await databaseConnection.collection('users').deleteMany({})
  // await databaseConnection.collection('some').deleteMany({})
}
