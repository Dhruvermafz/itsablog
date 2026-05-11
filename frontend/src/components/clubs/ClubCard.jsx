import Link from "next/link";
import { Users, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ClubCard({ club }) {
  return (
    <Link href={`/club/${club._id}`} className="group block h-full">
      <Card
        className="
        overflow-hidden rounded-[2rem] border-border bg-card/80
        transition-all duration-500 h-full

        hover:shadow-2xl
        sm:hover:-translate-y-2
      "
      >
        {/* Cover image */}
        <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={club.coverImage}
            alt={club.name}
            className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-105 sm:group-hover:scale-110
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 sm:top-5 right-3 sm:right-5">
            <span
              className="
              bg-primary text-primary-foreground text-[10px] sm:text-xs
              px-3 sm:px-4 py-1 rounded-full
            "
            >
              {club.category}
            </span>
          </div>

          {/* Title + stats */}
          <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5">
            <h3
              className="
              text-lg sm:text-2xl md:text-3xl font-serif text-white
              leading-tight mb-1 sm:mb-2
              line-clamp-2
            "
            >
              {club.name}
            </h3>

            <div className="flex items-center gap-3 sm:gap-4 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{club.memberCount?.toLocaleString() || 0}</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{club.postCount || 0} posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 sm:p-6 md:p-7">
          <p className="text-muted-foreground leading-6 sm:leading-7 mb-5 sm:mb-8 line-clamp-3 text-sm sm:text-base">
            {club.description}
          </p>

          <Button variant="outline" className="rounded-full w-full">
            View Club
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
