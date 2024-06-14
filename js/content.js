//runs when the user opens the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "run") {
    function colorToHex(color) {
      let values = color.match(/\d+\.?\d*/g).map(Number)

      if (values.length === 3) {
        let [r, g, b] = values
        return (
          "#" +
          ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase()
        )
      } else if (values.length === 4) {
        let [r, g, b, a] = values
        a = Math.round(a * 255)
        return (
          "#" +
          ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase() +
          a.toString(16).padStart(2, "0").toUpperCase()
        )
      } else {
        return "Invalid color format"
      }
    }
    //function to get any style out from the page
    function styleInPage(cssProp) {
      return [...document.querySelectorAll("*")]
        .map((node) => {
          return window.getComputedStyle(node)[cssProp]
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index && value != ""
        })
    }
    let dataColor = new Set()
    dataColor = styleInPage("color")
    dataColor = [...dataColor, ...styleInPage("backgroundColor")]
    let hexColors = dataColor.map(colorToHex)
    let fonts = styleInPage("fontFamily")
    console.log(fonts, hexColors)
    chrome.runtime.sendMessage({ colors: hexColors, fontsArray: fonts })
  }
})
