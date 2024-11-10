"use client";
import { useState, useEffect } from "react";
import { fetchMolecule3D, fetchMoleculeDetails } from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer } from "@/components/activeModelViewer";
import Image from "next/image";
import image1 from "@/public/logo.svg";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <Link className="flex absolute top-0 left-0 pt-4 pl-6 z-50" href={"/"}>
      <Image src={image1} alt="Logo" height={36} />
      <h1 className="text-2xl font-semibold ml-2 leading-5 text-[#DBD8D5]">
        Molecule <br /> View
      </h1>
    </Link>
  );
};

export default Navbar;
