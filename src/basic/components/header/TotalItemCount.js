export const TotalItemCount = ({ totalItemCount }) => {
  let itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    let previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${totalItemCount} items in cart`;
    if (previousCount !== totalItemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
};
