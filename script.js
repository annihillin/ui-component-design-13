const category = ['History', 'Lifestyle', 'Culture', 'Adventure'];

async function data() {
   try {
      let posts = await (await fetch('https://jsonplaceholder.typicode.com/pots')).json();
      return posts.map(i => {
         i.date = randomDate();
         i.feature = category[randomArr(category.length)];
         i.update = randomArr();
         return i;
      })
   } catch (err) {
      return false;
   }
}
const allPosts = data();
// ------------------------------------

const display = document.querySelector('.display');
const allFeature = document.querySelector('.header li:nth-child(1)');
const recentUpdate = document.querySelector('.header li:nth-child(2)');
const yearsList = document.querySelectorAll('.category-by-years li');

let menuSelect = 'update';
let yearSelect = 2020;

allFeature.addEventListener('click', () => {
   allFeature.classList.add('category-select');
   recentUpdate.classList.remove('category-select');

   displayPost('feature')
});

recentUpdate.addEventListener('click', () => {
   recentUpdate.classList.add('category-select');
   allFeature.classList.remove('category-select');

   displayPost('update');
});

yearsList.forEach(i => {
   i.addEventListener('click', e => {
      yearsList.forEach(i => i.classList.remove('category-by-years-active'));
      e.target.classList.add('category-by-years-active');

      displayPost(false, e.target.textContent.trim())
   })
})


/* FUNCTIONS */ 
function randomDate() {
   start = new Date(2016, 0, 1)
   end = new Date(2020, 11, 31)

   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}
function dateFormat(d) {
   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function randomArr(len=false) {
   if (len) {
      // random with len for category
      return Math.floor(Math.random() * len);
   } else {
      // 0 or 1 for update
      return Math.round(Math.random());
   }
}
function ucfirst(str) {
   return str.charAt(0).toUpperCase() + str.slice(1)
}
async function displayPost(element=false, year=false, tag=false) {
   let posts = await allPosts;

   if (!posts) {
      display.innerHTML = `
         404 Error: resource not found
      `
      return;
   }

   // desc sort by date
   posts.sort((a,b) => b.date - a.date);

   if (element) {
      menuSelect = element;
   } else if (year) {
      yearSelect = year;
   }

   if (tag) {
      posts = posts.filter(i => {
         return i.date.getFullYear() == yearSelect && i[menuSelect] && i.feature == tag.trim();
      })
   } else {
      posts = posts.filter(i => i.date.getFullYear() == yearSelect && i[menuSelect]);
   }

   display.innerHTML = posts.map(post => {
      return (
         `
            <div class="post">
               <span class="feature tag" onclick="displayPost(false,false,'${post.feature}')">${post.feature}</span>
               ${post.update ? `<span class="update tag">update</span>` : ''}
               <span>${dateFormat(post.date)}</span>
               <h2>${ucfirst(post.title)}</h2>
               <p>${ucfirst(post.body)}</p>
            </div>
         `
      )
   }).join('');

}

document.addEventListener('readystatechange', event => { 
   if (event.target.readyState === "complete") {
      displayPost('update');
   }
});
