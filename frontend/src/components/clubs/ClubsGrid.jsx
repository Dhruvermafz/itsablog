import { Card } from "@/components/ui/card";
import { ClubCard } from "./ClubCard";

export function ClubsGrid({ clubs }) {
  if (!clubs || clubs.length === 0) {
    return (
      <Card
        className="
        rounded-[2rem] 
        p-8 sm:p-12 md:p-16 
        text-center
      "
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif mb-3 sm:mb-4">
          No clubs found
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Try different search terms
        </p>
      </Card>
    );
  }

  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        xl:grid-cols-3 

        gap-4 
        sm:gap-6 
        lg:gap-8

        px-2 sm:px-0
      "
    >
      {clubs.map((club) => (
        <ClubCard key={club._id} club={club} />
      ))}
    </div>
  );
}
