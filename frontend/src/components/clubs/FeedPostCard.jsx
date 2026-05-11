import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FeedPostCard({ post }) {
  return (
    <Card
      className="
      rounded-[2rem] overflow-hidden border-border bg-card/80
    "
    >
      <div className="p-4 sm:p-6 md:p-8">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
            <AvatarImage src={post.author?.avatar} />
            <AvatarFallback>{post.author?.name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="leading-tight">
            <p className="font-medium text-sm sm:text-base">
              {post.club?.name}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              by {post.author?.name}
            </p>
          </div>
        </div>

        {/* Optional image */}
        {post.image && (
          <div
            className="
            relative overflow-hidden rounded-2xl mb-4 sm:mb-6
            h-56 sm:h-72 md:h-96
          "
          >
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <p
          className="
          text-sm sm:text-base md:text-lg
          leading-relaxed mb-4 sm:mb-6
        "
        >
          {post.content}
        </p>

        {/* Engagement */}
        <div
          className="
          flex items-center gap-4 sm:gap-6
          text-muted-foreground text-xs sm:text-sm
        "
        >
          <div className="flex items-center gap-2">
            ❤️ <span>{post.likesCount || 0}</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
