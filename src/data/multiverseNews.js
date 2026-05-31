// All dates as ISO strings or null for TBA
export const MULTIVERSE_NEWS = [
  // ── MARVEL ──────────────────────────────────────────────────────────────────
  { id: 'n-mcu-01', franchise: 'marvel', title: 'Thunderbolts*',                  type: 'movie',    date: '2025-05-02', released: true,  desc: 'Marvel\'s antihero team — Yelena, Ghost, Red Guardian, Taskmaster, Bucky, and the Sentry — assemble in one chaotic mission.' },
  { id: 'n-mcu-02', franchise: 'marvel', title: 'Ironheart',                       type: 'tv',       date: '2025-06-24', released: true,  desc: 'Riri Williams takes the mantle of Ironheart as the MCU\'s newest genius inventor battles forces she wasn\'t ready for.' },
  { id: 'n-mcu-03', franchise: 'marvel', title: 'Avengers: Doomsday',              type: 'movie',    date: '2026-05-01', released: true,  desc: 'The Avengers face their greatest threat yet as Doctor Doom orchestrates the convergence of the multiverse.' },
  { id: 'n-mcu-04', franchise: 'marvel', title: 'Daredevil: Born Again S2',        type: 'tv',       date: '2026-07-01', released: false, desc: 'Matt Murdock returns to Hell\'s Kitchen as Daredevil continues to protect the streets of New York in the MCU canon.' },
  { id: 'n-mcu-05', franchise: 'marvel', title: 'The Fantastic Four: First Steps', type: 'movie',    date: '2026-07-25', released: false, desc: 'Marvel\'s First Family arrives in the MCU — Reed, Sue, Johnny, and Ben face their cosmic destiny in this long-awaited debut.' },
  { id: 'n-mcu-06', franchise: 'marvel', title: 'Spider-Man: Brand New Day',       type: 'movie',    date: '2026-11-01', released: false, desc: 'Tom Holland returns as Peter Parker in a new chapter that pushes Spider-Man into uncharted MCU territory.' },
  { id: 'n-mcu-07', franchise: 'marvel', title: 'Avengers: Secret Wars',           type: 'movie',    date: '2027-05-07', released: false, desc: 'The multiverse-spanning conclusion to the Multiverse Saga — every hero, every universe, one final battle.' },
  // ── DC ───────────────────────────────────────────────────────────────────────
  { id: 'n-dc-01',  franchise: 'dc',     title: 'Superman',                        type: 'movie',    date: '2025-07-11', released: true,  desc: 'James Gunn\'s new DCU begins. David Corenswet debuts as Clark Kent — optimistic, compassionate, and full of hope.' },
  { id: 'n-dc-02',  franchise: 'dc',     title: 'Lanterns',                        type: 'tv',       date: '2026-08-01', released: false, desc: 'HBO series following Hal Jordan and John Stewart as space cops investigating a dark conspiracy on Earth.' },
  { id: 'n-dc-03',  franchise: 'dc',     title: 'Supergirl: Woman of Tomorrow',    type: 'movie',    date: '2026-10-01', released: false, desc: 'Milly Alcock stars as a harder, more world-weary Kara Zor-El in a cosmic road-trip adventure.' },
  { id: 'n-dc-04',  franchise: 'dc',     title: 'Batman: The Brave and the Bold',  type: 'movie',    date: '2027-07-04', released: false, desc: 'The new DCU\'s Batman arrives alongside Damian Wayne — a darker, more grounded Dark Knight for the Gunn era.' },
  { id: 'n-dc-05',  franchise: 'dc',     title: 'The Authority',                   type: 'movie',    date: '2027-01-01', released: false, desc: 'The DCU\'s most morally complex team makes its debut — these heroes don\'t just stop villains, they end them.' },
  // ── HARRY POTTER ─────────────────────────────────────────────────────────────
  { id: 'n-hp-01',  franchise: 'hp',     title: 'Harry Potter (HBO Series)',       type: 'tv',       date: '2026-09-01', released: false, desc: 'The definitive adaptation of J.K. Rowling\'s novels, with each season covering one book in full — HBO\'s most ambitious fantasy series.' },
  // ── STAR WARS ────────────────────────────────────────────────────────────────
  { id: 'n-sw-01',  franchise: 'sw',     title: 'Andor Season 2',                  type: 'tv',       date: '2025-04-22', released: true,  desc: 'Cassian Andor\'s journey completes. The most acclaimed Star Wars series delivers its final chapter leading into Rogue One.' },
  { id: 'n-sw-02',  franchise: 'sw',     title: 'The Mandalorian & Grogu',         type: 'movie',    date: '2026-05-22', released: true,  desc: 'Din Djarin and Grogu return to the big screen in Lucasfilm\'s first theatrical Star Wars film since The Rise of Skywalker.' },
  { id: 'n-sw-03',  franchise: 'sw',     title: 'Dawn of the Jedi',                type: 'movie',    date: null,         released: false, desc: 'Sharmeen Ob-Wan Hameed\'s film set 25,000 years before A New Hope — the founding of the Jedi Order itself.' },
  { id: 'n-sw-04',  franchise: 'sw',     title: 'Starfighter Squadron',            type: 'movie',    date: null,         released: false, desc: 'A new Star Wars film focused on X-Wing pilots and the aerial combat that defined the Rebel Alliance\'s greatest battles.' },
]

export const FRANCHISE_META = {
  marvel: { name: 'MARVEL',       color: '#E81C2E', bg: 'rgba(232,28,46,0.1)',  logo: 'M',  logoStyle: { background: 'linear-gradient(135deg, #E81C2E, #a0001a)', color: '#fff', borderRadius: 6 } },
  dc:     { name: 'DC',           color: '#FFD700', bg: 'rgba(255,215,0,0.08)', logo: 'DC', logoStyle: { background: 'linear-gradient(135deg, #FFD700, #d4a017)', color: '#000', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' } },
  hp:     { name: 'HARRY POTTER', color: '#c9a227', bg: 'rgba(201,162,39,0.08)', logo: '⚡', logoStyle: { background: 'linear-gradient(135deg,#1a0a2e,#2d1555)', border: '1px solid rgba(201,162,39,0.5)', borderRadius: 8 } },
  sw:     { name: 'STAR WARS',    color: '#ffe81f', bg: 'rgba(255,232,31,0.05)', logo: '⚔️', logoStyle: { background: '#030308', border: '1px solid rgba(255,232,31,0.4)', borderRadius: 8 } },
}
