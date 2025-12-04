import animalsCover from "@assets/generated_images/cute_animals_coloring_pack_cover.png";
import carsCover from "@assets/generated_images/cool_cars_coloring_pack_cover.png";
import fruitsCover from "@assets/generated_images/cute_fruits_coloring_pack_cover.png";
import dinosCover from "@assets/generated_images/cute_dinosaurs_coloring_pack_cover.png";
import princessCover from "@assets/generated_images/princess_coloring_pack_cover.png";
import spaceCover from "@assets/generated_images/space_coloring_pack_cover.png";

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

// Dinos
import trexImg from "@assets/generated_images/trex_coloring_page.png";
import stegoImg from "@assets/generated_images/stegosaurus_coloring_page.png";

// Others
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
    images: createImages("fruits", "Yummy Fruits", [appleImg, bananaImg, fruitsCover], 10)
  },
  {
    id: "dinos",
    title: "Dino World",
    cover: dinosCover,
    isPremium: false,
    count: 10,
    images: createImages("dinos", "Dino World", [trexImg, stegoImg, dinosCover], 10)
  },
  {
    id: "princess",
    title: "Princess Castle",
    cover: princessCover,
    isPremium: true,
    count: 15,
    images: createImages("princess", "Princess Castle", [castleImg, princessCover], 15)
  },
  {
    id: "space",
    title: "Space Explorer",
    cover: spaceCover,
    isPremium: true,
    count: 12,
    images: createImages("space", "Space Explorer", [rocketImg, spaceCover], 12)
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
