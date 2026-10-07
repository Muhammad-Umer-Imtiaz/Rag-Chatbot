"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

const fileTypes = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt"
];
export default function Home() {
  const [chats, setChats] = React.useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef(null as HTMLInputElement | null);


    const handleChangenew = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log("Selected via click:", selectedFile);
        const formData = new FormData();
        formData.append("file", selectedFile);
        await fetch("http://localhost:5000/pdf", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
          }).catch((error) => {
            console.error("Error uploading file:", error);
          });
      }
    }

  const handledrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      console.log("Dropped file:", droppedFile);
    }
  }

  return (
    <section>
      <div className="flex  max-h-screen  ">
        <div className="w-[50vw] text-center">

          <div className="w-72 h-56 outline-2 flex-col gap-6 outline-offset-2 outline-dashed flex items-center justify-center mx-auto mt-10" >
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleChangenew} />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handledrag}
              onDragOver={(e) => e.preventDefault()}
            >
              <p>Drag and Drop File here</p>
              <FiUpload className="w-16 h-16" />
              {file && <p className="text-sm text-green-600 mt-2">{file.name}</p>}
            </div>
          </div>
        </div>
        <div className="w-[50vw] text-center border-l-2">
          <header className="flex items-center gap-3 border-b-2 border-gray-200 p-4">
            <h2 className="rounded-[50%] px-1.75 py-2 bg-red-50">logo</h2>
            <h3>Chatbot</h3>
          </header>
          <section className="flex flex-col gap-3 p-4  max-h-[80vw] h-full">
            {
              chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                  <Image
                    src="/chatbot.png"
                    alt="chatbot"
                    width={50}
                    height={50}
                  />
                  <p className="text-gray-500">No chats yet</p>
                </div>
              ) : (

                chats.map((chat, index) => (
                  <p key={index}>{chat}</p>
                ))
              )
            }
          </section>

          <footer className="p-4 flex items-center gap-3 border-t-2 border-gray-200">
            <input type="text" placeholder="Type your message..." className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-full" />
            <span className="border-white border-2 p-2.5 rounded-full">

              <IoSend className="" />
            </span>

          </footer>
        </div>
      </div>
    </section>
  );
}
