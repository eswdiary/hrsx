//   __    __  _______   __    __   ______  
//  /  |  /  |/       \ /  |  /  | /      \ 
//  $$ |  $$ |$$$$$$$  |$$ |  $$ |/$$$$$$  |
//  $$ |__$$ |$$ |__$$ |$$  \/$$/ $$ \__$$/ 
//  $$    $$ |$$    $$<  $$  $$<  $$      \ 
//  $$$$$$$$ |$$$$$$$  |  $$$$  \  $$$$$$  |
//  $$ |  $$ |$$ |  $$ | $$ /$$  |/  \__$$ |
//  $$ |  $$ |$$ |  $$ |$$ |  $$ |$$    $$/ 
//  $$/   $$/ $$/   $$/ $$/   $$/  $$$$$$/  
//
// HRXS Project @ 2025 by ewd

// Defined

await initHydra()

setcpm(120 / 2)

let kP = "<k  [~ [~ [~ k]]] k ~ k [~ [~ [~ k]]] [k [~ k] k ~] ~> / 2"
let sP = "<~ s ~ s> / 2"
let pP = "<0 2 3 4> 1 <2 0 13 2> 4 <13 0 1 2> 2"

let bt = 64

// Macro
const pMacro = register('pMacro', (degrade, jux, bin, iter, pat) => (
    pat
    .degradeBy(degrade)
    .juxBy(jux, x => x.hurry("0.5 3 8 2.1 2.3 7 4").iter(iter))
    .struct(binaryN("1000 2000 1999", bin))
    .ply("<2 3 4 2> / 4")
    .slow("<4 3 8 6>")
    .coarse("7 | 5 | 10")
))

let colors = arrange(
  [bt, s("<colors> / 64")],
  [bt, s("<colors:1> / 64")],
)

let felt = arrange(
  [bt / 2, s("felt / 32")],
  [bt / 2, s("felt:1 / 32")]
)

// -------START HERE--------- //

//sine
// GAIN MUTE ONLY
sine: s("<~ sine ~ sine> / 4").n("0 | 1 | 2 | 3")
  // .chop("16")
  .striate("16")
  .degrade()
  .legato(1)
  .often(x => x.jux(hurry(4)))
  .room(0.3)
  .gain(0)

// eco
_eco: s("<eco>").n(choose("0 | 1 | 2 | 3 | 4"))
  .loopAt(8)
  .room(0.1)
  // .delay(0.4).dt(0.3)
  .hpf(300)
  .gain(0.8)

// swt
_swt: s("<swt> / 4").n("<1> | <2> | <3> | <4>")
  // .jux(x => x.chop(4))
  .hpf(600)
  .gain(0.8)

// p
// pMacro(degrade[0 - 1], jux[0 - 1], bin[1 - 32], iter[1 - 4])
// "mute" not working 

_p: s("p").n(pP).pMacro(0.4, 0.3, 16, 2)
  .phaser("<0.5 0.2 0.3 0.5> / 4").phaserdepth("0.3")
  .gain(1)

// chime
_chime: s("chime")
  .n("0 | 1 | 2 | 3")
  .jux(x => x.chop(4))
  .degradeBy("0.7")
  .legato(0.5)
  .room(0.1)
  .gain(0.7)

// xylo
_xylo: s("xylo")
  .striate(choose("32 | 15 | 8 | 4"))
  .degrade()
  .sometimesBy(0.8, x => x.hurry("2").coarse(2))
  .slow("<4 5 6>")
  .shape(0.3)
  .gain(1)

// piano colors
_colors: colors.gain(1.3)

// drum
_drum: stack(
  s(kP),
  s(sP)
).shape(0.2).room(0.4).delay(0.2).gain(1)

// felt piano
_felt: felt.gain(1.5)

_chord: arrange(
  [bt / 2, stack(
     s("chord / 32"),
     s("chord:1 / 32").hpf(500).coarse(10).gain(0.3)),
    ],
  [bt / 2, stack(
    s("chord:2 / 32"),
    s("chord:1 / 32").hpf(500).coarse(10).gain(0.3),
  ),
  ],
).gain(1.3)

// Hydra

osc(60, 0.05, 0.1)
	.diff(osc(H("<10 5 1 5> / 4"), H("<0.1 0.2 0.1 0.4> / 4"), 0.3)
		.rotate(() => time % 360 * 0.2))
	.modulateScale(
         // <<-
         voronoi(20, 1)
		 // shape(10, 0.8, 0.2)
         // osc(20, 0.3, 0.2)
         // noise(5, 0.2)
		.modulate(src(o0)
			.rotate(time % 360)),
		H("<0.1 0.3 0.3 0.1> / 4")    // <--
	)
	.color(H("<1 0.9 0.8> / 8"), 0.5, 0.6, H("<0.2 0.1 0.3> / 8"))
	.blend(src(o0)
		.modulatePixelate(o0), H("<0.2 0.3 0.5> / 16"))
	.luma(0.3, 0.5)
	.invert()
    // .kaleid(H("<4, 8, 12, 6> / 16"))
	.blend(src(o1), 0.8)    //alpha
	.out(o0);

