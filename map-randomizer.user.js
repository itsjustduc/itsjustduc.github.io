// ==UserScript==
// @name        map randomizer
// @namespace   Violentmonkey Scripts
// @icon        https://www.geoguessr.com/_next/static/media/favicon.bffdd9d3.png
// @version     1.0.0
//
// @match       https://www.geoguessr.com/*
// @grant       none
//
// @author      duc
// @description meow
// ==/UserScript==

window.addEventListener('load', function() {
    // your code here



const mapgen_ui = `
<div class="buttons">
    <button id='randomize' style='font-size: 20px; background-color: black; color: white;'>Randomize</button>
</div>
<div id="toggles">
    Categories: &nbsp;
</div>

<div id="map" style="margin-bottom:40px;">
    Your map is...
</div>

<div class="generate">
<div style="margin-bottom: 5px;">

    <label>Move</label>
    <select name="move" id="move">
  <option value="false">Yes</option>
  <option value="true">No</option>
</select>
 <label>Pan</label>
    <select name="pan" id="pan">
  <option value="false">Yes</option>
  <option value="true">No</option>
</select>
 <label>Zoom</label>
    <select name="zoom" id="zoom">
  <option value="false">Yes</option>
  <option value="true">No</option>
</select></div>
<div style="margin-bottom: 5px;">
    <label>Time (seconds) (0 = no timer)</label>
<input type="number" id="time" name="time" min="0" max="1800" value="0"/>
<label>Rounds</label>
<input type="number" id="round" name="r" min="1" max="10" value="5"/>
</div>
<div style="margin-bottom: 5px;">
    <button id="generate" style='font-size: 20px; background-color: black; color: white;'>Generate Challenge</button>
</div>
</div>
<div>
    Challenge link: <a href="" id="challengeLink">none</a>
</div>
`


let categories = []
let maps = []
let map = ""

const p = document.createElement('div');
  p.setAttribute("popover", "");
  p.setAttribute("id", "mapgen");
  const div = document.createElement('div');
  div.id = 'meow'
  p.appendChild(div)
  document.body.appendChild(p);
  div.insertAdjacentHTML("afterend", mapgen_ui)

const header = document.querySelector('[class*=header-desktop_desktopSectionLeft__]')
header.style = "grid-template-columns: 10.25rem repeat(3,auto) .0625rem repeat(6,auto)"
//console.log(document)

//console.log(header)

  const randomize = document.getElementById("randomize");
  randomize.addEventListener("click", random)

  const links = document.querySelectorAll('[class*=next-link_anchor__]')[5]
// Source - https://stackoverflow.com/a/9423014
// Posted by lkaradashkov, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-12, License - CC BY-SA 4.0

const g = document.createElement('button');
g.setAttribute("id", "Div1");
g.setAttribute("popovertarget", "mapgen")
g.addEventListener("click", getData)
g.href = "#"
g.innerHTML = "map randomizer"
  g.className = links.className
header.insertBefore(g, links.nextElementSibling)




  //the actual functions

  async function getData() {
  const url = "https://raw.githubusercontent.com/slashpeekbot/slashpeekbot.github.io/main/maps/maps.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    maps = await response.json();
    console.log(maps);

    for (const element of maps) {
        if(!categories.includes(element["category"])){
            categories.push(element["category"]);
        }}
    console.log(categories);
    const buttons = document.getElementById("toggles");
    for(const el of categories){
        const but = document.createElement("button");
        but.classList.add("toggle");
        but.innerHTML = el;
        but.id = el
        but.style.backgroundColor = "#00FF0022";
        but.style.marginRight = "5px"
        but.addEventListener("click", function(){
    toggle(el);
})
        //but.setAttribute( "onClick", "javascript: toggle('" + el + "');" );
        buttons.appendChild(but);

  const generate_button = document.getElementById("generate");
      generate_button.addEventListener("click", generate)


}

  } catch (error) {
    console.error(error.message);
  }
}

async function toggle(el){
    //console.log(el)
    const ell = document.getElementById(el)
    //console.log(el)
    //console.log(ell)
    if(ell.style.backgroundColor == "rgba(255, 0, 0, 0.133)"){
        ell.style.backgroundColor = "#00FF0022"
    } else{
        ell.style.backgroundColor = "#FF000022"
    }
}

async function random() {
    let div = document.getElementById("map");

    // Source - https://stackoverflow.com/a/4550514
    // Posted by Jacob Relkin, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-18, License - CC BY-SA 4.0
    const a = []
    for(const el of categories){
        if(document.getElementById(el).style.backgroundColor == "rgba(0, 255, 0, 0.133)"){
            a.push(el);
        }
    var used_maps = []
    for(const el of maps){
        if(a.includes(el["category"])){
            used_maps.push(el)
        }
    }
    }

    const randomElement = used_maps[Math.floor(Math.random() * used_maps.length)];
    div.innerHTML = "Your map is " + "<a style='background-color: black; color: white' href='https://www.geoguessr.com/maps/" + randomElement["mapId"]  + "'>" + randomElement["mapName"] + "</a>";
    map = randomElement["mapId"]
}

async function generate(){
    // Source - https://stackoverflow.com/a/63029279
    // Posted by Karan Kumar, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-08-11, License - CC BY-SA 4.0

    // this will return true if the conditional is true
    let move = document.getElementById('move').value === "true";
    let pan = document.getElementById('pan').value === "true";
    let zoom = document.getElementById('zoom').value === "true";
    let time = document.getElementById('time').value;
    let round = document.getElementById('round').value;

    let base = {"map":map,"timeLimit":time,"forbidMoving":move,"forbidZooming":pan,"forbidRotating":zoom,"accessLevel":1,"challengeType":0,"roundCount":round,"guessMapType":"roadmap"};

    const response = await fetch("https://www.geoguessr.com/api/v3/challenges", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
  },
    body: JSON.stringify(base),
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    };

    const result = await response.json();
    console.log("Success:", result);
    let link = "https://geoguessr.com/challenge/" + result["token"];

    const challenge = document.getElementById("challengeLink");
    challenge.innerHTML = link;
    navigator.clipboard.writeText(link);
    challenge.setAttribute("href", link);

}


    }, false);
