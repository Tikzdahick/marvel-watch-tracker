/**
 * dcCalendar.js — "Today in DC" data.
 * Keys are "MM-DD" (zero-padded). Each value is an object:
 *   { type: 'release'|'birthday'|'comic'|'bts'|'event', icon, text }
 */

export const DC_CALENDAR = {
  // ── JANUARY ──────────────────────────────────────────────────────────────
  '01-01': { type: 'event',    icon: '🎉', text: 'Happy New Year! In 2012, The Dark Knight Rises began filming in Los Angeles — Christopher Nolan\'s final chapter of his Batman trilogy was officially underway.' },
  '01-03': { type: 'bts',      icon: '🎬', text: 'Christian Bale\'s distinctive Batman voice was improvised during the first day of filming Batman Begins — Christopher Nolan loved it and kept it throughout the trilogy.' },
  '01-06': { type: 'comic',    icon: '📖', text: 'The Joker first appeared in Batman #1 in April 1940 — originally planned to be killed off in the second issue, but editor Whitney Ellsworth saved the character for future stories.' },
  '01-09': { type: 'birthday', icon: '🎂', text: 'Nina Dobrev was born on this day in 1989. She starred in The Flash (2023) as Iris West.' },
  '01-11': { type: 'bts',      icon: '🎬', text: 'The Batmobile in Tim Burton\'s Batman (1989) was built in just 15 weeks. The car was so complex it required a full-time team of engineers to keep running during filming.' },
  '01-14': { type: 'birthday', icon: '🎂', text: 'Jason Momoa (Aquaman / Arthur Curry) was born on this day in 1979 in Honolulu, Hawaii.' },
  '01-17': { type: 'comic',    icon: '📖', text: 'Superman first appeared in Action Comics #1 in June 1938 — the 13-page story was sold to DC for $130 by Jerry Siegel and Joe Shuster. The issue now sells for millions.' },
  '01-20': { type: 'bts',      icon: '🎬', text: 'Heath Ledger spent six weeks in isolation in a hotel room to develop his Joker character for The Dark Knight, keeping a diary of the character\'s thoughts.' },
  '01-22': { type: 'birthday', icon: '🎂', text: 'Diane Lane (Martha Kent in Man of Steel, Batman v Superman, and Zack Snyder\'s Justice League) was born on this day in 1965.' },
  '01-25': { type: 'event',    icon: '⭐', text: 'The Dark Knight crossed $1 billion at the worldwide box office in 2008 — making it one of the first superhero films to achieve that milestone.' },
  '01-27': { type: 'comic',    icon: '📖', text: 'Wonder Woman first appeared in All Star Comics #8 in October 1941, created by William Moulton Marston. She was the first major female superhero in comics history.' },

  // ── FEBRUARY ─────────────────────────────────────────────────────────────
  '02-01': { type: 'bts',      icon: '🎬', text: 'The production of Zack Snyder\'s Justice League (the Snyder Cut) was completed in 2021 using footage that had been locked away since 2017 — a fan campaign spanning four years made it happen.' },
  '02-05': { type: 'birthday', icon: '🎂', text: 'Michael B. Jordan, who appeared in Chronicle (a DC-adjacent film) was born this day in 1987. He trained extensively for his superhero role.' },
  '02-07': { type: 'birthday', icon: '🎂', text: 'Ashton Sanders was born on this day in 1995. He plays Guy Gardner in the upcoming Lanterns series.' },
  '02-10': { type: 'bts',      icon: '🎬', text: 'Gal Gadot was cast as Wonder Woman without any prior superhero film experience. She trained for nine months with IDF soldiers and professional martial artists before filming.' },
  '02-14': { type: 'event',    icon: '💛', text: 'On Valentine\'s Day 2019, Aquaman crossed $1 billion worldwide — making Jason Momoa\'s Atlantean king the DCEU\'s highest-grossing solo film.' },
  '02-16': { type: 'birthday', icon: '🎂', text: 'Margot Robbie (Harley Quinn) was born on this day in 1990 in Dalby, Queensland, Australia. Her Harley Quinn became one of DC\'s most popular big-screen characters.' },
  '02-18': { type: 'comic',    icon: '📖', text: 'Batman first appeared in Detective Comics #27 in May 1939, created by Bob Kane and Bill Finger. Bruce Wayne\'s tragic origin was added in Batman #1 in 1940.' },
  '02-22': { type: 'bts',      icon: '🎬', text: 'The Batman (2022) was filmed almost entirely in the dark. Matt Reeves told cinematographer Greig Fraser to light every scene as if the characters were really there — practical darkness, not digital.' },
  '02-25': { type: 'release',  icon: '🎬', text: 'Batman Returns (1992) entered production on this day, with Tim Burton doubling down on the gothic horror elements that made the original Batman a success.' },

  // ── MARCH ────────────────────────────────────────────────────────────────
  '03-04': { type: 'bts',      icon: '🎬', text: 'Christopher Nolan shot The Dark Knight with real IMAX cameras — the first feature film to extensively use the format. Six sequences totaling 28 minutes were captured in native IMAX.' },
  '03-07': { type: 'release',  icon: '🎬', text: '300 (2007) — based on Frank Miller\'s DC/Dark Horse graphic novel — opened in theaters on this day, pioneering the digital-heavy visual style used in many DC films.' },
  '03-09': { type: 'birthday', icon: '🎂', text: 'Ezra Miller (The Flash / Barry Allen) was born on this day in 1992 in Wyckoff, New Jersey.' },
  '03-14': { type: 'birthday', icon: '🎂', text: 'Billy Crudup was born on this day in 1969. He played Barry Allen\'s father Henry Allen in the DC Extended Universe films.' },
  '03-19': { type: 'bts',      icon: '🎬', text: 'Joaquin Phoenix lost 52 pounds to play Arthur Fleck in Joker (2019) — the most dramatic physical transformation for a DC role. He also learned to dance for the film\'s iconic staircase scene.' },
  '03-22': { type: 'birthday', icon: '🎂', text: 'Reeve Carney, who plays Dick Grayson in DC\'s Titans series, was born on this day in 1983.' },
  '03-25': { type: 'release',  icon: '🎬', text: 'Batman v Superman: Dawn of Justice opened in theaters on this day in 2016 — the first live-action film to feature Batman, Superman, and Wonder Woman together.' },
  '03-28': { type: 'birthday', icon: '🎂', text: 'Amy Adams (Lois Lane in the DCEU) was born on this day in 1974. She played Lois Lane in four DC films.' },

  // ── APRIL ────────────────────────────────────────────────────────────────
  '04-03': { type: 'birthday', icon: '🎂', text: 'Alec Baldwin was born on this day in 1958. He voiced Thomas Wayne in Batman: Mask of the Phantasm.' },
  '04-04': { type: 'bts',      icon: '🎬', text: 'Jack Nicholson\'s Joker in Batman (1989) was so beloved that he reportedly received a portion of the film\'s merchandise revenue — a deal worth tens of millions of dollars.' },
  '04-09': { type: 'comic',    icon: '📖', text: 'Green Lantern (Hal Jordan) first appeared in Showcase #22 in October 1959 — the character that launched the "Silver Age" of DC Comics and helped revitalize the superhero genre.' },
  '04-15': { type: 'birthday', icon: '🎂', text: 'Emma Watson was born on this day in 1990. While not in a DC film, she was famously considered for the role of Wonder Woman before Gal Gadot was cast.' },
  '04-19': { type: 'bts',      icon: '🎬', text: 'The Tumbler Batmobile from Batman Begins was designed by production designer Nathan Crowley in Chris Nolan\'s garage — working from the concept "what if Bruce Wayne had to build it himself?"' },
  '04-23': { type: 'birthday', icon: '🎂', text: 'John Cena (Peacemaker / Christopher Smith) was born on this day in 1977. His HBO Max series Peacemaker became one of DC\'s most acclaimed shows.' },
  '04-26': { type: 'bts',      icon: '🎬', text: 'The Batman (2022) had three years of pre-production. Robert Pattinson spent six months doing Batman\'s "method acting" — wearing the suit privately to find the character.' },

  // ── MAY ──────────────────────────────────────────────────────────────────
  '05-04': { type: 'bts',      icon: '🎬', text: 'Shazam! (2019) production used a real 14-year-old actor, Jack Dylan Grazer (Freddy Freeman), who had to act opposite an adult-bodied superhero — making the dual-casting logistics extremely complex.' },
  '05-08': { type: 'birthday', icon: '🎂', text: 'Melissa Benoist (Supergirl / Kara Danvers) was born on this day in 1988. She played Supergirl for 6 seasons in the Arrowverse.' },
  '05-10': { type: 'release',  icon: '🎬', text: 'Batman Forever (1995) entered production on this day under Joel Schumacher — shifting the franchise from dark to colorful, a decision that divided DC fans for decades.' },
  '05-16': { type: 'birthday', icon: '🎂', text: 'Megan Fox was born on this day in 1986. She plays Megan Fitzgerald in the animated Ninja Turtles franchise and has appeared in several DC-adjacent projects.' },
  '05-19': { type: 'birthday', icon: '🎂', text: 'Viola Davis (Amanda Waller) was born on this day in 1965. She is the only actor to have played the same character across Suicide Squad, The Suicide Squad, Peacemaker, and Task Force X.' },
  '05-23': { type: 'comic',    icon: '📖', text: 'The Flash first appeared in Showcase #4 in October 1956 as Barry Allen — created by Robert Kanigher and Carmine Infantino. He kicked off the Silver Age of Comics.' },
  '05-30': { type: 'bts',      icon: '🎬', text: 'The Dark Knight\'s ferry sequence used two real-world ferries — one in Chicago and one in New York — with hundreds of extras. The social experiment scene was shot over three days.' },

  // ── JUNE ─────────────────────────────────────────────────────────────────
  '06-02': { type: 'birthday', icon: '🎂', text: 'Morena Baccarin (Dr. Leslie Thompkins in Gotham and Vanessa in Deadpool) was born on this day in 1979.' },
  '06-04': { type: 'release',  icon: '🎬', text: 'The Dark Knight began filming in Chicago on this day in 2007, using the city\'s architecture as a stand-in for Gotham City — a decision praised for its realistic aesthetic.' },
  '06-10': { type: 'birthday', icon: '🎂', text: 'Idris Elba (Bloodsport in The Suicide Squad) was born on this day in 1972 in London. He replaced Will Smith in the squad.' },
  '06-16': { type: 'release',  icon: '🎬', text: 'Man of Steel (2013) opened in theaters on this day — Zack Snyder\'s reimagining of Superman that launched the DC Extended Universe.' },
  '06-18': { type: 'birthday', icon: '🎂', text: 'Richard Madden was born on this day in 1986. He\'s been linked to multiple DC roles, including a potential Superman consideration.' },
  '06-20': { type: 'bts',      icon: '🎬', text: 'The Superman suit in Man of Steel was CGI-enhanced — Henry Cavill\'s practical suit was grey, and the color was digitally added in post to create the iconic blue.' },
  '06-23': { type: 'comic',    icon: '📖', text: 'Aquaman first appeared in More Fun Comics #73 in November 1941. For decades he was considered one of comics\' least popular heroes — Jason Momoa\'s casting completely changed that perception.' },

  // ── JULY ─────────────────────────────────────────────────────────────────
  '07-02': { type: 'birthday', icon: '🎂', text: 'Ron Perlman was born on this day in 1950. He voiced Slade/Deathstroke in Teen Titans and has appeared in multiple DC animated productions.' },
  '07-06': { type: 'bts',      icon: '🎬', text: 'Wonder Woman (2017) was the first major superhero film directed by a woman. Patty Jenkins had to fight for years to get the chance — she was originally attached to direct Thor: The Dark World.' },
  '07-11': { type: 'birthday', icon: '🎂', text: 'Joel Schumacher, the director of Batman Forever and Batman & Robin, was born on this day in 1939. He brought neon Gotham to life and forever shaped DC\'s campy legacy.' },
  '07-14': { type: 'release',  icon: '🎬', text: 'The Dark Knight (2008) opened in theaters on this day, grossing $158.4 million in its opening weekend — a record at the time. Heath Ledger\'s posthumous Oscar performance became legendary.' },
  '07-16': { type: 'birthday', icon: '🎂', text: 'Barry Keoghan was born on this day in 1992. His cameo as the Joker in The Batman (2022) was one of cinema\'s most talked-about reveals.' },
  '07-20': { type: 'event',    icon: '🦇', text: 'The Dark Knight Rises premiered in New York on this day in 2012, completing Christopher Nolan\'s Batman trilogy and delivering the franchise\'s most emotionally charged conclusion.' },
  '07-22': { type: 'bts',      icon: '🎬', text: 'Zack Snyder\'s Justice League was 4 hours and 2 minutes long — the longest theatrical DC film ever. Snyder shot an additional 2.5 hours of new footage for the Snyder Cut.' },
  '07-26': { type: 'birthday', icon: '🎂', text: 'Sandra Bullock was born on this day in 1964. She was considered for multiple DC roles over the years, including an early iteration of Harley Quinn.' },

  // ── AUGUST ───────────────────────────────────────────────────────────────
  '08-02': { type: 'birthday', icon: '🎂', text: 'Sam Worthington was born on this day in 1976. He was one of the final candidates to play Superman in Man of Steel before Henry Cavill was chosen.' },
  '08-05': { type: 'release',  icon: '🎬', text: 'Suicide Squad opened in theaters on this day in 2016, earning $133 million domestically in its opening weekend despite polarizing reviews.' },
  '08-06': { type: 'birthday', icon: '🎂', text: 'Robin Williams was born on this day in 1951. He was Tim Burton\'s first choice to play the Joker in Batman (1989) before the role went to Jack Nicholson.' },
  '08-10': { type: 'bts',      icon: '🎬', text: 'The Joker\'s "Why so serious?" improvised scene in The Dark Knight originated from a rejected Batman Begins rehearsal. Nolan repurposed the improvised moment for the sequel.' },
  '08-13': { type: 'release',  icon: '🎬', text: 'Batman (1989) became the first film to open to $40 million in a single weekend — setting a box office record and proving superhero films could be blockbusters.' },
  '08-17': { type: 'birthday', icon: '🎂', text: 'Robert De Niro was born on this day in 1943. He was offered the role of Harvey Dent in Batman Forever but turned it down.' },
  '08-22': { type: 'bts',      icon: '🎬', text: 'The Bat-Signal in Batman (1989) was a practical set piece — a 90,000-watt searchlight that could actually be seen from miles away. Modern productions use digital effects instead.' },
  '08-28': { type: 'birthday', icon: '🎂', text: 'Jack Kirby was born on this day in 1917. Though primarily known for Marvel, he created New Gods and Darkseid for DC — characters central to the DCEU\'s larger mythology.' },

  // ── SEPTEMBER ────────────────────────────────────────────────────────────
  '09-03': { type: 'birthday', icon: '🎂', text: 'Kiefer Sutherland was born on this day in 1966. He was considered for Batman in the 1989 film but lost the role to Michael Keaton.' },
  '09-09': { type: 'bts',      icon: '🎬', text: 'The Joker in Joker (2019) was originally a Batman villain — but Todd Phillips pitched the film as a standalone origin story, not connected to any existing Batman continuity.' },
  '09-14': { type: 'birthday', icon: '🎂', text: 'Ben Affleck (Batman / Bruce Wayne) was born on this day in 1972 in Berkeley, California. His casting was initially controversial, but many fans now regard his Bruce Wayne as definitive.' },
  '09-15': { type: 'comic',    icon: '📖', text: 'Harley Quinn first appeared in the Batman: The Animated Series episode "Joker\'s Favor" in September 1992 — created by Paul Dini and Bruce Timm as a one-off character who became iconic.' },
  '09-16': { type: 'birthday', icon: '🎂', text: 'Marc Guggenheim was born on this day in 1970. He was one of the co-creators of the Arrow TV series that launched the Arrowverse.' },
  '09-22': { type: 'bts',      icon: '🎬', text: 'The Batman\'s (2022) Batsuit was so heavy that Robert Pattinson could only wear it for 25 minutes at a time. The suit took 8 months and 90 craftspeople to create.' },
  '09-25': { type: 'birthday', icon: '🎂', text: 'Will Smith (Deadshot in Suicide Squad) was born on this day in 1968 in Philadelphia. He left the franchise before The Suicide Squad.' },

  // ── OCTOBER ──────────────────────────────────────────────────────────────
  '10-01': { type: 'bts',      icon: '🎬', text: 'Man of Steel\'s cinematographer Amir Mokri used handheld cameras and documentary-style shooting to give Superman\'s first flight a raw, grounded feel — unprecedented for a superhero film.' },
  '10-04': { type: 'release',  icon: '🎬', text: 'Joker (2019) opened in theaters on this day, ultimately earning over $1 billion worldwide — making Joaquin Phoenix the first DC solo-villain film to reach that milestone.' },
  '10-05': { type: 'birthday', icon: '🎂', text: 'Kate Winslet was born on this day in 1975. She was considered for Harley Quinn before Margot Robbie was cast in the Suicide Squad.' },
  '10-10': { type: 'birthday', icon: '🎂', text: 'Peter Capaldi was born on this day in 1958. He played a significant role in The Suicide Squad as Thinker.' },
  '10-11': { type: 'birthday', icon: '🎂', text: 'Luke Perry was born on this day in 1966. He voiced Harvey Dent in the Batman animated feature film productions of the 1990s.' },
  '10-14': { type: 'bts',      icon: '🎬', text: 'The Wonder Woman "No Man\'s Land" sequence was almost cut from the film — Patty Jenkins fought to keep it in. It went on to be considered one of the greatest superhero moments in cinema history.' },
  '10-19': { type: 'birthday', icon: '🎂', text: 'Jon Favreau, who directed Iron Man but also exec-produced DC-adjacent projects, was born on this day in 1966. He almost directed a Superman film in the early 2000s.' },
  '10-21': { type: 'event',    icon: '🌟', text: 'On this day in 2015, James Gunn (who would go on to direct The Suicide Squad and lead DC Studios) was still working at Marvel. His future move to DC would reshape an entire superhero universe.' },
  '10-23': { type: 'birthday', icon: '🎂', text: 'Ryan Reynolds was born on this day in 1976. He appeared in Green Lantern (2011) — DC\'s most criticized casting, which Reynolds himself has made a career of joking about.' },

  // ── NOVEMBER ─────────────────────────────────────────────────────────────
  '11-02': { type: 'birthday', icon: '🎂', text: 'David Oyelowo was born on this day in 1976. He has voiced multiple DC characters in animated productions and was considered for several DCU roles.' },
  '11-05': { type: 'release',  icon: '🎬', text: 'Batman Forever (1995) opened in theaters on this day, earning $53 million in its opening weekend — proving audiences would accept a new Batman after Michael Keaton departed.' },
  '11-08': { type: 'birthday', icon: '🎂', text: 'Jack Kirby — who created New Gods, Darkseid, and the Fourth World saga for DC Comics in the 1970s —\'s work directly inspired Zack Snyder\'s DCEU villain arc.' },
  '11-10': { type: 'birthday', icon: '🎂', text: 'Ellen Pompeo was born on this day in 1969. She was screen-tested for Lois Lane in Man of Steel before Amy Adams was cast.' },
  '11-16': { type: 'release',  icon: '🎬', text: 'Justice League (2017) opened in theaters on this day — the first time Superman, Batman, Wonder Woman, Aquaman, The Flash, and Cyborg appeared together on the big screen.' },
  '11-20': { type: 'bts',      icon: '🎬', text: 'Henry Cavill\'s mustache became a $25 million problem when Justice League reshoots clashed with Mission: Impossible 6 filming. Paramount refused to let him shave it, forcing digital removal that became infamous.' },
  '11-22': { type: 'birthday', icon: '🎂', text: 'Mark Ruffalo was born on this day in 1967. Before his MCU role, he was briefly considered for Batman in Nolan\'s trilogy.' },
  '11-29': { type: 'birthday', icon: '🎂', text: 'Joel Edgerton was born on this day in 1974. He played Officer Jim Gordon in Gotham City\'s prequel film Gotham (2014 pilot).' },

  // ── DECEMBER ─────────────────────────────────────────────────────────────
  '12-01': { type: 'bts',      icon: '🎬', text: 'The production of Batman (1989) was so secretive that even the film\'s title was kept under wraps during shooting — listed in production records simply as "Production 0001."' },
  '12-05': { type: 'birthday', icon: '🎂', text: 'Batista was born on this day in 1969. Before joining Marvel as Drax, he auditioned for multiple DC roles and has expressed interest in playing Bane.' },
  '12-13': { type: 'release',  icon: '🎬', text: 'Aquaman (2018) opened in theaters on this day, going on to earn $1.148 billion worldwide — the highest-grossing DCEU film ever.' },
  '12-14': { type: 'birthday', icon: '🎂', text: 'Vanessa Hudgens was born on this day in 1988. She played Naomi McDuffie\'s friend in the DC series Naomi.' },
  '12-16': { type: 'bts',      icon: '🎬', text: 'Wonder Woman (2017) production lasted 106 days across the UK, Italy, and France. Gal Gadot was five months pregnant for some of the reshoots — production digitally removed her baby bump.' },
  '12-19': { type: 'release',  icon: '🎬', text: 'The Dark Knight Rises (2012) entered post-production on this day in 2011. Nolan locked himself in the editing suite for months to craft the trilogy\'s emotional finale.' },
  '12-21': { type: 'birthday', icon: '🎂', text: 'Samuel L. Jackson was born on this day in 1948. While he plays Nick Fury in Marvel, he was offered a role in the early DC Cinematic Universe but chose to stay with MCU.' },
  '12-26': { type: 'comic',    icon: '📖', text: 'Batman: The Killing Joke was published in 1988 — Alan Moore\'s seminal story exploring the relationship between Batman and the Joker remains the most influential single DC comic.' },
}

