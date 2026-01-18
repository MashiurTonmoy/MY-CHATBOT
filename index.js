let inpu=document.getElementById("input")
let out=document.getElementById("ans")



async function phantom(){
  let ques=inpu.value
let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer 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", 
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "arcee-ai/trinity-mini:free",
    "messages": [
      {
        "role": "user",
        "content": ques
      }
    ],
    "reasoning": {"enabled": true}
  })
});

// Extract the assistant message with reasoning_details and save it to the response variable
const result = await response.json();
response = result.choices[0].message;

// Preserve the assistant message with reasoning_details
const messages = [
  {
    role: 'user',
    content: ques
  },
  {
    role: 'assistant',
    content: response.content,
    reasoning_details: response.reasoning_details, // Pass back unmodified
  },
  {
    role: 'user',
    content: ques
  },
];

// Second API call - model continues reasoning from where it left off
const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "model": "arcee-ai/trinity-mini:free",
    "messages": messages  // Includes preserved reasoning_details
  })
});
let data = await response2.json();
ans=await data.choices[0].message.content;
console.log("Response with reasoning:", ans);
 
  out.innerHTML=` <div id ="output">
                <h3>Phantom Answer</h3>
                <p >
                ${ans}
                </p>
                <button id="btn" onclick="again()">Ask Again</button>
                </div>`

}
 phantom()



function again(){
  out.innerHTML=""
  inpu.value=""
}

