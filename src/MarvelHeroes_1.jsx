import { useState } from "react";

const heroes = [
  { name: "Iron Man", alt: "Tony Stark", titles: 9, time: "~5h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/346-iron-man.jpg" },
  { name: "Captain America", alt: "Steve Rogers", titles: 7, time: "~4h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/149-captain-america.jpg" },
  { name: "Thor", alt: "Thor Odinson", titles: 8, time: "~4h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/659-thor.jpg" },
  { name: "The Hulk", alt: "Bruce Banner", titles: 6, time: "~3h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/332-hulk.jpg" },
  { name: "Black Widow", alt: "Natasha Romanoff", titles: 8, time: "~4h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/107-black-widow.jpg" },
  { name: "Hawkeye", alt: "Clint Barton", titles: 4, time: "~2h 15m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/309-hawkeye.jpg" },
  { name: "Spider-Man", alt: "Peter Parker", titles: 4, time: "~2h 40m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/620-spider-man.jpg" },
  { name: "Doctor Strange", alt: "Stephen Strange", titles: 2, time: "~1h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/228-doctor-strange.jpg" },
  { name: "Black Panther", alt: "T'Challa", titles: 2, time: "~1h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/105-black-panther.jpg" },
  { name: "Captain Marvel", alt: "Carol Danvers", titles: 2, time: "~1h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/155-captain-marvel.jpg" },
  { name: "Scarlet Witch", alt: "Wanda Maximoff", titles: 5, time: "~3h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/578-scarlet-witch.jpg" },
  { name: "Vision", alt: "Vision", titles: 4, time: "~2h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/700-vision.jpg" },
  { name: "Captain America", alt: "Sam Wilson", titles: 6, time: "~3h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/570-sam-wilson.jpg" },
  { name: "Winter Soldier / White Wolf", alt: "Bucky Barnes", titles: 6, time: "~2h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/714-winter-soldier.jpg" },
  { name: "Ant-Man", alt: "Scott Lang", titles: 3, time: "~1h 40m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/44-ant-man.jpg" },
  { name: "Loki, God of Mischief", alt: "Loki Laufeyson", titles: 5, time: "~3h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/412-loki.jpg" },
  { name: "Star-Lord", alt: "Peter Quill", titles: 5, time: "~2h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/625-star-lord.jpg" },
  { name: "Gamora", alt: "Gamora", titles: 4, time: "~2h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/270-gamora.jpg" },
  { name: "Rocket Raccoon", alt: "Subject 89P13", titles: 3, time: "~1h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/559-rocket-raccoon.jpg" },
  { name: "Groot", alt: "Groot", titles: 3, time: "~1h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/303-groot.jpg" },
  { name: "Drax", alt: "Drax the Destroyer", titles: 3, time: "~1h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/231-drax.jpg" },
  { name: "Nebula", alt: "Nebula", titles: 3, time: "~1h 25m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/473-nebula.jpg" },
  { name: "The Mad Titan", alt: "Thanos", titles: 3, time: "~1h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/655-thanos.jpg" },
  { name: "Ultron", alt: "Ultron", titles: 1, time: "~1h 05m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/688-ultron.jpg" },
  { name: "Red Skull", alt: "Johann Schmidt", titles: 1, time: "~0h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/549-red-skull.jpg" },
  { name: "Hela, Goddess of Death", alt: "Hela Odinsdottir", titles: 1, time: "~0h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/316-hela.jpg" },
  { name: "Erik Killmonger", alt: "N'Jadaka / Erik Stevens", titles: 1, time: "~0h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/364-killmonger.jpg" },
  { name: "The Vulture", alt: "Adrian Toomes", titles: 1, time: "~0h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/699-vulture.jpg" },
  { name: "Mysterio", alt: "Quentin Beck", titles: 1, time: "~0h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/463-mysterio.jpg" },
  { name: "Kang the Conqueror", alt: "Nathaniel Richards", titles: 1, time: "~0h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/369-kang.jpg" },
  { name: "Gorr the God Butcher", alt: "Gorr", titles: 1, time: "~0h 40m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/298-gorr.jpg" },
  { name: "Dormammu", alt: "Dormammu", titles: 1, time: "~0h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/229-dormammu.jpg" },
  { name: "Namor", alt: "Namor / Kukulkan", titles: 1, time: "~0h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/474-namor.jpg" },
  { name: "Kingpin", alt: "Wilson Fisk", titles: 1, time: "~1h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/383-kingpin.jpg" },
  { name: "Baron Zemo", alt: "Helmut Zemo", titles: 1, time: "~0h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/79-baron-zemo.jpg" },
  { name: "Green Goblin", alt: "Norman Osborn", titles: 1, time: "~0h 45m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/302-green-goblin.jpg" },
  { name: "Deadpool", alt: "Wade Wilson", titles: 3, time: "~2h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/213-deadpool.jpg" },
  { name: "Wolverine / Logan", alt: "James 'Logan' Howlett", titles: 2, time: "~1h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/717-wolverine.jpg" },
  { name: "Professor X", alt: "Charles Xavier", titles: 1, time: "~0h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/543-professor-x.jpg" },
  { name: "Daredevil", alt: "Matt Murdock", titles: 1, time: "~1h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/206-daredevil.jpg" },
  { name: "Shuri / Black Panther", alt: "Shuri", titles: 2, time: "~1h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/607-shuri.jpg" },
  { name: "Nick Fury", alt: "Nick Fury", titles: 8, time: "~2h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/479-nick-fury.jpg" },
  { name: "Valkyrie", alt: "Brunnhilde", titles: 2, time: "~1h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/693-valkyrie.jpg" },
  { name: "Blade, the Daywalker", alt: "Eric Brooks", titles: 3, time: "~1h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/108-blade.jpg" },
  { name: "Hawkeye", alt: "Kate Bishop", titles: 1, time: "~0h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/720-kate-bishop.jpg" },
  { name: "Black Widow", alt: "Yelena Belova", titles: 3, time: "~1h 30m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/721-yelena-belova.jpg" },
  { name: "Moon Knight / Mr. Knight", alt: "Marc Spector / Steven Grant", titles: 1, time: "~0h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/722-moon-knight.jpg" },
  { name: "Ms. Marvel", alt: "Kamala Khan", titles: 1, time: "~0h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/723-ms-marvel.jpg" },
  { name: "Sorcerer Supreme", alt: "Wong", titles: 2, time: "~1h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/718-wong.jpg" },
  { name: "Okoye", alt: "Okoye", titles: 2, time: "~1h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/719-okoye.jpg" },
];

function HeroCard({ hero }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: 12,
      overflow: "hidden",
    }}>
      <div style={{ width: "100%", height: 140, overflow: "hidden", background: "#111" }}>
        {imgError ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 36, color: "#444" }}>?</span>
          </div>
        ) : (
          <img
            src={hero.img}
            alt={hero.name}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>{hero.name}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{hero.alt}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#555" }}>{hero.titles} {hero.titles === 1 ? "title" : "titles"}</span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#60a5fa",
            background: "rgba(59,130,246,0.15)",
            padding: "2px 8px",
            borderRadius: 20,
          }}>
            {hero.time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MarvelHeroes() {
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}>
        {heroes.map((hero, i) => (
          <HeroCard key={i} hero={hero} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#444", marginTop: 20, textAlign: "center" }}>
        Data provided by Marvel. © 2024 MARVEL
      </div>
    </div>
  );
}
