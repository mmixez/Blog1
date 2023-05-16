let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc(blogId);

docRef.get().then((doc) => {
    if(doc.exists){
        setupBlog(doc.data());
    } else{
        location.replace("/");
    }
})


const setupBlog = (data) => {
    const { bannerImage, title, publishedAt, article } = data;
  
    const banner = document.querySelector('.banner');
    banner.style.backgroundImage = `url(${bannerImage})`;
  
    const blogTitle = document.querySelector('.title');
    blogTitle.innerHTML = title;
  
    const titleTag = document.querySelector('title');
    titleTag.innerHTML += title;
  
    const publish = document.querySelector('.published');
    publish.innerHTML += publishedAt;
  
    const articleEl = document.querySelector('.article');
    addArticle(articleEl, article);
  };
  




  const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
  
    // Split the data into an array of strings, with each string being a line in the input text
    // Then filter out any empty lines

     // Loop through each line of text
    data.forEach(item => {
         // Check if the line starts with one or more '#' characters
      if(item.startsWith('#')){
        // Count the number of '#' characters at the start of the line
        let hCount = item.match(/^#+/)[0].length;
         // Create a tag name for the heading based on the number of '#' characters
        let tag = `h${hCount}`;
        ele.innerHTML += `<${tag}>${item.slice(hCount + 1)}</${tag}>`;
      } 

      // Check if the line is an image tag
      else if(item.startsWith('![') && item.endsWith(')')){
        // Find the position of the closing ']' character before the image URL
        let seperator = item.indexOf('](');
      
        let alt = item.slice(2, seperator);
        let src = item.slice(seperator + 2, -1);
        ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
      }

      // If the line is not a heading or an image tag, it is treated as a paragraph
      else {
        // Add a paragraph tag containing the line's text to the output element
        ele.innerHTML += `<p>${item}</p>`;
      }
    });
  };
  