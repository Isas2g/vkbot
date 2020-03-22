

let { VK } = require('vk-io');
let sample = (array) => array[Math.round(array.length * Math.random())];

let { TOKEN, GROUPS, MESSAGES, MILLISECONDS } = require('./config');

let vk = new VK({
  token: TOKEN,
});

console.log('> Бот запущен.');

let commented = [];
let ids = [];

(async () => {
  ids = await Promise.all(GROUPS.map(async (link) => {
    let res = await vk.snippets.resolveResource(link);
    if (!res || res.type !== 'group') throw new Error('Ссылка должна вести на группу');

    return -res.id;
  }));
})();

let counter = 0;
setInterval(async () => {
  
  
  let { items } = await vk.api.newsfeed.get({ filters: 'post', count: 1 });
  let post = items[0];
  let users = await vk.api.users.get({ user_ids: 'k1pse, isas2g, ed9app' });


  if (!ids.includes(post.source_id) || commented.includes(post.post_id)) return;

  let message = MESSAGES[counter];

  commented.push(post.post_id);

  await vk.api.likes.add({ type: 'post', owner_id: post.source_id, item_id: post.post_id });
  await vk.api.wall.createComment({ owner_id: post.source_id, post_id: post.post_id, message });
  
  let coms = await vk.api.wall.getComments({ owner_id: post.source_id, post_id: post.post_id });
  
  for (let i = 0; i < users.length; i++) {
    coms.items.forEach(async el => {
      if(el.from_id === users[i].id) {
        await vk.api.likes.add({ type: 'comment', owner_id: post.source_id, item_id: el.id });
        console.log(`Лайкнут комментарий с текстом ${el.text}`);
        return false;
      }
    });
  }
  // if (coms.items[0].id === user.)
  //     await vk.api.likes.add({ type: 'comment', owner_id: post.source_id, item_id: el.id });
  //     console.log(`Лайкнут комментарий с текстом ${el.text}`););

  console.log(`> Был оставлен комментарий <<${message}>>`);
  counter++;
  if(counter === 4) counter = 0;
}, MILLISECONDS);



