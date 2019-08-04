
let lights = []
let numberOfLights = 30
let bWidth
let bHeight

// Flag to reset the position of the lights
let resetPosition = false;

// Handle accessibility
let enableAnimations = false;
let reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

//handle animation preferences
function setAccessabilityState() {
    if (reduceMotionQuery.matches) {
        enableAnimations = false
    } else {
        enableAnimations = true
    }
}

setAccessabilityState()
reduceMotionQuery.addListener(setAccessabilityState)

function setup() {
    if (enableAnimations) {
        window.addEventListener("DOMContentLoaded", generateLights, false)
        window.addEventListener("resize", setResetFlag, false)
    }
}


setup()
//it starts


//constructor for the light object
function Light(element, speed, xPos, yPos) {
    this.element = element
    this.speed = speed
    this.xPos = xPos
    this.yPos = yPos
    this.scale = 1

    //Declare variables for light motion
    this.counter = 0

    this.sign = Math.random() < .5 ? 1 : -1


    //setting the intiial opacity of lights

    this.element.style.opacity = (1 + Math.random()) / 3

}
//random color generator for lights
function randomColor() {
    const letters = '0123456789ABCDEF'

    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

Light.prototype.update = function () {
    //using some trig to determine x and y pos
    this.counter += this.speed / 5000
    this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40
    this.yPos += Math.sin(this.counter) / 40 + this.speed / 30
    this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20)

    //set light position

    setTransform(Math.round(this.xPos), Math.round(this.yPos), this.scale, this.element)

    //once light reaches bottom of window, move it back to the top
    if (this.yPos > bHeight) {
        this.yPos = 50
    }

}


//position and size of light

function setTransform(xPos, yPos, scale, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`
}



function generateLights() {
    // get the light from the DOM
    const originalLight = document.querySelector('.light')


    //Access the lights parent container
    const lightContainer = originalLight.parentNode
    lightContainer.style.display = 'block'


    //get browser size

    let bWidth = document.documentElement.clientWidth
    let bHeight = document.documentElement.clientHeight


    //create each individual light

    for (let i = 0; i < numberOfLights; i++) {


        //Clone original light and add it to the lightContainer

        let lightClone = originalLight.cloneNode(true)
        lightContainer.appendChild(lightClone)
        lightClone.style.backgroundColor = randomColor()
        //change lights on click
        button.addEventListener('click', () => lightClone.style.backgroundColor = randomColor())
        //set the light's initial position and related properties

        const initialXPos = getPosition(50, bWidth)
        const initialYPos = getPosition(50, bHeight)
        let speed = 5 + Math.random() * 40

        //Create the light object

        const lightObject = new Light(lightClone, speed, initialXPos, initialYPos)
        lights.push(lightObject)
    }

    //remove original light because we dont need it its no longer visible

    lightContainer.removeChild(originalLight)
    moveLights()
}



//Responsible for movign the lights by calling the lightUpdate function

function moveLights() {
    if (enableAnimations) {
        for (let i = 0; i < lights.length; i++) {

            const light = lights[i]
            light.update()
        }
    }


    //reset position of all the lights to a new value

    if (resetPosition) {
        bWidth = document.documentElement.clientWidth
        bHeight = document.documentElement.clientHeight

        for (let i = 0; i < lights.length; i++) {

            const light = lights[i]
            light.xPos = getPosition(50, bWidth)
            light.yPos = getPosition(50, bHeight)
        }

        resetPosition = false
    }
    requestAnimationFrame(moveLights)
}


// this function returns a number (max - offset) and (max - offset) its a deviation

function getPosition(offset, size) {
    return Math.round(-1 * offset + Math.random() * (size + 2 * offset))
}


// trigger a reset of all light positons
function setResetFlag(e) {
    resetPosition = true
}


