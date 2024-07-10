
document.addEventListener("DOMContentLoaded", () => {
  let url = document.getElementById("url");
  let btn = document.getElementById("submit_btn");
  let table = document.getElementById("data");
  let tbody = document.getElementById("tbody");
  let clear_btn = document.getElementById("clear");
  let filter_btn = document.getElementById("filter_btn");
  let unfilter_btn = document.getElementById("unfilter_btn");
  let filter = document.getElementById("filter");
  let save = document.getElementById("save");
  let url_link_mem = '';
  let table_mem = '';
  let text_btn = document.getElementById("textify");
  let back_btn = document.getElementById("back");
  let filtered_mem = '';
  let content_cont = document.getElementById("content");
  let exc_btn = document.getElementById("exc_btn");
  let exc_unfil_btn = document.getElementById("exc_unfil_btn");
  let exc = document.getElementById("exc");

  exc_btn.addEventListener("click",()=>{
    let exc_crit = exc.value;
    exc.value = '';
    exclude(exc_crit);
  })

  function exclude(crit){
    let rows = tbody.querySelectorAll("tr");

      let rowsToRemove = [];

      for (let row of rows) {
          let type = row.querySelector("#type"); 
          if (type && type.textContent.toLowerCase().includes(crit.toLowerCase())) {
              rowsToRemove.push(row);
          }
      }
  
      rowsToRemove.forEach(row => tbody.removeChild(row));
      updateSn();
  }

  exc_unfil_btn.addEventListener("click",()=>{
    tbody.innerHTML = table_mem;
  })

  btn.addEventListener("click", () => {
    let url_link = url.value; 
    url.value = ""; 
    url_link_mem = url_link;
    fetchHTML(url_link);
  });

  clear_btn.addEventListener("click", () => {
      clearTable();
  })

  save.addEventListener("click",()=>{
      table_mem = tbody.innerHTML;
  })

  text_btn.addEventListener("click",()=>{
    let rows = tbody.querySelectorAll("tr");
    for (let row of rows){
      let title_text = row.querySelector("#title");
      let line = document.createElement("p");
      line.innerHTML = title_text.innerHTML;
      content_cont.appendChild(line);
    }
    filtered_mem = table.innerHTML;
    table.innerHTML = '';
  })

  back_btn.addEventListener("click",()=>{
    table.innerHTML = filtered_mem;
    let paras = content_cont.querySelectorAll("p");
    for (let p of paras){
      content_cont.removeChild(p);
    }
  })

  function clearTable(){
      tbody.innerHTML = '';
  }

  filter_btn.addEventListener("click",()=>{
      let filter_crit = filter.value;
      filter.value = '';
      filterBy(filter_crit);
  })

  unfilter_btn.addEventListener("click",()=>{
      tbody.innerHTML = table_mem;
  })

  function filterBy(crit){
      let rows = tbody.querySelectorAll("tr");

      let rowsToRemove = [];

      for (let row of rows) {
          let type = row.querySelector("#type"); 
          if (type && !type.textContent.toLowerCase().includes(crit.toLowerCase())) {
              rowsToRemove.push(row);
          }
      }
  
      rowsToRemove.forEach(row => tbody.removeChild(row));
      updateSn();
  }

  function updateSn(){
      let rows = table.querySelectorAll("tr");
      let sn = 1; 

      for (let row of rows){
          let snCell = row.querySelector("#sn");
          if (snCell){
              snCell.textContent = sn.toString();
              sn++;
          }
      }
  }

  async function fetchHTML(url) {
    try {
      // Fetch the HTML content
      const response = await fetch(url);
      const htmlString = await response.text();

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Extract information 
      const arts = doc.querySelectorAll('article');
      for (let art of arts) {
          let h5 = art.querySelector("div > div > h5 > a");
          let type_text = art.querySelector("article > div:nth-of-type(3) > div:nth-of-type(1)");
          let date_text = art.querySelector("article > div:nth-of-type(3) > div:nth-of-type(2)");
          let author_text = art.querySelector("article > div:nth-of-type(2)").textContent;
        let link_text = h5.href;
        let title_text = h5.textContent;
        let tr = document.createElement("tr");
        let sn = document.createElement("td");
        sn.id = "sn";
        let title = document.createElement("td");
        title.id = "title";
        let link = document.createElement("td");
        let type = document.createElement("td");
        let date = document.createElement("td");
        date.textContent = date_text.textContent;
        type.id = "type";
        link.textContent = link_text;
        title.innerHTML = `${title_text}<br><b>${author_text}</b>`;
        type.textContent = type_text.textContent;
        tr.appendChild(sn);
        tr.appendChild(title);
        tr.appendChild(link);
        tr.appendChild(type);
        tr.appendChild(date);
        tbody.appendChild(tr);
        updateSn();
      }
    } catch (error) {
      console.error('Error fetching the HTML:', error);
    }
  }
});



