//          10
//  5               9
//      4       1
//          0
//      3       2
//  6               8
//          7


/*
    To add more glyphs, go to glyphtionary.com and execute these commands in javascript console ;)
    http://glyphtionary.com/
    $('.glyph-cell').css('position', 'relative');
    $('.glyph-cell').prepend($('<img>').prop('src', 'http://nerestaren.github.io/ingress-glyphs/img/reference.png').css('position', 'absolute'))
*/

var glyphs = {
	// A
    abandon: [9, 1, 0, 3, 6, 7],
    adapt: [5, 3, 0, 2],
    advance: [10, 4, 6],
    after: [9, 1, 0, 2, 8, 9],
    again_repeat: [6, 4, 3, 0, 1, 2],
    all: [10, 9, 8, 7, 6, 5, 10],
    answer: [4, 1, 2, 0],
    attack_war: [6, 4, 10, 1, 8],
	avoid_struggle: [5, 10, 1, 9, 2],
    // B
    barrier_obstacle: [10, 0, 2, 8],
    before: [5, 4, 0, 3, 6, 5],
    begin: [10, 3, 7, 2],
    being_human: [4, 1, 2, 7, 3, 4],
    body_shell: [4, 1, 0, 4],
    breathe: [5, 4, 0, 1, 9],
	// C
	capture: [7, 6, 0, 2, 9],
    change_modify: [3, 0, 7, 2],
    chaos_disorder: [6, 5, 10, 9, 1, 0, 3, 7],
    clear: [10, 0, 7],
    clearAll: [10, 0, 7, 8, 9, 10, 5, 6, 7],
    complex: [1, 4, 0, 3],
    conflict: [6, 4, 3, 2, 1],
    consequence: [5, 4, 3, 2, 8],
    contemplate: [1, 0, 4, 3, 7, 8, 9, 10],
    contract_reduce: [2, 1, 8],
    courage: [6, 4, 3, 2],
    create_creation: [6, 3, 0, 1, 9],
    creativity: [0, 4, 7, 0],
    creativity_mind_thought_idea: [3, 6, 5, 4, 0, 2, 8, 9, 1],
	// D
	danger: [10, 4, 0, 7],
	// E
    enlightened_enlightenment: [4, 1, 0, 4, 10, 9, 8, 7],
	// F
	future: [9, 1, 2, 8],
	// G
	gain: [5, 4],
    // H
    help: [5, 4, 0, 3, 2],
	// L
	liberate: [6, 4, 0, 9, 10],
	// P
    past: [5, 4, 3, 6],
    present: [4, 3, 2, 1],
	// R
    resistance: [3, 7, 0, 10, 4, 1],
	// X
	xm: [4, 3, 0, 2, 1, 4]
};