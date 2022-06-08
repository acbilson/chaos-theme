document.addEventListener("DOMContentLoaded", (e) => {
  const showOnThisDayEl = document
    .getElementById("show-on-this-day")
    .addEventListener("click", (e) => {
      const parser = new DOMParser();
      const today = new Date();
      const lastYear = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      const logsUri = this.location.href + "index.xml";

      const onThisDayEl = document.getElementById("on-this-day");
      const templateEl = document.querySelector("article.log-card");

      fetch(logsUri)
        .then((x) => x.text())
        .then((logsTxt) => {
          const logsXml = parser.parseFromString(logsTxt, "text/xml");
          if (logsXml.getElementsByTagName("parsererror")?.length !== 0) {
            console.log(`Failed to load XML from ${logsUri}`);
            return;
          }
          const dateElements = logsXml.getElementsByTagName("pubDate");
          const onThisDayEls = Array.from(dateElements)
            .filter((el) => {
              const elDate = new Date(el.innerHTML);
              return (
                elDate.getFullYear() === lastYear.getFullYear() &&
                elDate.getMonth() === lastYear.getMonth() &&
                elDate.getDate() === lastYear.getDate()
              );
            })
            .map((el) => el.parentNode);
          onThisDayEls.forEach((itemEl) => {
            const newArticleEl = templateEl.cloneNode(true);
            const descriptionHtml =
              itemEl.querySelector("description").firstChild.data;
            const linkHtml = itemEl.querySelector("link").firstChild.data;
            const dateHtml = new Date(
              itemEl.querySelector("pubDate").firstChild.data
            );

            newArticleEl.querySelector("div.e-content").innerHTML =
              descriptionHtml;
            newArticleEl.querySelector("a.log-card__link:not(.p-author)").href =
              linkHtml;
            newArticleEl.querySelector("time").innerHTML = dateHtml
              .toISOString()
              .substr(0, 10);

            onThisDayEl.appendChild(newArticleEl);
          });

			  onThisDayEl.hidden = false;
        });
    });
});
