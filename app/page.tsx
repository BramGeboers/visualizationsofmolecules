import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";
import image1 from "../public/logo.svg";
import Head from "next/head";

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  return (
    <div className="bg-[rgb(36,36,36)] w-full h-full min-h-[100vh] lg:pt-20 flex flex-col items-center justify-center text-[#DBD8D5]">
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-between w-full px-4 lg:px-12 font-medium">
        <p className="text-lg lg:max-w-[300px] mb-4 lg:block hidden">
          This semester project uses
          <span className="text-[#4AC585]"> Möbius transformations </span>
          and scaling in Three.js and React to interactively visualize and
          analyze 2D molecular structures.
        </p>
        <div className="flex flex-row border-b-[1px] pt-28 border-[#DBD8D5] w-full lg:w-[65vw] justify-between items-start pr-10 px-6 lg:px-0">
          <h1 className="text-[50px] sm:text-[70px] md:text-[90px] lg:text-[120px] font-semibold leading-[50px] sm:leading-[70px] md:leading-[90px] lg:leading-[100px] mb-6 lg:mb-0">
            View a <br />
            <span className="text-[#4AC585]">Molecule </span> <br />
            in 3D Space
          </h1>
          <div className="lg:h-[300px] md:h-[250px] h-[200px] mb-6 lg:mb-12">
            <Image
              src={image1}
              alt={""}
              className="mb-6 lg:mb-12 h-full w-full"
            />
          </div>
        </div>
        <p className="text-lg lg:max-w-[300px] mb-4 lg:hidden mt-10 px-3">
          This semester project uses
          <span className="text-[#4AC585]"> Möbius transformations </span>
          and scaling in Three.js and React to interactively visualize and
          analyze 2D molecular structures.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 mt-20 mb-20 mx-4 lg:mr-16 w-full lg:items-end text-2xl lg:text-4xl">
        <div className="flex flex-row justify-between gap-4 w-[80%] sm:w-[600px] lg:w-[700px]">
          <p className="flex flex-row">
            <span className="mr-8 lg:block hidden">01. </span> 2D Transformation
          </p>

          <Link href="/first">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 flex items-center justify-center">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>

        <div className="flex flex-row justify-between gap-4 w-[80%] sm:w-[600px] lg:w-[700px]">
          <p className="flex flex-row">
            <span className="mr-8 lg:block hidden">02. </span> 3D Transformation
            on Spheres
          </p>
          <Link href="/second">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 flex items-center justify-center">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>

        <div className="flex flex-row justify-between gap-4 w-[80%] sm:w-[600px] lg:w-[700px]">
          <p className="flex flex-row">
            <span className="mr-8 lg:block hidden">03. </span> 3D Transformation
            on Molecules{" "}
          </p>
          <Link href="/third">
            <div className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 flex items-center justify-center">
              <IoIosArrowRoundForward color="#111111" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
