import animalsCover from "@assets/generated_images/colorful_animals_cover.png";
import carsCover from "@assets/generated_images/colorful_cars_cover.png";
import fruitsCover from "@assets/generated_images/colorful_fruits_cover.png";
import dinosCover from "@assets/generated_images/colorful_dinosaurs_cover.png";
import princessCover from "@assets/generated_images/colorful_princess_cover.png";
import spaceCover from "@assets/generated_images/colorful_space_cover.png";

// Animals
import lionImg from "@assets/generated_images/lion_coloring_page.png";
import elephantImg from "@assets/generated_images/elephant_coloring_page.png";
import monkeyImg from "@assets/generated_images/monkey_coloring_page.png";
import giraffeImg from "@assets/generated_images/giraffe_coloring_page.png";
import zebraImg from "@assets/generated_images/zebra_coloring_page.png";
import tigerImg from "@assets/generated_images/tiger_coloring_page.png";
import bearImg from "@assets/generated_images/bear_coloring_page.png";
import rabbitImg from "@assets/generated_images/rabbit_coloring_page.png";
import dogImg from "@assets/generated_images/dog_coloring_page.png";
import catImg from "@assets/generated_images/cat_coloring_page.png";

// Cars
import raceCarImg from "@assets/generated_images/race_car_coloring_page.png";
import truckImg from "@assets/generated_images/truck_coloring_page.png";
import policeCarImg from "@assets/generated_images/police_car_coloring_page.png";
import fireTruckImg from "@assets/generated_images/fire_truck_coloring_page.png";
import busImg from "@assets/generated_images/bus_coloring_page.png";
import tractorImg from "@assets/generated_images/tractor_coloring_page.png";
import motorcycleImg from "@assets/generated_images/motorcycle_coloring_page.png";
import jeepImg from "@assets/generated_images/jeep_coloring_page.png";
import trainImg from "@assets/generated_images/train_coloring_page.png";
import planeImg from "@assets/generated_images/plane_coloring_page.png";

// Fruits
import appleImg from "@assets/generated_images/apple_coloring_page.png";
import bananaImg from "@assets/generated_images/banana_coloring_page.png";
import strawberryImg from "@assets/generated_images/strawberry_coloring_page.png";
import orangeImg from "@assets/generated_images/orange_coloring_page.png";

// Dinos
import trexImg from "@assets/generated_images/trex_coloring_page.png";
import stegoImg from "@assets/generated_images/stegosaurus_coloring_page.png";
import triceratopsImg from "@assets/generated_images/triceratops_coloring_page.png";
import brachiosaurusImg from "@assets/generated_images/brachiosaurus_coloring_page.png";

// Princess
import castleImg from "@assets/generated_images/princess_castle_coloring_page.png";
import princessImg from "@assets/generated_images/princess_coloring_page.png";

// Space
import rocketImg from "@assets/generated_images/rocket_coloring_page.png";
import astronautImg from "@assets/generated_images/astronaut_coloring_page.png";

// Creatures (Pokemon-style)
import creaturesCover from "@assets/generated_images/colorful_creatures_cover.png";
import creatureImg from "@assets/generated_images/cute_creature_coloring_page.png";
import creature2Img from "@assets/generated_images/creature_2_coloring_page.png";

// Superheroes
import superheroCover from "@assets/generated_images/colorful_superhero_cover.png";
import superheroImg from "@assets/generated_images/superhero_coloring_page.png";
import superheroGirlImg from "@assets/generated_images/superhero_girl_coloring_page.png";

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

// Helper to just list images without repetition if possible
const createImages = (packId: string, packTitle: string, specificImages: string[], count: number) => {
  const images: PackImage[] = [];
  
  // Use provided images up to count
  for (let i = 0; i < count; i++) {
    // If we have a unique image, use it. 
    // If we run out of unique images, we unfortunately have to repeat or use cover, 
    // but for Animals/Cars we now have enough!
    const imgUrl = i < specificImages.length ? specificImages[i] : specificImages[i % specificImages.length];
    
    images.push({
      id: `${packId}-${i + 1}`,
      url: imgUrl,
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
    images: createImages("animals", "Cute Animals", [
      lionImg, elephantImg, monkeyImg, giraffeImg, zebraImg, 
      tigerImg, bearImg, rabbitImg, dogImg, catImg
    ], 10)
  },
  {
    id: "cars",
    title: "Cool Cars",
    cover: carsCover,
    isPremium: false,
    count: 10,
    images: createImages("cars", "Cool Cars", [
      raceCarImg, truckImg, policeCarImg, fireTruckImg, busImg,
      tractorImg, motorcycleImg, jeepImg, trainImg, planeImg
    ], 10)
  },
  {
    id: "fruits",
    title: "Yummy Fruits",
    cover: fruitsCover,
    isPremium: false,
    count: 10,
    images: createImages("fruits", "Yummy Fruits", [appleImg, bananaImg, strawberryImg, orangeImg], 10)
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: dinosCover,
    isPremium: false,
    count: 10,
    images: createImages("dinos", "Dino World", [trexImg, stegoImg, triceratopsImg, brachiosaurusImg], 10)
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: princessCover,
    isPremium: true,
    count: 15,
    images: createImages("princess", "Princess Castle", [castleImg, princessImg], 15)
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: spaceCover,
    isPremium: true,
    count: 12,
    images: createImages("space", "Space Explorer", [rocketImg, astronautImg], 12)
  },
  {
    id: "pokemon",
    title: "Poke-Style",
    cover: creaturesCover,
    isPremium: true,
    count: 20,
    images: createImages("pokemon", "Poke-Style", [creatureImg, creature2Img], 20)
  },
  {
    id: "superhero",
    title: "Super Heroes",
    cover: superheroCover,
    isPremium: true,
    count: 10,
    images: createImages("superhero", "Super Heroes", [superheroImg, superheroGirlImg], 10)
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
