"use client";
import Image from "next/image";
import React, { useState } from "react";

import PhotographyContents from "@/components/contents/PhotographyContents";
import Header from "@/components/ui/header/header";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");

  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImageNames, setProjectImageNames] = useState<string[]>([]);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name); // 파일명 저장
      setSelectedImageFile(file); // 실제 파일 저장
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setSelectedImageName("");
      setSelectedImageFile(null);
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

  const handleProjectUpload = async () => {
    setIsLoading(true);
    // 1. 현재 폴더(디렉토리) 리스트 가져오기
    const { data: folders, error } = await supabase.storage
      .from("ybst-photo")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      alert("폴더 목록을 불러오지 못했습니다.");
      return;
    }

    // 2. 다음 폴더 명 설정
    const newFolder = folders.length.toString();
    // 3. 썸네일 업로드 (1.확장자)
    if (!selectedImageFile) {
      alert("썸네일 이미지를 선택하세요.");
      return;
    }
    const thumbExt = selectedImageFile.name.split(".").pop();
    const thumbPath = `${newFolder}/1.${thumbExt}`;
    const { error: thumbError } = await supabase.storage
      .from("ybst-photo")
      .upload(thumbPath, selectedImageFile, { upsert: true });
    if (thumbError) {
      setIsLoading(false);
      alert("썸네일 업로드에 실패했습니다.");
      return;
    }
    const thumbPathB = `${newFolder}/2.${thumbExt}`;
    const { error: thumbErrorB } = await supabase.storage
      .from("ybst-photo")
      .upload(thumbPathB, selectedImageFile, { upsert: true });
    if (thumbErrorB) {
      setIsLoading(false);
      alert("썸네일 업로드에 실패했습니다.");
      return;
    }

    // 4. 프로젝트 이미지들 업로드 (3.확장자 ~ n.확장자)
    for (let i = 0; i < projectImages.length; i++) {
      const file = projectImages[i];
      const ext = file.name.split(".").pop();
      const filePath = `${newFolder}/${i + 3}.${ext}`;
      const { error: imgError } = await supabase.storage
        .from("ybst-photo")
        .upload(filePath, file, { upsert: true });
      if (imgError) {
        setIsLoading(false);
        alert(`프로젝트 이미지 업로드에 실패했습니다. ${file.name}`);
        return;
      }
    }

    alert("업로드가 완료 되었습니다.");
    // 업로드 후 상태 초기화
    setSelectedImage(null);
    setSelectedImageName("");
    setSelectedImageFile(null);
    setProjectImages([]);
    setProjectImageNames([]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex h-full flex-col bg-black">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="loader"></div>
          </div>
        )}
        {/* 프로젝트 추가 섹션 */}
        <section className="flex h-full flex-col">
          <div className="flex flex-col bg-[#333] p-3 text-lg text-white">
            프로젝트 추가
          </div>
          <div className="flex h-full flex-col bg-[#f5f5f5] p-5 text-black">
            <section className="m-2 flex h-full flex-col border border-[#e3e3e3] bg-white text-black">
              <div className="p-2 text-right text-sm text-red-600">
                * .jpg 확장자만 업로드 가능합니다.
              </div>
              <section className="flex size-full flex-row border-b border-b-[#e3e3e3] bg-white text-black">
                <div className="m-auto pl-10">
                  <span>썸네일 이미지 등록</span>
                  <span className="text-red-600"> * </span>
                </div>
                <div className="flex flex-1 flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center justify-center gap-2 p-4">
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
                      accept="image/jpg"
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
              <section className="flex size-full border-b border-b-[#e3e3e3] bg-white p-4 text-black">
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
                      accept="image/jpg"
                      multiple
                      onChange={handleProjectImagesChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </section>
            </section>
            <button
              className="m-auto w-1/3 rounded-full bg-blue-600 py-3 text-white hover:bg-blue-700"
              onClick={handleProjectUpload}
              type="button"
            >
              프로젝트 추가하기
            </button>
          </div>
        </section>

        {/* 프로젝트 삭제 섹션 */}
        <section className="flex h-full flex-col">
          <div className="flex flex-col  bg-[#333] p-3 text-lg text-white">
            프로젝트 삭제
          </div>
          <div className="flex h-full flex-col bg-[#f5f5f5] p-5 text-black">
            <div className="flex flex-row justify-between">
              <div className="p-2 text-left text-sm text-red-600">
                * 삭제를 원하는 프로젝트를 선택하고, 우측 삭제 버튼을
                클릭하세요.
              </div>
              <button
                className="w-1/6 rounded-full bg-red-600 py-3 text-white hover:bg-red-700"
                onClick={() => {
                  // console.log("✅ 삭제 버튼 클릭");
                }}
                type="button"
              >
                프로젝트 삭제하기
              </button>
            </div>
            <section className="m-2 flex h-full flex-col border border-[#e3e3e3] bg-white text-black">
              <section className="flex size-full flex-col overflow-y-scroll border-b border-b-[#e3e3e3] bg-white p-4 text-black">
                <PhotographyContents />
              </section>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
