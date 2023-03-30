const form = document.getElementById("form");
const inputFile = document.getElementById("file");
const formData = new FormData();

var x = 0;
var customLabels = Array();

function display_array()
  {
    var e = "<hr/>";   
      for (var y=0; y<customLabels.length; y++)
      {
        e += customLabels[y] + "<br/>";
      }
      document.getElementById("Result").innerHTML = e;
  }

function add_element_to_array()
  {
    customLabels[x] = document.getElementById("label").value;
    x++;
    document.getElementById("label").value = "";
    display_array()
  }

const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputFile.files[0].name)
    const upload_url = `https://ox6lkgv12e.execute-api.us-east-1.amazonaws.com/development/upload/ooo2139-b2/${inputFile.files[0].name}`;
    console.log(customLabels.toString());

    fetch(upload_url, {
        method: "put",
        body: inputFile.files[0],
        headers: {
          "Content-Type": inputFile.files[0].type,
          "x-api-key": "qu5c4ZERpz4YB4uqEsoYa7jpjyRvxJr269HdTknX",
          "Accept-Encoding": "gzip, deflate, br",
          "x-amz-meta-customLabels": customLabels.toString()
        },
    }).catch((error) => ("Something went wrong!", error));
    document.getElementById("file").value = "";
    document.getElementById("Result").innerHTML = "";
    customLabels.length = 0;
    x = 0;
};

form.addEventListener("submit", handleSubmit);

const article = document.querySelector("article");

async function sendHttpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "qu5c4ZERpz4YB4uqEsoYa7jpjyRvxJr269HdTknX",
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error("Something went wrong - server side.");
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Something went wrong!");
    });
}

/*
var input = document.getElementById("searchField");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    getImages();
  }
});
*/


function func() {
  console.log("it works");
  document.getElementById("slike").setAttribute("attribute_on_click");
}
//request s autorizacijskim parametrom: "https://api.unsplash.com/search/photos?query=dogs&cliend_id=GlxGxboGXijJhZZKPi-A76KH5XUkD1d3XHCwfGOmbKc"
async function getImages() {
  try{
    while (true){
    var insertedContent = document.querySelector(".insertedContent");
    if(insertedContent) {
      insertedContent.parentNode.removeChild(insertedContent);
    }
    else{
      break;
    }
    }
  }
  catch (error){
    console.log("No images in list")
  }
  try {
    const userInput = document.getElementById("searchField").value;
    console.log(userInput);
    const method = "GET";
    const url = `https://ox6lkgv12e.execute-api.us-east-1.amazonaws.com/development/search?q=${userInput}`;
    const responseData = await sendHttpRequest(method, url);
    console.log(responseData.results)
    responseData.results.forEach((res) => {
      const method = "afterend";
      const url = `<span class ='insertedContent'><div class="images" onclick="func()"><img  class="slike" src="${res.url}"/><p>Labels:${res.labels.toString()}</p></div></span>`;
      article.insertAdjacentHTML(method, url);
    });

    return responseData;
  } catch (error) {
    alert(error.message);
  }
}

const searchForm = document.querySelector("#search-form");
const searchFormInput = document.getElementById("searchField");//searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");
const info = document.querySelector(".info");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if(SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  // recognition.lang = "en-US";

  searchForm.insertAdjacentHTML("beforeend", '<button type="button"><i class="fa fa-microphone"></i></button>');
  searchFormInput.style.paddingRight = "50px";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    console.log("Button has been clicked")
    if(micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
      recognition.start(); // First time you have to allow access to mic!
    }
    else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    console.log("changing to slash")
    micIcon.classList.add("fa-microphone-slash");
    console.log("changed")
    searchFormInput.focus();
    console.log("Voice activated, SPEAK");
  }

  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    
    if(transcript.toLowerCase().trim()==="stop recording") {
      recognition.stop();
    }
    else if(!searchFormInput.value) {
      searchFormInput.value = transcript;
    }
    else {
      if(transcript.toLowerCase().trim()==="go") {
        searchForm.submit();
      }
      else if(transcript.toLowerCase().trim()==="reset input") {
        searchFormInput.value = "";
      }
      else {
        searchFormInput.value = transcript;
      }
    }
    // searchFormInput.value = transcript;
    // searchFormInput.focus();
    // setTimeout(() => {
    //   searchForm.submit();
    // }, 500);
  }
  
  info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
  
}
else {
  console.log("Your Browser does not support speech Recognition");
  info.textContent = "Your Browser does not support Speech Recognition";
}