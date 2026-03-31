import { ContentItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StatusBadge, ContentTypeBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="p-4 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-200 border-border/60 group"
      onClick={() => navigate(`/content/${item.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <ContentTypeBadge type={item.contentType} />
            <StatusBadge status={item.status} />
          </div>
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {item.wordCount > 0 ? `${item.wordCount.toLocaleString()} words · ` : ""}
            {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
          </p>
        </div>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className="h-14 w-20 rounded-md object-cover shrink-0"
          />
        )}
      </div>
      {item.tags.length > 0 && (
        <div className="flex gap-1 mt-2.5 flex-wrap">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
