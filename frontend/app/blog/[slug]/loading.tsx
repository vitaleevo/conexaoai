import { Spinner } from "@/components/ui/Spinner";

export default function LoadingPost() {
  return (
    <div className="mx-auto flex min-h-80 w-full max-w-4xl items-center justify-center px-6 py-12">
      <Spinner />
    </div>
  );
}
