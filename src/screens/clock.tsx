import React from "react";
import Header from "../components/Header";
import ClockTab from "@/components/clock-tab";

export default function Clock() {
  return (
    <main className="typeset typeset-chat m-auto">
      <Header
        title="Clock"
        subtitle="Customize time format, clock visuals, and display widgets."
      />
      <ClockTab />
    </main>
  );
}
