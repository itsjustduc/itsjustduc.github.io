// ==UserScript==
// @name        latest game button
// @namespace   Violentmonkey Scripts
// @icon        https://www.geoguessr.com/_next/static/media/favicon.bffdd9d3.png
// @version     1.0.0
//
// @match       https://*.geoguessr.com/*
// @grant       none
//
// @author      -
// @description
// ==/UserScript==

const prev_url = ""
const observer = new MutationObserver(() => {
    init()
})

async function init(){
    const path = window.location.pathname;
if(path.includes('/party/lobby/') && document.querySelector("#latestGame") == null) {
    const party = document.querySelector("[class*=party-hud_actions__]")
    if(party != null){
        let button;
        if(document.querySelector("latestGame") == null){

            const button = party.firstChild.cloneNode(true)
            button.id = "latestGame"
            const img = button.querySelector(":scope  > button > img");
            img.src = "https://itsjustduc.github.io/gamemode-stats.png";
            img.srcset = "https://itsjustduc.github.io/gamemode-stats.png";
            party.insertBefore(button, party.firstChild)
            button.addEventListener("click",function(){
                open(latest)
            })
    }

       else{
        const button = document.querySelector("latestGame")
       }

       let latest = ""
       const url = "https://www.geoguessr.com/api/v4/feed/private?count=2";
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

       const maps = await response.json();
       const payload = JSON.parse(maps["entries"][0]["payload"])
       console.log(payload)
       if(payload[0]["type"] == 7){
        latest = payload[0]["payload"]["gameId"]
       }
       else{
        latest = payload["gameId"]
       }
       console.log(latest)
       latest = "https://geoguessr.com/team-duels/" + latest + "/summary"
       
    }
    
}
}

if(document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
		});
	}else{
		observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
	}