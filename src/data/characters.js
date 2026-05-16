// characters.js — character rosters per title and reverse lookups

export const CHARACTERS = {
  1: ['Blade', 'Abraham Whistler', 'Quinn', 'Deacon Frost'],
  2: ['Blade', 'Abraham Whistler', 'Nyssa', 'Reinhardt', 'Scud'],
  3: ['Blade', 'Hannibal King', 'Abigail Whistler', 'Drake', 'Danica Talos'],
  14: ['Deadpool', 'Vanessa', 'Weasel', 'Negasonic Teenage Warhead', 'Colossus', 'Ajax'],
  15: ['Deadpool', 'Cable', 'Domino', 'Vanessa', 'Firefist', 'Colossus', 'Weasel'],
  16: ['Wolverine', 'Charles Xavier', 'X-23', 'Caliban', 'Donald Pierce'],
  17: ['Steve Rogers', 'Bucky Barnes', 'Peggy Carter', 'Howard Stark', 'Red Skull', 'Nick Fury'],
  20: ['Carol Danvers', 'Nick Fury', 'Maria Rambeau', 'Ronan', 'Talos', 'Yon-Rogg'],
  21: ['Tony Stark', 'Pepper Potts', 'James Rhodes', 'Obadiah Stane', 'Nick Fury', 'Happy Hogan'],
  22: ['Tony Stark', 'Pepper Potts', 'James Rhodes', 'Nick Fury', 'Black Widow', 'Justin Hammer'],
  23: ['Bruce Banner', 'Betty Ross', 'Thaddeus Ross', 'Abomination', 'Samuel Sterns'],
  24: ['Thor', 'Loki', 'Jane Foster', 'Odin', 'Heimdall', 'Sif', 'Nick Fury'],
  25: ['Tony Stark', 'Steve Rogers', 'Thor', 'Bruce Banner', 'Black Widow', 'Hawkeye', 'Nick Fury', 'Loki'],
  26: ['Tony Stark', 'Pepper Potts', 'James Rhodes', 'Aldrich Killian', 'Happy Hogan'],
  27: ['Thor', 'Loki', 'Jane Foster', 'Odin', 'Malekith', 'Heimdall'],
  28: ['Steve Rogers', 'Black Widow', 'Nick Fury', 'Sam Wilson', 'Bucky Barnes', 'Alexander Pierce'],
  30: ['Peter Quill', 'Gamora', 'Rocket', 'Groot', 'Drax', 'Ronan', 'Yondu', 'Thanos'],
  31: ['Peter Quill', 'Gamora', 'Rocket', 'Groot', 'Drax', 'Nebula', 'Yondu', 'Ego'],
  32: ['Tony Stark', 'Steve Rogers', 'Thor', 'Bruce Banner', 'Black Widow', 'Hawkeye', 'Ultron', 'Vision', 'Scarlet Witch', 'Quicksilver'],
  33: ['Scott Lang', 'Hank Pym', 'Hope Van Dyne', 'Darren Cross', 'Luis'],
  40: ['Steve Rogers', 'Tony Stark', 'Bucky Barnes', 'Black Widow', 'Sam Wilson', 'Black Panther', 'Spider-Man', 'Scarlet Witch', 'Vision', 'Hawkeye', 'Ant-Man', 'War Machine', 'Zemo'],
  41: ['Black Widow', 'Yelena Belova', 'Alexei Shostakov', 'Melina Vostokoff', 'Dreykov', 'Rick Mason'],
  42: ['Black Panther', 'Shuri', 'Okoye', 'Nakia', 'Ramonda', 'Erik Killmonger', 'MBaku', 'Ulysses Klaue'],
  43: ['Peter Parker', 'Tony Stark', 'Happy Hogan', 'Aunt May', 'Ned Leeds', 'Vulture', 'Michelle Jones'],
  44: ['Stephen Strange', 'Christine Palmer', 'Wong', 'Ancient One', 'Karl Mordo', 'Dormammu'],
  45: ['Thor', 'Loki', 'Bruce Banner', 'Valkyrie', 'Hela', 'Grandmaster', 'Heimdall'],
  46: ['Scott Lang', 'Hope Van Dyne', 'Hank Pym', 'Ghost', 'Bill Foster', 'Luis'],
  47: ['Tony Stark', 'Steve Rogers', 'Thor', 'Bruce Banner', 'Black Widow', 'Peter Parker', 'Thanos', 'Gamora', 'Doctor Strange', 'Peter Quill', 'Scarlet Witch', 'Vision', 'Sam Wilson', 'Bucky Barnes'],
  48: ['Tony Stark', 'Steve Rogers', 'Thor', 'Bruce Banner', 'Black Widow', 'Hawkeye', 'Scott Lang', 'Nebula', 'James Rhodes', 'Sam Wilson', 'Thanos', 'Captain Marvel', 'Pepper Potts'],
  49: ['Loki', 'Sylvie', 'Mobius', 'Ravonna Renslayer', 'Kang', 'Hunter B-15'],
  50: ['Scarlet Witch', 'Vision', 'Agatha Harkness', 'Jimmy Woo', 'Darcy Lewis', 'Monica Rambeau', 'White Vision'],
  51: ['Sam Wilson', 'Bucky Barnes', 'Sharon Carter', 'Baron Zemo', 'John Walker', 'Karli Morgenthau'],
  52: ['Clint Barton', 'Kate Bishop', 'Yelena Belova', 'Lucky', 'Kingpin', 'Maya Lopez'],
  54: ['Shang-Chi', 'Katy', 'Xu Xialing', 'Wenwu', 'Trevor Slattery', 'Abomination'],
  55: ['Sersi', 'Ikaris', 'Thena', 'Gilgamesh', 'Ajak', 'Sprite', 'Kingo', 'Phastos', 'Makkari', 'Druig'],
  56: ['Peter Parker', 'Michelle Jones', 'Nick Fury', 'Happy Hogan', 'Mysterio', 'Ned Leeds'],
  57: ['Peter Parker', 'Michelle Jones', 'Ned Leeds', 'Doctor Strange', 'Aunt May', 'Green Goblin', 'Doctor Octopus', 'Electro', 'Matt Murdock'],
  58: ['Stephen Strange', 'Scarlet Witch', 'America Chavez', 'Wong', 'Christine Palmer', 'Mordo'],
  59: ['Marc Spector', 'Steven Grant', 'Layla El-Faouly', 'Arthur Harrow', 'Khonshu'],
  60: ['Kamala Khan', 'Bruno Carrelli', 'Nakia Bahadir', 'Captain Marvel', 'Najma'],
  62: ['Thor', 'Jane Foster', 'Valkyrie', 'Korg', 'Gorr the God Butcher', 'Zeus', 'Peter Quill'],
  63: ['Shuri', 'Ramonda', 'Okoye', 'Nakia', 'MBaku', 'Namor', 'Riri Williams', 'Everett Ross'],
  67: ['Peter Quill', 'Gamora', 'Rocket', 'Groot', 'Drax', 'Nebula', 'Mantis', 'High Evolutionary', 'Adam Warlock'],
  70: ['Deadpool', 'Wolverine', 'Vanessa', 'Cassandra Nova', 'Lady Deadpool'],
  71: ['Agatha Harkness', 'Jennifer Kale', 'Lilia Calderu', 'Joe Machinegun', 'Alice'],
  77: ['Sam Wilson', 'Joaquin Torres', 'Isaiah Bradley', 'Thaddeus Ross', 'Sidewinder'],
  80: ['Yelena Belova', 'Ghost', 'US Agent', 'Taskmaster', 'Red Guardian', 'Bucky Barnes'],
  81: ['Reed Richards', 'Sue Storm', 'Human Torch', 'The Thing', 'Galactus', 'Silver Surfer'],
}

export const CHARACTER_TITLES = (() => {
  const map = {}
  for (const [titleId, chars] of Object.entries(CHARACTERS)) {
    for (const char of chars) {
      if (!map[char]) map[char] = []
      map[char].push(Number(titleId))
    }
  }
  return map
})()

export const ALL_CHARACTERS = Object.keys(CHARACTER_TITLES).sort()
