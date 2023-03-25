import {Message} from 'discord.js'
import {Configuration, OpenAIApi} from 'openai'

import {logStack} from './cache'

import dotenv from 'dotenv'
dotenv.config()

const logger = logStack.getLogger()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const modelDict: {[key: string]: string} = {
  chatgpt: 'gpt-3.5-turbo',
  davinci: 'text-davinci-003'
}

async function handleComplete(message: Message) {
  const filter = (msg: Message) => msg.author.id === message.author.id
  const collector = message.channel.createMessageCollector({filter, time: 15000})

  logger.log(`Try to create new complete`)
  const botMsg = await message.channel.send(`Please enter prompt.`)

  collector.on('collect', async (msg: Message) => {
    const userPrompt = msg.content

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: userPrompt
      })
      const result = completion.data.choices[0].text || 'error: no response from server'
      message.channel.send(result)
    } catch (error: any) {
      if (error.response) {
        logger.log(error.response.status)
        logger.log(error.response.data)
      } else {
        logger.log(error.message)
      }
    }

    try {
      await botMsg.delete()
      await msg.delete()
    } catch (err) {
      if (err instanceof Error) {
        logger.log(err.message)
      }
    }
  })
}

async function handleChat(message: Message) {

}

async function handleChangeSession(message: Message) {}


const funcDict: {[key: string]: Function} = {
  complete: handleComplete,
  chat: handleChat,
  changeSeSsion: handleChangeSession
}

export async function openAIManager(message: Message) {
  const channel = message.channel
  const args = message.content.split(' ')
  const usage = 'Usage:  !!chat  complete/start/continue'

  if (args.length !== 2) {
    const message = 'Invalid arguments count\n'
    channel.send(message + usage)
    return
  }

  const type = args[1]
  if (type in funcDict) {
    await funcDict[type](message)
  } else {
    const message = 'Invalid options\n'
    channel.send(message + usage)
  }
  return
}
