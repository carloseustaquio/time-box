export default function changePage(event) {
  const pageNumber = parseInt(event.target.value);
  const container = document.querySelector(".container");
  container.style.left = `${(pageNumber - 1) * -350}px`;
}
