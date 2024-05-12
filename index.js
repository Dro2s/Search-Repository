addEventListener("DOMContentLoaded", (event) => {
    let searchContainer = document.createElement("ul");
    document.body.append(searchContainer);
    let searchFragment = new DocumentFragment();
    let searchBarLabel = document.createElement("label");
    searchBarLabel.classList.add("search__label");
    searchBarLabel.for = "search-bar";
    searchFragment.append(searchBarLabel);
    let searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.id = "search-bar";
    searchBar.classList.add("search__bar");
    searchFragment.append(searchBar); 
    for (let i = 0; i < 5; i++) {
      let searchBarElement = document.createElement("li");
      searchBarElement.classList.add("search__element");
      searchBarElement.addEventListener("click", addRepo);
      searchFragment.append(searchBarElement);
    }
    searchContainer.append(searchFragment);
    let addedSearchResults = document.createElement("div");
    addedSearchResults.classList.add("results");
    document.body.append(addedSearchResults);
    const debounce = (fn, debounceTime) => {
      let timer = null;
      return function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          fn.apply(this, arguments);
        }, debounceTime);
      };
    };
    function searchEvent(e) {
      if (e === undefined || e.target.value === "") {
        let searchElements = document.querySelectorAll(".search__element");
        searchElements.forEach((elem, ind) => {
          elem.style.display = "none";
        });
      } else
        sendRequest(e.target.value).then((result) => {
          let searchElements = document.querySelectorAll(".search__element");
          if (result.items !== undefined)
            searchElements.forEach((elem, ind) => {
              if (result.items[ind] !== undefined) {
                elem.content = result.items[ind];
                elem.textContent = elem.content.name;
                elem.style.display = "flex";
              } else {
                elem.style.display = "none";
              }
            });
        });
    }
    let debouncedSearchEvent = debounce(searchEvent, 600);
    searchBar.addEventListener("input", debouncedSearchEvent);
    async function sendRequest(searchContent) {
      let url = new URL("https://api.github.com/search/repositories");
      url.searchParams.set("q", searchContent);
      const response = await fetch(url);
      const returnResponse = await response.json();
      return returnResponse;
    }
    function addRepo(event) {
      let addedResult = document.createElement("div");
      addedResult.classList.add("results__element");
      let resultText = document.createElement("div");
      addedResult.append(resultText);
      let deleteButton = document.createElement("button");
      let close = document.createElement("img");
      close.src = "close.svg";
      deleteButton.append(close); 
      addedResult.addEventListener("click", (e) => {
        if (e.target === deleteButton || e.target === close) {
          addedResult.remove();
        }
      });
      addedResult.append(deleteButton);
      resultText.innerHTML = `
      Имя: ${event.target.content.name} <br>
      Репозиторий: ${event.target.content.owner.login} <br>
      Звёзд: ${event.target.content.stargazers_count}
      `;
      addedSearchResults.append(addedResult);
      searchBar.value = "";
      searchEvent();
    }
    let allSearchElements = document.querySelectorAll(".search__element");
  });
