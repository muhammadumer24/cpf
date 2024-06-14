chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: modifyDOM
        },
        (results) => {
            getImages(results[0].result).then((value) => processData(value));
        }
    );
});

var index = 0;
function processData(imgs) {
    imgs.forEach(function (element) {
        var col = document.createElement('div');
        col.className = "col-sm-4";

        var shadowBox = document.createElement('div');
        shadowBox.className = "shadow-sm  bg-white rounded mb-3 text-left"
        shadowBox.id = "colBox";

        var imgM = document.createElement('img');
        imgM.src = element;
        imgM.id = index;
        imgM.className = "card-img-top";
        imgM.onerror = function () {
            imgs.splice(imgs.indexOf(element), 1)
            this.parentNode.parentNode.remove();
        };

        index = index + 1;
        shadowBox.prepend(imgM);

        var cardBody = document.createElement('div');
        cardBody.className = "card-body div-item";

        var imgD = document.createElement('img');
        imgD.src = "images/arrow.svg";
        imgD.id = "downloadBtn";
        imgD.className = "downloadDiv";

        cardBody.append(imgD);
        shadowBox.append(cardBody);
        col.append(shadowBox);
        $('#main-list').append(col);
    });
}

const images = [];
async function getImages(string) {
    const imgRex = /src="(.*?)"/g;
    const imgRex2 = /data-src="(.*?)"/g;
    const imgRex3 = /srcset="(.*?)"/g;

    let img;
    while ((img = imgRex.exec(string))) {

        var newImg = img[1].replace(/&amp;/g, "&");
        if (!newImg.substring(0, 1).includes("/") && !newImg.includes("http") && !newImg.includes(hostUrl)) {
            newImg = "/" + img[1].replace(/&amp;/g, "&");
        }

        if (newImg.includes("http")) {
            images.push(newImg);
        } else {
            if (newImg.substring(0, 2) == "//") {
                images.push("http:" + newImg);
            } else {
                if (hostUrl.includes("http")) {
                    images.push(hostUrl + newImg);
                } else {
                    images.push("http://" + hostUrl + newImg);

                }
            }
        }

    }

    while ((img = imgRex2.exec(string))) {
        if (newImg.includes("http")) {
            images.push(newImg);
        } else {
            if (newImg.substring(0, 2) == "//") {
                images.push("http:" + newImg);
            } else {
                if (hostUrl.includes("http")) {
                    images.push(hostUrl + newImg);
                } else {
                    images.push("http://" + hostUrl + newImg);

                }
            }
        }

    }


    while ((img = imgRex3.exec(string))) {
        if (newImg.includes("http")) {
            images.push(newImg);
        } else {
            if (newImg.substring(0, 2) == "//") {
                images.push("http:" + newImg);
            } else {
                if (hostUrl.includes("http")) {
                    images.push(hostUrl + newImg);
                } else {
                    images.push("http://" + hostUrl + newImg);

                }
            }
        }

    }
    return images;
}



$(document).on('click', '.card-body', function () {
    chrome.downloads.download({
        url: this.parentNode.childNodes[0].getAttribute('src')
    });
});

$(document).on('click', '#downloadAll', function () {
    images.forEach(function (element) {
        chrome.downloads.download({
            url: element
        });
    });
});



function modifyDOM() {
    return document.body.innerHTML;
}