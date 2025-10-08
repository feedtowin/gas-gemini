// script.js

const analyzeForm = document.getElementById("analyzeForm");
const urlInput = document.getElementById("urlInput");
const resultBox = document.getElementById("result");
const btn = document.getElementById("analyzeBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const inputError = document.getElementById("inputError");

// Thay bằng endpoint Apps Script của bạn
const APPSCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbx9hz42XYPTPkb98cGWH_HVKIzcWQ4W42HjXxuuIiigB7lgc1vj3piq8P6uvfk78KDM/exec";

function showLoader(show = true) {
  btn.disabled = show;
  btnLoader.style.display = show ? "inline-block" : "none";
  btnText.style.display = show ? "none" : "inline";
}

function validateURL(url) {
  try {
    const u = new URL(url);
    return (u.protocol === "http:" || u.protocol === "https:");
  } catch {
    return false;
  }
}

analyzeForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  inputError.textContent = "";
  resultBox.textContent = "";

  const url = urlInput.value.trim();

  if (!url) {
    inputError.textContent = "Vui lòng nhập URL sản phẩm.";
    urlInput.focus();
    return;
  }

  showLoader(true);
  resultBox.textContent = "Đang xử lý...";

  // Bạn có thể sửa câu hỏi tại đây cho linh hoạt
  // const queryText = `Thông tin về giá của sản phẩm này: ${url}`;
  const apiUrl = APPSCRIPT_ENDPOINT + `?query=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);
    const contentType = response.headers.get("content-type") || "";
    let result = "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      result = data.result || JSON.stringify(data);
    } else {
      result = await response.text();
    }

    resultBox.textContent = result || "Không có câu trả lời.";
  } catch (error) {
    resultBox.textContent = "Lỗi khi gọi API: " + error.message;
  } finally {
    showLoader(false);
  }
});

// UX: clear error on typing
urlInput.addEventListener("input", () => {
  inputError.textContent = "";
});

// UX: focus input on load
window.addEventListener("DOMContentLoaded", () => {
  urlInput.focus();
});