var PRODUTOS = [
  /* ── Garrafas individuais ── */
  { id: 25, categoria:'garrafa', nome:'Red Label 1L',            desc:'Johnnie Walker Red Label Blended Scotch Whisky 1L',         precoAntigo: 89.90, preco: 40.87, img:'images/garrafa-red-label.webp'   },
  { id: 26, categoria:'garrafa', nome:'Black Label 1L',          desc:'Johnnie Walker Black Label 12 Anos Blended Scotch Whisky 1L',precoAntigo:139.90, preco: 84.90, img:'images/garrafa-black-label.webp'  },
  { id: 27, categoria:'garrafa', nome:"Jack Daniel's 1L",        desc:"Jack Daniel's Old No.7 Tennessee Whiskey 1L",               precoAntigo:139.90, preco: 48.93, img:'images/garrafa-jack.webp'          },
  { id: 46, categoria:'garrafa', nome:"Jack Daniel's Apple 1L",  desc:"Jack Daniel's Tennessee Apple 1L",                          precoAntigo:119.90, preco: 41.98, img:'images/garrafa-jack-apple.webp'    },
  { id: 47, categoria:'garrafa', nome:"Jack Daniel's Honey 1L",  desc:"Jack Daniel's Tennessee Honey 1L",                          precoAntigo:129.90, preco: 44.91, img:'images/garrafa-jack-honey.webp'    },
  { id: 28, categoria:'garrafa', nome:"Buchanan's 12 Anos 1L",   desc:"Buchanan's DeLuxe Aged 12 Years Blended Scotch Whisky 1L",  precoAntigo:199.90, preco: 70.95, img:'images/garrafa-buchanans.webp'    },
  { id: 29, categoria:'garrafa', nome:"Ballantine's Finest 1L",  desc:"Ballantine's Finest Blended Scotch Whisky 1L",              precoAntigo: 79.90, preco: 30.96, img:'images/garrafa-ballantines.webp'  },
  { id: 30, categoria:'garrafa', nome:'Chivas Regal 12 Anos 1L', desc:'Chivas Regal 12 Years Old Blended Scotch Whisky 1L',        precoAntigo:149.90, preco: 87.90, img:'images/garrafa-chivas.webp'        },
  { id: 31, categoria:'garrafa', nome:'Old Parr 1L',             desc:'Old Parr Blended Scotch Whisky 1L',                         precoAntigo:124.90, preco: 72.90, img:'images/garrafa-old-parr.webp'      },
  { id: 32, categoria:'garrafa', nome:'J&B Rare 1L',             desc:'J&B Rare Blended Scotch Whisky 1L',                         precoAntigo: 79.90, preco: 44.90, img:'images/garrafa-jb.webp'            },
  { id: 33, categoria:'garrafa', nome:'Jameson 1L',              desc:'Jameson Triple Distilled Irish Whiskey 1L',                  precoAntigo:119.90, preco: 69.90, img:'images/garrafa-jameson.webp'       },
  { id: 34, categoria:'garrafa', nome:'White Horse 1L',          desc:'White Horse Blended Scotch Whisky 1L',                      precoAntigo: 64.90, preco: 36.90, img:'images/garrafa-white-horse.webp'   },
  /* ── Red Label ── trocar img por arquivo próprio quando tiver */
  { id: 1,  categoria:'combo', rbQty:6,  nome:'Combo Red Label',     desc:'1x Red Label 1L e 6x Red Bull 250ml',           precoAntigo:119.90, preco:49.87,  img:'images/img2.webp' },
  { id: 9,  categoria:'combo', rbQty:12, nome:'Combo Red Label',     desc:'1x Red Label 1L e 12x Red Bull 250ml',          precoAntigo:199.90, preco:80.90,  img:'images/combo2-red.webp' },
  { id: 10, categoria:'combo', rbQty:12, nome:'Combo Red Label',     desc:'2x Red Label 1L e 12x Red Bull 250ml',          precoAntigo:279.90, preco:89.90,  img:'images/img2.webp' },
  /* ── Jack Daniel's ── trocar img por arquivo próprio quando tiver */
  { id: 2,  categoria:'combo', rbQty:6,  nome:"Combo Jack Daniel's", desc:"1x Jack Daniel's Nº7 1L e 6x Red Bull 250ml",   precoAntigo:169.90, preco:58.93,  img:'images/img3.webp' },
  { id: 11, categoria:'combo', rbQty:12, nome:"Combo Jack Daniel's", desc:"1x Jack Daniel's Nº7 1L e 12x Red Bull 250ml",  precoAntigo:239.90, preco:100.90, img:'images/combo2-jack.webp' },
  { id: 12, categoria:'combo', rbQty:12, nome:"Combo Jack Daniel's", desc:"2x Jack Daniel's Nº7 1L e 12x Red Bull 250ml",  precoAntigo:379.90, preco:109.90, img:'images/img3.webp' },
  /* ── Jack Daniel's Apple ── */
  { id: 44, categoria:'combo', rbQty:6,  nome:"Combo Jack Daniel's Apple", desc:"1x Jack Daniel's Apple 1L e 6x Red Bull 250ml", precoAntigo:149.90, preco:51.98, img:'images/jack-apple.webp' },
  /* ── Jack Daniel's Honey ── */
  { id: 45, categoria:'combo', rbQty:6,  nome:"Combo Jack Daniel's Honey", desc:"1x Jack Daniel's Honey 1L e 6x Red Bull 250ml", precoAntigo:159.90, preco:54.91, img:'images/jack-honey.webp' },
  /* ── Buchanan's ── trocar img por arquivo próprio quando tiver */
  { id: 3,  categoria:'combo', rbQty:6,  nome:"Combo Buchanan's",   desc:"1x Buchanan's 12 anos 1L e 6x Red Bull 250ml",  precoAntigo:229.90, preco:80.95, img:'images/img4.webp' },
  { id: 13, categoria:'combo', rbQty:12, nome:"Combo Buchanan's",   desc:"1x Buchanan's 12 anos 1L e 12x Red Bull 250ml", precoAntigo:289.90, preco:120.90, img:'images/combo2-buc.webp' },
  { id: 14, categoria:'combo', rbQty:12, nome:"Combo Buchanan's",   desc:"2x Buchanan's 12 anos 1L e 12x Red Bull 250ml", precoAntigo:399.90, preco:149.90, img:'images/img4.webp' },
  /* ── Ballantine's ── trocar img por arquivo próprio quando tiver */
  { id: 4,  categoria:'combo', rbQty:6,  nome:"Combo Ballantine's", desc:"1x Ballantine's 1L e 6x Red Bull 250ml",        precoAntigo:109.90, preco:40.96,  img:'images/img5.webp' },
  { id: 15, categoria:'combo', rbQty:12, nome:"Combo Ballantine's", desc:"1x Ballantine's 1L e 12x Red Bull 250ml",       precoAntigo:179.90, preco:70.90,  img:'images/combo2-balla.webp' },
  { id: 16, categoria:'combo', rbQty:12, nome:"Combo Ballantine's", desc:"2x Ballantine's 1L e 12x Red Bull 250ml",       precoAntigo:264.90, preco:79.90,  img:'images/img5.webp' },
  /* ── Budweiser ── */
  { id: 5,  categoria:'fardo', nome:'Fardo Budweiser',   desc:'Fardo com 12 latas de Budweiser 473ml',   precoAntigo: 55.90, preco: 23.01, img:'images/img8.webp'  },
  { id: 17, categoria:'fardo', nome:'Duplo Budweiser',   desc:'2 fardos com 24 latas de Budweiser 473ml', precoAntigo:144.90, preco: 38.90, img:'images/img8.webp'  },
  { id: 18, categoria:'fardo', nome:'Triplo Budweiser',  desc:'3 fardos com 36 latas de Budweiser 473ml', precoAntigo:209.90, preco: 54.90, img:'images/img8.webp'  },
  /* ── Heineken ── */
  { id: 6,  categoria:'fardo', nome:'Fardo Heineken',    desc:'Fardo com 12 latas de Heineken 473ml',    precoAntigo: 74.00, preco: 34.16, img:'images/img10.webp' },
  { id: 19, categoria:'fardo', nome:'Duplo Heineken',    desc:'2 fardos com 24 latas de Heineken 473ml', precoAntigo:159.90, preco: 54.90, img:'images/img10.webp' },
  { id: 20, categoria:'fardo', nome:'Triplo Heineken',   desc:'3 fardos com 36 latas de Heineken 473ml', precoAntigo:234.90, preco: 77.90, img:'images/img10.webp' },
  /* ── Corona ── */
  { id: 7,  categoria:'fardo', nome:'Fardo Corona',      desc:'Fardo com 12 latas de Corona 473ml',      precoAntigo: 80.00, preco: 30.27, img:'images/img11.webp' },
  { id: 21, categoria:'fardo', nome:'Duplo Corona',      desc:'2 fardos com 24 latas de Corona 473ml',   precoAntigo:184.90, preco: 64.90, img:'images/img11.webp' },
  { id: 22, categoria:'fardo', nome:'Triplo Corona',     desc:'3 fardos com 36 latas de Corona 473ml',   precoAntigo:274.90, preco: 89.90, img:'images/img11.webp' },
  /* ── Brahma ── */
  { id: 8,  categoria:'fardo', nome:'Fardo Brahma',      desc:'Fardo com 12 latas de Brahma 473ml',      precoAntigo: 45.00, preco: 17.93, img:'images/img9.webp'  },
  { id: 23, categoria:'fardo', nome:'Duplo Brahma',      desc:'2 fardos com 24 latas de Brahma 473ml',   precoAntigo:124.90, preco: 36.90, img:'images/img9.webp'  },
  { id: 24, categoria:'fardo', nome:'Triplo Brahma',     desc:'3 fardos com 36 latas de Brahma 473ml',   precoAntigo:184.90, preco: 51.90, img:'images/img9.webp'  },
  /* ── Spaten ── */
  { id: 36, categoria:'fardo', nome:'Fardo Spaten',        desc:'12 latas 473ml', precoAntigo: 59.90, preco: 25.94, img:'images/spaten-fardo.webp' },
  /* ── Amstel ── */
  { id: 40, categoria:'fardo', nome:'Fardo Amstel',        desc:'12 latas 473ml', precoAntigo: 50.90, preco: 19.87, img:'images/amstel-fardo.webp' },
  /* ── Skol Beats ── */
  { id: 41, categoria:'fardo', nome:'Pack Skol Beats Senses',  desc:'8 latas 269ml', precoAntigo: 51.90, preco: 24.98, img:'images/skol-beats-senses.webp'  },
  { id: 42, categoria:'fardo', nome:'Pack Skol Beats Tropical',desc:'8 latas 269ml', precoAntigo: 51.90, preco: 24.98, img:'images/skol-beats-tropical.webp' },
  { id: 43, categoria:'fardo', nome:'Pack Skol Beats GT',      desc:'8 latas 269ml', precoAntigo: 51.90, preco: 24.98, img:'images/skol-beats-gt.webp'      },
  /* ── Old Parr ── */
  { id: 38, categoria:'combo', rbQty:6,  nome:'Combo Old Parr',      desc:'1x Old Parr 12 Anos 1L e 6x Red Bull 250ml',    precoAntigo:249.90, preco:99.90,  img:'images/img6.webp' },
  /* ── Royal Salute ── */
  { id: 39, categoria:'combo', rbQty:6,  nome:'Combo Royal Salute',  desc:'1x Royal Salute 21 Anos 700ml e 6x Red Bull 250ml', precoAntigo:349.90, preco:139.90, img:'images/img7.webp' },
  /* ── Para a Resenha ── */
  { id: 50, categoria:'resenha', nome:'Carvão Vegetal 5kg',            desc:'Carvão vegetal especial para churrasco 5kg',  precoAntigo: 36.90, preco: 15.98, img:'images/carvao.webp'        },
  { id: 51, categoria:'resenha', nome:'Saco de Gelo em Cubos 5kg',     desc:'Gelo em cubos 5kg',                            precoAntigo: 20.00, preco:  9.87, img:'images/gelo-saco.webp'     },
  { id: 52, categoria:'resenha', nome:'Acendedor Álcool em Gel 500g',  desc:'Gel acendedor 500g',                           precoAntigo: 13.00, preco:  6.94, img:'images/acendedor.webp'     },
  { id: 53, categoria:'resenha', nome:'Guaraná Antarctica 2L',         desc:'Refrigerante Guaraná Antarctica 2L',           precoAntigo:  9.89, preco:  5.38, img:'images/guarana.webp'       },
  { id: 54, categoria:'resenha', nome:'Guaraná Antarctica Zero 2L',    desc:'Refrigerante Guaraná Antarctica Zero 2L',      precoAntigo:  9.89, preco:  5.38, img:'images/guarana-zero.webp'  },
  { id: 55, categoria:'resenha', nome:'Pepsi 2L',                      desc:'Refrigerante Pepsi 2L',                        precoAntigo:  9.29, preco:  5.16, img:'images/pepsi.webp'         },
  { id: 56, categoria:'resenha', nome:'Pepsi Zero 2L',                desc:'Refrigerante Pepsi Zero (sem açúcar) 2L',      precoAntigo:  9.29, preco:  5.16, img:'images/pepsi-black.webp'   }
];
