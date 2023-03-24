# YakWeide Discord Bot V3

YakWeide Discord Bot V3 is a Discord bot that logs selected events from the Discord audit log into a specific channel on your Discord server. By default, the audit log is only accessible to server administrators, but with this bot, any user with read rights to the designated log channel can access the logs.

## Features

YakWeide Discord Bot V3 logs the following events from the Discord audit log:

- Disconnects: If somebody disconnects another user (not kicked), a message is logged that says "User @name has kicked another user."
- Channel moves: If a user moves another user into another (voice) channel, a message is logged that says "User @name has moved another user into channel <channel name>."

### Docker Container

You can run YakWeide Discord Bot V3 using the Docker container available at:

- https://github.com/YakWeide/YakWeide-Discord-Bot-V3/pkgs/container/yakweide-discord-bot

To pull the container from the command line, run:
`docker pull ghcr.io/yakweide/yakweide-discord-bot:latest`
  
To run the YakWeide Discord Bot V3 Docker Container, you will need to provide three Docker environment variables:

- `DISCORD_TOKEN`: The secret token of the Discord bot being used.
- `GUILD_ID`: The Discord server ID.
- `CHANNEL_ID`: The ID of the channel where logs are supposed to go.

## Version History

- YakWeide Discord Bot V1: https://github.com/YakWeide/YakWeide-Discord-Bot-V1 (no longer being maintained)
- YakWeide Discord Bot V2: https://github.com/YakWeide/YakWeide-Discord-Bot-V2 (no longer being maintained)
