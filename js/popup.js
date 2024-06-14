// Custom sorting function based on lightness
function sortByLightness(a, b) {
  // Convert hex to RGB
  const rgbA = hexToRgb(a)
  const rgbB = hexToRgb(b)
  // Convert RGB to HSL
  const hslA = rgbToHsl(rgbA.r, rgbA.g, rgbA.b)
  const hslB = rgbToHsl(rgbB.r, rgbB.g, rgbB.b)
  // Compare lightness values
  return hslA.l - hslB.l
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h, s, l }
}
function hexToRgb(hex) {
  // Remove the leading #
  hex = hex.substring(1)
  // Parse the hex value to RGB components
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Return an object with the RGB components
  return { r, g, b }
}
//sending message when the popup is opened
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { message: "run" })
})
//runs when the content script fetches data
chrome.runtime.onMessage.addListener(function (request, sender, response) {
  var { colors, fontsArray } = request
  colors.sort(sortByLightness)
  let modifiedArray = []
  fontsArray.forEach((item) => {
    // Removing double quotes
    item = item.replace(/"/g, "")

    // Splitting if there's a comma
    if (item.includes(",")) {
      let itemsSplit = item.split(",")
      itemsSplit.forEach((splitItem) => {
        modifiedArray.push(splitItem.trim())
      })
    } else {
      modifiedArray.push(item)
    }
  })
  //sorting fonts
  let fonts = Array.from(new Set(modifiedArray))
  fonts.sort()
  //getting elements
  const fontGrid = document.getElementById("fontGrid")
  const colorGrid = document.getElementById("colorGrid")
  const notification = document.getElementById("notification")
  const copyData = (e) => {
    const { value } = e.target
    //function to copy to clipboard and show notification
    navigator.clipboard.writeText(value).then(
      function () {
        notification.classList.add("show")
        setTimeout(() => {
          notification.classList.remove("show")
        }, 1000)
      },
      function (err) {
        alert("Could not copy text: ", err)
      }
    )
  }
  //creating elements for fonts
  for (var i = 0; i < fonts.length; i++) {
    var fontBox = document.createElement("input")
    fontBox.style.fontFamily = fonts[i]
    fontBox.type = "button"
    fontBox.className = "font-box"
    fontBox.value = fonts[i]
    fontGrid.appendChild(fontBox)
    fontBox.onclick = copyData
  }
  //creating elements for colors
  for (var i = 0; i < colors.length; i++) {
    var colorBox = document.createElement("div")
    colorBox.className = "color-box"
    colorBox.innerHTML = `<input type="button" class="inner-color-box" value="${colors[i]}" style="background-color:${colors[i]}"></input><div class="color-box-text">${colors[i]}</div>`
    colorGrid.appendChild(colorBox)
    colorBox.onclick = copyData
  }
  const toggleView = (text, button) => {
    document.querySelectorAll(".section").forEach((item) => {
      item.style.display = "none"
    })
    document.querySelectorAll(".toggle-button").forEach((item) => {
      item.style = "border: 0;background: black;color: white;"
    })
    document.querySelector(`.${text}`).style.display = "grid"
    button.style =
      " border:2px solid gold;border-bottom: 0;background-color: white;color: black;"
  }
  document.querySelectorAll(".toggle-button").forEach((item) => {
    item.addEventListener("click", () => toggleView(item.value, item))
  })
})
