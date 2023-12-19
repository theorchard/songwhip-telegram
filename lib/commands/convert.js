/**
 * External Dependencies
 */

const debug = require('debug')('songwhip-bots:telegram:commands');

/**
 * Internal Dependencies
 */

// const getDisplayType = require('../utils/get-display-type');
const createMessage = require('../utils/create-message');
const convert = require('../utils/convert-link');
const typing = require('../utils/wait-typing');

/**
 * @param {import('telegraf/telegram')} bot
 */
module.exports = (bot) => {
  return async (ctx, match = [], { quiet = false } = {}) => {
    const link = match[1];
    debug('convert', { quiet });

    const { message } = ctx;
    const { message_id } = message;

    if (!link) {
      return ctx.reply("Paste a music link you'd like to convert 👇");
    }

    if (!link.startsWith('http')) {
      return ctx.reply("🤔 Hmmm … that's not a link, try again", {
        reply_to_message_id: message_id,
      });
    }

    if (!quiet) {
      typing(bot, message.chat.id);
    }

    const json = await convert(link);

    if (!json || Object.keys(json.links).length <= 1) {
      // it's common for youtube links not to have a matching
      // song as not all youtube videos are music! :)
      if (!quiet && !isYouTubeLink(link)) {
        return ctx.reply("🤔 Hmmm … we can't seem to convert that link", {
          reply_to_message_id: message_id,
        });
      }

      return;
    }

    await ctx.reply(createMessage(json), {
      parse_mode: 'markdown',
    });

    const shutdownNotice = [
      'Thank you for using Songwhip’s Telegram bot.',
      'As of March 1st, 2024 the Telegram bot will be shutting down.',
      'You can still continue to create and share free music links by visiting Songwhip’s <a href="https://songwhip.com/create">website</a>!',
    ].join('\n');

    return ctx.reply(shutdownNotice, {
      parse_mode: 'HTML',
    });
  };
};

/**
 * @param {string} link
 */
const isYouTubeLink = (link) =>
  link.includes('youtube.com') || link.includes('youtu.be');
