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

// Sea Creatures
import seaCreaturesCover from "@assets/generated_images/sea_creatures_coloring_cover.png";
import dolphinImg from "@assets/generated_images/dolphin_coloring_page.png";
import octopusImg from "@assets/generated_images/octopus_coloring_page.png";
import fishImg from "@assets/generated_images/fish_coloring_page.png";
import jellyfishImg from "@assets/generated_images/jellyfish_coloring_page.png";
import seaTurtleImg from "@assets/generated_images/sea_turtle_coloring_page.png";

// Birds
import birdsCover from "@assets/generated_images/birds_coloring_book_cover.png";
import parrotImg from "@assets/generated_images/parrot_coloring_page.png";
import owlImg from "@assets/generated_images/owl_coloring_page.png";
import flamingoImg from "@assets/generated_images/flamingo_coloring_page.png";
import peacockImg from "@assets/generated_images/peacock_coloring_page.png";
import penguinImg from "@assets/generated_images/penguin_coloring_page.png";

// Sports
import sportsCover from "@assets/generated_images/sports_coloring_book_cover.png";
import soccerImg from "@assets/generated_images/soccer_ball_coloring_page.png";
import basketballImg from "@assets/generated_images/basketball_coloring_page.png";
import swimmingImg from "@assets/generated_images/swimming_coloring_page.png";
import bicycleImg from "@assets/generated_images/bicycle_coloring_page.png";
import tennisImg from "@assets/generated_images/tennis_coloring_page.png";

// Music
import musicCover from "@assets/generated_images/music_coloring_book_cover.png";
import guitarImg from "@assets/generated_images/guitar_coloring_page.png";
import pianoImg from "@assets/generated_images/piano_coloring_page.png";
import drumsImg from "@assets/generated_images/drums_coloring_page.png";
import violinImg from "@assets/generated_images/violin_coloring_page.png";
import trumpetImg from "@assets/generated_images/trumpet_coloring_page.png";

export interface PackImage {
  id: string;
  url: string;
  title: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Pack {
  id: string;
  title: string;
  cover: string;
  isPremium: boolean;
  count: number;
  difficulty: Difficulty;
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
    difficulty: "easy",
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
    difficulty: "easy",
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
    difficulty: "easy",
    images: createImages("fruits", "Yummy Fruits", [appleImg, bananaImg, strawberryImg, orangeImg], 10)
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: dinosCover,
    isPremium: false,
    count: 10,
    difficulty: "medium",
    images: createImages("dinos", "Dino World", [trexImg, stegoImg, triceratopsImg, brachiosaurusImg], 10)
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: princessCover,
    isPremium: true,
    count: 15,
    difficulty: "medium",
    images: createImages("princess", "Princess Castle", [castleImg, princessImg], 15)
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: spaceCover,
    isPremium: true,
    count: 12,
    difficulty: "hard",
    images: createImages("space", "Space Explorer", [rocketImg, astronautImg], 12)
  },
  {
    id: "pokemon",
    title: "Poke-Style",
    cover: creaturesCover,
    isPremium: true,
    count: 20,
    difficulty: "medium",
    images: createImages("pokemon", "Poke-Style", [creatureImg, creature2Img], 20)
  },
  {
    id: "superhero",
    title: "Super Heroes",
    cover: superheroCover,
    isPremium: true,
    count: 10,
    difficulty: "hard",
    images: createImages("superhero", "Super Heroes", [superheroImg, superheroGirlImg], 10)
  },
  {
    id: "seacreatures",
    title: "Sea Creatures",
    cover: seaCreaturesCover,
    isPremium: false,
    count: 10,
    difficulty: "easy",
    images: createImages("seacreatures", "Sea Creatures", [
      dolphinImg, octopusImg, fishImg, jellyfishImg, seaTurtleImg
    ], 10)
  },
  {
    id: "birds",
    title: "Birds",
    cover: birdsCover,
    isPremium: false,
    count: 10,
    difficulty: "medium",
    images: createImages("birds", "Birds", [
      parrotImg, owlImg, flamingoImg, peacockImg, penguinImg
    ], 10)
  },
  {
    id: "sports",
    title: "Sports",
    cover: sportsCover,
    isPremium: true,
    count: 10,
    difficulty: "medium",
    images: createImages("sports", "Sports", [
      soccerImg, basketballImg, swimmingImg, bicycleImg, tennisImg
    ], 10)
  },
  {
    id: "music",
    title: "Music",
    cover: musicCover,
    isPremium: true,
    count: 10,
    difficulty: "hard",
    images: createImages("music", "Music", [
      guitarImg, pianoImg, drumsImg, violinImg, trumpetImg
    ], 10)
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
