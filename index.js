const request = require("request"), cheerio = require('cheerio');
const fs = require('fs');

const DATE_NOTEPAD_URL = 'https://anotepad.com/notes/p359qh';
const DST_FILE = __dirname + '/site/watch.svg';

request.get(DATE_NOTEPAD_URL, (err, res, body) => {
    // console.log(body);
    const $ = cheerio.load(body);
    const txt = $('#note_content .plaintext').text().trim();
    const dateMatch = txt.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if(dateMatch === null){
        // datum nesedi, vyrobim errorovy obrazek
        processExpireDays(0, txt, "Daky debil napsal zle datum!");
    }
    else{
        // datum sedi, tak si zjistim pocet dnu do vybiti a bude
        // console.log(dateMatch)
        const rechargeDate = new Date(parseInt(dateMatch[3], 10),
                                        parseInt(dateMatch[2], 10) - 1,
                                        parseInt(dateMatch[1], 10) );
        // console.log(rechargeDate);
        const expireDate = new Date(rechargeDate.getTime() + 28*3600*24*1000 );
        // console.log(expireDate);
        const expireDays = Math.floor((expireDate.getTime() - Date.now() ) / (3600*24*1000) ) + 1;
        // console.log(expireDays);
        const civilDate = `${expireDate.getDate()}.${expireDate.getMonth() + 1}.${expireDate.getFullYear()}`;
        processExpireDays(expireDays, civilDate);
    }
});

function processExpireDays(expireDays, civilDateStr, extraTxt){
    // console.log(expireDays, civilDateStr);
    let colorCSS = "green", txt = "VIP Okchej !";
    if(expireDays <= 10 && expireDays > 3){
        colorCSS = "yellow"; txt = "Akesy zmeny mohu priist !";
    }
    else if(expireDays <= 3 && expireDays >= 0){
        colorCSS = "red"; txt = "Dobijaj svinar !";
    }
    else if(expireDays < 0){
        colorCSS = "brown"; txt = "Toto hadam vonauka nevyriesi !";
    }
    if(extraTxt){ // objevi se jako hlaseni chyby
        colorCSS = "brown"; txt = extraTxt; 
    }

    const expireDaysStr = (expireDays > 0 ? '+' : '') + expireDays.toString();
    const svgSegment = `<text x="5" y="30" class="${colorCSS} large">
    (${expireDaysStr})
    </text>
    <text x="85" y="20" class="${colorCSS} middle">
    ${txt}
    </text>
    <text x="90" y="36" class="small">
    do ${civilDateStr}
    </text>`;

    renderSVG2File(svgSegment);
}

function renderSVG2File(svgSegment){
    const fullSvg = `<?xml version="1.0"?>
    <svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" 
            width="400" height="125">
         <style type="text/css" >
         <![CDATA[
       text {
              font-family: Verdana,sans-serif;
       }
       text.green {
          stroke: #43A047;
          fill:   #43A047;
       }
       text.yellow {
          stroke: #FFAB00;
          fill:   #FFAB00;
       }
           text.red {
              stroke: #DD2C00;
              fill:   #DD2C00;
           }
       text.brown {
          stroke: #6D4C41;
          fill: #6D4C41;
       }
           text.black {
              fill:   #000000;
           }
       text.large {
         font-size: 22pt;
       }
       text.middle {
          font-size: 14pt;
       }
       text.small {
          font-size: 10pt;
       }
       a text:hover {
          cursor: pointer;
       }
       a text:hover {
          text-decoration: underline;
       }
   
       tspan.bold {
          font-weight: bold;
       }
         ]]>
       </style>
${svgSegment}
  <text x="5" y="56" class="black small">
     Posielaj <tspan class="bold">PE REG RITNE__RYDLO</tspan> na 
  </text>
  <text x="5" y="70" class="black small">
   <tspan class="bold">909 30 40</tspan> ty pandrava osrata (40 Kc/SMS)
  </text>
  <text x="5" y="85" class="black small">
   !!!! Jsou tam <tspan class="bold">dve podtrzitka (__)</tspan> !!!
  </text>
<a xlink:href="https://anotepad.com/notes/p359qh">
  <text x="5" y="110" class="black small">
    Klikaj zde pre zapis data posledniho dobiti 
  </text>
  </a>
</svg>
`;    
    fs.writeFileSync(DST_FILE, fullSvg);
}
