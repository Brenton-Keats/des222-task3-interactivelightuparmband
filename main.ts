function checkForMovement () {
    a0 = Math.sqrt(input.acceleration(Dimension.X) ** 2 + input.acceleration(Dimension.Y) ** 2 + input.acceleration(Dimension.Z) ** 2)
    basic.pause(200)
    a1 = Math.sqrt(input.acceleration(Dimension.X) ** 2 + input.acceleration(Dimension.Y) ** 2 + input.acceleration(Dimension.Z) ** 2)
    return Math.abs(a1 - a0) / (5 + sensitivity) > 6
}
input.onButtonPressed(Button.A, function () {
    max_brightness = 1
    colour_index += 1
    if (colour_index >= colour_modes.length) {
        colour_index = 0
    }
    resetTimer()
})
input.onButtonPressed(Button.B, function () {
    max_brightness = 1
    light_index += 1
    if (light_index >= light_modes.length) {
        light_index = 0
    }
    resetTimer()
})
input.onGesture(Gesture.Shake, function () {
    resetTimer()
})
function resetTimer () {
    last_shake = input.runningTime()
}
function plotBrightness (brightness: number) {
    basic.clearScreen()
    for (let index = 0; index <= Math.floor(brightness / 10); index++) {
        led.plot(index % 5, Math.floor(index / 5))
    }
}
let current_light_mode = ""
let current_colour = 0
let a1 = 0
let a0 = 0
let max_brightness = 0
let colour_index = 0
let colour_modes: number[] = []
let light_index = 0
let light_modes: string[] = []
let sensitivity = 0
let last_shake = 0
let strip = neopixel.create(DigitalPin.P2, 30, NeoPixelMode.RGB)
let active = false
let tickrate = 20
last_shake = input.runningTime()
sensitivity = 3
let off_timer = 10 * 1000
light_modes = [
"SOLID",
"FLASH",
"BREATH",
"RAINBOW"
]
light_index = 0
colour_modes = [
neopixel.colors(NeoPixelColors.White),
neopixel.colors(NeoPixelColors.Red),
neopixel.colors(NeoPixelColors.Blue),
neopixel.colors(NeoPixelColors.Green),
neopixel.colors(NeoPixelColors.Orange),
neopixel.colors(NeoPixelColors.Purple)
]
colour_index = 0
max_brightness = 1
basic.forever(function () {
    current_colour = colour_modes[colour_index]
    current_light_mode = light_modes[light_index]
    if (current_light_mode == "RAINBOW") {
        for (let index = 0; index <= 360; index++) {
            if (false || light_modes[light_index] != "RAINBOW") {
                break;
            }
            strip.showRainbow(index + 1, 360 + index)
            basic.pause(tickrate)
        }
    } else if (current_light_mode == "SOLID") {
        strip.showColor(current_colour)
    } else if (current_light_mode == "FLASH") {
        strip.showColor(current_colour)
        basic.pause(200)
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
        basic.pause(150)
    } else if (current_light_mode == "BREATH") {
        for (let index = 0; index <= max_brightness; index++) {
            if (false || light_modes[light_index] != "BREATH") {
                break;
            }
            strip.setBrightness(max_brightness - index)
            strip.showColor(current_colour)
            basic.pause(10)
        }
        for (let index = 0; index <= max_brightness; index++) {
            if (false || light_modes[light_index] != "BREATH") {
                break;
            }
            if (index > max_brightness) {
                break;
            }
            strip.setBrightness(Math.min(index, max_brightness))
            strip.showColor(current_colour)
            basic.pause(10)
        }
    }
    basic.pause(tickrate)
    if (active) {
    	
    }
})
control.inBackground(function () {
    while (true) {
        if (checkForMovement()) {
            resetTimer()
        }
        if (input.runningTime() - last_shake > off_timer) {
            active = false
        } else {
            active = true
        }
        basic.pause(tickrate)
    }
})
// Limits power consumption of the Neopixel strip
control.inBackground(function () {
    while (true) {
        if (!(active)) {
            max_brightness += -2
        } else {
            if (strip.power() >= 600) {
                max_brightness += -1
            } else if (strip.power() <= 540) {
                max_brightness += 1
            }
        }
        max_brightness = Math.constrain(max_brightness, 0, 255)
        strip.setBrightness(max_brightness)
        plotBrightness(max_brightness)
        basic.pause(tickrate / 5)
    }
})
