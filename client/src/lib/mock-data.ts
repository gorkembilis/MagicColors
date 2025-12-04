import animalsCover from "@assets/generated_images/cute_animals_coloring_pack_cover.png";
import carsCover from "@assets/generated_images/cool_cars_coloring_pack_cover.png";
import fruitsCover from "@assets/generated_images/cute_fruits_coloring_pack_cover.png";
import dinosCover from "@assets/generated_images/cute_dinosaurs_coloring_pack_cover.png";
import princessCover from "@assets/generated_images/princess_coloring_pack_cover.png";
import spaceCover from "@assets/generated_images/space_coloring_pack_cover.png";

// New detailed images
import lionImg from "@assets/generated_images/lion_coloring_page.png";
import elephantImg from "@assets/generated_images/elephant_coloring_page.png";
import raceCarImg from "@assets/generated_images/race_car_coloring_page.png";
import truckImg from "@assets/generated_images/truck_coloring_page.png";
import appleImg from "@assets/generated_images/apple_coloring_page.png";
import bananaImg from "@assets/generated_images/banana_coloring_page.png";
import trexImg from "@assets/generated_images/trex_coloring_page.png";
import stegoImg from "@assets/generated_images/stegosaurus_coloring_page.png";
import castleImg from "@assets/generated_images/princess_castle_coloring_page.png";
import rocketImg from "@assets/generated_images/rocket_coloring_page.png";

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

const createImages = (packId: string, packTitle: string, specificImages: string[], count: number) => {
  const images: PackImage[] = [];
  // First add specific images
  specificImages.forEach((url, index) => {
    images.push({
      id: `${packId}-${index + 1}`,
      url: url,
      title: `${packTitle} #${index + 1}`
    });
  });
  
  // Fill the rest with cycling specific images to reach count
  for (let i = specificImages.length; i < count; i++) {
    images.push({
      id: `${packId}-${i + 1}`,
      url: specificImages[i % specificImages.length],
      title: `${packTitle} #${i + 1}`
    });
  }
  return images;
};

export const packs: Pack[] = [
  {
    id: "animals",
    title: "Cute Animals",
    cover: animalsCover,
    isPremium: false,
    count: 10,
    images: createImages("animals", "Cute Animals", [animalsCover, lionImg, elephantImg], 10)
  },
  {
    id: "cars",
    title: "Cool Cars",
    cover: carsCover,
    isPremium: false,
    count: 10,
    images: createImages("cars", "Cool Cars", [carsCover, raceCarImg, truckImg], 10)
  },
  {
    id: "fruits",
    title: "Yummy Fruits",
    cover: fruitsCover,
    isPremium: false,
    count: 10,
    images: createImages("fruits", "Yummy Fruits", [fruitsCover, appleImg, bananaImg], 10)
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: dinosCover,
    isPremium: false,
    count: 10,
    images: createImages("dinos", "Dino World", [dinosCover, trexImg, stegoImg], 10)
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: princessCover,
    isPremium: true,
    count: 15,
    images: createImages("princess", "Princess Castle", [princessCover, castleImg], 15)
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: spaceCover,
    isPremium: true,
    count: 12,
    images: createImages("space", "Space Explorer", [spaceCover, rocketImg], 12)
  },
  {
    id: "pokemon",
    title: "Poke-Style",
    cover: "https://images.unsplash.com/photo-1613771404721-c5b425876d64?q=80&w=500&auto=format&fit=crop",
    isPremium: true,
    count: 20,
    images: createImages("pokemon", "Poke-Style", ["https://images.unsplash.com/photo-1613771404721-c5b425876d64?q=80&w=500&auto=format&fit=crop"], 20)
  },
  {
    id: "superhero",
    title: "Super Heroes",
    cover: "https://images.unsplash.com/photo-1568833450051-15f9b2a97908?q=80&w=500&auto=format&fit=crop",
    isPremium: true,
    count: 10,
    images: createImages("superhero", "Super Heroes", ["https://images.unsplash.com/photo-1568833450051-15f9b2a97908?q=80&w=500&auto=format&fit=crop"], 10)
  }
];

export const generatedHistory = [
  {
    id: "gen-1",
    prompt: "A flying cat with wings",
    url: animalsCover,
    date: "2 mins ago"
  }
];
