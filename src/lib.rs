use wasm_bindgen::prelude::*;
mod structs;
//Utils.js wasm replacements
use structs::Coordinates;

/*
wasm use for rectangular collisions
*/
#[wasm_bindgen]
pub fn rectangular_collision(a: i32, b: i32) -> bool {
    a + b > 0
}
