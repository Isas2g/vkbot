let { VK } = require('vk-io');

let { TOKEN, BOT_ID, usersToLike } = require('./config');

let vk = new VK({
  token: TOKEN,
});





console.log('> Bot started.');
let groups = [];

(async () => {
  
  let user = await vk.api.users.get({ user_ids: BOT_ID });
  
  let groups1 = await vk.api.groups.get({ user_id: user[0].id });
  
  groups1.items.forEach(el => {
    groups.push(el*-1);
  });
})();


let counter = 0;

// Function that checks last 5 posts' comments and likes comments from defined people
async function like() {
  let users = await vk.api.users.get({ user_ids: usersToLike.split(',')[counter] });
  counter++;
  if (counter === usersToLike.split(',').length) counter = 0;
  for (let p = 0; p < groups.length; p++) {
    let { items } = await vk.api.wall.get({ count: 10, owner_id: groups[p] });
    let posts = items;
  for(let j = 0; j < posts.length; j++) {
    // if (j <= 2){
    //    await vk.api.likes.add({ type: 'post', owner_id:  groups[p], item_id: posts[j].id });
    // }
    
    let coms = await vk.api.wall.getComments({ owner_id:  groups[p], post_id: posts[j].id });
      for(let k = 0; k < coms.items.length; k++) {
        if (coms.items[k].from_id === users[0].id) {
            await vk.api.likes.add({ type: 'comment', owner_id:  groups[p], item_id: coms.items[k].id });
            console.log(`Лайкнут комментарий с текстом <${coms.items[k].text}> от <${users[0].first_name} ${users[0].last_name}>`);
            break;
          }
        }
    }
  }
}

module.exports = {
  like
}