// ── Fallback DC general facts pool ──────────────────────────────────────────
export const DC_GENERAL_FACTS = [
  { icon: '🦇', text: 'The Dark Knight (2008) is the only superhero film to have been nominated for a Best Picture Oscar at the Academy Awards — though it was controversially left off the final list, leading to rule changes.' },
  { icon: '⚡', text: 'Superman\'s "S" shield is not actually the letter S — in Man of Steel, it is revealed to be the Kryptonian symbol for Hope.' },
  { icon: '🃏', text: 'Heath Ledger won the Academy Award for Best Supporting Actor posthumously for The Dark Knight in 2009 — the first superhero film performance to win a major acting Oscar.' },
  { icon: '🌊', text: 'Aquaman (2018) earned more than $1.1 billion worldwide — outgrossing every other DCEU film including Justice League and Man of Steel combined.' },
  { icon: '👑', text: 'Wonder Woman (2017) was the first major superhero film directed by a woman. Patty Jenkins had been trying to make a Wonder Woman film for over a decade.' },
  { icon: '🎭', text: 'The Joker has been played by more actors in film than any other comic book villain: Cesar Romero, Jack Nicholson, Heath Ledger, Jared Leto, Joaquin Phoenix, and Barry Keoghan.' },
  { icon: '🦸', text: 'Michael Keaton\'s Batman was the first superhero film to gross over $400 million worldwide — in 1989, that was an unprecedented box office achievement.' },
  { icon: '🌑', text: 'The Batman (2022) is the darkest — literally — major superhero film ever made. Cinematographer Greig Fraser set a record for the lowest average light level in a major blockbuster production.' },
  { icon: '🏛️', text: 'Gotham City was inspired by New York. Metropolis was inspired by Toronto. DC\'s two signature cities were each designed to represent different aspects of American urban life.' },
  { icon: '📺', text: 'The Arrowverse on The CW ran for over a decade — comprising Arrow, The Flash, Supergirl, Legends of Tomorrow, Batwoman, and Black Lightning. It\'s the longest-running shared superhero TV universe.' },
  { icon: '🎬', text: 'Zack Snyder\'s Justice League is 4 hours and 2 minutes long — the longest DC film ever made. It was released directly on HBO Max and had no theatrical run in most countries.' },
  { icon: '🔵', text: 'The first DC superhero film with a Black lead was Steel (1997) starring Shaquille O\'Neal. The next major Black DC lead wouldn\'t come until Black Adam (2022) with Dwayne Johnson.' },
  { icon: '💛', text: 'Kryptonite first appeared not in the comics but on the Superman radio show in 1943 — created as a plot device to allow actors other than Bud Collyer to fill in when he needed time off.' },
  { icon: '🌟', text: 'James Gunn became co-CEO of DC Studios in 2022 alongside Peter Safran — the first time a director of a major superhero franchise took executive control over an entire studio universe.' },
  { icon: '🦸‍♀️', text: 'Gal Gadot was 30 years old when Wonder Woman (2017) was released — making her portrayal of Diana Prince one of the most celebrated superhero performances of the decade.' },
  { icon: '🤝', text: 'The first time Batman and Superman met on screen was in Batman v Superman: Dawn of Justice (2016) — 78 years after both characters were separately created.' },
  { icon: '🎵', text: 'Hans Zimmer\'s cello motif for Wonder Woman in Batman v Superman became instantly iconic — the growling electric cello was described as "all the passion and fury of a Valkyrie on a mission."' },
  { icon: '🕶️', text: 'Ben Affleck\'s Batman is the oldest live-action Batman — his Bruce Wayne was 45 during the events of Batman v Superman, the most experienced version of the character.' },
  { icon: '🔥', text: 'Peacemaker (2022) achieved a 94% approval rating on Rotten Tomatoes — the highest-rated DC live-action series ever, surpassing even the most acclaimed Arrowverse shows.' },
  { icon: '💙', text: 'Superman\'s costume in Man of Steel had no red underwear — a deliberate choice by Zack Snyder to modernize the look that sparked enormous fan debate.' },
  { icon: '🌍', text: 'DC Comics was founded in 1934 as National Allied Publications — it predates Marvel Comics by over 25 years, making DC the oldest continuous superhero publisher in history.' },
  { icon: '🦅', text: 'Birds of Prey (2020) was the first R-rated solo DC film following Joker — and the first DC film with a female director (Cathy Yan) for an R-rated production.' },
  { icon: '🧬', text: 'The Suicide Squad (2021) was James Gunn\'s first DC film after leaving Marvel. He was fired from Guardians Vol. 3, then hired by DC, then rehired by Marvel — all within 18 months.' },
  { icon: '🏅', text: 'Wonder Woman 1984 was the first major Hollywood blockbuster to premiere simultaneously on streaming (HBO Max) and in theaters globally — a pandemic-era decision that changed the industry.' },
  { icon: '🎯', text: 'Deadshot never misses a shot in the comics. Will Smith\'s portrayal in Suicide Squad maintained this rule — every bullet fired by Floyd Lawton hits its intended target.' },
  { icon: '🌊', text: 'Mera\'s costume in Aquaman was made from over 10,000 hand-applied green scales — it took three people six weeks to construct the full suit for Amber Heard.' },
  { icon: '🔴', text: 'The Flash\'s Speed Force was depicted differently in the 2023 film than in any prior version — showing the speed dimension as a fragile, multiverse-shattering phenomenon.' },
  { icon: '🏙️', text: 'Christopher Nolan used real Chicago architecture for Gotham City in The Dark Knight and Rises — avoiding studio sets entirely for a grounded urban realism.' },
  { icon: '🌙', text: 'Blue Beetle (2023) was the first DC film with a Latino lead and a predominantly Latino cast — a historic milestone for superhero representation in Hollywood.' },
  { icon: '⚫', text: 'Black Adam had the longest gestation period of any DCEU film — Dwayne Johnson was first cast as the character in 2007, but the film didn\'t release until 2022, 15 years later.' },
]

/**
 * Get a "Today in DC" entry for a given date string (YYYY-MM-DD).
 * Returns a specific calendar entry if one exists, or a deterministic
 * general fact based on the day of the year.
 */
export function getTodayInDC(dateStr) {
  const [, mm, dd] = dateStr.split('-')
  const key = `${mm}-${dd}`
  if (DC_CALENDAR[key]) return { ...DC_CALENDAR[key], isSpecific: true, dateKey: key }

  // Deterministic fallback: hash the full date to pick from general pool
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  const fact = DC_GENERAL_FACTS[hash % DC_GENERAL_FACTS.length]
  return { ...fact, isSpecific: false, dateKey: key }
}
