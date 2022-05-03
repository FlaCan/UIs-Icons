const total = document.querySelectorAll("li svg");
const number = total.length;
const stringNumber = number.toString();
const textNode = document.createTextNode(stringNumber);
const numberParent = document.querySelector(".count");
numberParent.appendChild(textNode);