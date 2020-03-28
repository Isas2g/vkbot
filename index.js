let { VK } = require('vk-io');

let { TOKEN, GROUPS, MESSAGES, BOT_ID } = require('./config');

let vk = new VK({
  token: TOKEN,
});





console.log('> Bot started.');

let commented = [];
let ids = [];
let groups = '';

(async () => {
  
  let user = await vk.api.users.get({ user_ids: BOT_ID });
  
  let groups1 = await vk.api.groups.get({ user_id: user[0].id });
  
  console.log(groups1);
  groups1.items.forEach(el => {
    groups += 'g' + el + ',';
  });
  
})();


////Function that checks which groups to check for updates
async function checkGroups() {
  ids = await Promise.all(GROUPS.map(async (link) => {
    let res = await vk.snippets.resolveResource(link);
    if (!res || res.type !== 'group') throw new Error('Ссылка должна вести на группу');

    return -res.id;
  })).catch(_ => console.log('Promise error'));
}

// Function that comments the newest post in the group
async function comment() {
  let { items } = await vk.api.newsfeed.get({ filters: 'post', count: 3, source_ids: 'g193240811, g193222366' });
  let post = items[0];
  
  let counter = 0;


  if (!ids.includes(post.source_id) || commented.includes(post.post_id)) return;

  let message = MESSAGES[counter];

  commented.push(post.post_id);

  await vk.api.likes.add({ type: 'post', owner_id: post.source_id, item_id: post.post_id });
  await vk.api.wall.createComment({ owner_id: post.source_id, post_id: post.post_id, message });
  
  
  
  console.log(groups);
  console.log(`> Был оставлен комментарий <<${message}>>`);
  counter++;
  if(counter === 4) counter = 0;
}


// Function that checks last 50 posts' comments and likes comments from defined people
async function like() {
  let { items } = await vk.api.newsfeed.get({ filters: 'post', source_ids: 'g193240811, g193222366' });
  let posts = items;
  let users = await vk.api.users.get({ user_ids: 'k1pse, isas2g, ed9app, id224715702' });
  
  for(let j = 0; j < posts.length; j++) {
    let coms = await vk.api.wall.getComments({ owner_id: posts[j].source_id, post_id: posts[j].post_id });
    
    for (let i = 0; i < users.length; i++) {
      for(let k = 0; k < coms.items.length; k++) {
        if (coms.items[k].from_id === users[i].id) {
          await vk.api.likes.add({ type: 'comment', owner_id: posts[j].source_id, item_id: coms.items[k].id });
          console.log(`Лайкнут комментарий с текстом ${coms.items[k].text}`);
          break;
        }
        }
      }
    
    }
}

module.exports = {
  checkGroups,
  comment,
  like
}