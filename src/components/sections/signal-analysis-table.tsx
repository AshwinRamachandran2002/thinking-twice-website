"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type CategoryKey =
  | "architectural"
  | "structural"
  | "mechanical"
  | "electrical"
  | "plumbing"
  | "fire_protection"
  | "site_civil"
  | "interior_design"
  | "bim_coordination"
  | "landscape";

interface Category {
  key: CategoryKey;
  name: string;
}

interface Signal {
  title: string;
  description: string;
  category: string;
  categoryKey: CategoryKey;
}

const categories: Category[] = [
  { key: "architectural", name: "Architectural" },
  { key: "structural", name: "Structural" },
  { key: "mechanical", name: "Mechanical" },
  { key: "electrical", name: "Electrical" },
  { key: "plumbing", name: "Plumbing" },
  { key: "fire_protection", name: "Fire Protection" },
  { key: "site_civil", name: "Site & Civil" },
  { key: "interior_design", name: "Interior Design" },
  { key: "bim_coordination", name: "BIM Coordination" },
  { key: "landscape", name: "Landscape" },
];

const signals: Signal[] = [
  {
    title: "Doorway Violates ADA Clearance",
    description: "Proposed door swing and frame width in the architecturals fail to meet ADA requirements, risking inspection failure and rework.",
    category: "Architectural",
    categoryKey: "architectural",
  },
  {
    title: "Structural Beam Clash with Ductwork",
    description: "A primary HVAC duct passes through a load-bearing structural beam in the latest drawings, requiring immediate redesign of mechanical or structural plans.",
    category: "Mechanical",
    categoryKey: "mechanical",
  },
  {
    title: "Insufficient Electrical Panel Clearance",
    description: "The main electrical panel's location does not provide the legally required clearance, posing a major safety and compliance issue that will halt inspections.",
    category: "Electrical",
    categoryKey: "electrical",
  },
  {
    title: "Incorrect Seismic Bracing for Piping",
    description: "Plumbing drawings lack the required seismic bracing details for pipes over 2.5 inches in diameter, mandatory in this seismic zone.",
    category: "Plumbing",
    categoryKey: "plumbing",
  },
  {
    title: "Fire Sprinkler Head Obstruction",
    description: "New lighting fixture plans show pendants obstructing the spray pattern of fire sprinklers, a direct violation of NFPA 13 code.",
    category: "Fire Protection",
    categoryKey: "fire_protection",
  },
  {
    title: "Emergency Egress Path Blocked",
    description: "A new interior wall partition shown in the architectural drawings directly blocks a primary emergency egress route, a critical life safety violation.",
    category: "Architectural",
    categoryKey: "architectural",
  },
  {
    title: "Foundation Footing Conflicts with Sewer Line",
    description: "Proposed foundation footings overlap with an existing municipal sewer line, requiring immediate coordination with civil engineers and potential project redesign.",
    category: "Site & Civil",
    categoryKey: "site_civil",
  },
  {
    title: "Mismatched Finish Schedules",
    description: "The finish schedule in the architectural set specifies a different flooring material than the interior design spec, leading to budget and procurement conflicts.",
    category: "Interior Design",
    categoryKey: "interior_design",
  },
  {
    title: "Uncoordinated Models in Navisworks",
    description: "The latest federated model shows over 500 high-priority clashes between structural, mechanical, and plumbing systems, indicating a severe lack of BIM coordination.",
    category: "BIM Coordination",
    categoryKey: "bim_coordination",
  },
  {
    title: "Retaining Wall Exceeds Max Height",
    description: "The landscape plan's retaining wall design exceeds the maximum height allowed by local zoning codes without additional engineering permits.",
    category: "Landscape",
    categoryKey: "landscape",
  },
  {
    title: "Inadequate Roof Drainage Slope",
    description: "The architectural roof plan indicates a slope insufficient for proper water drainage, leading to risks of water pooling, leaks, and structural damage.",
    category: "Architectural",
    categoryKey: "architectural",
  },
  {
    title: "Plumbing Stack Misaligned Between Floors",
    description: "Vertical plumbing stacks are not aligned between the first and second-floor plans, making a continuous run impossible without significant modification.",
    category: "Plumbing",
    categoryKey: "plumbing",
  },
];

export default function SignalAnalysisTable() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("architectural");

  return (
    <section className="bg-dark-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Stalk every company in your TAM
          </h2>
          <p className="mt-6 text-lg md:text-xl text-light-gray max-w-2xl mx-auto">
            We analyze thousands of real-time project documents to show you which drawings have critical conflicts **before** they cause delays. Stop guessing which teams are struggling and engage the right stakeholder at the perfect time.
          </p>
        </div>

        <div className="mt-16 flex flex-col lg:flex-row gap-12 lg:gap-8">
          <aside className="lg:w-1/4">
            <div className="border border-[#2A2A2A] rounded-lg">
              <div
                className={cn(
                  "border-t-2 rounded-t-md",
                  selectedCategory === "architectural"
                    ? "border-secondary-yellow"
                    : "border-transparent"
                )}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCategory("architectural")}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory("architectural")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                    selectedCategory === "architectural"
                      ? "text-secondary-yellow"
                      : "text-light-gray hover:text-white"
                  )}
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-transparent border-[#666]">
                    {selectedCategory === "architectural" && (
                      <div className="w-full h-full bg-secondary-yellow"></div>
                    )}
                  </div>
                  <span className="font-medium text-base text-white">LAW</span> {/* Per screenshot, first item is "LAW" */}
                </div>
                 <p className="pl-11 text-sm text-light-gray -mt-2 pb-2">healthcare</p> {/* Per screenshot */}
              </div>

              <div className="border-t border-[#2A2A2A] pt-2">
                {categories.map((category) => (
                  <div
                    key={category.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCategory(category.key)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(category.key)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors",
                      selectedCategory === category.key
                        ? "text-white"
                        : "text-light-gray hover:text-white"
                    )}
                    >
                    <div
                      className={cn(
                        "flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-transparent",
                        selectedCategory === category.key
                        ? "border-secondary-yellow"
                        : "border-[#666]"
                        )}
                        >
                      {selectedCategory === category.key && (
                        <div className="w-full h-full bg-secondary-yellow"></div>
                      )}
                    </div>
                    <span className="font-medium text-base">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="flex justify-between items-center text-light-gray uppercase text-sm font-medium pb-4">
              <span>Signal</span>
              <span>Industry</span>
            </div>
            <div className="space-y-1">
              {signals.map((signal, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-start border-t border-[#2a2a2a] transition-all duration-300",
                    selectedCategory === signal.categoryKey
                      ? "bg-medium-gray rounded-lg p-6 my-2"
                      : "py-6"
                  )}
                >
                  <div className="w-3/4 pr-4">
                    <h3 className="font-semibold text-white text-base md:text-lg">
                      {signal.title}
                    </h3>
                    <p className="text-light-gray text-sm md:text-base mt-2">
                      {signal.description}
                    </p>
                  </div>
                  <span className="text-light-gray text-sm md:text-base whitespace-nowrap">
                    {signal.category}
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}