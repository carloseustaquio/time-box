export default function changePage(pageNumber) {
  const container = document.querySelector(".container");
  container.style.left = `${(pageNumber - 1) * -342}px`;
}
