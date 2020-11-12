const config = require('../../config');
const Newsticker = require(`caznews`);
const caznews = new Newsticker(config, 60, config.obs.address);
exports.run = (data, news_opts) => {
    // const twitchCPR = new TwitchCPR(twitchCPRopts, context[`room-id`], channel.slice(1));
    if (data.user_input === `debug`) {
        console.log(`Requested Redemption: ${data.reward.title} by ${data.redemption.user.display_name}`);
    } else if (data.reward.id === `68f28aca-068b-4145-9df5-bcb9709225b7`) { /// CazNews ///
        caznews.new(`cazgem`, data.redemption.user_input, 60);
    } else if (data.reward.id === `3535f36f-d8db-4f60-8e5e-dd3c2c395e91`) { /// Adopt a Street ///
        let headline = `${data.redemption.user.display_name} Adopts ${data.user_input}. Locals look forward to well-kept streets!`;
        caznews.new(`cazgem`, headline, 60);
    } else if (data.reward.id === `d3ee9141-e6ae-4561-a443-e4cd1deefa62`) { /// Adopt an Avenue ///
        let headline = `${data.redemption.user.display_name} Adopts ${data.user_input}. This Avenue looks to be in for some real change! More at 11.`;
        caznews.new(`cazgem`, headline, 60);
    } else if (data.reward.id === `7632f5f4-25cb-4b3a-9c5a-bd3d016869aa`) { /// Name a Transit Line ///
        let headline = `${data.redemption.user.display_name} has dedicated a new transit line in the city! ${data.user_input} will be open for commuters after an inaugural ride by representatives of the Mayor's Office.`;
        caznews.new(`cazgem`, headline, 60);
    } else if (data.reward.id === `81554b5e-b05a-4266-ac2a-96a5a14ad131`) { /// Name a Highway ///
        let headline = `${data.redemption.user.display_name} has invested in our city's infrastructure in a massive way! The (re)dedication of ${data.user_input} will take place over the coming days.`;
        caznews.new(`cazgem`, headline, 60);
    }
    console.log(`==============================================================================`);
    console.log(`Redemption on ${data.channel_id}: ${data.reward.id} | ${data.reward.title} | ${data.redemption.user.display_name}`);
    console.log(`==============================================================================`);
}