"use client";
import Image from "next/image";
import React, { useState } from "react";

import Header from "@/components/ui/header/header";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");

  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImageNames, setProjectImageNames] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name); // 파일명 저장
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setSelectedImageName("");
    }
  };

  // 프로젝트 이미지 여러 장 추가 핸들러
  const handleProjectImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    setProjectImages((prev) => [...prev, ...validFiles]);
    setProjectImageNames((prev) => [
      ...prev,
      ...validFiles.map((file) => file.name),
    ]);
    // input value 초기화 (동일 파일 재선택 가능)
    e.target.value = "";
  };

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex h-full flex-col bg-black">
        {/* 프로젝트 추가 섹션 */}
        <section className="flex h-full flex-col">
          <div className="flex flex-col bg-[#333] p-3 text-lg text-white">
            프로젝트 추가
          </div>
          <div className="flex h-full flex-col bg-[#f5f5f5] p-5 text-black">
            <section className="m-2 flex h-full flex-col border border-[#e3e3e3] bg-white text-black">
              <section className="flex size-full flex-row border-b border-b-[#e3e3e3] bg-white text-black">
                <div className="m-auto pl-10">
                  <span>썸네일 이미지 등록</span>
                  <span className="text-red-600"> * </span>
                </div>
                <div className="flex flex-1 flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* 이미지 미리보기 */}
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt="이미지 미리보기"
                        width={128}
                        height={128}
                        className="max-h-32 max-w-xs rounded border object-contain"
                      />
                    ) : (
                      <div className="flex size-[128px] items-center justify-center rounded bg-gray-200">
                        <span className="text-gray-500">이미지 미리보기</span>
                      </div>
                    )}
                    {/* 파일 추가 버튼 */}
                    <label
                      htmlFor="thumbnailImage"
                      className="w-[128px] cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                    >
                      이미지 선택
                    </label>
                    <input
                      id="thumbnailImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="flex max-w-[500px] items-center justify-center overflow-hidden">
                    {/* 이미지 파일 명 표시 */}
                    {selectedImageName ? (
                      <span className="break-all text-sm text-gray-600">
                        {selectedImageName}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">
                        선택된 이미지가 없습니다.
                      </span>
                    )}
                  </div>
                </div>
              </section>
              <section className="flex size-full border-b border-b-[#e3e3e3] bg-white text-black">
                <div className="m-auto pl-10">
                  <span>프로젝트 이미지 추가</span>
                  <span className="text-red-600"> * </span>
                </div>
                <div className="flex flex-1 flex-col">
                  {/* 추가된 파일명들 표시 (여러 장, 세로 스크롤) */}
                  <div className="m-auto size-3/5 max-h-40 overflow-y-scroll rounded bg-slate-200 p-2">
                    {projectImageNames.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {projectImageNames.map((name, idx) => (
                          <li
                            key={idx}
                            className="break-all text-sm text-gray-700"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">
                        추가된 이미지가 없습니다.
                      </span>
                    )}
                  </div>
                  {/* 파일 추가 버튼 */}
                  <div className="m-auto mt-2 flex flex-col items-center">
                    <label
                      htmlFor="projectImages"
                      className="w-[128px] cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                    >
                      이미지 추가
                    </label>
                    <input
                      id="projectImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProjectImagesChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </section>
            </section>
            <button className="m-auto w-1/3 rounded-full bg-blue-600 py-3 text-white hover:bg-blue-700">
              프로젝트 추가하기
            </button>
          </div>
        </section>

        {/* 프로젝트 삭제 섹션 */}
        <section className="flex h-full flex-col">
          <div className="flex flex-col bg-[#333] p-3 text-lg text-white">
            프로젝트 삭제
          </div>
          <div className="flex h-full flex-col bg-[#f5f5f5] p-5 text-black">
            <section className="m-2 flex h-full flex-col border border-[#e3e3e3] bg-white text-black">
              <section className="flex size-full border-b border-b-[#e3e3e3] bg-white text-black">
                option 1
              </section>
              <section className="flex size-full border-b border-b-[#e3e3e3] bg-white text-black">
                option 2
              </section>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
