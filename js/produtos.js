var PRODUTOS = [
  /* ── Garrafas individuais ── */
  { id: 25, categoria:'garrafa', nome:'Red Label 1L',            desc:'Johnnie Walker Red Label Blended Scotch Whisky 1L',         precoAntigo: 89.90, preco: 40.90, img:'images/garrafa-red-label.webp'   },
  { id: 26, categoria:'garrafa', nome:'Black Label 1L',          desc:'Johnnie Walker Black Label 12 Anos Blended Scotch Whisky 1L',precoAntigo:139.90, preco: 84.90, img:'images/garrafa-black-label.webp'  },
  { id: 27, categoria:'garrafa', nome:"Jack Daniel's 1L",        desc:"Jack Daniel's Old No.7 Tennessee Whiskey 1L",               precoAntigo:134.90, preco: 60.90, img:'images/garrafa-jack.webp'          },
  { id: 28, categoria:'garrafa', nome:"Buchanan's 12 Anos 1L",   desc:"Buchanan's DeLuxe Aged 12 Years Blended Scotch Whisky 1L",  precoAntigo:169.90, preco: 70.90, img:'images/garrafa-buchanans.webp'    },
  { id: 29, categoria:'garrafa', nome:"Ballantine's Finest 1L",  desc:"Ballantine's Finest Blended Scotch Whisky 1L",              precoAntigo: 79.90, preco: 30.90, img:'images/garrafa-ballantines.webp'  },
  { id: 30, categoria:'garrafa', nome:'Chivas Regal 12 Anos 1L', desc:'Chivas Regal 12 Years Old Blended Scotch Whisky 1L',        precoAntigo:149.90, preco: 87.90, img:'images/garrafa-chivas.webp'        },
  { id: 31, categoria:'garrafa', nome:'Old Parr 1L',             desc:'Old Parr Blended Scotch Whisky 1L',                         precoAntigo:124.90, preco: 72.90, img:'images/garrafa-old-parr.webp'      },
  { id: 32, categoria:'garrafa', nome:'J&B Rare 1L',             desc:'J&B Rare Blended Scotch Whisky 1L',                         precoAntigo: 79.90, preco: 44.90, img:'images/garrafa-jb.webp'            },
  { id: 33, categoria:'garrafa', nome:'Jameson 1L',              desc:'Jameson Triple Distilled Irish Whiskey 1L',                  precoAntigo:119.90, preco: 69.90, img:'images/garrafa-jameson.webp'       },
  { id: 34, categoria:'garrafa', nome:'White Horse 1L',          desc:'White Horse Blended Scotch Whisky 1L',                      precoAntigo: 64.90, preco: 36.90, img:'images/garrafa-white-horse.webp'   },
  /* ── Red Label ── trocar img por arquivo próprio quando tiver */
  { id: 1,  categoria:'combo', rbQty:6,  nome:'Combo Red Label',     desc:'1x Red Label 1L e 6x Red Bull 250ml',           precoAntigo:139.90, preco:60.90,  img:'images/img2.webp' },
  { id: 9,  categoria:'combo', rbQty:12, nome:'Combo Red Label',     desc:'1x Red Label 1L e 12x Red Bull 250ml',          precoAntigo:199.90, preco:80.90,  img:'images/combo2-red.webp' },
  { id: 10, categoria:'combo', rbQty:12, nome:'Combo Red Label',     desc:'2x Red Label 1L e 12x Red Bull 250ml',          precoAntigo:279.90, preco:89.90,  img:'images/img2.webp' },
  /* ── Jack Daniel's ── trocar img por arquivo próprio quando tiver */
  { id: 2,  categoria:'combo', rbQty:6,  nome:"Combo Jack Daniel's", desc:"1x Jack Daniel's Nº7 1L e 6x Red Bull 250ml",   precoAntigo:189.90, preco:80.90,  img:'images/img3.webp' },
  { id: 11, categoria:'combo', rbQty:12, nome:"Combo Jack Daniel's", desc:"1x Jack Daniel's Nº7 1L e 12x Red Bull 250ml",  precoAntigo:239.90, preco:100.90, img:'images/combo2-jack.webp' },
  { id: 12, categoria:'combo', rbQty:12, nome:"Combo Jack Daniel's", desc:"2x Jack Daniel's Nº7 1L e 12x Red Bull 250ml",  precoAntigo:379.90, preco:109.90, img:'images/img3.webp' },
  /* ── Buchanan's ── trocar img por arquivo próprio quando tiver */
  { id: 3,  categoria:'combo', rbQty:6,  nome:"Combo Buchanan's",   desc:"1x Buchanan's 12 anos 1L e 6x Red Bull 250ml",  precoAntigo:229.90, preco:100.90, img:'images/img4.webp' },
  { id: 13, categoria:'combo', rbQty:12, nome:"Combo Buchanan's",   desc:"1x Buchanan's 12 anos 1L e 12x Red Bull 250ml", precoAntigo:289.90, preco:120.90, img:'images/combo2-buc.webp' },
  { id: 14, categoria:'combo', rbQty:12, nome:"Combo Buchanan's",   desc:"2x Buchanan's 12 anos 1L e 12x Red Bull 250ml", precoAntigo:399.90, preco:149.90, img:'images/img4.webp' },
  /* ── Ballantine's ── trocar img por arquivo próprio quando tiver */
  { id: 4,  categoria:'combo', rbQty:6,  nome:"Combo Ballantine's", desc:"1x Ballantine's 1L e 6x Red Bull 250ml",        precoAntigo:129.90, preco:50.90,  img:'images/img5.webp' },
  { id: 15, categoria:'combo', rbQty:12, nome:"Combo Ballantine's", desc:"1x Ballantine's 1L e 12x Red Bull 250ml",       precoAntigo:179.90, preco:70.90,  img:'images/combo2-balla.webp' },
  { id: 16, categoria:'combo', rbQty:12, nome:"Combo Ballantine's", desc:"2x Ballantine's 1L e 12x Red Bull 250ml",       precoAntigo:264.90, preco:79.90,  img:'images/img5.webp' },
  /* ── Budweiser ── */
  { id: 5,  categoria:'fardo', nome:'Fardo Budweiser',   desc:'Fardo com 12 latas de Budweiser 473ml',   precoAntigo: 74.90, preco: 20.90, img:'images/img8.webp'  },
  { id: 17, categoria:'fardo', nome:'Duplo Budweiser',   desc:'2 fardos com 24 latas de Budweiser 473ml', precoAntigo:144.90, preco: 38.90, img:'images/img8.webp'  },
  { id: 18, categoria:'fardo', nome:'Triplo Budweiser',  desc:'3 fardos com 36 latas de Budweiser 473ml', precoAntigo:209.90, preco: 54.90, img:'images/img8.webp'  },
  /* ── Heineken ── */
  { id: 6,  categoria:'fardo', nome:'Fardo Heineken',    desc:'Fardo com 12 latas de Heineken 473ml',    precoAntigo: 81.90, preco: 28.90, img:'images/img10.webp' },
  { id: 19, categoria:'fardo', nome:'Duplo Heineken',    desc:'2 fardos com 24 latas de Heineken 473ml', precoAntigo:159.90, preco: 54.90, img:'images/img10.webp' },
  { id: 20, categoria:'fardo', nome:'Triplo Heineken',   desc:'3 fardos com 36 latas de Heineken 473ml', precoAntigo:234.90, preco: 77.90, img:'images/img10.webp' },
  /* ── Corona ── */
  { id: 7,  categoria:'fardo', nome:'Fardo Corona',      desc:'Fardo com 12 latas de Corona 473ml',      precoAntigo: 93.90, preco: 33.90, img:'images/img11.webp' },
  { id: 21, categoria:'fardo', nome:'Duplo Corona',      desc:'2 fardos com 24 latas de Corona 473ml',   precoAntigo:184.90, preco: 64.90, img:'images/img11.webp' },
  { id: 22, categoria:'fardo', nome:'Triplo Corona',     desc:'3 fardos com 36 latas de Corona 473ml',   precoAntigo:274.90, preco: 89.90, img:'images/img11.webp' },
  /* ── Brahma ── */
  { id: 8,  categoria:'fardo', nome:'Fardo Brahma',      desc:'Fardo com 12 latas de Brahma 473ml',      precoAntigo: 64.90, preco: 19.90, img:'images/img9.webp'  },
  { id: 23, categoria:'fardo', nome:'Duplo Brahma',      desc:'2 fardos com 24 latas de Brahma 473ml',   precoAntigo:124.90, preco: 36.90, img:'images/img9.webp'  },
  { id: 24, categoria:'fardo', nome:'Triplo Brahma',     desc:'3 fardos com 36 latas de Brahma 473ml',   precoAntigo:184.90, preco: 51.90, img:'images/img9.webp'  }
];
