let { VK } = require('vk-io');

let { TOKEN, GROUPS, MESSAGES, BOT_ID, usersToLike } = require('./config');

let vk = new VK({
  token: TOKEN,
});





console.log('> Bot started.');
// let groups = '';

// (async () => {
  
//   let user = await vk.api.users.get({ user_ids: BOT_ID });
  
//   let groups1 = await vk.api.groups.get({ user_id: user[0].id });
  
  
//   groups1.items.forEach(el => {
//     groups += 'g' + el + ',';
//   });
  
// })();


////Function that checks which groups to check for updates
// async function checkGroups() {
//   ids = await Promise.all(GROUPS.map(async (link) => {
//     let res = await vk.snippets.resolveResource(link);
//     if (!res || res.type !== 'group') throw new Error('Ссылка должна вести на группу');

//     return -res.id;
//   })).catch(_ => console.log('Promise error'));
// }

// Function that checks last 50 posts' comments and likes comments from defined people
async function like() {
  let { items } = await vk.api.newsfeed.get({ filters: 'post', source_ids: 'g193240811, g193222366' });
  let posts = items;
  let users = await vk.api.users.get({ user_ids: usersToLike });
  
  await vk.api.likes.add({ type: 'post', owner_id: posts[0].source_id, item_id: posts[0].post_id });
  
  for(let j = 0; j < posts.length; j++) {
    let coms = await vk.api.wall.getComments({ owner_id: posts[j].source_id, post_id: posts[j].post_id });
    
    for (let i = 0; i < users.length; i++) {
      for(let k = 0; k < coms.items.length; k++) {
        if (coms.items[k].from_id === users[i].id) {
          let isLiked = await vk.api.likes.isLiked({type: 'comment', user_id: users[i].id, owner_id: posts[j].source_id, item_id: coms.items[k].id });
            if (isLiked.liked === 0) {
              await vk.api.likes.add({ type: 'comment', owner_id: posts[j].source_id, item_id: coms.items[k].id });
              console.log(`Лайкнут комментарий с текстом ${coms.items[k].text}`);
              break;
            } else break;
        }
        }
      }
    
    }
}

module.exports = {
  like
}