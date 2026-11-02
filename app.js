const form = document.querySelector("#image-form");
const promptInput = document.querySelector("#prompt");
const charCount = document.querySelector("#char-count");
const result = document.querySelector("#result");
const preparedPrompt = document.querySelector("#prepared-prompt");
const copyButton = document.querySelector("#copy-button");

document.querySelector("#year").textContent = new Date().getFullYear();

promptInput.addEventListener("input", () => {
  charCount.textContent = `${promptInput.value.length} / 600`;
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.dispatchEvent(new Event("input"));
    promptInput.focus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = promptInput.value.trim();

  if (description.length < 12) {
    promptInput.setCustomValidity("Please describe your image in at least 12 characters.");
    promptInput.reportValidity();
    return;
  }
  promptInput.setCustomValidity("");

  const style = document.querySelector("#style").value;
  const ratio = document.querySelector("#ratio").value;
  const finalPrompt = `${description}. Visual style: ${style}. Aspect ratio: ${ratio}. Create a clear, high-quality image with a well-composed subject and professional lighting.`;

  preparedPrompt.textContent = finalPrompt;
  result.hidden = false;
  copyButton.textContent = "Copy prepared prompt";
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preparedPrompt.textContent);
    copyButton.textContent = "Copied!";
  } catch {
    copyButton.textContent = "Copy unavailable in this browser";
  }
});
