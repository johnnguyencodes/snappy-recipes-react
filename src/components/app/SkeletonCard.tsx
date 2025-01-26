import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

const SkeletonCard = () => {
  return (
    <Card className="skeleton-card duration-1500 animate-pulse">
      <CardHeader className="image-container relative">
        <div className="skeleton-image mb-3 h-[220px] rounded-md bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
        <div className="skeleton-title w-1/1 mt-2 h-8 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
      </CardHeader>
      <CardContent>
        <div className="my-4">
          <div className="skeleton-text h-6 w-1/2 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
          <div className="skeleton-text mt-2 h-4 w-3/4 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
        </div>
        <div className="my-4">
          <div className="skeleton-text h-6 w-2/3 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
          <div className="skeleton-text w-1/1 mt-2 h-4 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
          <div className="skeleton-text mt-2 h-4 w-5/6 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
        </div>
        <div className="my-4">
          <div className="skeleton-text h-6 w-1/2 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
          <div className="skeleton-text mt-2 h-4 w-5/6 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
          <div className="skeleton-text mt-2 h-4 w-2/3 rounded bg-lightmode-dimmed5 dark:bg-darkmode-dimmed5"></div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default SkeletonCard;
