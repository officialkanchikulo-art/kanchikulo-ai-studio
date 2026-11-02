
const API_URL =
  "https://kanchikulo-ai-api.officialkanchikulo.workers.dev";

const form = document.querySelector("#image-form");
const promptInput = document.querySelector("#prompt");
const charCount = document.querySelector("#char-count");
const result = document.querySelector("#result");
const preparedPrompt = document.querySelector("#prepared-prompt");
const copyButton = document.querySelector("#copy-button");

const submitButton = form.querySelector(
  'button[type="submit"], button:not([type])'
);

const statusMessage = document.createElement("p");
const generatedImage = document.createElement("img");

generatedImage.alt = "Your generated image";
generatedImage.style.width = "100%";
generatedImage.style.maxWidth = "600px";
generatedImage.style.height = "auto";
generatedImage.style.borderRadius = "12px";
generatedImage.style.marginTop = "16px";
generatedImage.hidden = true;

statusMessage.setAttribute("role", "status");
result.prepend(statusMessage);
result.prepend(generatedImage);

document.querySelector("#year").textContent =
  new Date().getFullYear();

promptInput.addEventListener("input", () => {
  charCount.textContent =
    `${promptInput.value.length} / 600`;
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.dispatchEvent(new Event("input"));
    promptInput.focus();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const description = promptInput.value.trim();

  if (description.length < 12) {
    promptInput.setCustomValidity(
      "Please describe your image in at least 12 characters."
    );
    promptInput.reportValidity();
    return;
  }

  promptInput.setCustomValidity("");

  const style = document.querySelector("#style").value;
  const ratio = document.querySelector("#ratio").value;

  const finalPrompt =
    `${description}. Visual style: ${style}. ` +
    `Aspect ratio: ${ratio}. Professional lighting and composition.`;

  if (finalPrompt.length > 600) {
    statusMessage.textContent =
      "Your description is too long. Please shorten it and try again.";
    result.hidden = false;
    return;
  }

  result.hidden = false;
  generatedImage.hidden = true;
  statusMessage.textContent =
    "Creating your image. Please wait...";

  submitButton.disabled = true;
  submitButton.textContent = "Generating...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: finalPrompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image generation failed.");
    }

    if (!data.imageUrl) {
      throw new Error("No image was returned.");
    }

    generatedImage.src = data.imageUrl;
    generatedImage.hidden = false;

    preparedPrompt.textContent = finalPrompt;
    statusMessage.textContent = "Your image is ready!";
    copyButton.textContent = "Copy prepared prompt";

  } catch (error) {
    statusMessage.textContent =
      error.message || "Something went wrong. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Generate my image";
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      preparedPrompt.textContent
    );
    copyButton.textContent = "Copied!";
  } catch {
    copyButton.textContent = "Copy unavailable in this browser";
  }
});
