use wasm_bindgen::prelude::*;
//Canvas coordinates
#[wasm_bindgen]
pub struct Coordinates {
    x: i32,
    y: i32,
}

//Basic Sprite
#[wasm_bindgen]
pub struct Sprite {
    position: Coordinates,
    height: u16,
    width: u16,
    image_src: String,
    scale: u8,
    frames: u8,
    framesCurrent: u8,
    framesElapsed: u8,
    framesHold: u8,
    offset: Coordinates,
}
