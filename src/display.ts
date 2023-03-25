import {Message, TextChannel, Interaction, MessageComponentInteraction} from 'discord.js'
import {logStack, dataPool} from '../src/cache'


const logger = logStack.getLogger()

export async function displayLog(message: Message) {
  if (message.author.id !== '472053971406815242') return

  const channel = message.channel
  const args = message.content.split(' ')

  if (args.length > 2) {
    channel.send('Invalid arguments count\nUsage:  !!logs  (size)')
    return
  }

  let size = 20
  if (args.length === 2) {
    if (!Number.isInteger(Number(args[1]))) {
      channel.send('Invalid arguments\nUsage:  !!logs  (size)')
      return
    }
    size = Number(args[1])
  }
  const log = '`' + logger.getLog(size).reduce((a, b) => a + '\n' + b) + '`'
  channel.send(log)
}

export async function displayHelp(message: Message) {
  const helpMessage = '**`command list:`**`\n!!chat  complete/start/continue\n!!logs  (Size)\n!!help`'
  message.channel.send(helpMessage)
}
