// ? Require packages
require("dotenv").config();
const Discord = require("discord.js");
const ms = require("ms");
const axios = require("axios").default;

//* Create a new client using the new keyword
const client = new Discord.Client();

//* Common variables
const prefix = "!";
const token = process.env.DISCORD_TOKEN;
const password = process.env.SERVER_PASS;
const commands = [
  "help",
  "server-info",
  "user-info",
  "hello",
  "max",
  "test",
  "clear",
  "mute",
  "affirmation",
];

//* Display a message once the bot has started
client.once("ready", () => {
  client.user
    .setActivity("my master Yomudogly", { type: "LISTENING" })
    .catch(console.error());
  console.log(`Logged in as ${client.user.tag}!`);
});

//* Reconnecting event
client.on("reconnecting", () => {
  console.log(`This bot is trying to reconnect: ${client.user.tag}!`);
});

//* Server greeting
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get("729805983710183504");
  // const channel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
  if (!channel) return;

  channel.send(`Welcome to our server, ${member}`);
});

//* Check messages for a specific command
client.on("message", (msg) => {
  let args = msg.content.substring(prefix.length).split(" ");

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  if (!commands.includes(args[0].toLocaleLowerCase()) && args.length == 1) {
    msg.channel.bulkDelete(1);
    setTimeout(() => {
      msg.channel.bulkDelete(1);
    }, 3000);
    return msg.reply(`type error or command !${args[0]} does not exist`);
  }

  switch (args[0].toLowerCase()) {
    //! Help command
    case commands[0]:
      msg.channel.bulkDelete(1);
      msg.channel
        .send(
          `
        Available commands ✌️
        1. !server-info - posts server info
        2. !user-info - posts user info
        3. !hello - reacts on your command
        3. !max - sends embedded message with picture
        4. !test - fully embedded message
        5. !clear - expects 2 arguments number of messages to clear and password
        6. !mute - expects 3 arguments time, user and password`
        )
        .then((msg) => {
          msg.delete({ timeout: 30000 });
        });
      break;
    //! Server-info command
    case commands[1]:
      msg.channel.send(
        `Server name: ${msg.guild.name}\nServer id: ${msg.guild.id}\nTotal members: ${msg.guild.memberCount}`
      );
      break;
    //! User-info
    case commands[2]:
      msg.channel.send(
        `Your username: ${msg.author.username}\nYour ID: ${msg.author.id}`
      );
      break;
    //! Hello
    case commands[3]:
      const emoji = msg.guild.emojis.cache.find(
        (emoji) => emoji.name === "yeezy"
      );
      msg.react(emoji);
      break;
    //! Max
    case commands[4]:
      const exampleEmbed = new Discord.MessageEmbed()
        .setTitle("Hola mmgvoooooo")
        .attachFiles(["./media/mmgv.jpg"])
        .setImage("attachment://mmgv.jpg");

      msg.channel.send(exampleEmbed);
      break;
    //! Test
    case commands[5]:
      const sample = new Discord.MessageEmbed()
        .setColor("#db0404")
        .setTitle("Google")
        .setURL("https://google.com")
        .setAuthor(
          "Roman",
          "https://i.imgur.com/wSTFkRM.png",
          "https://discord.js.org"
        )
        .setDescription("Some description here")
        .setThumbnail("https://i.imgur.com/wSTFkRM.png")
        .addFields(
          { name: "Regular field title", value: "Some value here" },
          { name: "\u200B", value: "\u200B" },
          {
            name: "Inline field title",
            value: "Some value here",
            inline: true,
          },
          { name: "Inline field title", value: "Some value here", inline: true }
        )
        .addField("Inline field title", "Some value here", false)
        .attachFiles(["./media/botmage.jpeg"])
        .setImage("attachment://botmage.jpeg")
        .setTimestamp()
        .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");

      msg.channel.send(sample);
      break;
    //! Clear
    case commands[6]:
      if (!msg.member.roles.cache.some((role) => role.name === "botmaster")) {
        msg.channel.bulkDelete(1);
        return msg.channel
          .send("You have to be an admin to use this command")
          .then((msg) => {
            msg.delete({ timeout: 3000 });
          });
      } else {
        if (!args[1] || isNaN(parseInt(args[1], 10))) {
          msg.channel.bulkDelete(1);
          return msg
            .reply(
              "Please provide number between 1 and 100 to delete messages as 1st argument"
            )
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });
        } else if (!args[2]) {
          msg.channel.bulkDelete(1);
          return msg.reply("Please provide a password").then((msg) => {
            msg.delete({ timeout: 3000 });
          });
        } else if (args[2] != password) {
          msg.channel.bulkDelete(1);
          return msg
            .reply("Please provide the correct password")
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });
        } else if (args[1] > 100 && args[2] == password) {
          msg.channel.bulkDelete(100, true).catch((err) => {
            console.error(err);
            msg.channel
              .send("I can't delete messages older than 2 weeks")
              .then((msg) => {
                msg.delete({ timeout: 3000 });
              });
          });
          return msg
            .reply(
              "I deleted 100 messages. That's the maximum number I can operate with 🤓"
            )
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });
        } else if (+args[1] != parseInt(args[1], 10) && args[2] == password) {
          msg.channel.bulkDelete(1);
          return msg
            .reply(
              "Please provide number between 1 and 100 to delete messages as 1st argument"
            )
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });
        } else {
          msg.channel
            .bulkDelete(parseInt(args[1], 10) + 1, true)
            .catch((err) => {
              console.error(err);
              msg.channel
                .send("I can't delete messages older than 2 weeks")
                .then((msg) => {
                  msg.delete({ timeout: 3000 });
                });
            });
        }
      }
      break;
    //! Mute
    case commands[7]:
      let time = args[1];
      let person = msg.guild.member(msg.mentions.users.first());
      let mainRole = msg.guild.roles.cache.find(
        (role) => role.name === "newbie"
      );
      let muteRole = msg.guild.roles.cache.find((role) => role.name === "mute");

      if (!msg.member.roles.cache.some((role) => role.name === "botmaster")) {
        msg.channel.bulkDelete(1);
        return msg.channel
          .send("You have to be an admin to use this command")
          .then((msg) => {
            msg.delete({ timeout: 3000 });
          });
      } else {
        msg.channel.bulkDelete(1);
        if (!person)
          return msg.channel
            .send("Couldn't find mentioned member")
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });
        if (!muteRole)
          return msg.channel.send("Couldn't find mute role").then((msg) => {
            msg.delete({ timeout: 3000 });
          });
        if (!time)
          return msg.channel.send("You didn't specify a time").then((msg) => {
            msg.delete({ timeout: 3000 });
          });
        if (args[3] != password)
          return msg.channel
            .send("You need to use password for this command")
            .then((msg) => {
              msg.delete({ timeout: 3000 });
            });

        person.roles.remove(mainRole.id);
        person.roles.add(muteRole.id);

        msg.channel.send(
          `${person.user} has now been muted for ${ms(ms(time), {
            long: true,
          })}`
        );

        setTimeout(() => {
          person.roles.add(mainRole.id);
          person.roles.remove(muteRole.id);
          msg.channel.send(`${person.user} has now been unmuted`);
        }, ms(time));
      }
      break;
    //! Affirmation
    case commands[8]:
      msg.channel.bulkDelete(1);
      axios
        .get("https://www.affirmations.dev/")
        .then((response) => {
          msg.channel.send(response.data.affirmation);
        })
        .catch((error) => {
          console.log(error);
          msg.channel.send("Couldn't fetch data").then((msg) => {
            msg.delete({ timeout: 3000 });
          });
        });

      break;
  }
});

//* Log in the bot with the token
client.login(token);
