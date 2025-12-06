import colorfulLionImg from "@assets/generated_images/colorful_cartoon_lion.png";
import colorfulElephantImg from "@assets/generated_images/colorful_elephant.png";
import colorfulGiraffeImg from "@assets/generated_images/colorful_giraffe.png";
import colorfulMonkeyImg from "@assets/generated_images/colorful_monkey.png";

import colorfulRacingCarImg from "@assets/generated_images/colorful_racing_car.png";
import colorfulFireTruckImg from "@assets/generated_images/colorful_fire_truck.png";
import colorfulHelicopterImg from "@assets/generated_images/colorful_helicopter.png";
import colorfulSchoolBusImg from "@assets/generated_images/colorful_school_bus.png";

import colorfulFruitsImg from "@assets/generated_images/colorful_fruits.png";
import colorfulStrawberryImg from "@assets/generated_images/colorful_strawberry.png";
import colorfulBananasImg from "@assets/generated_images/colorful_bananas.png";
import colorfulWatermelonImg from "@assets/generated_images/colorful_watermelon.png";

import colorfulDinosaurImg from "@assets/generated_images/colorful_dinosaur.png";
import colorfulTriceratopsImg from "@assets/generated_images/colorful_triceratops.png";

import colorfulPrincessImg from "@assets/generated_images/colorful_princess.png";
import colorfulUnicornImg from "@assets/generated_images/colorful_unicorn.png";

import colorfulSpaceImg from "@assets/generated_images/colorful_space_scene.png";
import colorfulAstronautImg from "@assets/generated_images/colorful_astronaut.png";

export type PuzzleDifficulty = "easy" | "medium" | "hard";

export interface PuzzleImage {
  id: string;
  title: string;
  url: string;
}

export interface PuzzlePack {
  id: string;
  cover: string;
  count: number;
  difficulty: PuzzleDifficulty;
  isPremium: boolean;
  images: PuzzleImage[];
}

export const puzzlePacks: PuzzlePack[] = [
  {
    id: "puzzle-animals",
    cover: colorfulLionImg,
    count: 4,
    difficulty: "easy",
    isPremium: false,
    images: [
      { id: "puzzle-lion", title: "Lion", url: colorfulLionImg },
      { id: "puzzle-elephant", title: "Elephant", url: colorfulElephantImg },
      { id: "puzzle-giraffe", title: "Giraffe", url: colorfulGiraffeImg },
      { id: "puzzle-monkey", title: "Monkey", url: colorfulMonkeyImg },
    ],
  },
  {
    id: "puzzle-vehicles",
    cover: colorfulRacingCarImg,
    count: 4,
    difficulty: "easy",
    isPremium: false,
    images: [
      { id: "puzzle-racing-car", title: "Racing Car", url: colorfulRacingCarImg },
      { id: "puzzle-fire-truck", title: "Fire Truck", url: colorfulFireTruckImg },
      { id: "puzzle-helicopter", title: "Helicopter", url: colorfulHelicopterImg },
      { id: "puzzle-school-bus", title: "School Bus", url: colorfulSchoolBusImg },
    ],
  },
  {
    id: "puzzle-fruits",
    cover: colorfulFruitsImg,
    count: 4,
    difficulty: "easy",
    isPremium: false,
    images: [
      { id: "puzzle-fruits-mix", title: "Fruit Mix", url: colorfulFruitsImg },
      { id: "puzzle-strawberry", title: "Strawberry", url: colorfulStrawberryImg },
      { id: "puzzle-bananas", title: "Bananas", url: colorfulBananasImg },
      { id: "puzzle-watermelon", title: "Watermelon", url: colorfulWatermelonImg },
    ],
  },
  {
    id: "puzzle-dinos",
    cover: colorfulDinosaurImg,
    count: 2,
    difficulty: "medium",
    isPremium: false,
    images: [
      { id: "puzzle-trex", title: "T-Rex", url: colorfulDinosaurImg },
      { id: "puzzle-triceratops", title: "Triceratops", url: colorfulTriceratopsImg },
    ],
  },
  {
    id: "puzzle-princess",
    cover: colorfulPrincessImg,
    count: 2,
    difficulty: "medium",
    isPremium: true,
    images: [
      { id: "puzzle-princess", title: "Princess", url: colorfulPrincessImg },
      { id: "puzzle-unicorn", title: "Unicorn", url: colorfulUnicornImg },
    ],
  },
  {
    id: "puzzle-space",
    cover: colorfulSpaceImg,
    count: 2,
    difficulty: "hard",
    isPremium: true,
    images: [
      { id: "puzzle-space-scene", title: "Space Scene", url: colorfulSpaceImg },
      { id: "puzzle-astronaut", title: "Astronaut", url: colorfulAstronautImg },
    ],
  },
];
