const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


      // Attach event listener to the publish button

publishBtn.addEventListener('click', () => {
    // Check if the article field and blog title field have content
    if (articleField.value.length && blogTitleField.value.length) {
      // Generate a random 4-letter ID for the document name
      const letters = 'aaaaaaaaaaaaaaaaaaaaaaa';
      let id = '';
      for (let i = 0; i < 4; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
      }
  
      // Formating document name & published date
      const blogTitle = blogTitleField.value.split(" ").join("-");
      const docName = `${blogTitle}-${id}`;
      const date = new Date();
      const publishedAt = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  
      // Add the blog data to the "blogs" collection in Firestore
      db.collection("blogs").add({
        title: blogTitleField.value,
        article: articleField.value,
        bannerImage: bannerPath,
        publishedAt: publishedAt,
        documentName: docName 
      })
      .then((docRef) => {
        // When the document is successfully added, redirect to the new blog post
        const newDocName = docRef.id;
        location.href = `/${newDocName}`;
      })
      .catch((err) => {
        // Log any errors that occur
        console.error(err);
      })
    }
  });
  