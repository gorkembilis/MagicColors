import { MobileLayout } from "@/components/layout/MobileLayout";
import { packs } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  // Mock gallery data - simulating saved creations
  const savedArt = [
    { id: 1, src: packs[0].cover, date: "Today", prompt: "Cute cat flying" },
    { id: 2, src: packs[1].cover, date: "Yesterday", prompt: "Fast red car" },
    { id: 3, src: packs[4].cover, date: "Dec 1", prompt: "Princess castle" },
  ];

  return (
    <MobileLayout headerTitle="My Gallery">
      <div className="p-4">
        {savedArt.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg">No Artworks Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-[200px]">Create your first magic coloring page to see it here!</p>
            <Button className="rounded-full px-8 font-bold">Create Now</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {savedArt.map((art) => (
              <Card key={art.id} className="overflow-hidden border-none shadow-sm">
                <div className="aspect-square relative bg-muted">
                  <img src={art.src} alt="Saved art" className="h-full w-full object-cover grayscale contrast-125" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{art.date}</p>
                  <div className="flex justify-between gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

// Helper icon for the mock data above
import { Printer } from "lucide-react";
