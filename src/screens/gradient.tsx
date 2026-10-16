import Header from "../components/header";
import GradientTab from "../components/gradient-tab";
import React from "react";

export default function GradientsScreen() {
  return (
    <main className="typeset typeset-chat m-auto">
      <Header
        title="Gradient"
        subtitle="Design dynamic animated gradient transitions and mesh aesthetics."
      />
      <GradientTab />
    </main>
  );
}
