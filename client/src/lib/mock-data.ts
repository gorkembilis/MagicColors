import animalsCover from "@assets/generated_images/cute_animals_coloring_pack_cover.png";
import carsCover from "@assets/generated_images/cool_cars_coloring_pack_cover.png";
import fruitsCover from "@assets/generated_images/cute_fruits_coloring_pack_cover.png";
import dinosCover from "@assets/generated_images/cute_dinosaurs_coloring_pack_cover.png";
import princessCover from "@assets/generated_images/princess_coloring_pack_cover.png";
import spaceCover from "@assets/generated_images/space_coloring_pack_cover.png";

export interface Pack {
  id: string;
  title: string;
  cover: string;
  isPremium: boolean;
  count: number;
}

export const packs: Pack[] = [
  {
    id: "animals",
    title: "Cute Animals",
    cover: animalsCover,
    isPremium: false,
    count: 10,
  },
  {
    id: "cars",
    title: "Cool Cars",
    cover: carsCover,
    isPremium: false,
    count: 10,
  },
  {
    id: "fruits",
    title: "Yummy Fruits",
    cover: fruitsCover,
    isPremium: false,
    count: 10,
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: dinosCover,
    isPremium: false,
    count: 10,
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: princessCover,
    isPremium: true,
    count: 15,
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: spaceCover,
    isPremium: true,
    count: 12,
  },
  {
    id: "pokemon",
    title: "Poke-Style",
    cover: "https://images.unsplash.com/photo-1613771404721-c5b425876d64?q=80&w=500&auto=format&fit=crop",
    isPremium: true,
    count: 20,
  },
  {
    id: "superhero",
    title: "Super Heroes",
    cover: "https://images.unsplash.com/photo-1568833450051-15f9b2a97908?q=80&w=500&auto=format&fit=crop",
    isPremium: true,
    count: 10,
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
