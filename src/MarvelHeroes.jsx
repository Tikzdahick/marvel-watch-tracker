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
  { name: "Ant-Man", alt: "Scott Lang", titles: 3, time: "~1h 40m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/44-ant-man.jpg" },
  { name: "Loki", alt: "Loki Laufeyson", titles: 5, time: "~3h 20m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/412-loki.jpg" },
  { name: "Star-Lord", alt: "Peter Quill", titles: 5, time: "~2h 55m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/625-star-lord.jpg" },
  { name: "Gamora", alt: "Gamora", titles: 4, time: "~2h 10m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/270-gamora.jpg" },
  { name: "Winter Soldier", alt: "Bucky Barnes", titles: 6, time: "~2h 50m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/714-winter-soldier.jpg" },
  { name: "Sam Wilson", alt: "Captain America", titles: 6, time: "~3h 00m", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/570-sam-wilson.jpg" },
];

const related = [
  { name: "Nick Fury", role: "Director, S.H.I.E.L.D.", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/479-nick-fury.jpg" },
  { name: "Pepper Potts", role: "CEO / Rescue", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/530-pepper-potts.jpg" },
  { name: "War Machine", role: "James Rhodes", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/706-war-machine.jpg" },
  { name: "Phil Coulson", role: "S.H.I.E.L.D. Agent", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/537-phil-coulson.jpg" },
  { name: "Thanos", role: "Primary Antagonist", img: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/655-thanos.jpg" },
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
      <div style={{ width: "100%", height: 140, overflow: "hidden", background: "#111", position: "relative" }}>
        {imgError ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 36, color: "#555" }}>?</span>
          </div>
        ) : (
          <img
            src={hero.img}
            alt={hero.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
          />
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{hero.name}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{hero.alt}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#666" }}>{hero.titles} titles</span>
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

function RelatedCard({ person }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: 10,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: 10,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#111", flexShrink: 0 }}>
        {imgError ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, color: "#555" }}>?</span>
          </div>
        ) : (
          <img
            src={person.img}
            alt={person.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        )}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff" }}>{person.name}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{person.role}</div>
      </div>
    </div>
  );
}

export default function MarvelHeroes() {
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 12,
      }}>
        Heroes
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}>
        {heroes.map((hero) => (
          <HeroCard key={hero.name + hero.alt} hero={hero} />
        ))}
      </div>

      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: "24px 0 12px",
      }}>
        Most Relevant People
      </div>

      <div style={{
        background: "#111",
        borderRadius: 12,
        padding: "14px 16px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 8,
        }}>
          {related.map((person) => (
            <RelatedCard key={person.name} person={person} />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, color: "#444", marginTop: 16, textAlign: "center" }}>
        Data provided by Marvel. © 2024 MARVEL
      </div>
    </div>
  );
}
