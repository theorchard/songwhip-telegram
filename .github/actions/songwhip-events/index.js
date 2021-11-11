const { songwhipEventApi } = require('@theorchard/songwhip-events');

const inputs = {
  event: process.env.INPUT_EVENT,
  context: process.env.INPUT_CONTEXT,
};

(async () => {
  const event = JSON.parse(
    inputs.event || '{}'.replace(/\n/g, ' ').replace(/ +/g, ' ')
  );

  const context = JSON.parse(
    inputs.context || '{}'.replace(/\n/g, ' ').replace(/ +/g, ' ')
  );

  await songwhipEventApi({
    event,
    context,
  });
})();
