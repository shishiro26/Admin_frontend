"use client";
import { useRouter } from "next/navigation";

interface HeaderWithBackButtonProps {
  title: string;
  backRoute: string;
}

export default function HeaderWithBackButton({
  title,
  backRoute,
}: HeaderWithBackButtonProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-lg flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-700">{title}</h1>
      <button
        onClick={() => router.push(backRoute)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
