# Amuzantiu

Amuzantiu is a simple Discord bot built using the Discord.js library. The bot can perform a number of basic tasks, including sending welcome messages, moderating the server, and playing music.

## Installation

To install and run the bot on your own server, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Create a new application and bot account in the [Discord Developer Portal](https://discord.com/developers/applications).
4. Copy the bot token and add it to a `.env` file in the root of the project.
5. Update the `config.json` file with your desired settings.
6. Run the bot using `npm start`.

## Commands

Amuzantiu currently supports the following commands:

- `a ping`: Responds with "Pong!" to test that the bot is working.
- `a kick @user`: Kicks the mentioned user from the server.
- `a ban @user`: Bans the mentioned user from the server.
- `a play [song]`: Plays the requested song in the voice channel the user is currently in.
- `a stop`: Stops the current song and clears the queue.

## Contributing

If you'd like to contribute to Amuzantiu, feel free to submit a pull request! You can also open an issue if you find a bug or have a suggestion for a new feature.
