export interface PackImage {
  id: string;
  url: string;
  title: string;
}

export interface Pack {
  id: string;
  title: string;
  cover: string;
  isPremium: boolean;
  count: number;
  images: PackImage[];
}

const createImages = (packId: string, packTitle: string, count: number): PackImage[] => {
  const images: PackImage[] = [];
  for (let i = 0; i < count; i++) {
    images.push({
      id: `${packId}-${i + 1}`,
      url: `https://via.placeholder.com/300x300/FFFFFF/000000?text=${packTitle}+${i + 1}`,
      title: `${packTitle} #${i + 1}`
    });
  }
  return images;
};

export const packs: Pack[] = [
  {
    id: "animals",
    title: "Cute Animals",
    cover: "https://via.placeholder.com/300x300/FFB6C1/000000?text=Animals",
    isPremium: false,
    count: 10,
    images: createImages("animals", "Animals", 10)
  },
  {
    id: "cars",
    title: "Cool Cars",
    cover: "https://via.placeholder.com/300x300/87CEEB/000000?text=Cars",
    isPremium: false,
    count: 10,
    images: createImages("cars", "Cars", 10)
  },
  {
    id: "fruits",
    title: "Yummy Fruits",
    cover: "https://via.placeholder.com/300x300/90EE90/000000?text=Fruits",
    isPremium: false,
    count: 10,
    images: createImages("fruits", "Fruits", 10)
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: "https://via.placeholder.com/300x300/DDA0DD/000000?text=Dinos",
    isPremium: false,
    count: 10,
    images: createImages("dinos", "Dinos", 10)
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: "https://via.placeholder.com/300x300/FFD700/000000?text=Princess",
    isPremium: true,
    count: 15,
    images: createImages("princess", "Princess", 15)
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: "https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Space",
    isPremium: true,
    count: 12,
    images: createImages("space", "Space", 12)
  },
  {
    id: "pokemon",
    title: "Poke-Style",
    cover: "https://via.placeholder.com/300x300/FFFF00/000000?text=Pokemon",
    isPremium: true,
    count: 20,
    images: createImages("pokemon", "Pokemon", 20)
  },
  {
    id: "superhero",
    title: "Super Heroes",
    cover: "https://via.placeholder.com/300x300/DC143C/FFFFFF?text=Heroes",
    isPremium: true,
    count: 10,
    images: createImages("superhero", "Heroes", 10)
  }
];
