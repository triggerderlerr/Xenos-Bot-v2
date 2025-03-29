const { SnowflakeUtil } = require('discord.js');

function isValid(snowflake){
    const snowflakeRegex = /^[0-9]{17,19}$/;
    return snowflakeRegex.test(snowflake);
  }

function isValidAge(snowflake){
    const snowflakeRegex = /^[0-9]{2,2}$/;
    return snowflakeRegex.test(snowflake);
  }


module.exports = {isValid, isValidAge}

//module.exports = {isValidAge}

//examples
    //if (!snowflake.isValid(user)) return interaction.reply({content: "Geçersiz ID."})
    //const snowflake = require('../events/snowflake.js');