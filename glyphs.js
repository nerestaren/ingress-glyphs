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
    data_signal_message: [10, 1, 0, 3, 7],
    defend: [5, 3, 7, 2, 9],
    destination: [7, 8, 9],
    destiny: [4, 0, 1, 2, 3, 7],
    destroy_destruction: [5, 4, 0, 2, 8],
    deteriorate_erode: [4, 0, 3, 6],
    die: [6, 3, 0, 2, 8],
    difficult: [3, 0, 2, 1, 9],
    discover: [6, 7, 8, 9],
    distance_outside: [6, 5, 10],
	// E
    easy: [1, 0, 3, 7],
    end_close_finality: [10, 0, 7, 2, 9, 10],
    enlightened_enlightenment: [4, 1, 0, 4, 10, 9, 8, 7],
    enlightened_enlightenmentTypeB: [4, 1, 0, 4, 10, 9, 8, 7, 6],
    equal: [3, 4, 1, 2],
    escape: [10, 9, 1, 4, 3],
    evolution_success_progress: [10, 0, 4, 3],  //move to success?
	// F
    failure: [10, 0, 1, 2],
    fear: [4, 1, 2, 9],
    follow: [10, 1, 9, 8],
    forget: [6, 3],
	future_forwardTime: [9, 1, 2, 8],
	// G
	gain: [5, 3],
    government_city_civilization_structure: [5, 4, 3, 2, 1, 9], //move to civilization?
    grow: [6, 4, 3],
    // H
    harm: [8, 2, 0, 4, 10, 1, 0],
    harmony_peace: [10, 1, 0, 3, 7, 2, 0, 4, 10],
    have: [2, 0, 3, 7],
    help: [5, 4, 0, 3, 2],
    hide: [4, 1, 9, 2, 3],
    // I
    i_me_self: [4, 1, 7, 4],
    ignore: [2, 8],
    imperfect: [0, 4, 3, 0, 1, 3],
    improve: [9, 1, 0, 2],
    impure: [0, 3, 4, 0, 7],
    intelligence: [6, 3, 4, 0, 1, 9],
    interrupt: [10, 0, 4, 5, 6, 3, 0, 7],
    // J
    journey: [9, 1, 0, 4, 5, 6, 7],
    // K
    knowledge: [4, 0, 1, 7, 4],
	// L
    lead: [10, 5, 6, 3, 7],
    legacy: [6, 3, 4, 5, 10, 9, 1, 2, 8],
    less: [4, 0, 1],
    liberate: [10, 9, 1, 0, 4, 6],
    lie: [3, 4, 0, 2, 1, 0],
    liveAgain_reincarnate: [6, 4, 3, 0, 1, 9],
    lose_loss: [2, 9],
    // M
    message: [6, 4, 0, 2, 9],
    mind_idea_thought: [4, 0, 7, 3, 4],
    more: [3, 0, 2],
    mystery: [5, 4, 1, 10, 4, 3],
    // N
    nzeer: [10, 4, 0, 1, 10, 0, 7],
    nature: [6, 3, 4, 1, 2, 8],
    new: [1, 2, 8],
    no_not_absent_inside: [4, 1, 2],
    nourish: [0, 3, 6, 7, 0],
    // O
    old: [5, 4, 3],
    open_accept: [3, 2, 7, 3],
    openAll: [7, 3, 2, 7, 6, 5, 10, 9, 8, 7],
    opening_doorway_portal: [6, 5, 4, 1, 9, 8, 2, 3, 6],//move to portal??
    // P
    past: [5, 4, 3, 6],
    path: [6, 3, 0, 10],
    perfection_balance: [10, 0, 2, 8, 7, 6, 3, 0],
    perspective: [6, 3, 0, 1, 10, 4, 0, 2, 8],
    potential: [10, 0, 2, 8, 9],
    presence: [3, 4, 0, 1, 2, 3, 7, 2],
    present_now: [4, 3, 2, 1],
    pure_purity: [10, 0, 2, 1, 0],
    pursue_aspiration: [5, 4, 10, 1],
    pursue_chase: [10, 0, 4, 3, 6],
    // Q
    question: [10, 1, 4, 3],
	// R
    react: [1, 4, 0, 2, 8],
    rebel: [5, 3, 0, 1, 9, 8],
    recharge: [10, 5, 4, 0, 10],
    resist_resistance_struggle: [3, 7, 0, 10, 4, 1],
    resist_resistanceTypeB: [2, 7, 0, 10, 4, 1],
    restraint: [5, 4, 0, 2, 8, 7],
    retreat: [10, 1, 8],
    // S
    safety: [6, 4, 1, 8],
    save_rescue: [3, 0, 2, 9],
    see: [10, 4],
    seek_search: [0, 1, 4, 3, 2],
    self: [6, 7, 8],
    separate: [5, 4, 3, 0, 1, 2, 8],
    shaper_collective: [6, 3, 4, 10, 1, 2, 8],
    share: [7, 6, 3, 2, 8],
    simple: [3, 2],
    soul_spirit_lifeForce: [0, 1, 2, 7, 0],
    stability_stay: [6, 3, 2, 8],
    strong: [4, 1, 2, 3, 4],
    // T
    technology: [9, 1, 0, 3, 4, 0, 2, 8],
    together: [6, 3, 0, 1, 4, 0],
    truth: [4, 0, 2, 1, 0, 3, 4],
    // U
    unbounded: [0, 1, 4, 3, 2, 9, 10, 5, 6, 7, 8],
    use: [0, 2, 9],
    // V
    victory: [10, 1, 7, 4, 10],
    // W
    want_desire: [6, 3, 7, 2],
    we_us: [4, 1, 7],
    weak: [5, 4, 1, 2],
    worth: [5, 3, 0, 2, 9],
    // X
    xm: [4, 3, 0, 2, 1, 4],
    // Y
    you_other: [10, 2, 3, 10]
};