import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";
import image1 from "../public/logo.svg";

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  return (
    <div className="bg-[rgb(36,36,36)] w-[100vw] h-[100vh] pt-20 flex flex-col items-center justify-center text-[#DBD8D5]">
      <Navbar />
      <div className="flex flex-row justify-between w-full pl-12 font-medium">
        <p className="max-w-[300px] text-lg">
          This semester project uses
          <span className="text-[#4AC585]"> Möbius transformations </span>
          and scaling in Three.js and React to interactively visualize and
          analyze 2D molecular structures.
        </p>
        <div className="flex  border-b-[1px] border-[#DBD8D5] w-[65vw] justify-between items-start pr-10">
          <h1 className="text-[120px] font-semibold leading-[100px]">
            View a <br />
            <span className="text-[#4AC585]">Molecule </span> <br />
            in 3D Space
          </h1>
          <Image src={image1} alt={""} height={300} className="mb-12" />
        </div>
      </div>
      <div className="flex items-end mt-20 mr-16 w-full flex-col gap-4 text-4xl">
        <div className="flex flex-row justify-between gap-4 w-[700px]">
          <p>
            <span className="mr-8">01. </span> 2D Transformation
          </p>

          <Link href="/first">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200  text-[#111111] p-1 px-3">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>
        <div className="flex flex-row justify-between gap-4 w-[700px]">
          <p>
            <span className="mr-8">02. </span> 3D Transformation on Spheres
          </p>
          <Link href="/second">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200  text-[#111111] p-1 px-3">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>
        <div className="flex flex-row justify-between gap-4 w-[700px]">
          <p>
            <span className="mr-8">03. </span> 3D Transformation on Molecules{" "}
          </p>
          <Link href="/third">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200  text-[#111111] p-1 px-3">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
