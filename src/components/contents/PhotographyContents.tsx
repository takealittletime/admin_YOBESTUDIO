"use client";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function PhotographyContents({
  onSelectionChange,
}: {
  onSelectionChange?: (folders: string[]) => void;
}) {
  const [folderThumbs, setFolderThumbs] = useState<
    { folder: string; thumbUrl: string }[]
  >([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track loaded thumbnail URLs for shimmer effect
  const [loadedThumbs, setLoadedThumbs] = useState<Set<string>>(new Set());
  const [selectedThumbIndices, setSelectedThumbIndices] = useState<number[]>(
    [],
  );

  useEffect(() => {
    const fetchThumbs = async () => {
      const { data: folders, error } = await supabase.storage
        .from("ybst-photo")
        .list("", { limit: 100, sortBy: { column: "name", order: "desc" } });

      if (error) {
        return;
      }

      const folderNames = folders
        .filter(
          (item) =>
            item.name !== "0" && item.name !== "" && item.name.match(/^\d+$/),
        )
        .map((item) => item.name)
        .sort((a, b) => Number(b) - Number(a));

      const thumbs = (
        await Promise.all(
          folderNames.map(async (folder) => {
            // Use public URL with transform parameters for a 285x356 cover thumbnail
            const { data: publicData } = supabase.storage
              .from("ybst-photo")
              .getPublicUrl(`${folder}/1.jpg`);

            const thumbUrl = publicData?.publicUrl;
            if (!thumbUrl) return null;

            return {
              folder,
              thumbUrl,
            };

            // const url = publicData?.publicUrl
            //   ? `${publicData.publicUrl}?width=800&height=1000&resize=cover`
            //   : null;
            // if (!url) return null;
            // return { folder, thumbUrl: url };
          }),
        )
      ).filter((thumb) => thumb !== null);

      setFolderThumbs(thumbs);
    };

    fetchThumbs();
  }, []);

  // 선택 상태가 변경될 때마다 상위로 폴더명 배열 전달
  useEffect(() => {
    if (onSelectionChange) {
      const selectedFolders = selectedThumbIndices
        .map((idx) => folderThumbs[idx]?.folder)
        .filter(Boolean);
      onSelectionChange(selectedFolders);
    }
  }, [selectedThumbIndices, folderThumbs, onSelectionChange]);

  const onPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length,
    );
  };
  const onNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-1 p-3 sm:grid-cols-3">
        {folderThumbs
          .filter(({ thumbUrl }) => thumbUrl !== "")
          .map(({ folder, thumbUrl }, index) => (
            <div
              key={index}
              className="group relative aspect-[285/356] w-full cursor-pointer bg-slate-300"
              onClick={() => {
                setSelectedThumbIndices((prev) =>
                  prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index],
                );
              }}
            >
              <div className="relative size-full">
                <Image
                  src={thumbUrl}
                  alt={`Folder ${folder}`}
                  width={800}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 285px"
                  className="z-5 size-full object-cover"
                  onLoad={() =>
                    setLoadedThumbs((prev) => new Set(prev).add(thumbUrl))
                  }
                />
                {selectedThumbIndices.includes(index) && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <CircleCheckBig
                      size={32}
                      color="#0047FF"
                      fill="#fff"
                      strokeWidth={2}
                    />
                  </div>
                )}
              </div>
              <div className="z-6 absolute inset-0 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
            </div>
          ))}
      </div>
    </>
  );
}
