"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{ loop: true }}
      onInit={(typewriter) => {
        typewriter
          .typeString("Supercharge Productivity.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("AI-powered Insights.")
          .pauseFor(1000)
          .deleteAll()
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
