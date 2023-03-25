import DiscordJS, {IntentsBitField, PermissionsBitField, TextChannel} from 'discord.js'

import {logStack} from './src/cache'
import {openAIManager} from './src/openai'

import {displayHelp} from './src/display'

import dotenv from 'dotenv'
dotenv.config()

const logger = logStack.getLogger()

const prefix = '!!'
const client = new DiscordJS.Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]
})

client.on('ready', async () => {
  logger.log('The bot is ready.')
})

const commandDict: {[key: string]: Function} = {
  log: console.log,
  help: displayHelp,
  chat: openAIManager
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix)) return

  if (!message.member || !message.guild) return

  const channel = message.channel as TextChannel
  logger.log(`${message.author.tag} at #${channel.name}: "${message.content}" id: ${message.id}`)

  // check permissions
  if (message.author.id !== message.guild.ownerId) {
    if (!message.member.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages) || message.author.bot) {
      logger.log(`permission denied.`)
      return
    }
  }

  const args = message.content.split(' ')
  const cmd = args[0].slice(2)

  if (cmd in commandDict) {
    commandDict[cmd](message)
    return
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
