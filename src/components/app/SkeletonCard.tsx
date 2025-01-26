import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

const SkeletonCard = () => {
  return (
    <Card
      className="skeleton-card duration-2000 pointer-events-none animate-pulse"
      data-testid="skeleton-card"
    >
      <CardHeader className="image-container relative">
        <div className="skeleton-image bg-shimmer mb-3 h-[220px] animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
        <div className="skeleton-title w-1/1 bg-shimmer mt-2 h-8 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
      </CardHeader>
      <CardContent>
        <div className="my-4">
          <div className="skeleton-text bg-shimmer h-6 w-1/2 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
          <div className="skeleton-text bg-shimmer mt-2 h-4 w-3/4 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
        </div>
        <div className="my-4">
          <div className="skeleton-text bg-shimmer h-6 w-2/3 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
          <div className="skeleton-text w-1/1 bg-shimmer mt-2 h-4 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
          <div className="skeleton-text bg-shimmer mt-2 h-4 w-5/6 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
        </div>
        <div className="my-4">
          <div className="skeleton-text bg-shimmer h-6 w-1/2 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
          <div className="skeleton-text bg-shimmer mt-2 h-4 w-5/6 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
          <div className="skeleton-text bg-shimmer mt-2 h-4 w-2/3 animate-shimmer rounded bg-shimmerLight bg-[length:200%_100%] dark:bg-shimmerDark"></div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default SkeletonCard;
