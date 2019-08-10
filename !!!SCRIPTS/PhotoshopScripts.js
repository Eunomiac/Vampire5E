/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

// define your variables
const ROOT = "C:/Users/Ryan/Documents/Projects/!Roleplaying/!!!VAMPIRE/Images/"
const LOCALPATH =/* !!!VAMPIRE/Images/ ...*/"!DISTRICTS & SITES/Districts"
    // "!DISTRICTS & SITES/Sites"

const PATH = `${ROOT}/${LOCALPATH}/PSPEXPORT/`.replace(/\/\//gu, "/")
const DOC = app.activeDocument
var artlayers = new Array()

// define your jpeg options
const options = new ExportOptionsSaveForWeb()
options.quality = 80 // Start with highest quality (biggest file).
options.format = SaveDocumentType.JPEG // Or it'll default to GIF.

// loop through all layers

var x = 0
var a = 0
while(x < DOC.layers.length) {
// check if the layer is a item
    if (DOC.layers[x].kind == LayerKind.NORMAL) {
    // add to array
        artlayers[a] = x
        a++
    }
    x++
}

// loop through our array of layers
//  each loop will export a jpeg with 1 text layer visible and hiding the others

x = 0
a = 0

while (a < artlayers.length) {
    while (x < artlayers.length) {
        DOC.layers[artlayers[x]].visible = a == artlayers[x]
        x++
    } 

    // export as jpeg

    try { DOC.backgroundLayer.visible = true } catch (e) {}

    file = new File(PATH + DOC.layers[artlayers[a]].name +".jpg")

    DOC.exportDocument(file, ExportType.SAVEFORWEB, options)

 

    x = 0

    a++

}